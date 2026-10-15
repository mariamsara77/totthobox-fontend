import type { Metadata } from "next";
import EnergyConverter from "@/components/converter/EnergyConverter";

export const metadata: Metadata = {
  alternates: { canonical: "https://totthobox.com/converter/energy" },
  title: "অনলাইন এনার্জি রূপান্তরকারী - Joule, Calorie, kWh | Totthobox",
  description:
    "সহজেই Joule, Calorie, Kilocalorie এবং kWh কনভার্ট করুন। Totthobox-এর নিখুঁত Energy Converter।",
  openGraph: {
    title: "অনলাইন এনার্জি রূপান্তরকারী - Joule, Calorie, kWh | Totthobox",
    description:
      "সহজেই Joule, Calorie, Kilocalorie এবং kWh কনভার্ট করুন। Totthobox-এর নিখুঁত Energy Converter।",
    type: "website",
    locale: "bn_BD",
    siteName: "Totthobox",
    url: "https://totthobox.com/converter/energy",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox" }],
  },
  twitter: { card: "summary_large_image", title: "অনলাইন এনার্জি রূপান্তরকারী - Joule, Calorie, kWh | Totthobox", description: "সহজেই Joule, Calorie, Kilocalorie এবং kWh কনভার্ট করুন। Totthobox-এর নিখুঁত Energy Converter।", images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }] },
};

export default function EnergyConverterPage() {
  return (
    <div className="mx-auto max-w-2xl p-4">
      <EnergyConverter />
    </div>
  );
}