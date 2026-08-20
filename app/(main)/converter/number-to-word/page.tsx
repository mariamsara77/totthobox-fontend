import type { Metadata } from "next";
import NumberToWordConverter from "./NumberToWordConverter";

export const metadata: Metadata = {
  title: "সংখ্যা থেকে শব্দ রূপান্তরকারী | Number to Word Converter Bangla",
  description:
    "যেকোনো সংখ্যাকে সহজে বাংলা ও ইংরেজি শব্দে রূপান্তর করুন। টাকা-পয়সা, ইউনিকোড বাংলা ও আদর্শলিপি (ANSI) ফরম্যাট সমর্থিত।",
  keywords: [
    "number to word bangla",
    "সংখ্যা থেকে শব্দ",
    "bangla number converter",
    "taka paisa converter",
    "number to bangla text",
    "adorsholipi converter",
  ],
  openGraph: {
    title: "সংখ্যা থেকে শব্দ রূপান্তরকারী | Bangla Number to Word",
    description: "সহজে টাকা-পয়সা, ইউনিকোড বাংলা ও আদর্শলিপিতে সংখ্যা রূপান্তর করুন।",
    type: "website",
  },
};

export default function Page() {
  return <NumberToWordConverter />;
}