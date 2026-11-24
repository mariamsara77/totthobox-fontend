import type { Metadata } from "next";
import ZodiacCalculator from "@/components/tools/ZodiacCalculator";
import ToolStructuredData from "@/components/seo/ToolStructuredData";
import ToolGuide from "@/components/ToolGuide";
import { zodiacCalculatorContent } from "@/lib/content/tools/zodiac-calculator";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "স্মার্ট রাশিফল ক্যালকুলেটর - সঠিক রাশি ও রাশির মিল জানুন | তথ্যবক্স",
  description:
    "অনলাইনে জন্মতারিখ দিয়ে আপনার সঠিক রাশি (Zodiac Sign), বৈশিষ্ট্য, শুভ সংখ্যা এবং দুইজনের রাশির মধ্যে কতটা মিল রয়েছে তা নিখুঁতভাবে হিসেব করুন।",
  alternates: {
    canonical: "https://totthobox.com/tools/zodiac-calculator",
  },
  openGraph: {
    title:
      "স্মার্ট রাশিফল ক্যালকুলেটর - সঠিক রাশি ও রাশির মিল জানুন | তথ্যবক্স",
    description:
      "অনলাইনে জন্মতারিখ দিয়ে আপনার সঠিক রাশি, বৈশিষ্ট্য এবং দুইজনের রাশির মিল নিখুঁতভাবে হিসেব করুন।",
    type: "website",
    locale: "bn_BD",
    siteName: "Totthobox",
    url: "https://totthobox.com/tools/zodiac-calculator",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox" }],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "স্মার্ট রাশিফল ক্যালকুলেটর - সঠিক রাশি ও রাশির মিল জানুন | তথ্যবক্স",
    description:
      "অনলাইনে জন্মতারিখ দিয়ে আপনার সঠিক রাশি, বৈশিষ্ট্য এবং দুইজনের রাশির মিল নিখুঁতভাবে হিসেব করুন।",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }],
  },
};

export default function ZodiacCalculatorPage() {
  return (
    <>
      <ToolStructuredData
        name="স্মার্ট রাশিফল ও রাশির মিল ক্যালকুলেটর"
        description="জন্মতারিখ অনুযায়ী সঠিক রাশি এবং রাশিচক্রের বৈশিষ্ট্যাবলী ও যুগল সামঞ্জস্যতা পরিমাপের অনলাইন টুল।"
        url="https://totthobox.com/tools/zodiac-calculator"
        applicationCategory="EntertainmentApplication"
        featureList={[
          "জন্মতারিখ অনুযায়ী রাশি (Zodiac Sign) নির্ধারণ",
          "রাশির শুভ সংখ্যা, রং ও অধিপতি গ্রহ",
          "দুই রাশির মধ্যকার শতকরা সামঞ্জস্যতা (Compatibility)",
          "ব্যক্তিত্ব ও চারিত্রিক বৈশিষ্ট্যের বিশ্লেষণ",
        ]}
      />
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
        <ZodiacCalculator />
        <ToolGuide content={zodiacCalculatorContent} />
      </div>
    </>
  );
}
