import type { Metadata } from "next";
import QRGenerator from "@/components/tools/QRGenerator";
import ToolStructuredData from "@/components/seo/ToolStructuredData";

export const metadata: Metadata = {
  title:
    "QR কোড জেনারেটর — ফ্রি অ্যাডভান্সড অনলাইন QR Code Generator | তথ্যবক্স",
  description:
    "সবচেয়ে ফিচার-সমৃদ্ধ ফ্রি QR কোড জেনারেটর। টেক্সট, লিংক, ওয়াইফাই, ইমেইল, ফোন, SMS, ভিকার্ড থেকে তাৎক্ষণিক QR বানান। রঙ, গ্রেডিয়েন্ট, ডট স্টাইল, লোগো, সাইজ কাস্টমাইজ + PNG/SVG/JPEG ডাউনলোড। রেজিস্ট্রেশন লাগবে না।",
  alternates: {
    canonical: "https://totthobox.com/tools/qrcode-generator",
  },
  openGraph: {
    title:
      "QR কোড জেনারেটর — ফ্রি অ্যাডভান্সড অনলাইন QR Code Generator | তথ্যবক্স",
    description:
      "টেক্সট, লিংক, ওয়াইফাই, SMS, ভিকার্ড থেকে তাৎক্ষণিক প্রফেশনাল QR কোড তৈরি করুন। রঙ, লোগো, স্টাইল কাস্টমাইজ + PNG/SVG/JPEG ডাউনলোড।",
    type: "website",
    locale: "bn_BD",
    siteName: "Totthobox",
    url: "https://totthobox.com/tools/qrcode-generator",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox" }],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "QR কোড জেনারেটর — ফ্রি অ্যাডভান্সড অনলাইন QR Code Generator | তথ্যবক্স",
    description:
      "টেক্সট, লিংক, ওয়াইফাই, SMS, ভিকার্ড থেকে তাৎক্ষণিক প্রফেশনাল QR কোড তৈরি করুন।",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }],
  },
};

export default function QRGeneratorPage() {
  return (
    <>
      <ToolStructuredData
        name="প্রফেশনাল QR কোড জেনারেটর"
        description="টেক্সট, ইউআরএল, ওয়াইফাই, ভিকার্ড ও ফোন নম্বরের কাস্টমাইজড কিউআর কোড জেনারেটর।"
        url="https://totthobox.com/tools/qrcode-generator"
        applicationCategory="DesignApplication"
        featureList={[
          "টেক্সট, ইউআরএল, ওয়াইফাই নেটওয়ার্ক, ইমেইল ও ভিকার্ড সাপোর্ট",
          "ডট স্টাইল, কর্নার ও ফ্রেম কাস্টমাইজেশন",
          "হাই-রেজোলিউশন PNG, SVG ও JPEG ফরম্যাটে ডাউনলোড",
          "লোগো আপলোড ও ব্রান্ডিং সুবিধা",
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        <QRGenerator />
      </div>
    </>
  );
}
