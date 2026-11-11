import type { Metadata } from "next";
import VolumeConverter from "@/components/converter/VolumeConverter";
import ToolGuide from "@/components/ToolGuide";
import { volumeConverterGuide } from "@/lib/content/converters/volume";

export const revalidate = 86400;

export const metadata: Metadata = {
  alternates: { canonical: "https://totthobox.com/converter/volume" },
  title: "অনলাইন আয়তন রূপান্তরকারী - লিটার, CFT, CC, গ্যালন কনভার্টার | Totthobox",
  description:
    "সহজেই লিটার (L), সেফটি/কিউবিক ফুট (CFT), সিসি (CC), মিলিলিটার এবং গ্যালন কনভার্ট করুন। Totthobox-এর নিখুঁত Volume Converter ও নির্মাণকাজের সেফটি পরিমাপ গাইড।",
  openGraph: {
    title: "অনলাইন আয়তন রূপান্তরকারী - লিটার, CFT, CC, গ্যালন কনভার্টার | Totthobox",
    description:
      "সহজেই লিটার (L), সেফটি/কিউবিক ফুট (CFT), সিসি (CC), মিলিলিটার এবং গ্যালন কনভার্ট করুন। Totthobox-এর নিখুঁত Volume Converter ও নির্মাণকাজের সেফটি পরিমাপ গাইড।",
    type: "website",
    locale: "bn_BD",
    siteName: "Totthobox",
    url: "https://totthobox.com/converter/volume",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "অনলাইন আয়তন রূপান্তরকারী - লিটার, CFT, CC, গ্যালন কনভার্টার | Totthobox",
    description: "সহজেই লিটার (L), সেফটি/কিউবিক ফুট (CFT), সিসি (CC), মিলিলিটার এবং গ্যালন কনভার্ট করুন।",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }],
  },
};

export default function VolumeConverterPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-12">
      <div className="max-w-2xl mx-auto">
        <VolumeConverter />
      </div>
      <ToolGuide guide={volumeConverterGuide} />
    </div>
  );
}
