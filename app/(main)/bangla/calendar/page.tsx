import type { Metadata } from "next";
import AdvancedBanglaCalendar from "./AdvancedBanglaCalendar";

export const metadata: Metadata = {
  title: "উন্নত বাংলা ক্যালেণ্ডার ও তারিখ রূপান্তরকারী | Bangla Calendar Today",
  description:
    "আজকের সঠিক বাংলা তারিখ, বঙ্গাব্দ সাল, ঋতু, হিজরী তারিখ ও ইংরেজি তারিখের হিসাব দেখুন। সহজে ইংরেজি তারিখ থেকে বাংলা তারিখে রূপান্তরের অনলাইন টুল।",
  keywords: [
    "bangla calendar",
    "advanced bangla calendar",
    "বাংলা ক্যালেণ্ডার",
    "আজকের বাংলা তারিখ",
    "bangla date today",
    "bangla to english date converter",
    "ইংরেজি থেকে বাংলা তারিখ",
    "বঙ্গাব্দ ক্যালেন্ডার",
    "bangla calendar with hijri",
  ],
  openGraph: {
    title: "উন্নত বাংলা ক্যালেণ্ডার ও তারিখ রূপান্তরকারী | Bangla Calendar Today",
    description: "আজকের বাংলা তারিখ, বঙ্গাব্দ, ঋতু এবং ইংরেজি থেকে বাংলা তারিখ রূপান্তরের ফ্রি টুল।",
    type: "website",
  },
};

export default function Page() {
  return <AdvancedBanglaCalendar />;
}