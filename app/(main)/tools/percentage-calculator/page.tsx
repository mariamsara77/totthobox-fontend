import { Metadata } from "next";
import PercentageCalculator from "@/components/tools/PercentageCalculator";

export const metadata: Metadata = {
  title: "পার্সেন্টেজ ক্যালকুলেটর — সহজ বাংলায় শতকরা হিসাব | Totthobox",
  description:
    "সহজ বাংলায় পার্সেন্টেজ ক্যালকুলেটর। কোনো সংখ্যার শতকরা, বৃদ্ধি-হ্রাস, ছাড়, টিপ, মার্জিন ও পার্থক্য — সূত্র ও ব্যাখ্যাসহ তাৎক্ষণিক ফলাফল। রেজিস্ট্রেশন লাগবে না।",
  keywords: [
    "percentage calculator",
    "শতকরা ক্যালকুলেটর",
    "percent calculator",
    "percentage increase",
    "percentage decrease",
    "discount calculator",
    "tip calculator",
    "margin calculator",
    "অনলাইন শতকরা ক্যালকুলেটর",
    "বাংলা পার্সেন্টেজ ক্যালকুলেটর",
    "Totthobox",
  ],
  openGraph: {
    title: "পার্সেন্টেজ ক্যালকুলেটর — সহজ বাংলায় শতকরা হিসাব | Totthobox",
    description:
      "সহজ বাংলায় পার্সেন্টেজ ক্যালকুলেটর। কোনো সংখ্যার শতকরা, বৃদ্ধি-হ্রাস, ছাড়, টিপ, মার্জিন ও পার্থক্য — সূত্র ও ব্যাখ্যাসহ তাৎক্ষণিক ফলাফল।",
    type: "website",
    locale: "bn_BD",
    siteName: "Totthobox",
  },
};

export default function PercentageCalculatorPage() {
  return (
    <div className="mx-auto max-w-2xl p-4">
      <PercentageCalculator />
    </div>
  );
}