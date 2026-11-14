import type { Metadata } from "next";
import PercentageCalculator from "@/components/tools/PercentageCalculator";
import ToolStructuredData from "@/components/seo/ToolStructuredData";
import ToolGuide from "@/components/ToolGuide";
import { percentageCalculatorContent } from "@/lib/content/tools/percentage-calculator";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "কত পারসেন্ট কীভাবে বের করবেন - শতকরা হিসাব ক্যালকুলেটর",
  description:
    "কত পারসেন্ট কীভাবে বের করবেন? X টাকার Y% কত, প্রাপ্ত নম্বরের শতকরা হার ও ডিসকাউন্ট নির্ণয়ের সহজ সূত্র ও উদাহরণসহ হিসাব করুন তথ্যবক্স ক্যালকুলেটরে।",
  alternates: {
    canonical: "https://totthobox.com/tools/percentage-calculator",
  },
  openGraph: {
    title: "কত পারসেন্ট কীভাবে বের করবেন - শতকরা হিসাব ক্যালকুলেটর | তথ্যবক্স",
    description:
      "কত পারসেন্ট কীভাবে বের করবেন? X টাকার Y% কত, প্রাপ্ত নম্বরের শতকরা হার ও ডিসকাউন্ট নির্ণয়ের সহজ সূত্র ও উদাহরণসহ হিসাব করুন তথ্যবক্স ক্যালকুলেটরে।",
    type: "website",
    locale: "bn_BD",
    siteName: "Totthobox",
    url: "https://totthobox.com/tools/percentage-calculator",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "কত পারসেন্ট কীভাবে বের করবেন - শতকরা হিসাব ক্যালকুলেটর | তথ্যবক্স",
    description:
      "কত পারসেন্ট কীভাবে বের করবেন? X টাকার Y% কত, প্রাপ্ত নম্বরের শতকরা হার ও ডিসকাউন্ট নির্ণয়ের সহজ সূত্র ও উদাহরণসহ হিসাব করুন তথ্যবক্স ক্যালকুলেটরে।",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }],
  },
};

export default function PercentageCalculatorPage() {
  return (
    <>
      <ToolStructuredData
        name="পার্সেন্টেজ ক্যালকুলেটর"
        description="কোনো সংখ্যার শতকরা, বৃদ্ধি-হ্রাস, ছাড়, টিপ, মুনাফা মার্জিন ও শতাংশের পার্থক্য নির্ণয়ের অনলাইন ক্যালকুলেটর।"
        url="https://totthobox.com/tools/percentage-calculator"
        applicationCategory="CalculatorApplication"
        featureList={[
          "কোনো সংখ্যার শতকরা (%) মান বের করা",
          "শতাংশ বৃদ্ধি ও হ্রাসের হিসাব",
          "ডিসকাউন্ট ও অফার প্রাইস হিসাব",
          "মুনাফা ও প্রফিট মার্জিন বিশ্লেষণ",
          "সহজ বাংলা ব্যাখ্যা ও গাণিতিক সূত্র",
        ]}
      />
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8 space-y-8">
        <PercentageCalculator />

        {/* কত পারসেন্ট কীভাবে বের করবেন: সরাসরি উত্তর ও ৩টি বাস্তব উদাহরণ */}
        <section
          aria-labelledby="percentage-direct-guide-heading"
          className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 p-6 space-y-6"
        >
          <div className="space-y-2 border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <h2
              id="percentage-direct-guide-heading"
              className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100"
            >
              কত পারসেন্ট কীভাবে বের করবেন: সহজ গাইড ও সূত্র
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              যেকোনো সংখ্যার শতকরা বা <strong>কত পারসেন্ট</strong> বের করার নিয়ম খুবই সহজ। পারসেন্ট মানে হলো ১০০ এর মধ্যে কত। সূত্র: <code>শতকরা হার (%) = (প্রাপ্ত মান ÷ মোট মান) × ১০০</code>। নিচে ৩টি সাধারণ বাস্তব উদাহরণ দেওয়া হলো:
            </p>
          </div>

          <div className="space-y-4">
            {/* উদাহরণ ১: X টাকার Y% কত */}
            <article className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 p-4 space-y-2">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                উদাহরণ ১: X টাকার Y% কত? (যেমন: ৫,০০০ টাকার ১৫% কত?)
              </h2>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                <strong className="text-zinc-900 dark:text-zinc-100">
                  সরাসরি উত্তর: ৫,০০০ টাকার ১৫% হলো ৭৫০ টাকা।
                </strong>
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                হিসাব পদ্ধতি: ৫,০০০ × (১৫ ÷ ১০০) = (৫,০০০ × ১৫) ÷ ১০০ = ৭৫০ টাকা।
              </p>
            </article>

            {/* উদাহরণ ২: পরীক্ষার নম্বরে কত পারসেন্ট */}
            <article className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 p-4 space-y-2">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                উদাহরণ ২: প্রাপ্ত নম্বরের পারসেন্ট (যেমন: ৮০০ নম্বরের মধ্যে ৬০০ পেলে কত পারসেন্ট?)
              </h2>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                <strong className="text-zinc-900 dark:text-zinc-100">
                  সরাসরি উত্তর: ৮০০ নম্বরে ৬০০ পেলে তা হবে ৭৫%।
                </strong>
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                হিসাব পদ্ধতি: (৬০০ ÷ ৮০০) × ১০০ = ০.৭৫ × ১০০ = ৭৫%।
              </p>
            </article>

            {/* উদাহরণ ৩: ডিসকাউন্ট বা ছাড় */}
            <article className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 p-4 space-y-2">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                উদাহরণ ৩: কেনাকাটায় ডিসকাউন্ট (যেমন: ১,২০০ টাকার পণ্যে ২০% ছাড় দিলে কত ছাড়?)
              </h2>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                <strong className="text-zinc-900 dark:text-zinc-100">
                  সরাসরি উত্তর: ২৪০ টাকা ছাড়, ছাড়ের পর বিক্রয়মূল্য ৯৬০ টাকা।
                </strong>
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                হিসাব পদ্ধতি: ১,২০০ × (২০ ÷ ১০০) = ২৪০ টাকা ছাড়। পরিশোধযোগ্য মূল্য = ১,২০০ - ২৪০ = ৯৬০ টাকা।
              </p>
            </article>
          </div>
        </section>

        <ToolGuide content={percentageCalculatorContent} />
      </div>
    </>
  );
}
