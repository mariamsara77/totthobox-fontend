import { Metadata } from "next";
import EnergyConverter from "@/components/converter/EnergyConverter";

export const metadata: Metadata = {
  title: "অনলাইন এনার্জি রূপান্তরকারী - Joule, Calorie, kWh | Totthobox",
  description:
    "সহজেই Joule, Calorie, Kilocalorie এবং kWh কনভার্ট করুন। Totthobox-এর নিখুঁত Energy Converter।",
  keywords: [
    "এনার্জি রূপান্তরকারী",
    "joule to calorie",
    "energy converter",
    "kwh converter",
    "Totthobox",
  ],
  openGraph: {
    title: "অনলাইন এনার্জি রূপান্তরকারী - Joule, Calorie, kWh | Totthobox",
    description:
      "সহজেই Joule, Calorie, Kilocalorie এবং kWh কনভার্ট করুন। Totthobox-এর নিখুঁত Energy Converter।",
    type: "website",
    locale: "bn_BD",
    siteName: "Totthobox",
  },
};

export default function EnergyConverterPage() {
  return (
    <div className="mx-auto max-w-2xl p-4">
      <EnergyConverter />
    </div>
  );
}