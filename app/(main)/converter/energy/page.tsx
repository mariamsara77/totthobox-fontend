import type { Metadata } from "next";
import EnergyConverter from "@/components/converter/EnergyConverter";
import ToolGuide from "@/components/ToolGuide";
import { energyConverterGuide } from "@/lib/content/converters/energy";

export const revalidate = 86400;

export const metadata: Metadata = {
  alternates: { canonical: "https://totthobox.com/converter/energy" },
  title: "অনলাইন এনার্জি রূপান্তরকারী - Joule, Calorie, kWh | Totthobox",
  description:
    "সহজেই Joule, Calorie, Kilocalorie এবং kWh কনভার্ট করুন। Totthobox-এর নিখুঁত Energy Converter ও বিদ্যুৎ বিল এবং খাদ্য ক্যালোরি নির্দেশিকা।",
  openGraph: {
    title: "অনলাইন এনার্জি রূপান্তরকারী - Joule, Calorie, kWh | Totthobox",
    description:
      "সহজেই Joule, Calorie, Kilocalorie এবং kWh কনভার্ট করুন। Totthobox-এর নিখুঁত Energy Converter ও বিদ্যুৎ বিল এবং খাদ্য ক্যালোরি নির্দেশিকা।",
    type: "website",
    locale: "bn_BD",
    siteName: "Totthobox",
    url: "https://totthobox.com/converter/energy",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "অনলাইন এনার্জি রূপান্তরকারী - Joule, Calorie, kWh | Totthobox",
    description: "সহজেই Joule, Calorie, Kilocalorie এবং kWh কনভার্ট করুন। Totthobox-এর নিখুঁত Energy Converter।",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }],
  },
};

export default function EnergyConverterPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-12">
      <div className="max-w-2xl mx-auto">
        <EnergyConverter />
      </div>
      <ToolGuide guide={energyConverterGuide} />
    </div>
  );
}
