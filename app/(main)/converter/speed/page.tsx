import { Metadata } from "next";
import VelocityConverter from "@/components/converter/VelocityConverter";

export const metadata: Metadata = {
  title: "অনলাইন গতিবেগ রূপান্তরকারী - m/s, km/h, mph, Knots | Totthobox",
  description:
    "সহজেই m/s, km/h, mph এবং Knots কনভার্ট করুন। Totthobox-এর নিখুঁত Velocity Converter।",
  keywords: [
    "গতিবেগ রূপান্তরকারী",
    "speed converter",
    "kmh to mph",
    "velocity converter",
    "Totthobox",
  ],
  openGraph: {
    title: "অনলাইন গতিবেগ রূপান্তরকারী - m/s, km/h, mph, Knots | Totthobox",
    description:
      "সহজেই m/s, km/h, mph এবং Knots কনভার্ট করুন। Totthobox-এর নিখুঁত Velocity Converter।",
    type: "website",
    locale: "bn_BD",
    siteName: "Totthobox",
  },
};

export default function VelocityConverterPage() {
  return (
    <div className="mx-auto max-w-2xl p-4">
      <VelocityConverter />
    </div>
  );
}