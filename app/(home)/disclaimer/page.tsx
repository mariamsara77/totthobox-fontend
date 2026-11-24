import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldAlert,
  Calculator,
  PhoneCall,
  BookOpen,
  Newspaper,
  Cpu,
  BadgeAlert,
  CheckCircle2,
  Mail,
  ExternalLink,
  Coins,
} from "lucide-react";

export const revalidate = 86400;

export const metadata: Metadata = {
  alternates: { canonical: "https://totthobox.com/disclaimer" },
  title: "দায়মুক্তি ও তথ্য নীতিমালা (Disclaimer) | তথ্যবক্স",
  description:
    "Totthobox-এর সম্পূর্ণ দায়মুক্তি ও নীতিমালা। প্ল্যাটফর্মের তথ্য, ক্যালকুলেটর, কনভার্টার, জরুরি সেবা এবং তৃতীয় পক্ষের বিষয়বস্তুর সঠিকতা, সীমাবদ্ধতা ও ব্যবহারের নিয়ম সম্পর্কে জানুন।",
  openGraph: {
    title: "দায়মুক্তি ও নীতিমালা (Disclaimer) | Totthobox",
    description:
      "Totthobox-এর সম্পূর্ণ দায়মুক্তি ও নীতিমালা। আমাদের তথ্য, কনভার্টার, ক্যালকুলেটর ও বিজ্ঞাপনের সীমাবদ্ধতা সম্পর্কে বিস্তারিত জানুন।",
    url: "https://totthobox.com/disclaimer",
    siteName: "Totthobox",
    type: "website",
    locale: "bn_BD",
    images: [
      {
        url: "https://totthobox.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Totthobox Disclaimer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "দায়মুক্তি ও নীতিমালা (Disclaimer) | Totthobox",
    description:
      "Totthobox-এর তথ্য, ক্যালকুলেটর, কনভার্টার ও বিজ্ঞাপনের দায়মুক্তি এবং ব্যবহারের সীমাবদ্ধতা।",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }],
  },
};

export default function DisclaimerPage() {
  const lastUpdated = "১০ নভেম্বর, ২০২৬";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <ShieldAlert className="w-3.5 h-3.5" />
          আইনি নোটিশ ও ব্যবহারকারীর সচেতনতা
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          দায়মুক্তি ও তথ্য নীতিমালা
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Totthobox প্ল্যাটফর্ম ব্যবহারের সাধারণ শর্তাবলি, তথ্যের সীমাবদ্ধতা ও
          দায়মুক্তি সংক্রান্ত বিস্তারিত বিবরণ
        </p>

        <div className="pt-2">
          <span className="inline-block px-3 py-1 text-xs rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
            সর্বশেষ আপডেট: {lastUpdated}
          </span>
        </div>
      </div>

      <div className="space-y-8 text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
        {/* ১. সাধারণ তথ্য */}
        <section className="p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-800/30 space-y-3">
          <div className="flex items-center gap-3 text-zinc-900 dark:text-zinc-100">
            <BadgeAlert className="w-5 h-5 text-indigo-500 shrink-0" />
            <h2 className="text-lg font-bold">১. সাধারণ তথ্যের দায়মুক্তি (General Disclaimer)</h2>
          </div>
          <p>
            <strong>Totthobox</strong> (
            <a
              href="https://totthobox.com"
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              totthobox.com
            </a>
            )-এ প্রকাশিত সকল তথ্য কেবল সাধারণ জ্ঞান, শিক্ষা এবং দৈনন্দিন
            ব্যবহারের সহায়ক হিসেবে সরল বিশ্বাসে (in good faith) পরিবেশিত হয়।
            আমরা তথ্যের নির্ভরযোগ্যতা, প্রাসঙ্গিকতা ও সঠিকতা বজায় রাখার জন্য
            সর্বাত্মক চেষ্টা করি; তবে প্ল্যাটফর্মে থাকা কোনো তথ্যের পূর্ণাঙ্গতা,
            সময়োপযোগিতা বা শতভাগ নির্ভুলতার ব্যাপারে কোনো প্রকাশ্য বা পরোক্ষ
            গ্যারান্টি প্রদান করি না।
          </p>
          <p>
            এই ওয়েবসাইটের তথ্যের ওপর ভিত্তি করে গৃহীত যেকোনো সিদ্ধান্তের ঝুঁকি
            সম্পূর্ণরূপে ব্যবহারকারীর নিজস্ব।
          </p>
        </section>

        {/* ২. ক্যালকুলেটর ও কনভার্টার */}
        <section className="p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-800/30 space-y-3">
          <div className="flex items-center gap-3 text-zinc-900 dark:text-zinc-100">
            <Calculator className="w-5 h-5 text-emerald-500 shrink-0" />
            <h2 className="text-lg font-bold">
              ২. টুলস, ক্যালকুলেটর ও কনভার্টারের ফলাফল সংক্রান্ত দায়মুক্তি
            </h2>
          </div>
          <p>
            আমাদের প্ল্যাটফর্মে থাকা টুলসমূহ—যেমন: কারেন্সি কনভার্টার, বয়স
            ক্যালকুলেটর, জমির পরিমাপ কনভার্টার, একক রূপান্তর, ইমেজ রিসাইজার ও QR
            কোড জেনারেটর—প্রচলিত গাণিতিক সূত্র ও সূত্রের মানদণ্ডের ওপর ভিত্তি
            করে ফলাফল প্রদর্শন করে।
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            <li>
              <strong>আয়কর ও ভ্যাট ক্যালকুলেটর (Tax & VAT Calculator):</strong> এটি কেবল সাধারণ সচেতনতা ও প্রাথমিক খসড়া হিসাবের জন্য আনুমানিক ফলাফল প্রদান করে। জাতীয় রাজস্ব বোর্ড (NBR)-এর কর আইন, এসআরও বা করদাতার ব্যক্তিগত প্রযোজ্য রেয়াত ও বিনিয়োগ ভাতার কারণে প্রকৃত করদায় ভিন্ন হতে পারে। চূড়ান্ত কর নির্ধারণের জন্য সংশ্লিষ্ট কর আইনজীবী, চার্টার্ড অ্যাকাউন্ট্যান্ট বা আয়কর সার্কেলের সাথে পরামর্শ করুন।
            </li>
            <li>
              <strong>মুদ্রা কনভার্টার (Currency Converter):</strong> প্রদর্শিত
              মুদ্রার হার আনুমানিক ও আন্তর্জাতিক বাজারভিত্তিক। ব্যাংকিং লেনদেন,
              মানি এক্সচেঞ্জ বা বৈদেশিক বাণিজ্যের ক্ষেত্রে সংশ্লিষ্ট আর্থিক
              প্রতিষ্ঠানের অফিসিয়াল রেট অনুসরণ বাধ্যতামূলক।
            </li>
            <li>
              <strong>জমি পরিমাপ (Land Measurement):</strong> আঞ্চলিক ভেদে জমির
              পরিমাপ (যেমন: কাঠা, বিঘা, শতাংশ)-এর সংজ্ঞায় সামান্য পার্থক্য হতে
              পারে। কোনো আইনি দলিল বা জমি ক্রয়-বিক্রয়ে সংশ্লিষ্ট সরকারি ভূমি
              অফিস ও সার্ভেয়ারের পরামর্শ গ্রহণ কাম্য।
            </li>
            <li>
              <strong>রাশি ক্যালকুলেটর (Zodiac):</strong> এটি কেবল একটি
              প্রচলিত বিনোদন ও সাধারণ তথ্যভিত্তিক ফিচার। এটি কোনো ভাগ্য নির্ধারণ
              বা ভবিষ্যৎ বাণী নয়।
            </li>
          </ul>
        </section>

        {/* ৩. জরুরি সেবা ও হেল্পলাইন */}
        <section className="p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-800/30 space-y-3">
          <div className="flex items-center gap-3 text-zinc-900 dark:text-zinc-100">
            <PhoneCall className="w-5 h-5 text-rose-500 shrink-0" />
            <h2 className="text-lg font-bold">
              ৩. জরুরি সেবা ও হেল্পলাইন নম্বর সংক্রান্ত স্পষ্টীকরণ
            </h2>
          </div>
          <p>
            Totthobox-এ প্রদত্ত জরুরি হেল্পলাইন (পুলিশ, ফায়ার সার্ভিস,
            অ্যাম্বুলেন্স, জাতীয় জরুরি সেবা ৯৯৯ ইত্যাদি) জনস্বার্থে সরকারি ও
            উন্মুক্ত উৎস থেকে সংগৃহীত।
          </p>
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3.5 text-xs sm:text-sm text-rose-800 dark:text-rose-300">
            <strong>জরুরি বিজ্ঞপ্তি:</strong> Totthobox সরাসরি কোনো জরুরি সেবা বা
            উদ্ধার তৎপরতা প্রদানকারী সংস্থা নয়। যেকোনো সংকটাপন্ন মুহূর্তে অবিলম্বে
            জাতীয় জরুরি সেবা <strong>৯৯৯</strong> অথবা সংশ্লিষ্ট নিকটস্থ
            থানা/হাসপাতালে সরাসরি যোগাযোগ করুন।
          </div>
        </section>

        {/* ৪. ইসলামিক ও ধর্মীয় তথ্য */}
        <section className="p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-800/30 space-y-3">
          <div className="flex items-center gap-3 text-zinc-900 dark:text-zinc-100">
            <BookOpen className="w-5 h-5 text-teal-500 shrink-0" />
            <h2 className="text-lg font-bold">
              ৪. ইসলামিক ও ধর্মীয় তথ্যের সীমাবদ্ধতা
            </h2>
          </div>
          <p>
            আমাদের ইসলামিক সেকশনে থাকা মৌলিক ধারণা, কালেমা, দোয়া এবং নামাজের
            নিয়মাবলি প্রাথমিক শিক্ষামূলক উদ্দেশ্যে প্রস্তুত করা হয়েছে।
          </p>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            কোনো জটিল ধর্মীয় ফতোয়া, শরীয়াহ বিধান বা বিশেষ মাসআলার ক্ষেত্রে
            সরাসরি বিজ্ঞ আলেম, মুফতি অথবা স্বীকৃত ইসলামিক গবেষণা প্রতিষ্ঠানের
            শরণাপন্ন হওয়ার অনুরোধ জানানো হচ্ছে।
          </p>
        </section>

        {/* ৫. সংবাদ ও তৃতীয় পক্ষের তথ্যসূত্র */}
        <section className="p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-800/30 space-y-3">
          <div className="flex items-center gap-3 text-zinc-900 dark:text-zinc-100">
            <Newspaper className="w-5 h-5 text-blue-500 shrink-0" />
            <h2 className="text-lg font-bold">৫. সংবাদ শিরোনাম ও বাহ্যিক কন্টেন্ট</h2>
          </div>
          <p>
            Totthobox-এর সংবাদ শিরোনাম বিভাগে বিভিন্ন প্রথম সারির জাতীয় ও
            আন্তর্জাতিক সংবাদমাধ্যমের শিরোনাম ও সারসংক্ষেপ পাঠকের সুবিধার্থে RSS
            বা অনুমোদিত এগ্রিগেশনের মাধ্যমে পরিবেশিত হয়।
          </p>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            সংবাদের মূল সত্যতা, দৃষ্টিভঙ্গি ও মতামতের পূর্ণ দায় সংশ্লিষ্ট মূল
            সংবাদমাধ্যমের। কোনো সংবাদের তথ্যে অসঙ্গতি থাকলে মূল প্রকাশকের সাথে
            যোগাযোগ করার পরামর্শ দেওয়া হলো।
          </p>
        </section>

        {/* ৬. সফটওয়্যার ও থার্ড-পার্টি ডাউনলোড */}
        <section className="p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-800/30 space-y-3">
          <div className="flex items-center gap-3 text-zinc-900 dark:text-zinc-100">
            <Cpu className="w-5 h-5 text-purple-500 shrink-0" />
            <h2 className="text-lg font-bold">
              ৬. সফটওয়্যার পরিচিতি ও বাহ্যিক লিংক
            </h2>
          </div>
          <p>
            সফটওয়্যার ডিরেক্টরি সেকশনে বিভিন্ন দরকারি সফটওয়্যারের পরিচিতি,
            সিস্টেম রিকোয়ারমেন্ট ও অফিসিয়াল ডাউনলোডের লিংক তুলে ধরা হয়েছে।
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            <li>
              Totthobox কোনো পাইরেটেড বা ম্যালওয়্যারযুক্ত সফটওয়্যার হোস্ট বা
              বিতরণ করে না।
            </li>
            <li>
              ব্যবহারকারী যখন কোনো বাহ্যিক ওয়েবসাইটে রিডাইরেক্ট হন, তখন সেই
              সাইটের নিয়ম ও গোপনীয়তা নীতি প্রযোজ্য হবে।
            </li>
            <li>
              ডাউনলোড করা সফটওয়্যার ব্যবহারে আপনার ডিভাইসে কোনো সমস্যা হলে তার
              দায় সংশ্লিষ্ট সফটওয়্যার প্রস্তুতকারকের।
            </li>
          </ul>
        </section>

        {/* ৭. গুগল অ্যাডসেন্স ও বিজ্ঞাপন */}
        <section className="p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-800/30 space-y-3">
          <div className="flex items-center gap-3 text-zinc-900 dark:text-zinc-100">
            <ExternalLink className="w-5 h-5 text-amber-500 shrink-0" />
            <h2 className="text-lg font-bold">
              ৭. গুগল অ্যাডসেন্স ও বিজ্ঞাপন সংক্রান্ত নীতিমালা
            </h2>
          </div>
          <p>
            আমাদের প্ল্যাটফর্মটি সম্পূর্ণ বিনামূল্যে পরিচালিত হয় এবং এর পরিচালন
            ব্যয় নির্বাহের জন্য আমরা <strong>Google AdSense</strong> সহ বিভিন্ন
            বিশ্বস্ত তৃতীয় পক্ষের বিজ্ঞাপনী নেটওয়ার্কের সাহায্য গ্রহণ করি।
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            <li>
              বিজ্ঞাপনে প্রদর্শিত কোনো পণ্য বা সেবার গুণমান, সত্যতা বা
              কার্যকারিতা Totthobox কর্তৃক সরাসরি সত্যায়িত বা সুপারিশকৃত নয়।
            </li>
            <li>
              বিজ্ঞাপনে ক্লিক করা বা বিজ্ঞাপনী লিংকের মাধ্যমে কোনো আর্থিক লেনদেন
              করলে তা ব্যবহারকারী ও সংশ্লিষ্ট বিজ্ঞাপনদাতার মধ্যকার নিজস্ব চুক্তি
              হিসেবে গণ্য হবে।
            </li>
            <li>
              বিজ্ঞাপন প্রদর্শনের সময় কুকিজের ব্যবহার সম্পর্কে বিস্তারিত জানতে
              আমাদের{" "}
              <Link
                href="/privacy-policy"
                className="text-indigo-600 dark:text-indigo-400 underline font-medium"
              >
                গোপনীয়তা নীতি
              </Link>{" "}
              দেখুন।
            </li>
          </ul>
        </section>

        {/* ৮. পেশাগত পরামর্শের বিকল্প নয় */}
        <section className="p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-800/30 space-y-3">
          <div className="flex items-center gap-3 text-zinc-900 dark:text-zinc-100">
            <CheckCircle2 className="w-5 h-5 text-sky-500 shrink-0" />
            <h2 className="text-lg font-bold">
              ৮. পেশাগত পরামর্শের বিকল্প নয় (No Professional Advice)
            </h2>
          </div>
          <p>
            Totthobox-এর কনটেন্ট কোনোভাবেই আইনি (Legal), চিকিৎসা (Medical) কিংবা
            পেশাদার আর্থিক ও কর (Financial/Tax) পরামর্শের বিকল্প নয়। যেকোনো গুরুত্বপূর্ণ
            সিদ্ধান্ত গ্রহণের পূর্বে উপযুক্ত পেশাজীবীর সরাসরি পরামর্শ গ্রহণ করা
            আবশ্যক।
          </p>
        </section>

        {/* ৯. মতামত ও সংশোধন */}
        <section className="p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-800/30 space-y-3">
          <div className="flex items-center gap-3 text-zinc-900 dark:text-zinc-100">
            <Mail className="w-5 h-5 text-rose-500 shrink-0" />
            <h2 className="text-lg font-bold">৯. অসঙ্গতি সংশোধন ও যোগাযোগ</h2>
          </div>
          <p>
            আমাদের সাইটে কোনো তথ্য ভুল, অসম্পূর্ণ বা বিভ্রান্তিকর মনে হলে অনুগ্রহ
            করে আমাদের অবহিত করুন। আমরা দ্রুততম সময়ে তা যাচাই করে সংশোধনের
            পদক্ষেপ গ্রহণ করব।
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs sm:text-sm font-medium transition hover:opacity-90"
            >
              যোগাযোগ ফর্ম
            </Link>
            <a
              href="mailto:admin@totthobox.com"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-300 transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              ইমেইল: admin@totthobox.com
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
