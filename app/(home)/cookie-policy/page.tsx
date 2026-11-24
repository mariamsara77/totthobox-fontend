import type { Metadata } from "next";
import Link from "next/link";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "কুকি নীতি (Cookie Policy) | তথ্যবক্স",
  description:
    "Totthobox কীভাবে প্রয়োজনীয় স্টোরেজ, অ্যানালিটিক্স ও বিজ্ঞাপন-সংক্রান্ত কুকি ব্যবহার করে, কীভাবে পছন্দ পরিবর্তন করবেন এবং তৃতীয় পক্ষের সেটিংস কোথায় পাবেন তা জানুন।",
  alternates: { canonical: "https://totthobox.com/cookie-policy" },
  openGraph: {
    title: "কুকি নীতি | Totthobox",
    description: "Totthobox-এর কুকি, সম্মতি ও পছন্দ ব্যবস্থাপনা নীতি।",
    url: "https://totthobox.com/cookie-policy",
    siteName: "Totthobox",
    type: "website",
    locale: "bn_BD",
  },
  twitter: {
    card: "summary",
    title: "কুকি নীতি | Totthobox",
    description: "কুকি ও গোপনীয়তা পছন্দ ব্যবস্থাপনা সম্পর্কে জানুন।",
  },
};

export default function CookiePolicyPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-8 px-4 py-8 sm:py-12">
      <header className="space-y-3 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          কুকি নীতি (Cookie Policy)
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          এই নীতিতে Totthobox-এ কুকি ও অনুরূপ browser storage কীভাবে ব্যবহৃত হয় তা ব্যাখ্যা করা হয়েছে।
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">১. কুকি ও browser storage কী?</h2>
        <p className="text-sm leading-7 text-zinc-700 dark:text-zinc-300">
          কুকি হলো ছোট তথ্য, যা কোনো ওয়েবসাইট আপনার browser-এ সংরক্ষণ করতে পারে।
          Totthobox কুকির পাশাপাশি localStorage-এর মতো browser storage ব্যবহার করতে পারে।
          এগুলো সাইটের প্রয়োজনীয় পছন্দ মনে রাখা, নিরাপত্তা ও ঐচ্ছিক পরিসংখ্যানের কাজে ব্যবহৃত হতে পারে।
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">২. কোন ধরনের storage ব্যবহার হতে পারে?</h2>
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold">প্রয়োজনীয় storage</h3>
            <p className="text-sm leading-7 text-zinc-700 dark:text-zinc-300">
              সাইটের মৌলিক কার্যকারিতা, নিরাপত্তা, session ও আপনার সংরক্ষিত সম্মতি-পছন্দ
              বজায় রাখতে প্রয়োজনীয় storage ব্যবহার হতে পারে।
            </p>
          </div>
          <div>
            <h3 className="font-semibold">অ্যানালিটিক্স</h3>
            <p className="text-sm leading-7 text-zinc-700 dark:text-zinc-300">
              আপনি অনুমতি দিলে Google Analytics 4-এর মতো পরিসংখ্যান প্রযুক্তি
              সাইট ব্যবহারের তথ্য সংগ্রহ করতে পারে। সম্মতি না থাকলে Totthobox-এর
              consent-aware integration এই analytics tag চালু করে না।
            </p>
          </div>
          <div>
            <h3 className="font-semibold">বিজ্ঞাপন</h3>
            <p className="text-sm leading-7 text-zinc-700 dark:text-zinc-300">
              বিজ্ঞাপন চালু করা হলে Google AdSense ও সংশ্লিষ্ট advertising partner
              কুকি বা অনুরূপ প্রযুক্তি ব্যবহার করতে পারে। marketing পছন্দ না দিলে
              Totthobox-এর AdSense loader বিজ্ঞাপন script অনুরোধ করে না।
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">৩. আপনার পছন্দ কীভাবে পরিবর্তন করবেন?</h2>
        <p className="text-sm leading-7 text-zinc-700 dark:text-zinc-300">
          পেজের footer থেকে “কুকি সেটিংস” খুলে Analytics ও Marketing পছন্দ পরিবর্তন
          করতে পারবেন। প্রথমবার সাইটে এলে ঐচ্ছিক tracking বন্ধ থাকে; সিদ্ধান্ত
          সংরক্ষণ করার পর সংশ্লিষ্ট tag চালু হয়। browser-এর settings থেকেও কুকি
          মুছতে বা সীমিত করতে পারেন, তবে এতে কিছু site preference পুনরায় নির্ধারণ
          করতে হতে পারে।
        </p>
        <Link
          href="/privacy-policy"
          className="text-sm font-semibold text-indigo-700 underline underline-offset-2 dark:text-indigo-400"
        >
          সম্পূর্ণ গোপনীয়তা নীতি পড়ুন
        </Link>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">৪. Google বিজ্ঞাপন ও তৃতীয় পক্ষ</h2>
        <p className="text-sm leading-7 text-zinc-700 dark:text-zinc-300">
          Google কীভাবে partner site বা app থেকে তথ্য ব্যবহার করে, তা Google-এর
          নিজস্ব নীতিতে ব্যাখ্যা করা হয়েছে। ব্যক্তিগতকৃত বিজ্ঞাপনের পছন্দ দেখতে
          Google Ads Settings ব্যবহার করতে পারেন।
        </p>
        <ul className="list-disc space-y-2 pl-5 text-sm">
          <li>
            <a
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-700 underline underline-offset-2 dark:text-indigo-400"
            >
              Google: How Google uses information from sites or apps
            </a>
          </li>
          <li>
            <a
              href="https://adssettings.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-700 underline underline-offset-2 dark:text-indigo-400"
            >
              Google Ads Settings
            </a>
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">৫. EEA, UK ও Switzerland-এর সম্মতি</h2>
        <p className="text-sm leading-7 text-zinc-700 dark:text-zinc-300">
          এই repository-র নিজস্ব cookie settings panel Google-certified CMP বা
          IAB TCF integration নয়। EEA, UK ও Switzerland-এর জন্য প্রযোজ্য
          certification, TCF signal ও Google account configuration আলাদাভাবে
          সম্পন্ন এবং যাচাই করা প্রয়োজন। সেই যাচাই না হওয়া পর্যন্ত production
          environment-এ AdSense চালু রাখা উচিত নয়। এই অবস্থা সম্পর্কে ভুল ধারণা
          তৈরি করার জন্য Totthobox নিজস্ব panel-কে certified CMP বলে দাবি করে না।
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">৬. যোগাযোগ</h2>
        <p className="text-sm leading-7 text-zinc-700 dark:text-zinc-300">
          কুকি বা privacy পছন্দ সম্পর্কে প্রশ্ন থাকলে যোগাযোগ পাতার form ব্যবহার
          করুন অথবা <a href="mailto:admin@totthobox.com" className="text-indigo-700 underline dark:text-indigo-400">admin@totthobox.com</a>-এ লিখুন।
          প্রকাশের আগে site owner-এর এই যোগাযোগ ঠিকানাটি সচল আছে কি না যাচাই করা প্রয়োজন।
        </p>
        <Link
          href="/contact-us"
          className="text-sm font-semibold text-indigo-700 underline underline-offset-2 dark:text-indigo-400"
        >
          যোগাযোগ পাতা
        </Link>
      </section>
    </main>
  );
}
