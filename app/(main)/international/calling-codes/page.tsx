import type { Metadata } from "next";
import CallingCodesClient from "./CallingCodesClient";
import ToolStructuredData from "@/components/seo/ToolStructuredData";

export const metadata: Metadata = {
  title: "আন্তর্জাতিক ডায়ালিং কোড ডিরেক্টরি | International Calling Codes",
  description:
    "বিশ্বের সকল দেশের আন্তর্জাতিক ডায়ালিং কান্ট্রি কোড, রাজধানী, জরুরি হেল্পলাইন এবং আন্তর্জাতিক ফোন নম্বর ফরম্যাট করুন সহজে।",
  keywords: [
    "country calling codes",
    "international dialing codes",
    "আন্তর্জাতিক ডায়ালিং কোড",
    "কান্ট্রি কোড তালিকা",
    "bd country code",
    "phone code finder",
  ],
  alternates: { canonical: "https://totthobox.com/international/calling-codes" },
  openGraph: {
    title: "আন্তর্জাতিক ডায়ালিং কোড ডিরেক্টরি | Totthobox",
    description: "বিশ্বের সকল দেশের ফোন কলিং কোড, রাজধানী ও জরুরি নম্বর ডিরেক্টরি।",
    type: "website",
    url: "https://totthobox.com/international/calling-codes",
    siteName: "Totthobox",
    locale: "bn_BD",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox Calling Codes" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "আন্তর্জাতিক ডায়ালিং কোড ডিরেক্টরি | Totthobox",
    description: "বিশ্বের সকল দেশের ফোন কলিং কোড এবং আন্তর্জাতিক নম্বর ফরম্যাটার।",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }],
  },
};

export default function CallingCodesPage() {
  return (
    <>
      <ToolStructuredData
        name="আন্তর্জাতিক ডায়ালিং কোড ডিরেক্টরি"
        description="বিশ্বের সকল দেশের ফোন কলিং কোড, রাজধানী, জরুরি হেল্পলাইন ও আন্তর্জাতিক নম্বর ফরম্যাট এক নজরে খুঁজুন।"
        url="https://totthobox.com/international/calling-codes"
        applicationCategory="UtilityApplication"
        featureList={[
          "বিশ্বের প্রধান ৩০+ ও সকল আন্তর্জাতিক ডায়ালিং কোড",
          "আন্তর্জাতিক নম্বর ফরম্যাট টেস্টার ও সরাসরি কল সুবিধা",
          "জরুরি পুলিশ/ফায়ার হেল্পলাইন নম্বর",
          "এক ক্লিকে ডায়ালিং কোড কপি করার সুবিধা",
        ]}
      />
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
        <CallingCodesClient />
      </div>
    </>
  );
}
