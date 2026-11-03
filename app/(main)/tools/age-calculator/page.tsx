import type { Metadata } from "next";
import AgeCalculator from "@/components/tools/AgeCalculator";
import ToolStructuredData from "@/components/seo/ToolStructuredData";

export const metadata: Metadata = {
  title: "স্মার্ট এজ ক্যালকুলেটর - সঠিক বয়স ও বয়সের পার্থক্য হিসাব | তথ্যবক্স",
  description:
    "অনলাইনে নিখুঁতভাবে আপনার বয়স, পরবর্তী জন্মদিন, দুইজনের বয়সের পার্থক্য এবং আরও অনেক কিছু হিসাব করুন। বাংলায় সহজ ও দ্রুত এজ ক্যালকুলেটর।",
  alternates: {
    canonical: "https://totthobox.com/tools/age-calculator",
  },
  openGraph: {
    title:
      "স্মার্ট এজ ক্যালকুলেটর - সঠিক বয়স ও বয়সের পার্থক্য হিসাব | তথ্যবক্স",
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
      "স্মার্ট এজ ক্যালকুলেটর - সঠিক বয়স ও বয়সের পার্থক্য হিসাব | তথ্যবক্স",
    description:
      "অনলাইনে নিখুঁতভাবে আপনার বয়স, পরবর্তী জন্মদিন, দুইজনের বয়সের পার্থক্য এবং আরও অনেক কিছু হিসাব করুন।",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }],
  },
};

export default function AgeCalculatorPage() {
  return (
    <>
      <ToolStructuredData
        name="স্মার্ট এজ ক্যালকুলেটর"
        description="অনলাইনে নিখুঁতভাবে আপনার বয়স, পরবর্তী জন্মদিন, দুইজনের বয়সের পার্থক্য এবং আরও অনেক কিছু হিসাব করুন।"
        url="https://totthobox.com/tools/age-calculator"
        applicationCategory="CalculatorApplication"
        featureList={[
          "নির্দিষ্ট জন্মতারিখ থেকে নিখুঁত বছর, মাস, দিন হিসাব",
          "পরবর্তী জন্মদিনের কাউন্টডাউন",
          "দুই ব্যক্তির বয়সের তুলনামূলক পার্থক্য",
          "মোট দিন, ঘণ্টা, মিনিট ও সেকেন্ড গণনা",
        ]}
      />
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
        <AgeCalculator />
      </div>
    </>
  );
}
