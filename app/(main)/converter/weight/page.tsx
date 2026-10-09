import type { Metadata } from "next";
import WeightConverter from "@/components/converter/WeightConverter";

export const metadata: Metadata = {
  alternates: { canonical: "https://totthobox.com/converter/weight" },
  title: "অনলাইন ওজন রূপান্তরকারী - কেজি, গ্রাম, পাউন্ড কনভার্টার | Totthobox",
  description:
    "সহজেই কেজি (kg), গ্রাম (g), পাউন্ড (lb), আউন্স এবং মেট্রিক টন কনভার্ট করুন। Totthobox-এর নিখুঁত Weight Converter।",
  openGraph: {
    title: "অনলাইন ওজন রূপান্তরকারী - কেজি, গ্রাম, পাউন্ড কনভার্টার | Totthobox",
    description:
      "সহজেই কেজি (kg), গ্রাম (g), পাউন্ড (lb), আউন্স এবং মেট্রিক টন কনভার্ট করুন। Totthobox-এর নিখুঁত Weight Converter।",
    type: "website",
    locale: "bn_BD",
    siteName: "Totthobox",
  },
};

export default function WeightConverterPage() {
  return (
    <div className="mx-auto max-w-2xl p-4">
      <WeightConverter />
    </div>
  );
}