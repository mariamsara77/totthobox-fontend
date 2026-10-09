import type { Metadata } from "next";
import DowaClient from "./dowaClient";

export const metadata: Metadata = {
  title: "দোয়া সংগ্রহ | দৈনন্দিন জীবনের প্রয়োজনীয় দোয়া ও আমল | তথ্যবক্স",
  description:
    "দৈনন্দিন জীবনের প্রয়োজনীয় ও নিত্যদিনের গুরুত্বপূর্ণ দোয়া, জিকির ও আমলসমূহের সম্পূর্ণ বাংলা তালিকা। ঘুমানো, খাওয়া, সফরসহ বিভিন্ন পরিস্থিতির দোয়া।",
  alternates: {
    canonical: "https://totthobox.com/islam/dowan",
  },
  openGraph: {
    title: "দোয়া সংগ্রহ | দৈনন্দিন জীবনের প্রয়োজনীয় দোয়া ও আমল",
    description:
      "ঘুমানো, খাওয়া, সফর, বিপদ-আপদসহ বিভিন্ন পরিস্থিতির জন্য গুরুত্বপূর্ণ দোয়া এক জায়গায়।",
    url: "https://totthobox.com/islam/dowan",
    siteName: "Totthobox",
    type: "website",
    locale: "bn_BD",
  },
  twitter: {
    card: "summary_large_image",
    title: "দোয়া সংগ্রহ | তথ্যবক্স",
    description: "দৈনন্দিন জীবনের প্রয়োজনীয় দোয়া ও আমল",
  },
};

export default function DowaPage() {
  return <DowaClient />;
}
