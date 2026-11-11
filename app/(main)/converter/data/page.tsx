import type { Metadata } from "next";
import DataStorageConverter from "@/components/converter/DataStorageConverter";
import ToolGuide from "@/components/ToolGuide";
import { dataConverterGuide } from "@/lib/content/converters/data";

export const revalidate = 86400;

export const metadata: Metadata = {
  alternates: { canonical: "https://totthobox.com/converter/data" },
  title: "অনলাইন ডাটা স্টোরেজ রূপান্তরকারী - MB, GB, TB, PB | Totthobox",
  description:
    "সহজেই MB, GB, TB, PB কনভার্ট করুন। Totthobox-এর নিখুঁত Data Storage Converter ও পূর্ণাঙ্গ মেমরি পরিমাপ গাইড।",
  openGraph: {
    title: "অনলাইন ডাটা স্টোরেজ রূপান্তরকারী - MB, GB, TB, PB | Totthobox",
    description:
      "সহজেই MB, GB, TB, PB কনভার্ট করুন। Totthobox-এর নিখুঁত Data Storage Converter ও পূর্ণাঙ্গ মেমরি পরিমাপ গাইড।",
    type: "website",
    locale: "bn_BD",
    siteName: "Totthobox",
    url: "https://totthobox.com/converter/data",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "অনলাইন ডাটা স্টোরেজ রূপান্তরকারী - MB, GB, TB, PB | Totthobox",
    description: "সহজেই MB, GB, TB, PB কনভার্ট করুন। Totthobox-এর নিখুঁত Data Storage Converter।",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }],
  },
};

export default function DataStorageConverterPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-12">
      <div className="max-w-2xl mx-auto">
        <DataStorageConverter />
      </div>
      <ToolGuide guide={dataConverterGuide} />
    </div>
  );
}
