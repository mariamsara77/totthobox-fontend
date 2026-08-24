import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ব্যবহারের শর্তাবলি (Terms of Service) | Totthobox",
  description:
    "Totthobox প্ল্যাটফর্ম ব্যবহারের সম্পূর্ণ নিয়ম ও শর্তাবলি। ব্যবহারকারীর দায়িত্ব, সেবার সীমাবদ্ধতা এবং তথ্যের সঠিকতা সম্পর্কে বিস্তারিত জানুন।",
  keywords: [
    "ব্যবহারের শর্তাবলি",
    "terms of service",
    "Totthobox terms",
    "নিয়মাবলী",
    "তথ্যবক্স শর্তাবলি",
  ],
};

export default function TermsPage() {
  const lastUpdated = new Date().toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section>
      <div className="max-w-2xl mx-auto space-y-8 py-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">ব্যবহারের শর্তাবলি</h1>
          <p className="max-w-xl mx-auto ">
            Totthobox প্ল্যাটফর্ম ব্যবহারের নিয়ম, শর্ত ও নির্দেশিকা
          </p>
          <div className="pt-1">
            <span className="inline-block px-3 py-1 text-xs rounded-full bg-zinc-400/10 text-zinc-300">
              সর্বশেষ আপডেট: {lastUpdated}
            </span>
          </div>
          <div className="pt-2 h-px bg-zinc-800 bg-zinc-800" />
        </div>

        {/* 1. Acceptance */}
        <section className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-zinc-400/10">📄</div>
            <h2 className="text-xl ">
              ১. সাধারণ নিয়মাবলি ও গ্রহণযোগ্যতা
            </h2>
          </div>
          <p className="leading-relaxed">
            <strong>Totthobox</strong> (
            <a
              href="https://totthobox.com"
              className="text-indigo-600 hover:underline"
            >
              totthobox.com
            </a>
            ) ওয়েবসাইট এবং এর সকল সেবা ব্যবহার করার মাধ্যমে আপনি এই ব্যবহারের
            শর্তাবলির সাথে সম্পূর্ণভাবে একমত পোষণ করছেন। এই প্ল্যাটফর্মটি তথ্য
            প্রদান, শিক্ষামূলক কনটেন্ট এবং বিভিন্ন অনলাইন টুলস (কনভার্টার,
            ক্যালকুলেটর, ক্যালেন্ডার ইত্যাদি) ব্যবহারের জন্য তৈরি করা হয়েছে।
          </p>
          <p className="leading-relaxed">
            আপনি যদি এই শর্তাবলির কোনো অংশের সাথে একমত না হন, তাহলে অনুগ্রহ করে
            আমাদের ওয়েবসাইট ও সেবা ব্যবহার থেকে বিরত থাকুন।
          </p>
        </section>

        {/* 2. Services */}
        <section className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-zinc-400/10">▦</div>
            <h2 className="text-xl ">২. আমাদের সেবাসমূহ</h2>
          </div>
          <p>Totthobox নিম্নলিখিত ধরনের সেবা প্রদান করে:</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              "বাংলা ক্যালেন্ডার ও ছুটির তালিকা",
              "বিভিন্ন কনভার্টার টুলস",
              "ইউটিলিটি টুলস (Image Resizer, QR Code ইত্যাদি)",
              "জরুরি সেবা ও হেল্পলাইন নম্বর",
              "বাংলাদেশ ও বিশ্বকোষ বিষয়ক তথ্য",
              "ইসলামিক বিষয়বস্তু ও শিশুশিক্ষা",
              "সর্বশেষ সংবাদ",
              "Totthobox AI চ্যাটবট",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 3. User Responsibilities */}
        <section className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-zinc-400/10">👥</div>
            <h2 className="text-xl ">৩. ব্যবহারকারীর দায়িত্ব</h2>
          </div>
          <p>
            আমাদের সেবা ব্যবহার করার সময় আপনাকে নিম্নলিখিত নিয়মগুলো মেনে চলতে
            হবে:
          </p>
          <ul className="space-y-4">
            {[
              "সাইটের কোনো অংশে অবৈধ, ক্ষতিকর, বিভ্রান্তিকর বা অশ্লীল কনটেন্ট প্রদান করা যাবে না।",
              "সার্ভার, সিস্টেম বা অন্য ব্যবহারকারীর ক্ষতি করার চেষ্টা করা সম্পূর্ণ নিষিদ্ধ।",
              "আমাদের লোগো, কনটেন্ট বা ডাটা অনুমতি ছাড়া বাণিজ্যিক কাজে ব্যবহার করা যাবে না।",
              "অন্যের ব্যক্তিগত তথ্য অননুমোদিতভাবে সংগ্রহ বা প্রকাশ করা যাবে না।",
              "সাইটের নিরাপত্তা ব্যবস্থা ভেদ করার কোনো প্রচেষ্টা করা যাবে না।",
            ].map((item) => (
              <li key={item} className="flex gap-4">
                <span className="text-zinc-400 mt-1">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 4. Limitations */}
        <section className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-600">
              ⚠️
            </div>
            <h2 className="text-xl ">
              ৪. সেবা সংক্রান্ত সীমাবদ্ধতা ও দায়মুক্তি
            </h2>
          </div>

          <div className="space-y-5">
            <div>
              <h3 className=" mb-2">টুলস ও কনভার্টার</h3>
              <p className="text-sm ">
                আমাদের প্রদত্ত সকল টুলস (Image Resizer, QR Generator, কনভার্টার
                ইত্যাদি) শিক্ষামূলক ও সহায়ক উদ্দেশ্যে দেওয়া হয়েছে। গুরুত্বপূর্ণ
                কাজের আগে ফলাফল যাচাই করে নেওয়ার পরামর্শ দেওয়া হচ্ছে।
              </p>
            </div>
            <div>
              <h3 className=" mb-2">জরুরি সেবা ও হেল্পলাইন</h3>
              <p className="text-sm ">
                আমরা সঠিক নম্বর প্রদানের সর্বোচ্চ চেষ্টা করি। তবে টেলিকম অপারেটর
                বা সরকারি পরিবর্তনের কারণে কোনো নম্বর কাজ না করলে Totthobox তার
                জন্য দায়ী থাকবে না।
              </p>
            </div>
            <div>
              <h3 className=" mb-2">সংবাদ ও তথ্য</h3>
              <p className="text-sm ">
                সংবাদ ও তথ্য বিভিন্ন উৎস থেকে সংগ্রহ করা হয়। আমরা তথ্যের শতভাগ
                নির্ভুলতার গ্যারান্টি দিই না। গুরুত্বপূর্ণ সিদ্ধান্ত নেওয়ার আগে
                মূল উৎস থেকে যাচাই করে নিন।
              </p>
            </div>
            <div>
              <h3 className=" mb-2">Totthobox AI</h3>
              <p className="text-sm ">
                AI চ্যাটবট সাধারণ তথ্য সহায়তার জন্য তৈরি। এটি পেশাদার পরামর্শ
                (চিকিৎসা, আইনগত ইত্যাদি) হিসেবে ব্যবহার করা উচিত নয়।
              </p>
            </div>
          </div>
        </section>

        {/* 5-9 */}
        <section className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-zinc-400/10">🛡️</div>
            <h2 className="text-xl ">৫. মেধা সম্পত্তি অধিকার</h2>
          </div>
          <p className="leading-relaxed">
            এই ওয়েবসাইটের সকল কনটেন্ট, লোগো, ডিজাইন, কোড এবং উপকরণ Totthobox-এর
            মেধা সম্পত্তি। আমাদের লিখিত অনুমতি ছাড়া এগুলো কপি, পরিবর্তন, বিতরণ
            বা বাণিজ্যিক কাজে ব্যবহার করা সম্পূর্ণ নিষিদ্ধ।
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-zinc-400/10">🔗</div>
            <h2 className="text-xl ">৬. তৃতীয় পক্ষের লিংক</h2>
          </div>
          <p className="leading-relaxed">
            আমাদের সাইটে বাহ্যিক ওয়েবসাইট, সংবাদমাধ্যম বা সরকারি সার্ভিসের লিংক
            থাকতে পারে। এই সাইটগুলোর বিষয়বস্তু বা সেবার জন্য Totthobox কোনো
            দায়িত্ব নেয় না। সেগুলো ব্যবহারের আগে তাদের নিজস্ব শর্তাবলি ও
            গোপনীয়তা নীতি পড়ে নিন।
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-zinc-400/10">⚖️</div>
            <h2 className="text-xl ">৭. দায়বদ্ধতার সীমাবদ্ধতা</h2>
          </div>
          <p className="leading-relaxed">
            Totthobox “যেমন আছে” (as is) ভিত্তিতে সেবা প্রদান করে। সাইট
            ব্যবহারের ফলে সৃষ্ট কোনো প্রত্যক্ষ বা পরোক্ষ ক্ষতির জন্য আমরা দায়ী
            থাকব না। ব্যবহারকারী নিজ দায়িত্বে সাইট ব্যবহার করবেন।
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-zinc-400/10">🔄</div>
            <h2 className="text-xl ">৮. শর্তাবলির পরিবর্তন</h2>
          </div>
          <p className="leading-relaxed">
            Totthobox কর্তৃপক্ষ যেকোনো সময় এই শর্তাবলি আপডেট বা পরিবর্তন করার
            অধিকার রাখে। পরিবর্তন এই পৃষ্ঠায় প্রকাশিত হওয়ার সাথে সাথেই কার্যকর
            হবে। নিয়মিত এই পৃষ্ঠা দেখা ব্যবহারকারীর দায়িত্ব। পরিবর্তনের পরও সাইট
            ব্যবহার অব্যাহত রাখলে আপনি নতুন শর্তাবলির সাথে একমত বলে গণ্য হবেন।
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-zinc-400/10">🏛️</div>
            <h2 className="text-xl ">৯. প্রযোজ্য আইন</h2>
          </div>
          <p className="leading-relaxed">
            এই শর্তাবলি বাংলাদেশের প্রচলিত আইন অনুসারে পরিচালিত ও ব্যাখ্যা করা
            হবে। যেকোনো বিরোধের ক্ষেত্রে বাংলাদেশের আদালতের এখতিয়ার প্রযোজ্য
            হবে।
          </p>
        </section>
      </div>
    </section>
  );
}
