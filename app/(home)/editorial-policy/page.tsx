import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  FileCheck,
  RefreshCw,
  Scale,
  Mail,
  AlertCircle,
  BookOpen,
  CheckCircle2,
} from "lucide-react";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "কনটেন্ট ও সম্পাদকীয় নীতিমালা (Editorial Policy) | তথ্যবক্স",
  description:
    "তথ্যবক্সের তথ্য সংগ্রহ, যাচাইকরণ, সম্পাদকীয় স্বাধীনতা, সংশোধনী নীতিমালা এবং তথ্যের নির্ভুলতা বজায় রাখার অঙ্গীকার সম্পর্কে বিস্তারিত জানুন।",
  alternates: {
    canonical: "https://totthobox.com/editorial-policy",
  },
  openGraph: {
    title: "কনটেন্ট ও সম্পাদকীয় নীতিমালা | তথ্যবক্স",
    description:
      "তথ্যবক্সের তথ্য সংগ্রহ, যাচাইকরণ, সম্পাদকীয় স্বাধীনতা এবং সংশোধনী নীতিমালা।",
    url: "https://totthobox.com/editorial-policy",
    siteName: "Totthobox",
    type: "article",
    locale: "bn_BD",
    images: [
      {
        url: "https://totthobox.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Totthobox Editorial Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "কনটেন্ট ও সম্পাদকীয় নীতিমালা | তথ্যবক্স",
    description:
      "তথ্যবক্সের তথ্য সংগ্রহ, যাচাইকরণ এবং সংশোধনী নীতিমালা।",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }],
  },
};

export default function EditorialPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <header className="space-y-4 border-b border-zinc-200 dark:border-zinc-800 pb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4" />
          স্বচ্ছতা ও নির্ভরযোগ্যতার অঙ্গীকার
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
          সম্পাদকীয় ও কনটেন্ট নীতিমালা (Editorial Policy)
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
          তথ্যবক্স (Totthobox) একটি নিরপেক্ষ ও উন্মুক্ত তথ্যভাণ্ডার ও ডিজিটাল টুলস সেবা। 
          ব্যবহারকারীদের কাছে নির্ভুল, হালনাগাদ ও প্রাসঙ্গিক তথ্য পৌঁছে দেওয়াই আমাদের মূল অঙ্গীকার। 
          কনটেন্ট প্রস্তুতি, উৎস যাচাই, সংশোধন এবং প্রকাশের ক্ষেত্রে আমরা যে নীতিগুলো অনুসরণ করার লক্ষ্য রাখি, তা নিচে ব্যাখ্যা করা হলো।
        </p>
        <p className="text-xs text-zinc-500">
          সংস্করণ: ১১ নভেম্বর, ২০২৬
        </p>
      </header>

      {/* Section 1: Objective */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            ১. সম্পাদকীয় উদ্দেশ্য ও দৃষ্টিভঙ্গি
          </h2>
        </div>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
          তথ্যবক্সের মূল উদ্দেশ্য হলো দৈনন্দিন জীবনের জটিল গাণিতিক হিসাব, সরকারি ও প্রাতিষ্ঠানিক তথ্য, 
          আইনি ও জরুরি নম্বর এবং শিক্ষামূলক বিষয়াবলিকে সহজ ও সাবলীল বাংলায় সবার সামনে উপস্থাপন করা। 
          আমরা কোনো ধরণের ক্লিকবেট, অসত্য চটকদার খবর বা বিভ্রান্তিকর তথ্য প্রচার করি না। 
          যেখানে সম্ভব, তথ্যের সঙ্গে নির্ভরযোগ্য উৎস ও সীমাবদ্ধতা যুক্ত করা হয়। কোনো তথ্যের উৎস বা যাচাই অসম্পূর্ণ থাকলে সেটিকে নিশ্চিত সত্য হিসেবে উপস্থাপন করা উচিত নয়।
        </p>
      </section>

      {/* Section 2: Sources */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <FileCheck className="w-5 h-5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            ২. তথ্য সংগ্রহের উৎস ও মানদণ্ড
          </h2>
        </div>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
          তথ্যের ধরন অনুযায়ী আমরা প্রাথমিক সরকারি নথি, সংশ্লিষ্ট প্রতিষ্ঠানের ওয়েবসাইট, স্বীকৃত গ্রন্থ বা নির্ভরযোগ্য রেফারেন্স ব্যবহার করতে অগ্রাধিকার দিই। সব বিদ্যমান রেকর্ডে এখনো পৃথক উৎস-লিংক যুক্ত হয়নি; উৎস অনুপস্থিত থাকলে তা সম্পাদকীয়ভাবে পূরণ করতে হবে:
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-sm text-zinc-700 dark:text-zinc-300">
          <li className="flex items-start gap-2.5 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span><strong>সরকারি গ্যাজেট ও পোর্টাল:</strong> সরকারি ছুটি, প্রশাসনিক তথ্য ও পরিসংখ্যানের জন্য বাংলাদেশ সরকারের অফিসিয়াল গ্যাজেট ও জাতীয় ওয়েব পোর্টাল।</span>
          </li>
          <li className="flex items-start gap-2.5 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span><strong>জাতীয় রাজস্ব বোর্ড (NBR):</strong> ট্যাক্স ও ভ্যাট সংক্রান্ত হিসাবের ক্ষেত্রে জাতীয় রাজস্ব বোর্ডের সর্বশেষ অর্থ আইন ও কর নির্দেশিকা।</span>
          </li>
          <li className="flex items-start gap-2.5 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span><strong>ইসলামিক ফাউন্ডেশন ও প্রামাণ্য গ্রন্থ:</strong> নামাজের সময়, হিজরি ক্যালেন্ডার এবং ধর্মীয় বিষয়ে ইসলামিক ফাউন্ডেশন ও প্রামাণ্য হাদিস গ্রন্থাবলি।</span>
          </li>
          <li className="flex items-start gap-2.5 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span><strong>আইনশৃঙ্খলা ও জরুরি সেবা:</strong> বাংলাদেশ পুলিশ, ফায়ার সার্ভিস ও সিভিল ডিফেন্স এবং স্বাস্থ্য অধিদপ্তরের সরাসরি হেল্পলাইন ও নোটিশ।</span>
          </li>
        </ul>
      </section>

      {/* Section 3: Verification */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <Scale className="w-5 h-5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            ৩. তথ্য যাচাইকরণ (Fact-Checking Process)
          </h2>
        </div>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
          যাচাইয়ের গভীরতা কনটেন্ট ও উপলব্ধ উৎসের ওপর নির্ভর করে। নতুন বা সংশোধিত কনটেন্টে প্রযোজ্য ক্ষেত্রে নিচের ধাপগুলো ব্যবহার করা উচিত; এই নীতি প্রকাশিত প্রতিটি পুরোনো রেকর্ডে দুই স্তরের যাচাই সম্পন্ন হয়েছে—এমন নিশ্চয়তা দেয় না:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed pl-1">
          <li><strong>গাণিতিক নির্ভুলতা পরীক্ষা:</strong> কনভার্টার ও ক্যালকুলেটরের সূত্রগুলো প্রামাণিক একক/সূত্রের সঙ্গে মিলিয়ে টেস্ট-কেসে যাচাই করা উচিত। সব টুলের জন্য পরীক্ষার রেকর্ড এখনো প্রকাশিত নেই।</li>
          <li><strong>সম্পাদকীয় পর্যালোচনা:</strong> ভাষা, পরিভাষা ও তথ্যের স্পষ্টতা যাচাই করা উচিত। কোনো নির্দিষ্ট বিশেষজ্ঞের পর্যালোচনা দাবি করা হলে তার নাম ও যোগ্যতা সংশ্লিষ্ট পাতায় উল্লেখ করতে হবে।</li>
          <li><strong>সীমাবদ্ধতার স্পষ্ট ঘোষণা:</strong> যেসব তথ্য পরিবর্তনশীল বা আনুমানিক (যেমন- লাইভ কারেন্সি রেট বা জটিল আয়কর হিসাব), সেগুলোতে স্পষ্ট সতর্কতা ও ডিসক্লেইমার যুক্ত করা থাকে।</li>
        </ol>
      </section>

      {/* Section 4: Corrections */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <RefreshCw className="w-5 h-5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            ৪. সংশোধন ও হালনাগাদকরণ নীতি (Corrections Policy)
          </h2>
        </div>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
          কোনো তথ্য বা হিসাবে অসঙ্গতির অভিযোগ পেলে আমরা সেটি পর্যালোচনার জন্য গ্রহণ করি। প্রয়োজনীয় উৎস ও যাচাইয়ের পর সংশোধন বা ব্যাখ্যা প্রকাশ করা হয়:
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed pl-1">
          <li>যাচাইয়ের জন্য নির্দিষ্ট ২৪ ঘণ্টার নিশ্চয়তা দেওয়া হয় না; বিষয়টির জটিলতা ও প্রয়োজনীয় উৎস পাওয়ার ওপর সময় নির্ভর করে।</li>
          <li>গুরুত্বপূর্ণ কোনো তথ্য পরিবর্তন করা হলে সংশ্লিষ্ট পৃষ্ঠায় &ldquo;সর্বশেষ আপডেট&rdquo; তারিখ উল্লেখ করা হয়।</li>
          <li>ব্যবহারকারীরা ভুল বা অসম্পূর্ণ তথ্যের নির্দিষ্ট URL উল্লেখ করে যোগাযোগ ফর্ম বা admin@totthobox.com-এ সংশোধনের অনুরোধ পাঠাতে পারেন।</li>
        </ul>
      </section>

      {/* Section 5: Independence & Advertising */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            ৫. সম্পাদকীয় স্বাধীনতা ও বিজ্ঞাপন নীতি
          </h2>
        </div>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
          বিজ্ঞাপন নেটওয়ার্ক অনুমোদিত ও প্রয়োজনীয় consent configuration সম্পন্ন থাকলে Totthobox-এ বিজ্ঞাপন প্রদর্শিত হতে পারে। বিজ্ঞাপন চালু থাকলে:
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed pl-1">
          <li>বিজ্ঞাপন কখনোই আমাদের সম্পাদকীয় সিদ্ধান্ত, বিষয় নির্বাচন বা তথ্যের নিরপেক্ষতাকে প্রভাবিত করে না।</li>
          <li>বিজ্ঞাপন এবং মূল কন্টেন্ট সম্পূর্ণ পৃথকভাবে চিহ্নিত থাকে। আমরা কোনো ভুয়া বা বিভ্রান্তিকর বিজ্ঞাপন প্রচার সমর্থন করি না।</li>
          <li>সফটওয়্যার ডাউনলোডের ক্ষেত্রে শুধুমাত্র অফিশিয়াল প্রকাশকের সোর্স উপস্থাপন করা হয়; কোনো প্রকার ক্র্যাক, পাইরেটেড বা ম্যালওয়্যারযুক্ত লিংক প্রচার করা কঠোরভাবে নিষিদ্ধ।</li>
        </ul>
      </section>

      {/* Section 6: Contact */}
      <section className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
            <Mail className="w-5 h-5" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">
            সম্পাদকীয় যোগাযোগ ও তথ্য সংশোধন ডেস্ক
          </h2>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          আমাদের সাইটের কোনো তথ্যে অসঙ্গতি দেখলে বা নতুন কোনো তথ্য সংযোজনের প্রস্তাব দিতে চাইলে নিচের তথ্যে আমাদের সাথে যোগাযোগ করার বিনীত অনুরোধ রইল:
        </p>
        <div className="space-y-1.5 text-sm">
          <p><strong>ইমেইল:</strong> <a href="mailto:admin@totthobox.com" className="text-indigo-600 dark:text-indigo-400 hover:underline">admin@totthobox.com</a></p>
          <p><strong>সরাসরি ফর্ম:</strong> <Link href="/contact-us" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">আমাদের যোগাযোগ পাতায় যান &rarr;</Link></p>
        </div>
      </section>
    </main>
  );
}
