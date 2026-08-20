import { Metadata } from "next";
import LandAreaConverter from "@/components/converter/LandAreaConverter";

export const metadata: Metadata = {
  title: "জমি পরিমাপ ক্যালকুলেটর - শতাংশ, কাঠা, বিঘা কনভার্টার | Totthobox",
  description:
    "সহজেই শতাংশ, কাঠা, বিঘা, স্কয়ার ফিট ও একর কনভার্ট করুন। Totthobox-এর নিখুঁত Land Area Converter (বাংলাদেশ স্ট্যান্ডার্ড)।",
  keywords: [
    "জমি পরিমাপ",
    "কাঠা টু শতাংশ",
    "বিঘা কনভার্টার",
    "land area converter",
    "katha to decimal",
    "Totthobox",
  ],
  openGraph: {
    title: "জমি পরিমাপ ক্যালকুলেটর - শতাংশ, কাঠা, বিঘা কনভার্টার | Totthobox",
    description:
      "সহজেই শতাংশ, কাঠা, বিঘা, স্কয়ার ফিট ও একর কনভার্ট করুন। Totthobox-এর নিখুঁত Land Area Converter (বাংলাদেশ স্ট্যান্ডার্ড)।",
    type: "website",
    locale: "bn_BD",
    siteName: "Totthobox",
  },
};

export default function LandAreaConverterPage() {
  return (
    <div className="mx-auto max-w-2xl p-4">
      <LandAreaConverter />
    </div>
  );
}