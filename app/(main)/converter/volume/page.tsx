import { Metadata } from "next";
import VolumeConverter from "@/components/converter/VolumeConverter";

export const metadata: Metadata = {
  title: "অনলাইন আয়তন রূপান্তরকারী - লিটার, CFT, CC, গ্যালন কনভার্টার | Totthobox",
  description:
    "সহজেই লিটার (L), সেফটি/কিউবিক ফুট (CFT), সিসি (CC), মিলিলিটার এবং গ্যালন কনভার্ট করুন। Totthobox-এর নিখুঁত Volume Converter।",
  keywords: [
    "আয়তন রূপান্তরকারী",
    "volume converter",
    "CFT to liter",
    "cft calculator",
    "সিসি থেকে লিটার",
    "সেফটি ক্যালকুলেটর",
    "Totthobox",
  ],
  openGraph: {
    title: "অনলাইন আয়তন রূপান্তরকারী - লিটার, CFT, CC, গ্যালন কনভার্টার | Totthobox",
    description:
      "সহজেই লিটার (L), সেফটি/কিউবিক ফুট (CFT), সিসি (CC), মিলিলিটার এবং গ্যালন কনভার্ট করুন। Totthobox-এর নিখুঁত Volume Converter।",
    type: "website",
    locale: "bn_BD",
    siteName: "Totthobox",
  },
};

export default function VolumeConverterPage() {
  return (
     <div className="max-w-2xl mx-auto p-4">
      <VolumeConverter />
    </div>
  );
}