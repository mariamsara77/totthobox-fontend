import type { Metadata } from "next";
import SpeedTestClient from "./SpeedTestClient";
import ToolStructuredData from "@/components/seo/ToolStructuredData";

export const metadata: Metadata = {
  title: "ইন্টারনেট স্পিড টেস্ট ও পিং চেকার | Live Internet Speed Test",
  description:
    "আপনার ব্রডব্যান্ড ওয়াইফাই বা মোবাইল ইন্টারনেটের সঠিক ডাউনলোড গতি, পিং (Ping) এবং জিটার (Jitter) রিয়েল-টাইমে পরিমাপ করুন সম্পূর্ণ বিনামূল্যে।",
  keywords: [
    "speed test",
    "internet speed test",
    "স্পিড টেস্ট",
    "ইন্টারনেট গতি পরীক্ষা",
    "wifi speed test bd",
    "ping checker",
    "ব্রডব্যান্ড স্পিড টেস্ট",
  ],
  alternates: { canonical: "https://totthobox.com/tools/internet-speed-test" },
  openGraph: {
    title: "লাইভ ইন্টারনেট স্পিড ও পিং টেস্ট | Totthobox",
    description: "ব্রডব্যান্ড ও মোবাইল ইন্টারনেটের ডাউনলোড স্পিড ও ল্যাটেন্সি পরিমাপ করুন তাৎক্ষণিকভাবে।",
    type: "website",
    url: "https://totthobox.com/tools/internet-speed-test",
    siteName: "Totthobox",
    locale: "bn_BD",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox Speed Test" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "লাইভ ইন্টারনেট স্পিড ও পিং টেস্ট | Totthobox",
    description: "ব্রডব্যান্ড ও মোবাইল ইন্টারনেটের স্পিড টেস্ট টুল।",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }],
  },
};

export default function InternetSpeedTestPage() {
  return (
    <>
      <ToolStructuredData
        name="লাইভ ইন্টারনেট স্পিড ও পিং টেস্ট"
        description="আপনার ব্রডব্যান্ড ওয়াইফাই বা মোবাইল ইন্টারনেটের ডাউনলোড স্পিড, পিং এবং জিটার রিয়েল-টাইমে পরিমাপ করুন।"
        url="https://totthobox.com/tools/internet-speed-test"
        applicationCategory="UtilityApplication"
        featureList={[
          "তাৎক্ষণিক ডাউনলোড স্পিড টেস্ট (Mbps)",
          "পিং ও জিটার ল্যাটেন্সি পরিমাপ (ms)",
          "অ্যানিমেটেড স্পিডোমিটার গেজ",
          "পূর্ববর্তী টেস্ট হিস্টোরি সংরক্ষণ",
        ]}
      />
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
        <SpeedTestClient />
      </div>
    </>
  );
}
