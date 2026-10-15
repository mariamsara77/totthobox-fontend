import type { Metadata } from "next";
import VolumeConverter from "@/components/converter/VolumeConverter";

export const metadata: Metadata = {
  alternates: { canonical: "https://totthobox.com/converter/volume" },
  title: "অনলাইন আয়তন রূপান্তরকারী - লিটার, CFT, CC, গ্যালন কনভার্টার | Totthobox",
  description:
    "সহজেই লিটার (L), সেফটি/কিউবিক ফুট (CFT), সিসি (CC), মিলিলিটার এবং গ্যালন কনভার্ট করুন। Totthobox-এর নিখুঁত Volume Converter।",
  openGraph: {
    title: "অনলাইন আয়তন রূপান্তরকারী - লিটার, CFT, CC, গ্যালন কনভার্টার | Totthobox",
    description:
      "সহজেই লিটার (L), সেফটি/কিউবিক ফুট (CFT), সিসি (CC), মিলিলিটার এবং গ্যালন কনভার্ট করুন। Totthobox-এর নিখুঁত Volume Converter।",
    type: "website",
    locale: "bn_BD",
    siteName: "Totthobox",
    url: "https://totthobox.com/converter/volume",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox" }],
  },
  twitter: { card: "summary_large_image", title: "অনলাইন আয়তন রূপান্তরকারী - লিটার, CFT, CC, গ্যালন কনভার্টার | Totthobox", description: "সহজেই লিটার (L), সেফটি/কিউবিক ফুট (CFT), সিসি (CC), মিলিলিটার এবং গ্যালন কনভার্ট করুন। Totthobox-এর নিখুঁত Volume Converter।", images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }] },
};

export default function VolumeConverterPage() {
  return (
     <div className="max-w-2xl mx-auto p-4">
      <VolumeConverter />
    </div>
  );
}