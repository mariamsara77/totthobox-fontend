import type { Metadata } from "next";
import Link from "next/link";

export const revalidate = 86400;

export const metadata: Metadata = {
  alternates: { canonical: "https://totthobox.com/privacy-policy" },
  title: "গোপনীয়তা নীতি (Privacy Policy) | তথ্যবক্স",
  description:
    "Totthobox-এর সম্পূর্ণ গোপনীয়তা নীতি। আমরা কীভাবে আপনার ব্যক্তিগত তথ্য, কুকিজ এবং Google AdSense-এর মাধ্যমে তথ্য সংগ্রহ, ব্যবহার ও সুরক্ষা করি তা বিস্তারিত জানুন।",
  openGraph: {
    title: "গোপনীয়তা নীতি | Totthobox",
    description:
      "Totthobox-এর গোপনীয়তা নীতি, কুকিজ, ব্যক্তিগত তথ্যের ব্যবহার এবং তথ্য সুরক্ষা সম্পর্কে জানুন।",
    url: "https://totthobox.com/privacy-policy",
    siteName: "Totthobox",
    type: "website",
    locale: "bn_BD",
    images: [
      {
        url: "https://totthobox.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Totthobox",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "গোপনীয়তা নীতি | Totthobox",
    description:
      "Totthobox-এর গোপনীয়তা নীতি, কুকিজ, ব্যক্তিগত তথ্যের ব্যবহার এবং তথ্য সুরক্ষা সম্পর্কে জানুন।",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }],
  },
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "১১ নভেম্বর, ২০২৬";

  return (
    <section>
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 space-y-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl font-bold mb-4">
            গোপনীয়তা নীতি (Privacy Policy)
          </h1>
          <p className="text-zinc-500 text-sm">সর্বশেষ আপডেট: {lastUpdated}</p>
        </div>

        {/* Intro */}
        <div className="space-y-4">
          <p className="leading-relaxed">
            তথ্যবক্স (<strong>Totthobox</strong>)-এ আপনার গোপনীয়তা রক্ষা করা
            আমাদের সর্বোচ্চ অগ্রাধিকার। এই গোপনীয়তা নীতিতে আমরা ব্যাখ্যা করেছি
            যে আপনি যখন আমাদের ওয়েবসাইট (
            <a href="https://totthobox.com" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              https://totthobox.com
            </a>
            ) ব্যবহার করেন, তখন আমরা কী ধরণের তথ্য সংগ্রহ করি, কীভাবে তা ব্যবহার
            ও সংরক্ষণ করি এবং আপনার অধিকারসমূহ কী কী।
          </p>
          <p className="leading-relaxed">
            আমাদের ওয়েবসাইট ব্যবহারের মাধ্যমে আপনি এই গোপনীয়তা নীতির শর্তাবলীতে
            সম্মতি জানাচ্ছেন। যদি আপনি কোনো শর্তের সাথে একমত না হন, তবে অনুগ্রহ
            করে আমাদের সেবা ব্যবহার থেকে বিরত থাকুন।
          </p>
        </div>

        {/* Section 1 */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">১. আমরা কী তথ্য সংগ্রহ করি</h2>
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-zinc-800 dark:text-zinc-200">
                ক. স্বয়ংক্রিয়ভাবে সংগৃহীত তথ্য:
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                আপনি যখন সাইট ভিজিট করেন, তখন আপনার ব্রাউজার ও ডিভাইস থেকে কিছু
                তথ্য স্বয়ংক্রিয়ভাবে সংরক্ষিত হতে পারে — যেমন IP অ্যাড্রেস,
                ব্রাউজারের ধরন, অপারেটিং সিস্টেম, রেফারেল URL, ভিজিটের সময় এবং
                পৃষ্ঠা পরিদর্শনের পরিসংখ্যান।
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-zinc-800 dark:text-zinc-200">
                খ. আপনার প্রদানকৃত তথ্য:
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                রেজিস্ট্রেশন বা যোগাযোগের সময় আপনার নাম, ইমেইল অ্যাড্রেস এবং
                মেসেজের বিবরণ।
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-zinc-800 dark:text-zinc-200">
                গ. টুলস ব্যবহারের ডেটা:
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                কনভার্টার, ক্যালকুলেটর, ইমেজ রিসাইজার বা পিডিএফ এডিটর ব্যবহারের
                সময় আপনার ইনপুট সম্পূর্ণ ব্রাউজারে প্রসেস হয়। আমরা আপনার ব্যক্তিগত
                ফাইল বা গণনার ইনপুট আমাদের সার্ভারে সংরক্ষণ করি না।
              </p>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">২. তথ্য কীভাবে ব্যবহার করি</h2>
          <ul className="list-disc ml-6 space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400">
            <li>আমাদের ডিজিটাল টুলস ও সেবাসমূহ পরিচালনা ও উন্নত করা</li>
            <li>ব্যবহারকারীর অভিজ্ঞতা ব্যক্তিগত ও সহজ করা</li>
            <li>আপনার অনুসন্ধানের উত্তর প্রদান ও কারিগরি সাপোর্ট দেওয়া</li>
            <li>সাইটের নিরাপত্তা রক্ষা এবং অপব্যবহার/স্প্যাম প্রতিরোধ</li>
            <li>আইনগত বাধ্যবাধকতা পালন</li>
            <li>বিজ্ঞাপন প্রদর্শন ও কর্মক্ষমতা বিশ্লেষণ (Google AdSense সহ)</li>
          </ul>
        </section>

        {/* Section 3: AdSense & Third-Party Vendors */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            ৩. Google AdSense, বিজ্ঞাপন ও তৃতীয় পক্ষের ভেন্ডর
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            আমাদের ওয়েবসাইটে পরিচালন ব্যয় নির্বাহের লক্ষ্যে <strong>Google AdSense</strong> এবং অন্যান্য অনুমোদিত তৃতীয় পক্ষের বিজ্ঞাপন অংশীদারদের মাধ্যমে বিজ্ঞাপন প্রদর্শিত হতে পারে।
          </p>
          <ul className="list-disc ml-6 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <li>
              Google ও অন্যান্য বিজ্ঞাপন অংশীদাররা তাদের নিজস্ব প্রযুক্তি ও সম্মতি-সংক্রান্ত সেটিংস অনুযায়ী কুকি বা অনুরূপ প্রযুক্তি ব্যবহার করতে পারে।
            </li>
            <li>
              Google কীভাবে অংশীদার সাইট বা অ্যাপে তথ্য ব্যবহার করে, তা জানতে অনুগ্রহ করে অফিসিয়াল নির্দেশিকা পড়ুন:{" "}
              <a
                href="https://policies.google.com/technologies/partner-sites"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              >
                How Google uses information from sites or apps that use our services
              </a>.
            </li>
            <li>
              ব্যবহারকারীরা চাইলে যেকোনো সময়{" "}
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              >
                Google Ads Settings (https://adssettings.google.com)
              </a>{" "}
              ভিজিট করে ব্যক্তিগতকৃত বিজ্ঞাপন (Personalized Ads) বন্ধ বা অপ্ট-আউট (Opt-out) করতে পারেন।
            </li>
            <li>
              এছাড়া আন্তর্জাতিকভাবে তৃতীয় পক্ষের কুকিজ অপ্ট-আউট করতে ভিজিট করতে পারেন{" "}
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                aboutads.info
              </a>{" "}
              অথবা ইউরোপীয় ইউনিয়নভুক্ত ব্যবহারকারীদের জন্য{" "}
              <a
                href="https://www.youronlinechoices.eu/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                youronlinechoices.eu
              </a>.
            </li>
          </ul>
        </section>

        {/* Section 4: Cookies & Consent */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">৪. কুকিজ ও সম্মতি ব্যবস্থাপনা (Consent Policy)</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">আমরা নিম্নলিখিত ধরনের কুকিজ ব্যবহার করি:</p>
          <ul className="list-disc ml-6 space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400">
            <li>
              <strong>প্রয়োজনীয় কুকিজ (Essential Cookies):</strong> সাইটের মৌলিক কার্যকারিতা, থিম পছন্দ (ডার্ক/লাইট মোড) ও নিরাপত্তার জন্য অপরিহার্য।
            </li>
            <li>
              <strong>অ্যানালিটিক্স কুকিজ (Analytics Cookies):</strong> ট্রাফিক সোর্স ও কোন পৃষ্ঠাগুলো বেশি জনপ্রিয় তা বুঝতে সাহায্য করে।
            </li>
            <li>
              <strong>বিজ্ঞাপন কুকিজ (Advertising Cookies):</strong> প্রাসঙ্গিক বিজ্ঞাপন প্রদর্শন এবং বিজ্ঞাপন পুনরাবৃত্তি নিয়ন্ত্রণের জন্য বিজ্ঞাপন অংশীদারদের দ্বারা ব্যবহৃত।
            </li>
          </ul>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 mt-2">
            বর্তমান Totthobox কুকি সেটিংস প্যানেল ঐচ্ছিক analytics ও marketing script চালু করার আগে আপনার পছন্দ সংরক্ষণ করে। তবে এই প্যানেল নিজে Google-certified CMP বা IAB TCF integration নয়। EEA, UK ও সুইজারল্যান্ডের জন্য প্রয়োজনীয় Google-certified CMP/TCF integration আলাদাভাবে স্থাপন ও যাচাই না হওয়া পর্যন্ত AdSense production flag বন্ধ রাখতে হবে। কুকি সম্পর্কে বিস্তারিত জানতে আমাদের কুকি নীতি পড়ুন।
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            <Link href="/cookie-policy" className="font-medium text-indigo-600 underline dark:text-indigo-400">
              কুকি নীতি ও আপনার পছন্দ ব্যবস্থাপনা
            </Link>
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">৫. তথ্য প্রকাশ ও শেয়ারিং</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            আমরা কখনোই ব্যবহারকারীর ব্যক্তিগত তথ্য কোনো বাণিজ্যিক উদ্দেশ্যে তৃতীয় পক্ষের কাছে বিক্রয় বা ভাড়া দিই না। শুধুমাত্র আইনি বাধ্যবাধকতা পূরণে কিংবা সাইটের সুরক্ষার প্রয়োজনে প্রযোজ্য আইনানুযায়ী ব্যবস্থা গ্রহণ করা হতে পারে।
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">৬. ব্যবহারকারীর অধিকার (User Rights)</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">আমাদের প্ল্যাটফর্মে আপনার নিম্নলিখিত অধিকার রয়েছে:</p>
          <ul className="list-disc ml-6 space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400">
            <li>আপনার সংরক্ষিত তথ্য পর্যালোচনা বা সংশোধন করার অধিকার</li>
            <li>আপনার রেজিস্টার্ড অ্যাকাউন্ট বা ব্যক্তিগত তথ্য মুছে ফেলার অনুরোধের অধিকার</li>
            <li>ব্যক্তিগতকৃত বিজ্ঞাপন ও ট্র্যাকিং অপ্ট-আউট করার অধিকার</li>
          </ul>
        </section>

        {/* Contact Box */}
        <div className="bg-zinc-50 dark:bg-zinc-800/40 p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-center space-y-3">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">গোপনীয়তা বিষয়ক যোগাযোগ</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto">
            গোপনীয়তা নীতি সম্পর্কে কোনো জিজ্ঞাসা বা আপনার ডেটা সংক্রান্ত অনুরোধ থাকলে Totthobox-এর যোগাযোগ দলের সাথে যোগাযোগ করুন।
          </p>
          <div className="pt-2">
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 transition text-sm"
            >
              যোগাযোগ পাতা দেখুন &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
