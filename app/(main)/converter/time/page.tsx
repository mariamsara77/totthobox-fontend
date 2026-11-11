import type { Metadata } from "next";
import TimeConverter from "@/components/converter/TimeConverter";
import ToolGuide from "@/components/ToolGuide";
import { timeConverterGuide } from "@/lib/content/converters/time";

export const revalidate = 86400;

export const metadata: Metadata = {
  alternates: { canonical: "https://totthobox.com/converter/time" },
  title: "অনলাইন সময় রূপান্তরকারী - সেকেন্ড, মিনিট, ঘণ্টা, দিন | Totthobox",
  description:
    "সহজেই সেকেন্ড, মিনিট, ঘণ্টা, দিন ও সপ্তাহ কনভার্ট করুন। Totthobox-এর নিখুঁত Time Converter ও প্রজেক্ট ডেডলাইন রূপান্তর নির্দেশিকা।",
  openGraph: {
    title: "অনলাইন সময় রূপান্তরকারী - সেকেন্ড, মিনিট, ঘণ্টা, দিন | Totthobox",
    description:
      "সহজেই সেকেন্ড, মিনিট, ঘণ্টা, দিন ও সপ্তাহ কনভার্ট করুন। Totthobox-এর নিখুঁত Time Converter ও প্রজেক্ট ডেডলাইন রূপান্তর নির্দেশিকা।",
    type: "website",
    locale: "bn_BD",
    siteName: "Totthobox",
    url: "https://totthobox.com/converter/time",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "অনলাইন সময় রূপান্তরকারী - সেকেন্ড, মিনিট, ঘণ্টা, দিন | Totthobox",
    description: "সহজেই সেকেন্ড, মিনিট, ঘণ্টা, দিন ও সপ্তাহ কনভার্ট করুন। Totthobox-এর নিখুঁত Time Converter।",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }],
  },
};

export default function TimeConverterPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-12">
      <div className="max-w-2xl mx-auto">
        <TimeConverter />
      </div>
      <ToolGuide guide={timeConverterGuide} />
    </div>
  );
}
