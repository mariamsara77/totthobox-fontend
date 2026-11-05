import type { Metadata } from "next";
import TemperatureConverter from "@/components/converter/TemperatureConverter";

export const metadata: Metadata = {
  alternates: { canonical: "https://totthobox.com/converter/temperature" },
  title: "অনলাইন তাপমাত্রা রূপান্তরকারী - °C, °F, Kelvin কনভার্টার",
  description:
    "সহজেই Celsius, Fahrenheit এবং Kelvin কনভার্ট করুন। Totthobox-এর নিখুঁত Temperature Converter।",
  openGraph: {
    title: "অনলাইন তাপমাত্রা রূপান্তরকারী - °C, °F, Kelvin কনভার্টার | Totthobox",
    description:
      "সহজেই Celsius, Fahrenheit এবং Kelvin কনভার্ট করুন। Totthobox-এর নিখুঁত Temperature Converter।",
    type: "website",
    locale: "bn_BD",
    siteName: "Totthobox",
    url: "https://totthobox.com/converter/temperature",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox" }],
  },
  twitter: { card: "summary_large_image", title: "অনলাইন তাপমাত্রা রূপান্তরকারী - °C, °F, Kelvin কনভার্টার | Totthobox", description: "সহজেই Celsius, Fahrenheit এবং Kelvin কনভার্ট করুন। Totthobox-এর নিখুঁত Temperature Converter।", images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }] },
};

export default function TemperatureConverterPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
      <TemperatureConverter />
    </div>
  );
}