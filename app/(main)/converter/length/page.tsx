import { Metadata } from "next";
// কম্পোনেন্টের সঠিক পাথ দিন
import LengthConverter from "@/components/converter/LengthConverter";

export const metadata: Metadata = {
  title: "অনলাইন দৈর্ঘ্য রূপান্তরকারী - মিটার, কিমি, মাইল, ফুট, ইঞ্চি কনভার্টার | Totthobox",
  description:
    "সহজেই মিটার (m), সেন্টিমিটার (cm), কিলোমিটার (km), মাইল (mi), ফুট (ft) এবং ইঞ্চি (in) কনভার্ট করুন। Totthobox-এর নিখুঁত Length Converter।",
  keywords: [
    "দৈর্ঘ্য রূপান্তরকারী",
    "length converter",
    "meter to feet",
    "km to miles",
    "inch to cm",
    "মিটার থেকে ফুট",
    "দৈর্ঘ্য ক্যালকুলেটর",
    "Totthobox",
  ],
  openGraph: {
    title: "অনলাইন দৈর্ঘ্য রূপান্তরকারী - মিটার, কিমি, মাইল, ফুট, ইঞ্চি | Totthobox",
    description:
      "সহজেই মিটার (m), সেন্টিমিটার (cm), কিলোমিটার (km), মাইল (mi), ফুট (ft) এবং ইঞ্চি (in) কনভার্ট করুন।",
    type: "website",
    locale: "bn_BD",
    siteName: "Totthobox",
  },
};

export default function LengthConverterPage() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <LengthConverter />
      </div>
  );
}