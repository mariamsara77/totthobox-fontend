import type { Metadata } from "next";
import ZodiacCalculator from "@/components/tools/ZodiacCalculator";

export const metadata: Metadata = {
  title: "স্মার্ট রাশিফল ক্যালকুলেটর - সঠিক রাশি ও রাশির মিল জানুন",
  description:
    "অনলাইনে জন্মতারিখ দিয়ে আপনার সঠিক রাশি (Zodiac Sign), বৈশিষ্ট্য, শুভ সংখ্যা এবং দুইজনের রাশির মধ্যে কতটা মিল রয়েছে তা নিখুঁতভাবে হিসেব করুন।",
  alternates: {
    canonical: "https://totthobox.com/tools/zodiac-calculator",
  },
  openGraph: {
    title:
      "স্মার্ট রাশিফল ক্যালকুলেটর - সঠিক রাশি ও রাশির মিল জানুন",
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
      "স্মার্ট রাশিফল ক্যালকুলেটর - সঠিক রাশি ও রাশির মিল জানুন",
    description:
      "অনলাইনে জন্মতারিখ দিয়ে আপনার সঠিক রাশি, বৈশিষ্ট্য এবং দুইজনের রাশির মিল নিখুঁতভাবে হিসেব করুন।",
  
    images: ["https://totthobox.com/og-image.png"],
  },
};

export default function ZodiacCalculatorPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
      <ZodiacCalculator />
    </div>
  );
}
