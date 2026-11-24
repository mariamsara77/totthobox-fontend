import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const filesToInspect = [
  "lib/services-catalog.ts",
  "components/Navbar.tsx",
  "components/Footer.tsx",
  "components/navigation/StickyCategoryNav.tsx",
  "components/navigation/MobileBottomNav.tsx",
  "components/home/CategorySection.tsx",
  "components/home/TrendingServices.tsx",
  "app/(home)/page.tsx",
  "app/(home)/services/page.tsx",
  "app/sitemap.ts"
];

// Extract { title/label, href, source }
const entries = [];

for (const file of filesToInspect) {
  try {
    const content = readFileSync(file, "utf8");

    // Match href: "..." or href="..."
    const hrefRegex = /href\s*[:=]\s*["']([^"']+)["']/g;
    // Match title: "..." or label: "..."
    const titleRegex = /(?:title|label|name)\s*:\s*["']([^"']+)["']/g;

    // Pattern for object definitions { id: ..., title: "...", href: "..." }
    const objectRegex = /\{[^{}]*(?:title|label|name)\s*:\s*["']([^"']+)["'][^{}]*href\s*:\s*["']([^"']+)["'][^{}]*\}/g;
    let match;
    while ((match = objectRegex.exec(content)) !== null) {
      entries.push({
        label: match[1].trim(),
        href: match[2].trim(),
        source: file
      });
    }

    // Reverse pattern { id: ..., href: "...", title: "..." }
    const reverseRegex = /\{[^{}]*href\s*:\s*["']([^"']+)["'][^{}]*(?:title|label|name)\s*:\s*["']([^"']+)["'][^{}]*\}/g;
    while ((match = reverseRegex.exec(content)) !== null) {
      entries.push({
        label: match[2].trim(),
        href: match[1].trim(),
        source: file
      });
    }

    // JSX Links <Link href="/abc">লেবেল</Link>
    const linkRegex = /<Link[^>]+href=["']([^"']+)["'][^>]*>([^<]+)<\/Link>/g;
    while ((match = linkRegex.exec(content)) !== null) {
      const text = match[2].trim();
      if (text && !text.includes("{") && !text.includes("<")) {
        entries.push({
          label: text,
          href: match[1].trim(),
          source: file
        });
      }
    }
  } catch (e) {
    console.warn("Could not read", file, e.message);
  }
}

// Group by href
const hrefMap = new Map();

for (const entry of entries) {
  // Normalize href
  const cleanHref = entry.href.replace(/#.*$/, "");
  if (!cleanHref || cleanHref.startsWith("http") || cleanHref.startsWith("mailto") || cleanHref.startsWith("tel")) continue;

  if (!hrefMap.has(cleanHref)) {
    hrefMap.set(cleanHref, new Map());
  }
  const labelMap = hrefMap.get(cleanHref);
  if (!labelMap.has(entry.label)) {
    labelMap.set(entry.label, new Set());
  }
  labelMap.get(entry.label).add(entry.source);
}

// Build NAV_DUPLICATES.md
let md = `# Totthobox — নেভিগেশন ও লিংক ডুপ্লিকেশন অডিট (NAV_DUPLICATES.md)\n\n`;
md += `**তারিখ:** ১৭ নভেম্বর, ২০২৬  \n`;
md += `**উদ্দেশ্য:** হোম পেজ, সার্ভিস ক্যাটালগ, ফুটার এবং নেভিগেশনে একই গন্তব্য (href)-এ ভিন্ন ভিন্ন লেবেল/নামে থাকা ডুপ্লিকেট মেনু শনাক্তকরণ এবং সমাধান।\n\n`;
md += `--- \n\n`;

md += `## ১. ডুপ্লিকেট লেবেলযুক্ত গন্তব্যসমূহ (Multiple Labels pointing to the Same Href)\n\n`;
md += `নিচে যেসব গন্তব্যে একাধিক আলাদা নামে মেনু আইটেম বা লিংক রয়েছে তার তালিকা দেওয়া হলো:\n\n`;
md += `| গন্তব্য ইউআরএল (Href) | ব্যবহৃত ভিন্ন ভিন্ন লেবেল/নাম | শনাক্তকৃত ফাইল/উৎস | সমাধান প্রস্তাবনা (Action) |\n`;
md += `| :--- | :--- | :--- | :--- |\n`;

let duplicateCount = 0;
for (const [href, labelMap] of hrefMap.entries()) {
  if (labelMap.size > 1) {
    duplicateCount++;
    const labels = Array.from(labelMap.keys()).join(" / ");
    const sources = Array.from(new Set([...labelMap.values()].flatMap(s => [...s]))).map(s => s.replace(/\\/g, "/")).join(", ");
    md += `| \`${href}\` | **${labels}** | \`${sources}\` | একটি একক প্রমিত নাম নির্ধারণ করে বাকিগুলো অপসারণ করা |\n`;
  }
}

md += `\n**মোট ডুপ্লিকেট লিংক গ্রুপ:** ${duplicateCount} টি।\n\n`;

md += `--- \n\n`;
md += `## ২. Single Source of Truth: \`config/navigation.ts\` আর্কিটেকচার\n\n`;
md += `ইউজার ইন্টারফেসে (UI) যেকোনো মেনু বা কার্ডে হাতে লেখা (hardcoded) \`href\` ব্যবহার সম্পূর্ণরূপে নিষিদ্ধ করা হলো।\n`;
md += `সমস্ত মেনু ও সার্ভিস আইটেম \`config/navigation.ts\` সেন্ট্রাল রেজিস্ট্রি থেকে রেন্ডার হবে। প্রতিটি এন্ট্রির স্কিমা:\n\n`;
md += `\`\`\`typescript
export interface NavItem {
  id: string;             // স্বতন্ত্র শনাক্তকারী
  label: string;          // প্রমিত বাংলা নাম (অনন্য)
  description?: string;   // ছোট বিবরণ
  href: string;           // গন্তব্য লিংক (সম্পূর্ণ ইউনিক, ডুপ্লিকেট নিষিদ্ধ)
  icon: string;           // Lucide আইকন নাম
  category: string;       // ক্যাটাগরি আইডি
  enabled: boolean;       // সক্রিয়/নিষ্ক্রিয় ফ্ল্যাগ
  indexable: boolean;     // সার্চ ইঞ্জিন ইনডেক্সিং অনুমোদিত কি না
  adsEnabled: boolean;    // এই পেজে অ্যাডসেন্স প্রদর্শিত হবে কি না
}
\`\`\`\n\n`;

md += `--- \n\n`;
md += `## ৩. ডুপ্লিকেট রোধের অটোমেটেড টেস্ট\n\n`;
md += `\`scripts/test-nav-registry.mjs\` টেস্টটি রেজিস্ট্রি স্ক্যান করে:\n`;
md += `1. কোনো \`href\` একাধিকবার পুনরাবৃত্তি হয়েছে কি না (Duplicate Href Check)\n`;
md += `2. কোনো \`label\` বিভ্রান্তিকরভাবে পুনরাবৃত্তি হয়েছে কি না\n`;
md += `3. কোনো অননুমোদিত ভাঙা লিংক বা অনিবন্ধিত রুট আছে কি না\n`;
md += `যদি কোনো ডুপ্লিকেট \`href\` পাওয়া যায়, তবে টেস্টটি বিল্ড ফেইল করবে।\n`;

writeFileSync(resolve("NAV_DUPLICATES.md"), md, "utf8");
console.log(`NAV_DUPLICATES.md generated! Found ${duplicateCount} duplicate href groups.`);
