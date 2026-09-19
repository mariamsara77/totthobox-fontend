import { Metadata } from "next";
import QRGenerator from "@/components/tools/QRGenerator";

export const metadata: Metadata = {
  title:
    "QR কোড জেনারেটর — ফ্রি অ্যাডভান্সড অনলাইন QR Code Generator | তথ্যবক্স",
  description:
    "সবচেয়ে ফিচার-সমৃদ্ধ ফ্রি QR কোড জেনারেটর। টেক্সট, লিংক, ওয়াইফাই, ইমেইল, ফোন, SMS, ভিকার্ড থেকে তাৎক্ষণিক QR বানান। রঙ, গ্রেডিয়েন্ট, ডট স্টাইল, লোগো, সাইজ কাস্টমাইজ + PNG/SVG/JPEG ডাউনলোড। রেজিস্ট্রেশন লাগবে না।",
  keywords: [
    "qr code generator",
    "QR কোড জেনারেটর",
    "free qr maker",
    "qr code online",
    "wifi qr code",
    "vcard qr code",
    "logo qr code",
    "qr code download",
    "বাংলা QR জেনারেটর",
    "তথ্যবক্স",
  ],
  alternates: {
    canonical: "https://totthobox.com/tools/qr-generator",
  },
  openGraph: {
    title:
      "QR কোড জেনারেটর — ফ্রি অ্যাডভান্সড অনলাইন QR Code Generator | তথ্যবক্স",
    description:
      "টেক্সট, লিংক, ওয়াইফাই, SMS, ভিকার্ড থেকে তাৎক্ষণিক প্রফেশনাল QR কোড তৈরি করুন। রঙ, লোগো, স্টাইল কাস্টমাইজ + PNG/SVG/JPEG ডাউনলোড।",
    type: "website",
    locale: "bn_BD",
    siteName: "Totthobox",
    url: "https://totthobox.com/tools/qr-generator",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "QR কোড জেনারেটর — ফ্রি অ্যাডভান্সড অনলাইন QR Code Generator | তথ্যবক্স",
    description:
      "টেক্সট, লিংক, ওয়াইফাই, SMS, ভিকার্ড থেকে তাৎক্ষণিক প্রফেশনাল QR কোড তৈরি করুন।",
  },
};

export default function QRGeneratorPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
      <QRGenerator />
    </div>
  );
}
