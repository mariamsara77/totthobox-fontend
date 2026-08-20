import { Metadata } from "next";
import AreaConverter from "@/components/converter/AreaConverter";

export const metadata: Metadata = {
  title: "অনলাইন ক্ষেত্রফল রূপান্তরকারী - Square Meter, Foot, Acre, Hectare | Totthobox",
  description:
    "সহজেই Square Meter, Square Foot, Acre, Hectare কনভার্ট করুন। Totthobox-এর নিখুঁত Area Converter।",
  keywords: [
    "ক্ষেত্রফল রূপান্তরকারী",
    "area converter",
    "sqm to sqft",
    "acre to hectare",
    "Totthobox",
  ],
  openGraph: {
    title: "অনলাইন ক্ষেত্রফল রূপান্তরকারী - Square Meter, Foot, Acre, Hectare | Totthobox",
    description:
      "সহজেই Square Meter, Square Foot, Acre, Hectare কনভার্ট করুন। Totthobox-এর নিখুঁত Area Converter।",
    type: "website",
    locale: "bn_BD",
    siteName: "Totthobox",
  },
};

export default function AreaConverterPage() {
  return (
    <div className="mx-auto max-w-2xl p-4">
      <AreaConverter />
    </div>
  );
}