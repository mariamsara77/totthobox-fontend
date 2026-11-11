import type { Metadata } from "next";
import AreaConverter from "@/components/converter/AreaConverter";
import ToolGuide from "@/components/ToolGuide";
import { areaConverterGuide } from "@/lib/content/converters/area";

export const revalidate = 86400;

export const metadata: Metadata = {
  alternates: { canonical: "https://totthobox.com/converter/area" },
  title: "অনলাইন ক্ষেত্রফল রূপান্তরকারী - Square Meter, Foot, Acre, Hectare | Totthobox",
  description:
    "সহজেই Square Meter, Square Foot, Acre, Hectare কনভার্ট করুন। Totthobox-এর নিখুঁত Area Converter ও প্রমিত ক্ষেত্রফল পরিমাপ গাইড।",
  openGraph: {
    title: "অনলাইন ক্ষেত্রফল রূপান্তরকারী - Square Meter, Foot, Acre, Hectare | Totthobox",
    description:
      "সহজেই Square Meter, Square Foot, Acre, Hectare কনভার্ট করুন। Totthobox-এর নিখুঁত Area Converter ও প্রমিত ক্ষেত্রফল পরিমাপ গাইড।",
    type: "website",
    locale: "bn_BD",
    siteName: "Totthobox",
    url: "https://totthobox.com/converter/area",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "অনলাইন ক্ষেত্রফল রূপান্তরকারী - Square Meter, Foot, Acre, Hectare | Totthobox",
    description: "সহজেই Square Meter, Square Foot, Acre, Hectare কনভার্ট করুন। Totthobox-এর নিখুঁত Area Converter ও প্রমিত ক্ষেত্রফল পরিমাপ গাইড।",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }],
  },
};

export default function AreaConverterPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-12">
      <div className="max-w-2xl mx-auto">
        <AreaConverter />
      </div>
      <ToolGuide guide={areaConverterGuide} />
    </div>
  );
}
