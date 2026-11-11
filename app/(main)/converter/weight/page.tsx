import type { Metadata } from "next";
import WeightConverter from "@/components/converter/WeightConverter";
import ToolGuide from "@/components/ToolGuide";
import { weightConverterGuide } from "@/lib/content/converters/weight";

export const revalidate = 86400;

export const metadata: Metadata = {
  alternates: { canonical: "https://totthobox.com/converter/weight" },
  title: "অনলাইন ওজন রূপান্তরকারী - কেজি, গ্রাম, পাউন্ড কনভার্টার | Totthobox",
  description:
    "সহজেই কেজি (kg), গ্রাম (g), পাউন্ড (lb), আউন্স এবং মেট্রিক টন কনভার্ট করুন। Totthobox-এর নিখুঁত Weight Converter ও ভর রূপান্তর নির্দেশিকা।",
  openGraph: {
    title: "অনলাইন ওজন রূপান্তরকারী - কেজি, গ্রাম, পাউন্ড কনভার্টার | Totthobox",
    description:
      "সহজেই কেজি (kg), গ্রাম (g), পাউন্ড (lb), আউন্স এবং মেট্রিক টন কনভার্ট করুন। Totthobox-এর নিখুঁত Weight Converter ও ভর রূপান্তর নির্দেশিকা।",
    type: "website",
    locale: "bn_BD",
    siteName: "Totthobox",
    url: "https://totthobox.com/converter/weight",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "অনলাইন ওজন রূপান্তরকারী - কেজি, গ্রাম, পাউন্ড কনভার্টার | Totthobox",
    description: "সহজেই কেজি (kg), গ্রাম (g), পাউন্ড (lb), আউন্স এবং মেট্রিক টন কনভার্ট করুন। Totthobox-এর নিখুঁত Weight Converter।",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }],
  },
};

export default function WeightConverterPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-12">
      <div className="max-w-2xl mx-auto">
        <WeightConverter />
      </div>
      <ToolGuide guide={weightConverterGuide} />
    </div>
  );
}
