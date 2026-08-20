import { Metadata } from "next";
import TemperatureConverter from "@/components/converter/TemperatureConverter";

export const metadata: Metadata = {
  title: "অনলাইন তাপমাত্রা রূপান্তরকারী - °C, °F, Kelvin কনভার্টার | Totthobox",
  description:
    "সহজেই Celsius, Fahrenheit এবং Kelvin কনভার্ট করুন। Totthobox-এর নিখুঁত Temperature Converter।",
  keywords: [
    "তাপমাত্রা রূপান্তরকারী",
    "celsius to fahrenheit",
    "temperature converter",
    "°C to °F",
    "Totthobox",
  ],
  openGraph: {
    title: "অনলাইন তাপমাত্রা রূপান্তরকারী - °C, °F, Kelvin কনভার্টার | Totthobox",
    description:
      "সহজেই Celsius, Fahrenheit এবং Kelvin কনভার্ট করুন। Totthobox-এর নিখুঁত Temperature Converter।",
    type: "website",
    locale: "bn_BD",
    siteName: "Totthobox",
  },
};

export default function TemperatureConverterPage() {
  return (
    <div className="mx-auto max-w-2xl p-4">
      <TemperatureConverter />
    </div>
  );
}