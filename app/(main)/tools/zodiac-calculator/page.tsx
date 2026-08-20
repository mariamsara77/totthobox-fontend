import { Metadata } from "next";
import ZodiacCalculator from "@/components/tools/ZodiacCalculator";

export const metadata: Metadata = {
  title: "স্মার্ট রাশিফল ক্যালকুলেটর - সঠিক রাশি ও রাশির মিল জানুন | Totthobox",
  description:
    "অনলাইনে জন্মতারিখ দিয়ে আপনার সঠিক রাশি (Zodiac Sign), বৈশিষ্ট্য, শুভ সংখ্যা এবং দুইজনের রাশির মধ্যে কতটা মিল রয়েছে তা নিখুঁতভাবে হিসেব করুন।",
  keywords: [
    "রাশিফল ক্যালকুলেটর",
    "রাশি নির্ণয়",
    "zodiac sign calculator bangla",
    "রাশির মিল",
    "জোটক বিচার",
    "অনলাইন রাশিফল",
    "Totthobox",
  ],
  openGraph: {
    title: "স্মার্ট রাশিফল ক্যালকুলেটর - সঠিক রাশি ও রাশির মিল জানুন | Totthobox",
    description:
      "অনলাইনে জন্মতারিখ দিয়ে আপনার সঠিক রাশি (Zodiac Sign), বৈশিষ্ট্য, শুভ সংখ্যা এবং দুইজনের রাশির মধ্যে কতটা মিল রয়েছে তা নিখুঁতভাবে হিসেব করুন।",
    type: "website",
    locale: "bn_BD",
    siteName: "Totthobox",
  },
};

export default function ZodiacCalculatorPage() {
  return (
    <div className="mx-auto max-w-2xl p-4">
      <ZodiacCalculator />
    </div>
  );
}
