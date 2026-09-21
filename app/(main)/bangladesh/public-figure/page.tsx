import type { Metadata } from "next";
import PeopleClient from "./PeopleClient";

export const metadata: Metadata = {
  title: "প্রোফাইল আর্কাইভ: বিশিষ্ট ব্যক্তিবর্গের জীবনী ও কর্মজীবন | তথ্যবক্স",
  description:
    "বাংলাদেশের গুরুত্বপূর্ণ ব্যক্তিবর্গ, রাজনীতিবিদ, পেশাজীবী ও বিখ্যাত ব্যক্তিদের জীবনবৃত্তান্ত, বর্তমান পদবী এবং কর্মজীবনের বিস্তারিত ইতিহাস।",
  keywords: [
    "ব্যক্তিত্ব আর্কাইভ",
    "জীবনী",
    "বাংলাদেশের বিখ্যাত ব্যক্তি",
    "প্রোফাইল লিস্ট",
    "রাজনীতিবিদ",
    "পেশাজীবী",
    "তথ্যবক্স",
  ],
  alternates: {
    canonical: "https://totthobox.com/bangladesh/public-figure",
  },
  openGraph: {
    title:
      "প্রোফাইল আর্কাইভ: বিশিষ্ট ব্যক্তিবর্গের জীবনী ও কর্মজীবন | তথ্যবক্স",
    description:
      "বাংলাদেশের গুরুত্বপূর্ণ ব্যক্তিবর্গ, রাজনীতিবিদ এবং পেশাজীবীদের জীবনবৃত্তান্ত ও কর্মজীবনের বিস্তারিত ইতিহাস।",
    url: "https://totthobox.com/bangladesh/public-figure",
    siteName: "Totthobox",
    type: "website",
    locale: "bn_BD",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "প্রোফাইল আর্কাইভ: বিশিষ্ট ব্যক্তিবর্গের জীবনী ও কর্মজীবন | তথ্যবক্স",
    description:
      "বাংলাদেশের গুরুত্বপূর্ণ ব্যক্তিবর্গ, রাজনীতিবিদ এবং পেশাজীবীদের জীবনবৃত্তান্ত ও কর্মজীবনের বিস্তারিত ইতিহাস।",
  },
};

export default function PublicFigurePage() {
  return <PeopleClient />;
}
