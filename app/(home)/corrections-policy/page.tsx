import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "ভুল সংশোধন ও পরিমার্জন নীতিমালা (Corrections Policy) | তথ্যবক্স",
  description:
    "তথ্যবক্সে প্রকাশিত যেকোনো তথ্য, হিসাব বা কনটেন্টে ত্রুটি চিহ্নিত হলে তা সংশোধন ও পরিমার্জনের স্বচ্ছ নীতিমালা এবং পাঠক প্রতিক্রিয়া প্রক্রিয়া।",
  alternates: {
    canonical: "https://totthobox.com/corrections-policy",
  },
  openGraph: {
    title: "ভুল সংশোধন ও পরিমার্জন নীতিমালা | তথ্যবক্স",
    description: "তথ্যবক্সের তথ্যের নির্ভুলতা ও সংশোধন সংক্রান্ত স্বচ্ছ সম্পাদকীয় নীতিমালা।",
    url: "https://totthobox.com/corrections-policy",
    siteName: "Totthobox",
    type: "website",
    locale: "bn_BD",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox Corrections Policy" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ভুল সংশোধন ও পরিমার্জন নীতিমালা | তথ্যবক্স",
    description: "তথ্যবক্সের তথ্যের নির্ভুলতা ও সংশোধন সংক্রান্ত স্বচ্ছ সম্পাদকীয় নীতিমালা।",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox Corrections Policy" }],
  },
};

export default function CorrectionsPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12 space-y-8">
      <PageHeader
        title="ভুল সংশোধন ও পরিমার্জন নীতিমালা"
        description="তথ্যের শতভাগ নির্ভুলতা ও স্বচ্ছতা নিশ্চিতকরণে তথ্যবক্সের প্রাতিষ্ঠানিক সংশোধনী প্রক্রিয়া"
        badge="স্বচ্ছতা ও সত্যনিষ্ঠা"
        breadcrumbs={[{ label: "সংশোধন নীতিমালা", href: "/corrections-policy" }]}
      />

      <div className="space-y-6 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
        {/* Section 1 */}
        <Card className="space-y-3">
          <div className="flex items-center gap-2.5 text-base font-bold text-zinc-900 dark:text-zinc-100">
            <div className="flex size-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Icon name="RefreshCw" size="xs" />
            </div>
            <h2>১. আমাদের প্রতিশ্রুতি ও নীতি</h2>
          </div>
          <p>
            তথ্যবক্স (Totthobox) একটি নির্ভরযোগ্য ও নিরপেক্ষ ডিজিটাল তথ্য প্ল্যাটফর্ম। আমরা জাতীয় আইন, এনবিআর কর বিধিমালা, সরকারি ছুটির ক্যালেন্ডার, ইসলামিক বিধান এবং সাধারণ জ্ঞান সংক্রান্ত তথ্য পরিবেশনে সর্বোচ্চ সতর্কতা অবলম্বন করি। এতদসত্ত্বেও মানুষের অনিচ্ছাকৃত ভুল বা সরকারি নীতিমালার সাম্প্রতিক পরিবর্তনের কারণে তথ্যে কোনো অসংগতি দেখা দিলে তা দ্রুততম সময়ে সংশোধনে আমরা প্রতিশ্রুতিবদ্ধ।
          </p>
        </Card>

        {/* Section 2 */}
        <Card className="space-y-3">
          <div className="flex items-center gap-2.5 text-base font-bold text-zinc-900 dark:text-zinc-100">
            <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Icon name="CheckCircle2" size="xs" />
            </div>
            <h2>২. সংশোধনের মাত্রা ও শ্রেণিবিভাগ</h2>
          </div>
          <ul className="space-y-2 list-disc list-inside">
            <li>
              <strong>বানান ও ব্যাকরণগত পরিমার্জন:</strong> তথ্যের মূল অর্থ পরিবর্তন না করে সাধারণ টাইপো বা অসতর্ক বানানভুল চিহ্নিত হওয়ামাত্র সংশোধন করা হয়।
            </li>
            <li>
              <strong>তথ্যের অসংগতি বা ফ্যাকচুয়াল ত্রুটি:</strong> তারিখ, পরিসংখ্যান, নাম, আইন বা অঙ্কের কোনো ভুল পরিলক্ষিত হলে সম্পাদকীয় পর্ষদ সরকারি প্রাথমিক সোর্স বা গেজেটের সাথে যাচাই করে মূল কনটেন্ট সংশোধন করে এবং পেজের নিচে সংশোধনী নোট যুক্ত করে।
            </li>
            <li>
              <strong>আইন ও নিয়মের সাম্প্রতিক পরিবর্তন:</strong> জাতীয় বাজেট, আয়কর স্ল্যাব বা নতুন সরকারি অধ্যাদেশ জারির সাথে সাথে পুরনো হিসাব-নিকাশ আপডেট করে &quot;সর্বশেষ হালনাগাদ&quot; তারিখ প্রকাশ করা হয়।
            </li>
          </ul>
        </Card>

        {/* Section 3 */}
        <Card className="space-y-3">
          <div className="flex items-center gap-2.5 text-base font-bold text-zinc-900 dark:text-zinc-100">
            <div className="flex size-8 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent-ink)]">
              <Icon name="AlertCircle" size="xs" />
            </div>
            <h2>৩. পাঠক প্রতিক্রিয়া ও ভুল অবহিতকরণ প্রক্রিয়া</h2>
          </div>
          <p>
            আমাদের পাঠক ও ব্যবহারকারীগণই তথ্যের নির্ভুলতা বজায় রাখার সবচেয়ে বড় অংশীদার। আপনি যদি আমাদের কোনো পেজে কোনো ত্রুটি লক্ষ্য করেন, তবে অনুগ্রহ করে নিচের তথ্যসহ আমাদের অবহিত করুন:
          </p>
          <div className="p-4 rounded-xl bg-zinc-100/70 dark:bg-zinc-800/50 space-y-1.5 text-xs">
            <p>• সংশ্লিষ্ট পেজের লিংক (URL)</p>
            <p>• আপনি যে বাক্য বা তথ্যে ত্রুটি পেয়েছেন</p>
            <p>• সঠিক তথ্য ও প্রমাণ বা সরকারি সূত্রের লিংক</p>
          </div>
          <p>
            সংশোধনী আবেদন পাঠাতে সরাসরি ইমেইল করুন:{" "}
            <a
              href="mailto:editorial@totthobox.com"
              className="font-semibold text-indigo-600 dark:text-indigo-400 underline"
            >
              editorial@totthobox.com
            </a>{" "}
            অথবা আমাদের{" "}
            <Link
              href="/contact-us"
              className="font-semibold text-indigo-600 dark:text-indigo-400 underline"
            >
              যোগাযোগ ফর্ম
            </Link>{" "}
            ব্যবহার করুন।
          </p>
        </Card>

        {/* Section 4 */}
        <Card className="space-y-3">
          <div className="flex items-center gap-2.5 text-base font-bold text-zinc-900 dark:text-zinc-100">
            <div className="flex size-8 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <Icon name="Clock" size="xs" />
            </div>
            <h2>৪. নিষ্পত্তির সময়সীমা</h2>
          </div>
          <p>
            আমাদের ফ্যাক্ট-চেকিং ও সম্পাদকীয় দল পাঠকের প্রতিটি সংশোধনী প্রস্তাব সর্বোচ্চ <strong>২৪ থেকে ৪৮ ঘণ্টার</strong> মধ্যে পুঙ্খানুপুঙ্খ যাচাই করে সিদ্ধান্ত গ্রহণ করে। তথ্য সঠিক প্রমাণিত হলে তা অবিলম্বে হালনাগাদ করা হয়।
          </p>
        </Card>
      </div>
    </div>
  );
}
