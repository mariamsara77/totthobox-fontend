import type { Metadata } from "next";
import PercentageCalculator from "@/components/tools/PercentageCalculator";

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
  },
  twitter: {
    card: "summary_large_image",
    title: "পার্সেন্টেজ ক্যালকুলেটর — সহজ বাংলায় শতকরা হিসাব | তথ্যবক্স",
    description:
      "সহজ বাংলায় পার্সেন্টেজ ক্যালকুলেটর। কোনো সংখ্যার শতকরা, বৃদ্ধি-হ্রাস, ছাড়, টিপ, মার্জিন ও পার্থক্য।",
  },
};

export default function PercentageCalculatorPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
      <PercentageCalculator />
    </div>
  );
}
