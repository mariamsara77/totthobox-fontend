# Totthobox — নেভিগেশন ও লিংক ডুপ্লিকেশন অডিট (NAV_DUPLICATES.md)

**তারিখ:** ১৭ নভেম্বর, ২০২৬  
**উদ্দেশ্য:** হোম পেজ, সার্ভিস ক্যাটালগ, ফুটার এবং নেভিগেশনে একই গন্তব্য (href)-এ ভিন্ন ভিন্ন লেবেল/নামে থাকা ডুপ্লিকেট মেনু শনাক্তকরণ এবং সমাধান।

--- 

## ১. ডুপ্লিকেট লেবেলযুক্ত গন্তব্যসমূহ (Multiple Labels pointing to the Same Href)

নিচে যেসব গন্তব্যে একাধিক আলাদা নামে মেনু আইটেম বা লিংক রয়েছে তার তালিকা দেওয়া হলো:

| গন্তব্য ইউআরএল (Href) | ব্যবহৃত ভিন্ন ভিন্ন লেবেল/নাম | শনাক্তকৃত ফাইল/উৎস | সমাধান প্রস্তাবনা (Action) |
| :--- | :--- | :--- | :--- |
| `/tools/image-resizer` | **ছবি রিসাইজার / পাসপোর্ট ও ৩০০×৩০০** | `lib/services-catalog.ts, components/home/TrendingServices.tsx` | একটি একক প্রমিত নাম নির্ধারণ করে বাকিগুলো অপসারণ করা |
| `/tools/age-calculator` | **বয়স ক্যালকুলেটর / বছর, মাস ও দিন** | `lib/services-catalog.ts, components/home/TrendingServices.tsx` | একটি একক প্রমিত নাম নির্ধারণ করে বাকিগুলো অপসারণ করা |
| `/tools/tax-vat-calculator` | **আয়কর ও ভ্যাট / এনবিআর কর স্ল্যাব** | `lib/services-catalog.ts, components/home/TrendingServices.tsx` | একটি একক প্রমিত নাম নির্ধারণ করে বাকিগুলো অপসারণ করা |
| `/converter/land` | **জমির পরিমাপ / কাঠা, শতক, বিঘা** | `lib/services-catalog.ts, components/home/TrendingServices.tsx` | একটি একক প্রমিত নাম নির্ধারণ করে বাকিগুলো অপসারণ করা |
| `/converter/number-to-word` | **কথায় রূপান্তর / চেক ও রসিদ তৈরি** | `lib/services-catalog.ts, components/home/TrendingServices.tsx` | একটি একক প্রমিত নাম নির্ধারণ করে বাকিগুলো অপসারণ করা |
| `/bangla/calendar` | **বাংলা ক্যালেন্ডার / ১৪৩২ বঙ্গাব্দ ও ছুটি** | `lib/services-catalog.ts, components/home/TrendingServices.tsx` | একটি একক প্রমিত নাম নির্ধারণ করে বাকিগুলো অপসারণ করা |
| `/contact/police` | **প্রশাসনিক সেবা / জরুরি সেবা ৯৯৯ / ফায়ার সার্ভিস / অ্যাম্বুলেন্স / হাসপাতাল / শিশু হেল্পলাইন / নারী সহায়তা ১০৯ / পুলিশ ও অ্যাম্বুলেন্স** | `lib/services-catalog.ts, components/home/TrendingServices.tsx` | একটি একক প্রমিত নাম নির্ধারণ করে বাকিগুলো অপসারণ করা |
| `/international/world-clock` | **বিশ্ব ঘড়ি / সকল দেশের সময়** | `lib/services-catalog.ts, components/home/TrendingServices.tsx` | একটি একক প্রমিত নাম নির্ধারণ করে বাকিগুলো অপসারণ করা |
| `/islam/basic` | **মৌলিক জ্ঞান / কালেমা ও অর্থ / নামাজের নিয়ম** | `lib/services-catalog.ts` | একটি একক প্রমিত নাম নির্ধারণ করে বাকিগুলো অপসারণ করা |
| `/news/headlines` | **শীর্ষ খবর / জাতীয় সংবাদপত্র / আন্তর্জাতিক খবর / মিডিয়া সোর্স** | `lib/services-catalog.ts` | একটি একক প্রমিত নাম নির্ধারণ করে বাকিগুলো অপসারণ করা |
| `/live-tv` | **বিটিভি জাতীয় / সংসদ টেলিভিশন / বিটিভি ওয়ার্ল্ড / বাংলাদেশ বেতার** | `lib/services-catalog.ts` | একটি একক প্রমিত নাম নির্ধারণ করে বাকিগুলো অপসারণ করা |
| `/contact-us` | **trackContactClick("footer_link", "/contact-us")}
            className="flex min-h-11 items-center rounded-xl px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            যোগাযোগ / যোগাযোগ** | `components/Footer.tsx, app/(home)/page.tsx` | একটি একক প্রমিত নাম নির্ধারণ করে বাকিগুলো অপসারণ করা |

**মোট ডুপ্লিকেট লিংক গ্রুপ:** 12 টি।

--- 

## ২. Single Source of Truth: `config/navigation.ts` আর্কিটেকচার

ইউজার ইন্টারফেসে (UI) যেকোনো মেনু বা কার্ডে হাতে লেখা (hardcoded) `href` ব্যবহার সম্পূর্ণরূপে নিষিদ্ধ করা হলো।
সমস্ত মেনু ও সার্ভিস আইটেম `config/navigation.ts` সেন্ট্রাল রেজিস্ট্রি থেকে রেন্ডার হবে। প্রতিটি এন্ট্রির স্কিমা:

```typescript
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
```

--- 

## ৩. ডুপ্লিকেট রোধের অটোমেটেড টেস্ট

`scripts/test-nav-registry.mjs` টেস্টটি রেজিস্ট্রি স্ক্যান করে:
1. কোনো `href` একাধিকবার পুনরাবৃত্তি হয়েছে কি না (Duplicate Href Check)
2. কোনো `label` বিভ্রান্তিকরভাবে পুনরাবৃত্তি হয়েছে কি না
3. কোনো অননুমোদিত ভাঙা লিংক বা অনিবন্ধিত রুট আছে কি না
যদি কোনো ডুপ্লিকেট `href` পাওয়া যায়, তবে টেস্টটি বিল্ড ফেইল করবে।
