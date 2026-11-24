import type { Metadata } from "next";
import LengthConverter from "@/components/converter/LengthConverter";
import ToolGuide from "@/components/ToolGuide";
import { lengthConverterGuide } from "@/lib/content/converters/length";

export const revalidate = 86400;

export const metadata: Metadata = {
  alternates: { canonical: "https://totthobox.com/converter/length" },
  title: "অনলাইন দৈর্ঘ্য রূপান্তরকারী - মিটার, কিমি, মাইল, ফুট, ইঞ্চি কনভার্টার | Totthobox",
  description:
    "সহজেই মিটার (m), সেন্টিমিটার (cm), কিলোমিটার (km), মাইল (mi), ফুট (ft) এবং ইঞ্চি (in) কনভার্ট করুন। Totthobox-এর নিখুঁত Length Converter ও উচ্চতা রূপান্তর গাইড।",
  openGraph: {
    title: "অনলাইন দৈর্ঘ্য রূপান্তরকারী - মিটার, কিমি, মাইল, ফুট, ইঞ্চি | Totthobox",
    description:
      "সহজেই মিটার (m), সেন্টিমিটার (cm), কিলোমিটার (km), মাইল (mi), ফুট (ft) এবং ইঞ্চি (in) কনভার্ট করুন। Totthobox-এর নিখুঁত Length Converter ও উচ্চতা রূপান্তর গাইড।",
    type: "website",
    locale: "bn_BD",
    siteName: "Totthobox",
    url: "https://totthobox.com/converter/length",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "অনলাইন দৈর্ঘ্য রূপান্তরকারী - মিটার, কিমি, মাইল, ফুট, ইঞ্চি | Totthobox",
    description: "সহজেই মিটার (m), সেন্টিমিটার (cm), কিলোমিটার (km), মাইল (mi), ফুট (ft) এবং ইঞ্চি (in) কনভার্ট করুন।",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }],
  },
};

export default function LengthConverterPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-12">
      <div className="max-w-2xl mx-auto">
        <LengthConverter />
      </div>
      <ToolGuide guide={lengthConverterGuide} />
    </div>
  );
}
