import type { Metadata } from "next";
// কম্পোনেন্টের সঠিক পাথ দিন
import LengthConverter from "@/components/converter/LengthConverter";

export const metadata: Metadata = {
  alternates: { canonical: "https://totthobox.com/converter/length" },
  title: "অনলাইন দৈর্ঘ্য রূপান্তরকারী - মিটার, কিমি, মাইল, ফুট, ইঞ্চি কনভার্টার",
  description:
    "সহজেই মিটার (m), সেন্টিমিটার (cm), কিলোমিটার (km), মাইল (mi), ফুট (ft) এবং ইঞ্চি (in) কনভার্ট করুন। Totthobox-এর নিখুঁত Length Converter।",
  openGraph: {
    title: "অনলাইন দৈর্ঘ্য রূপান্তরকারী - মিটার, কিমি, মাইল, ফুট, ইঞ্চি | Totthobox",
    description:
      "সহজেই মিটার (m), সেন্টিমিটার (cm), কিলোমিটার (km), মাইল (mi), ফুট (ft) এবং ইঞ্চি (in) কনভার্ট করুন।",
    type: "website",
    locale: "bn_BD",
    siteName: "Totthobox",
    url: "https://totthobox.com/converter/length",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox" }],
  },
  twitter: { card: "summary_large_image", title: "অনলাইন দৈর্ঘ্য রূপান্তরকারী - মিটার, কিমি, মাইল, ফুট, ইঞ্চি | Totthobox", description: "সহজেই মিটার (m), সেন্টিমিটার (cm), কিলোমিটার (km), মাইল (mi), ফুট (ft) এবং ইঞ্চি (in) কনভার্ট করুন।", images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }] },
};

export default function LengthConverterPage() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <LengthConverter />
      </div>
  );
}