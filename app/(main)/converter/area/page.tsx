export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import AreaConverter from "@/components/converter/AreaConverter";

export const metadata: Metadata = {
  alternates: { canonical: "https://totthobox.com/converter/area" },
  title: "অনলাইন ক্ষেত্রফল রূপান্তরকারী - Square Meter, Foot, Acre, Hectare",
  description:
    "সহজেই Square Meter, Square Foot, Acre, Hectare কনভার্ট করুন। Totthobox-এর নিখুঁত Area Converter।",
  openGraph: {
    title: "অনলাইন ক্ষেত্রফল রূপান্তরকারী - Square Meter, Foot, Acre, Hectare | Totthobox",
    description:
      "সহজেই Square Meter, Square Foot, Acre, Hectare কনভার্ট করুন। Totthobox-এর নিখুঁত Area Converter।",
    type: "website",
    locale: "bn_BD",
    siteName: "Totthobox",
  
    url: "https://totthobox.com/converter/area",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "অনলাইন ক্ষেত্রফল রূপান্তরকারী - Square Meter, Foot, Acre, Hectare",
    description: "সহজেই Square Meter, Square Foot, Acre, Hectare কনভার্ট করুন। Totthobox-এর নিখুঁত Area Converter।",
    images: ["https://totthobox.com/og-image.png"],
  },
};

export default function AreaConverterPage() {
  return (
    <div className="mx-auto max-w-2xl p-4">
      <AreaConverter />
    </div>
  );
}