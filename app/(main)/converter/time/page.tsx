import type { Metadata } from "next";
import TimeConverter from "@/components/converter/TimeConverter";

export const metadata: Metadata = {
  alternates: { canonical: "https://totthobox.com/converter/time" },
  title: "অনলাইন সময় রূপান্তরকারী - সেকেন্ড, মিনিট, ঘণ্টা, দিন | Totthobox",
  description:
    "সহজেই সেকেন্ড, মিনিট, ঘণ্টা, দিন, সপ্তাহ কনভার্ট করুন। Totthobox-এর নিখুঁত Time Converter।",
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