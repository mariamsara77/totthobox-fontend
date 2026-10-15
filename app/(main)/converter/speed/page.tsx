import type { Metadata } from "next";
import VelocityConverter from "@/components/converter/VelocityConverter";

export const metadata: Metadata = {
  alternates: { canonical: "https://totthobox.com/converter/speed" },
  title: "অনলাইন গতিবেগ রূপান্তরকারী - m/s, km/h, mph, Knots",
  description:
    "সহজেই m/s, km/h, mph এবং Knots কনভার্ট করুন। Totthobox-এর নিখুঁত Velocity Converter।",
  openGraph: {
    title: "অনলাইন গতিবেগ রূপান্তরকারী - m/s, km/h, mph, Knots | Totthobox",
    description:
      "সহজেই m/s, km/h, mph এবং Knots কনভার্ট করুন। Totthobox-এর নিখুঁত Velocity Converter।",
    type: "website",
    locale: "bn_BD",
    siteName: "Totthobox",
    url: "https://totthobox.com/converter/speed",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox" }],
  },
  twitter: { card: "summary_large_image", title: "অনলাইন গতিবেগ রূপান্তরকারী - m/s, km/h, mph, Knots | Totthobox", description: "সহজেই m/s, km/h, mph এবং Knots কনভার্ট করুন। Totthobox-এর নিখুঁত Velocity Converter।", images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }] },
};

export default function VelocityConverterPage() {
  return (
    <div className="mx-auto max-w-2xl p-4">
      <VelocityConverter />
    </div>
  );
}