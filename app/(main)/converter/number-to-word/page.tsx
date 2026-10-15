import type { Metadata } from "next";
import NumberToWordConverter from "./NumberToWordConverter";

export const metadata: Metadata = {
  alternates: { canonical: "https://totthobox.com/converter/number-to-word" },
  title: "সংখ্যা থেকে শব্দ রূপান্তরকারী | Number to Word Converter Bangla",
  description:
    "যেকোনো সংখ্যাকে সহজে বাংলা ও ইংরেজি শব্দে রূপান্তর করুন। টাকা-পয়সা, ইউনিকোড বাংলা ও আদর্শলিপি (ANSI) ফরম্যাট সমর্থিত।",
  openGraph: {
    title: "সংখ্যা থেকে শব্দ রূপান্তরকারী | Bangla Number to Word",
    description: "সহজে টাকা-পয়সা, ইউনিকোড বাংলা ও আদর্শলিপিতে সংখ্যা রূপান্তর করুন।",
    type: "website",
    url: "https://totthobox.com/converter/number-to-word",
    siteName: "Totthobox",
    locale: "bn_BD",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox" }],
  },
  twitter: { card: "summary_large_image", title: "সংখ্যা থেকে শব্দ রূপান্তরকারী | Bangla Number to Word", description: "সহজে টাকা-পয়সা, ইউনিকোড বাংলা ও আদর্শলিপিতে সংখ্যা রূপান্তর করুন।", images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }] },
};

export default function Page() {
  return <NumberToWordConverter />;
}