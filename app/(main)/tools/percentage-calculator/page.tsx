import type { Metadata } from "next";
import PercentageCalculator from "@/components/tools/PercentageCalculator";
import ToolStructuredData from "@/components/seo/ToolStructuredData";

export const metadata: Metadata = {
  title: "পার্সেন্টেজ ক্যালকুলেটর — সহজ বাংলায় শতকরা হিসাব | তথ্যবক্স",
  description:
    "সহজ বাংলায় পার্সেন্টেজ ক্যালকুলেটর। কোনো সংখ্যার শতকরা, বৃদ্ধি-হ্রাস, ছাড়, টিপ, মার্জিন ও পার্থক্য — সূত্র ও ব্যাখ্যাসহ তাৎক্ষণিক ফলাফল। রেজিস্ট্রেশন লাগবে না।",
  alternates: {
    canonical: "https://totthobox.com/tools/percentage-calculator",
  },
  openGraph: {
    title: "পার্সেন্টেজ ক্যালকুলেটর — সহজ বাংলায় শতকরা হিসাব | তথ্যবক্স",
    description:
      "সহজ বাংলায় পার্সেন্টেজ ক্যালকুলেটর। কোনো সংখ্যার শতকরা, বৃদ্ধি-হ্রাস, ছাড়, টিপ, মার্জিন ও পার্থক্য — সূত্র ও ব্যাখ্যাসহ তাৎক্ষণিক ফলাফল।",
    type: "website",
    locale: "bn_BD",
    siteName: "Totthobox",
    url: "https://totthobox.com/tools/percentage-calculator",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "পার্সেন্টেজ ক্যালকুলেটর — সহজ বাংলায় শতকরা হিসাব | তথ্যবক্স",
    description:
      "সহজ বাংলায় পার্সেন্টেজ ক্যালকুলেটর। কোনো সংখ্যার শতকরা, বৃদ্ধি-হ্রাস, ছাড়, টিপ, মার্জিন ও পার্থক্য।",
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
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
        <PercentageCalculator />
      </div>
    </>
  );
}
