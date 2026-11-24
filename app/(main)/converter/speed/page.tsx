import type { Metadata } from "next";
import VelocityConverter from "@/components/converter/VelocityConverter";
import ToolGuide from "@/components/ToolGuide";
import { speedConverterGuide } from "@/lib/content/converters/speed";

export const revalidate = 86400;

export const metadata: Metadata = {
  alternates: { canonical: "https://totthobox.com/converter/speed" },
  title: "অনলাইন গতিবেগ রূপান্তরকারী - m/s, km/h, mph, Knots | Totthobox",
  description:
    "সহজেই m/s, km/h, mph এবং Knots কনভার্ট করুন। Totthobox-এর নিখুঁত Velocity Converter ও সড়ক গতিসীমা এবং ঘূর্ণিঝড় বাতাসের বেগ গাইড।",
  openGraph: {
    title: "অনলাইন গতিবেগ রূপান্তরকারী - m/s, km/h, mph, Knots | Totthobox",
    description:
      "সহজেই m/s, km/h, mph এবং Knots কনভার্ট করুন। Totthobox-এর নিখুঁত Velocity Converter ও সড়ক গতিসীমা এবং ঘূর্ণিঝড় বাতাসের বেগ গাইড।",
    type: "website",
    locale: "bn_BD",
    siteName: "Totthobox",
    url: "https://totthobox.com/converter/speed",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "অনলাইন গতিবেগ রূপান্তরকারী - m/s, km/h, mph, Knots | Totthobox",
    description: "সহজেই m/s, km/h, mph এবং Knots কনভার্ট করুন। Totthobox-এর নিখুঁত Velocity Converter।",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }],
  },
};

export default function VelocityConverterPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-12">
      <div className="max-w-2xl mx-auto">
        <VelocityConverter />
      </div>
      <ToolGuide guide={speedConverterGuide} />
    </div>
  );
}
