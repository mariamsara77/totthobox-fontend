import { Metadata } from "next";
import TimeConverter from "@/components/converter/TimeConverter";

export const metadata: Metadata = {
  title: "অনলাইন সময় রূপান্তরকারী - সেকেন্ড, মিনিট, ঘণ্টা, দিন | Totthobox",
  description:
    "সহজেই সেকেন্ড, মিনিট, ঘণ্টা, দিন, সপ্তাহ কনভার্ট করুন। Totthobox-এর নিখুঁত Time Converter।",
  keywords: [
    "সময় রূপান্তরকারী",
    "time converter",
    "hour to minute",
    "day to hour",
    "Totthobox",
  ],
  openGraph: {
    title: "অনলাইন সময় রূপান্তরকারী - সেকেন্ড, মিনিট, ঘণ্টা, দিন | Totthobox",
    description:
      "সহজেই সেকেন্ড, মিনিট, ঘণ্টা, দিন, সপ্তাহ কনভার্ট করুন। Totthobox-এর নিখুঁত Time Converter।",
    type: "website",
    locale: "bn_BD",
    siteName: "Totthobox",
  },
};

export default function TimeConverterPage() {
  return (
    <div className="mx-auto max-w-2xl p-4">
      <TimeConverter />
    </div>
  );
}