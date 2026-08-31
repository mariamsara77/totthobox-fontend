import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "গোপনীয়তা নীতি (Privacy Policy) | Totthobox",
  description:
    "Totthobox-এর সম্পূর্ণ গোপনীয়তা নীতি। আমরা কীভাবে আপনার ব্যক্তিগত তথ্য, কুকিজ এবং Google AdSense-এর মাধ্যমে তথ্য সংগ্রহ, ব্যবহার ও সুরক্ষা করি তা বিস্তারিত জানুন।",
  keywords: [
    "গোপনীয়তা নীতি",
    "privacy policy",
    "Totthobox privacy",
    "Google AdSense privacy",
    "কুকিজ নীতি",
    "তথ্য সুরক্ষা",
    "data protection Bangladesh",
  ],
};

export default function PrivacyPolicyPage() {
  const lastUpdated = new Date().toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section>
      <div className=" max-w-2xl mx-auto space-y-4 py-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl font-bold mb-4">
            গোপনীয়তা নীতি (Privacy Policy)
          </h1>
          <p className="text-base ">
            Totthobox - আপনার ব্যক্তিগত তথ্যের সুরক্ষা আমাদের সর্বোচ্চ
            অগ্রাধিকার
          </p>
          <div className="mt-4 h-px bg-zinc-800 bg-zinc-800" />
          <p className="mt-4 text-sm text-zinc-400">
            সর্বশেষ আপডেট: {lastUpdated}
          </p>
        </div>

        {/* Introduction */}
        <section className="space-y-4">
          <h2 className="text-xl ">ভূমিকা</h2>
          <p className="leading-relaxed">
            <strong>Totthobox</strong>-এ আপনাকে স্বাগতম। আমরা (
            <a
              href="https://totthobox.com"
              className="text-indigo-600 hover:underline"
            >
              totthobox.com
            </a>
            ) আমাদের ব্যবহারকারীদের গোপনীয়তা রক্ষায় পুরোপুরি প্রতিশ্রুতিবদ্ধ।
            এই গোপনীয়তা নীতিতে আমরা ব্যাখ্যা করেছি যে আমরা কী ধরনের তথ্য সংগ্রহ
            করি, কীভাবে তা ব্যবহার করি, কাকে শেয়ার করি এবং কীভাবে আপনার তথ্য
            সুরক্ষিত রাখি।
          </p>
          <p className="leading-relaxed">
            আমাদের ওয়েবসাইট বা যেকোনো সেবা ব্যবহার করার মাধ্যমে আপনি এই
            গোপনীয়তা নীতির সাথে একমত পোষণ করছেন। যদি আপনি এই নীতির কোনো অংশের
            সাথে একমত না হন, তাহলে অনুগ্রহ করে আমাদের সেবা ব্যবহার করবেন না।
          </p>
        </section>

        {/* Services Overview */}
        <div className="p-6 rounded-xl bg-zinc-400/10/50">
          <h3 className="mb-4 text-indigo-600 ">আমাদের মূল সেবাসমূহ</h3>
          <p className="mb-5">
            Totthobox আপনার দৈনন্দিন প্রয়োজনীয় তথ্য, টুলস ও ডিজিটাল সেবা এক
            জায়গায় প্রদান করে। আমাদের প্রধান সেবাগুলো হলো:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "বাংলা ক্যালেন্ডার",
              "কনভার্টার টুলস",
              "বিভিন্ন ইউটিলিটি টুলস",
              "সফটওয়্যার পরিচিতি",
              "জরুরি সেবা ও হেল্পলাইন",
              "বাংলাদেশ বিষয়ক তথ্য",
              "বিশ্বকোষ",
              "ইসলামিক বিষয়বস্তু",
              "শিশুশিক্ষা",
              "স্বাস্থ্য ও ট্রাফিক সংকেত",
              "সর্বশেষ সংবাদ",
              "Totthobox AI চ্যাটবট",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tools */}
        <div className="p-6 rounded-xl border">
          <h3 className="mb-4 ">টুলস ও কনভার্টারসমূহ</h3>
          <p className=" mb-2">ইউটিলিটি টুলস:</p>
          <div className="flex flex-wrap gap-2 mb-5">
            {[
              "Image Resizer",
              "Age Calculator",
              "Word & Character Counter",
              "Zodiac (রাশি) Calculator",
              "Percentage Calculator",
              "QR Code Generator",
            ].map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 text-sm rounded-full bg-zinc-400/10"
              >
                {t}
              </span>
            ))}
          </div>
          <p className=" mb-2">কনভার্টারসমূহ:</p>
          <div className="flex flex-wrap gap-2">
            {[
              "Number to Word",
              "অদর্শলিপি কনভার্টার",
              "Image Converter",
              "Documents Converter",
              "Media Converter",
              "Data File Converter",
              "মুদ্রা কনভার্টার",
              "দৈর্ঘ্য কনভার্টার",
              "ওজন কনভার্টার",
              "পরিমাণ কনভার্টার",
            ].map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 text-sm rounded-full bg-zinc-400/10"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* 1. Information We Collect */}
        <section className="space-y-4">
          <h2 className="text-xl ">১. আমরা কী ধরনের তথ্য সংগ্রহ করি</h2>

          <h3 className="mt-4 ">ক. আপনার দেওয়া তথ্য</h3>
          <p>
            আপনি যখন যোগাযোগ ফর্ম পূরণ করেন, Totthobox AI ব্যবহার করেন বা কোনো
            ফিডব্যাক দেন, তখন আমরা নিম্নলিখিত তথ্য সংগ্রহ করতে পারি:
          </p>
          <ul className="list-disc ml-6 space-y-1.5 ">
            <li>নাম</li>
            <li>ইমেইল ঠিকানা</li>
            <li>মোবাইল নম্বর (যদি প্রদান করা হয়)</li>
            <li>বার্তা বা মন্তব্য</li>
          </ul>

          <h3 className="mt-4 ">খ. স্বয়ংক্রিয়ভাবে সংগৃহীত তথ্য</h3>
          <p>
            আপনি আমাদের সাইট ভিজিট করলে আমরা নিম্নলিখিত তথ্য স্বয়ংক্রিয়ভাবে
            সংগ্রহ করতে পারি:
          </p>
          <ul className="list-disc ml-6 space-y-1.5 ">
            <li>আইপি ঠিকানা</li>
            <li>ব্রাউজারের ধরন ও ভার্সন</li>
            <li>ডিভাইসের তথ্য (মোবাইল/ডেস্কটপ)</li>
            <li>অপারেটিং সিস্টেম</li>
            <li>রেফারার ইউআরএল</li>
            <li>ভিজিটের সময় ও পৃষ্ঠা দেখার তথ্য</li>
          </ul>

          <h3 className="mt-4 ">গ. কুকিজ এবং ট্র্যাকিং প্রযুক্তি</h3>
          <p>
            আমরা এবং আমাদের তৃতীয় পক্ষের অংশীদাররা (যেমন Google) কুকিজ, ওয়েব
            বীকন এবং অনুরূপ প্রযুক্তি ব্যবহার করি। কুকিজ হলো ছোট টেক্সট ফাইল যা
            আপনার ডিভাইসে সংরক্ষিত হয়। এগুলো সাইটের কার্যকারিতা উন্নত করতে,
            ব্যবহারকারীর অভিজ্ঞতা ব্যক্তিগত করতে এবং বিজ্ঞাপন দেখাতে সাহায্য
            করে।
          </p>
        </section>

        {/* 2-10 sections (same content as original) */}
        <section className="space-y-4">
          <h2 className="text-xl ">২. তথ্য কীভাবে ব্যবহার করি</h2>
          <p>আমরা সংগৃহীত তথ্য নিম্নলিখিত উদ্দেশ্যে ব্যবহার করি:</p>
          <ul className="list-disc ml-6 space-y-1.5 ">
            <li>আমাদের সেবা পরিচালনা ও উন্নত করা</li>
            <li>ব্যবহারকারীর অভিজ্ঞতা ব্যক্তিগত করা</li>
            <li>Totthobox AI এবং অন্যান্য টুলসের কার্যকারিতা নিশ্চিত করা</li>
            <li>আপনার প্রশ্নের উত্তর দেওয়া এবং সাপোর্ট প্রদান</li>
            <li>সাইটের নিরাপত্তা বজায় রাখা এবং প্রতারণা প্রতিরোধ</li>
            <li>আইনগত বাধ্যবাধকতা পূরণ</li>
            <li>বিজ্ঞাপন প্রদর্শন ও বিশ্লেষণ (Google AdSense সহ)</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl ">
            ৩. Google AdSense এবং তৃতীয় পক্ষের বিজ্ঞাপন
          </h2>
          <p>
            আমাদের ওয়েবসাইটে <strong>Google AdSense</strong> এর মাধ্যমে তৃতীয়
            পক্ষের বিজ্ঞাপন প্রদর্শিত হয়। Google এবং অন্যান্য বিজ্ঞাপন অংশীদাররা
            কুকিজ ব্যবহার করে আপনার আগের ভিজিটের ভিত্তিতে বিজ্ঞাপন দেখাতে পারে।
          </p>
          <p>
            Google AdSense কুকিজ ব্যবহার করে আপনার আগ্রহ অনুযায়ী বিজ্ঞাপন দেখায়।
            আপনি চাইলে{" "}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              Google Ads Settings
            </a>{" "}
            থেকে ব্যক্তিগতকৃত বিজ্ঞাপন নিয়ন্ত্রণ করতে পারেন।
          </p>
          <p>
            তৃতীয় পক্ষের বিজ্ঞাপনদাতারা তাদের নিজস্ব গোপনীয়তা নীতি অনুসরণ করে।
            আমরা তাদের তথ্য সংগ্রহের পদ্ধতির জন্য দায়ী নই। বিস্তারিত জানতে
            Google-এর গোপনীয়তা নীতি দেখুন:{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              https://policies.google.com/privacy
            </a>
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl ">৪. কুকিজ নীতি</h2>
          <p>আমরা নিম্নলিখিত ধরনের কুকিজ ব্যবহার করি:</p>
          <ul className="list-disc ml-6 space-y-1.5 ">
            <li>
              <strong>প্রয়োজনীয় কুকিজ:</strong> সাইটের মৌলিক কার্যকারিতার জন্য
            </li>
            <li>
              <strong>অ্যানালিটিক্স কুকিজ:</strong> সাইটের ব্যবহার বিশ্লেষণের
              জন্য (যেমন Google Analytics)
            </li>
            <li>
              <strong>বিজ্ঞাপন কুকিজ:</strong> প্রাসঙ্গিক বিজ্ঞাপন দেখানোর জন্য
              (Google AdSense)
            </li>
          </ul>
          <p className="mt-3">
            আপনি আপনার ব্রাউজার সেটিংস থেকে কুকিজ নিয়ন্ত্রণ বা মুছে ফেলতে পারেন।
            তবে কিছু কুকিজ বন্ধ করলে সাইটের কিছু ফিচার সঠিকভাবে কাজ নাও করতে
            পারে।
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl ">৫. তথ্য শেয়ারিং</h2>
          <p>
            আমরা আপনার ব্যক্তিগত তথ্য বিক্রি বা ভাড়া দিই না। তবে নিম্নলিখিত
            ক্ষেত্রে তথ্য শেয়ার করা হতে পারে:
          </p>
          <ul className="list-disc ml-6 space-y-1.5 ">
            <li>
              সেবা প্রদানকারীদের সাথে (হোস্টিং, অ্যানালিটিক্স, ইমেইল সার্ভিস)
            </li>
            <li>আইনি বাধ্যবাধকতা পূরণের জন্য</li>
            <li>সাইটের নিরাপত্তা ও প্রতারণা প্রতিরোধের প্রয়োজনে</li>
            <li>আপনার সম্মতিতে</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl ">৬. তথ্যের নিরাপত্তা</h2>
          <p>
            আমরা আপনার ব্যক্তিগত তথ্য সুরক্ষিত রাখতে যুক্তিসঙ্গত প্রযুক্তিগত ও
            সাংগঠনিক ব্যবস্থা গ্রহণ করি। তবে ইন্টারনেটের মাধ্যমে কোনো তথ্য
            প্রেরণ ১০০% নিরাপদ নয় বলে আমরা সম্পূর্ণ নিরাপত্তার নিশ্চয়তা দিতে
            পারি না।
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl ">৭. শিশুদের গোপনীয়তা</h2>
          <p>
            আমাদের সেবা ১৩ বছরের কম বয়সী শিশুদের জন্য নির্দিষ্টভাবে তৈরি নয়।
            আমরা জেনেশুনে ১৩ বছরের কম বয়সী কোনো শিশুর ব্যক্তিগত তথ্য সংগ্রহ করি
            না। যদি আপনি মনে করেন কোনো শিশুর তথ্য আমাদের কাছে আছে, তাহলে অনুগ্রহ
            করে আমাদের সাথে যোগাযোগ করুন, আমরা তা অবিলম্বে মুছে ফেলব।
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl ">৮. আপনার অধিকার</h2>
          <p>আপনার নিম্নলিখিত অধিকার রয়েছে:</p>
          <ul className="list-disc ml-6 space-y-1.5 ">
            <li>আপনার সম্পর্কে আমাদের কাছে থাকা তথ্য জানার অধিকার</li>
            <li>ভুল তথ্য সংশোধনের অনুরোধ করার অধিকার</li>
            <li>আপনার তথ্য মুছে ফেলার অনুরোধ করার অধিকার</li>
            <li>কুকিজ এবং ব্যক্তিগতকৃত বিজ্ঞাপন নিয়ন্ত্রণ করার অধিকার</li>
          </ul>
          <p className="mt-3">
            এই অধিকারগুলো প্রয়োগ করতে চাইলে আমাদের সাথে যোগাযোগ করুন।
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl ">৯. তৃতীয় পক্ষের লিঙ্ক</h2>
          <p>
            আমাদের সাইটে জরুরি সেবা, সংবাদমাধ্যম, সরকারি ওয়েবসাইট বা অন্যান্য
            বহিঃস্থ লিঙ্ক থাকতে পারে। এই সাইটগুলোর নিজস্ব গোপনীয়তা নীতি রয়েছে।
            আমরা সেই সাইটগুলোর বিষয়বস্তু বা গোপনীয়তা অনুশীলনের জন্য দায়ী নই।
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl ">১০. নীতির পরিবর্তন</h2>
          <p>
            আমরা সময় সময় এই গোপনীয়তা নীতি আপডেট করতে পারি। কোনো পরিবর্তন হলে
            আমরা এই পৃষ্ঠায় নতুন তারিখ উল্লেখ করব। নিয়মিত এই পৃষ্ঠা দেখার
            পরামর্শ দিচ্ছি। পরিবর্তনের পরও সাইট ব্যবহার অব্যাহত রাখলে আপনি
            আপডেটকৃত নীতির সাথে একমত বলে গণ্য হবেন।
          </p>
        </section>

        <div className="h-px bg-zinc-800 bg-zinc-800 my-10" />

        {/* Contact */}
        <div className="bg-zinc-400/10 p-8 rounded-2xl text-center space-y-4">
          <h3 className="text-lg ">যোগাযোগ</h3>
          <p>
            এই গোপনীয়তা নীতি সম্পর্কে কোনো প্রশ্ন, অভিযোগ বা অনুরোধ থাকলে
            নির্দ্বিধায় আমাদের সাথে যোগাযোগ করুন।
          </p>
          <div className="pt-2">
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              📧 সাপোর্ট সেন্টারে মেসেজ দিন
            </Link>
          </div>
        </div>

        <div className="pt-8 text-center text-zinc-400 text-sm">
          <p>
            এই গোপনীয়তা নীতি Totthobox ওয়েবসাইট এবং এর সকল সাবডোমেইনের জন্য
            প্রযোজ্য।
          </p>
        </div>
      </div>
    </section>
  );
}
