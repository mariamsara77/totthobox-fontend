import type { Metadata } from "next";
import DowaClient from "./dowaClient";

export const metadata: Metadata = {
  title: "দৈনন্দিন জীবনের প্রয়োজনীয় দোয়া ও আমল সংগ্রহ",
  description:
    "দৈনন্দিন জীবনের প্রয়োজনীয় ও নিত্যদিনের গুরুত্বপূর্ণ দোয়া, জিকির ও আমলসমূহের সম্পূর্ণ বাংলা তালিকা।",
  keywords: [
    "dowa bangla",
    "islamic dowa list",
    "প্রয়োজনীয় দোয়া",
    "প্রতিদিনের আমল",
    "দোয়া সংগ্রহ",
    "ঘুমানোর দোয়া",
    "খাবারের দোয়া",
    "সফরের দোয়া",
  ],
  openGraph: {
    title: "দোয়া সংগ্রহ | দৈনন্দিন জীবনের প্রয়োজনীয় দোয়া ও আমল",
    description:
      "ঘুমানো, খাওয়া, সফর, বিপদ-আপদসহ বিভিন্ন পরিস্থিতির জন্য গুরুত্বপূর্ণ দোয়া এক জায়গায়।",
    type: "website",
    locale: "bn_BD",
  },
  twitter: {
    card: "summary_large_image",
    title: "দোয়া সংগ্রহ",
    description: "দৈনন্দিন জীবনের প্রয়োজনীয় দোয়া ও আমল",
  },
  alternates: {
    canonical: "/islam/dowan",
  },
};

export default function DowaPage() {
  return <DowaClient />;
}