import type { Metadata } from "next";
import PercentageCalculator from "@/components/tools/PercentageCalculator";

export const metadata: Metadata = {
  title: "পার্সেন্টেজ ক্যালকুলেটর — সহজ বাংলায় শতকরা হিসাব",
  description:
    "সহজ বাংলায় পার্সেন্টেজ ক্যালকুলেটর। কোনো সংখ্যার শতকরা, বৃদ্ধি-হ্রাস, ছাড়, টিপ, মার্জিন ও পার্থক্য — সূত্র ও ব্যাখ্যাসহ তাৎক্ষণিক ফলাফল। রেজিস্ট্রেশন লাগবে না।",
  alternates: {
    canonical: "https://totthobox.com/tools/percentage-calculator",
  },
  openGraph: {
    title: "পার্সেন্টেজ ক্যালকুলেটর — সহজ বাংলায় শতকরা হিসাব",
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
    title: "পার্সেন্টেজ ক্যালকুলেটর — সহজ বাংলায় শতকরা হিসাব",
    description:
      "সহজ বাংলায় পার্সেন্টেজ ক্যালকুলেটর। কোনো সংখ্যার শতকরা, বৃদ্ধি-হ্রাস, ছাড়, টিপ, মার্জিন ও পার্থক্য।",
  
    images: ["https://totthobox.com/og-image.png"],
  },
};

export default function PercentageCalculatorPage() {
  return (
    <div className="tb-page-container tb-section mx-auto max-w-2xl">
      <PercentageCalculator />
    </div>
  );
}
