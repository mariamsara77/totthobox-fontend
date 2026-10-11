import type { Metadata } from "next";
import LandAreaConverter from "@/components/converter/LandAreaConverter";

export const metadata: Metadata = {
  alternates: { canonical: "https://totthobox.com/converter/land" },
  title: "জমি পরিমাপ ক্যালকুলেটর - শতাংশ, কাঠা, বিঘা কনভার্টার",
  description:
    "সহজেই শতাংশ, কাঠা, বিঘা, স্কয়ার ফিট ও একর কনভার্ট করুন। Totthobox-এর নিখুঁত Land Area Converter (বাংলাদেশ স্ট্যান্ডার্ড)।",
  openGraph: {
    title: "জমি পরিমাপ ক্যালকুলেটর - শতাংশ, কাঠা, বিঘা কনভার্টার | Totthobox",
    description:
      "সহজেই শতাংশ, কাঠা, বিঘা, স্কয়ার ফিট ও একর কনভার্ট করুন। Totthobox-এর নিখুঁত Land Area Converter (বাংলাদেশ স্ট্যান্ডার্ড)।",
    type: "website",
    locale: "bn_BD",
    siteName: "Totthobox",
  
    url: "https://totthobox.com/converter/land",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "জমি পরিমাপ ক্যালকুলেটর - শতাংশ, কাঠা, বিঘা কনভার্টার",
    description: "সহজেই শতাংশ, কাঠা, বিঘা, স্কয়ার ফিট ও একর কনভার্ট করুন। Totthobox-এর নিখুঁত Land Area Converter (বাংলাদেশ স্ট্যান্ডার্ড)।",
    images: ["https://totthobox.com/og-image.png"],
  },
};

export default function LandAreaConverterPage() {
  return (
    <div className="tb-page-container tb-section mx-auto max-w-2xl">
      <LandAreaConverter />
    </div>
  );
}