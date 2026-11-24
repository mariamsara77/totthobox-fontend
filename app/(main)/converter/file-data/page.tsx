import type { Metadata } from "next";
import DataConverter from "@/components/converter/DataConverter";
import ToolGuide from "@/components/ToolGuide";
import { fileDataConverterGuide } from "@/lib/content/converters/file-data";

export const revalidate = 86400;

export const metadata: Metadata = {
  alternates: { canonical: "https://totthobox.com/converter/file-data" },
  title: "ফাইল ডাটা ফরম্যাট কনভার্টার - JSON, XML, YAML, CSV | Totthobox",
  description:
    "সহজেই JSON, XML, YAML এবং CSV ফাইল বা টেক্সট ডাটা কনভার্ট করুন। সম্পূর্ণ ব্রাউজার-সাইড সুরক্ষিত ও ফ্রি ডাটা ট্রান্সফর্মেশন টুল।",
  openGraph: {
    title: "ফাইল ডাটা ফরম্যাট কনভার্টার - JSON, XML, YAML, CSV | Totthobox",
    description:
      "সহজেই JSON, XML, YAML এবং CSV ফাইল বা টেক্সট ডাটা কনভার্ট করুন। সম্পূর্ণ ব্রাউজার-সাইড সুরক্ষিত ও ফ্রি ডাটা ট্রান্সফর্মেশন টুল।",
    url: "https://totthobox.com/converter/file-data",
    siteName: "Totthobox",
    type: "website",
    locale: "bn_BD",
    images: [
      {
        url: "https://totthobox.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Totthobox",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ফাইল ডাটা ফরম্যাট কনভার্টার - JSON, XML, YAML, CSV | Totthobox",
    description:
      "সহজেই JSON, XML, YAML এবং CSV ফাইল বা টেক্সট ডাটা কনভার্ট করুন। সম্পূর্ণ ব্রাউজার-সাইড সুরক্ষিত ও ফ্রি ডাটা ট্রান্সফর্মেশন টুল।",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }],
  },
};

export default function DataConverterPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-12">
      <div className="max-w-3xl mx-auto">
        <DataConverter />
      </div>
      <ToolGuide guide={fileDataConverterGuide} />
    </div>
  );
}
