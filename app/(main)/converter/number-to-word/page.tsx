import type { Metadata } from "next";
import NumberToWordConverter from "./NumberToWordConverter";
import ToolGuide from "@/components/ToolGuide";
import { numberToWordConverterGuide } from "@/lib/content/converters/number-to-word";

export const revalidate = 86400;

export const metadata: Metadata = {
  alternates: { canonical: "https://totthobox.com/converter/number-to-word" },
  title: "সংখ্যা থেকে কথায় রূপান্তরকারী | Number to Word Converter Bangla | Totthobox",
  description:
    "যেকোনো সংখ্যাকে সহজে বাংলা ও ইংরেজি শব্দে রূপান্তর করুন। ব্যাংক চেক, দলিল ও চালানের জন্য টাকা-পয়সা, ইউনিকোড বাংলা ও আদর্শলিপি (ANSI) ফরম্যাট সমর্থিত।",
  openGraph: {
    title: "সংখ্যা থেকে কথায় রূপান্তরকারী | Bangla Number to Word | Totthobox",
    description: "সহজে টাকা-পয়সা, ইউনিকোড বাংলা ও আদর্শলিপিতে সংখ্যা রূপান্তর করুন। ব্যাংক চেক ও দলিলের কথায় লেখার গাইড।",
    type: "website",
    url: "https://totthobox.com/converter/number-to-word",
    siteName: "Totthobox",
    locale: "bn_BD",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "সংখ্যা থেকে কথায় রূপান্তরকারী | Bangla Number to Word | Totthobox",
    description: "সহজে টাকা-পয়সা, ইউনিকোড বাংলা ও আদর্শলিপিতে সংখ্যা রূপান্তর করুন।",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }],
  },
};

export default function Page() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-12">
      <NumberToWordConverter />
      <ToolGuide guide={numberToWordConverterGuide} />
    </div>
  );
}
