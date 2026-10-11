import type { Metadata } from "next";
import AgeCalculator from "@/components/tools/AgeCalculator";

export const metadata: Metadata = {
  title: "স্মার্ট এজ ক্যালকুলেটর - সঠিক বয়স ও বয়সের পার্থক্য হিসাব",
  description:
    "অনলাইনে নিখুঁতভাবে আপনার বয়স, পরবর্তী জন্মদিন, দুইজনের বয়সের পার্থক্য এবং আরও অনেক কিছু হিসাব করুন। বাংলায় সহজ ও দ্রুত এজ ক্যালকুলেটর।",
  alternates: {
    canonical: "https://totthobox.com/tools/age-calculator",
  },
  openGraph: {
    title:
      "স্মার্ট এজ ক্যালকুলেটর - সঠিক বয়স ও বয়সের পার্থক্য হিসাব",
    description:
      "অনলাইনে নিখুঁতভাবে আপনার বয়স, পরবর্তী জন্মদিন, দুইজনের বয়সের পার্থক্য এবং আরও অনেক কিছু হিসাব করুন।",
    type: "website",
    locale: "bn_BD",
    siteName: "Totthobox",
    url: "https://totthobox.com/tools/age-calculator",
  
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox" }],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "স্মার্ট এজ ক্যালকুলেটর - সঠিক বয়স ও বয়সের পার্থক্য হিসাব",
    description:
      "অনলাইনে নিখুঁতভাবে আপনার বয়স, পরবর্তী জন্মদিন, দুইজনের বয়সের পার্থক্য এবং আরও অনেক কিছু হিসাব করুন।",
  
    images: ["https://totthobox.com/og-image.png"],
  },
};

export default function AgeCalculatorPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
      <AgeCalculator />
    </div>
  );
}
