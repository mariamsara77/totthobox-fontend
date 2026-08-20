import type { Metadata } from "next";
import BasicIslamClient from "./basicislamClient";

export const metadata: Metadata = {
  title: "ইসলামের মৌলিক জ্ঞান | ঈমান, নামাজ, যাকাত, হজ, রোজা",
  description:
    "ইসলামের মূল ভিত্তি, আরকান এবং মৌলিক জ্ঞান সম্পর্কে সঠিক ও যাচাইকৃত তথ্য। ঈমান, নামাজ, যাকাত, রোজা ও হজসহ দ্বীনের সঠিক ধারণা এক জায়গায়।",
  keywords: [
    "ইসলামিক জ্ঞান",
    "ইসলামের মূলভিত্তি",
    "ঈমান",
    "নামাজ",
    "যাকাত",
    "হজ",
    "রোজা",
    "তথ্যবক্স ইসলাম",
    "ইসলামের মৌলিক জ্ঞান",
    "দ্বীনের মৌলিক ধারণা",
    "পাঁচ স্তম্ভ",
    "আরকান ইসলাম",
  ],
  openGraph: {
    title: "ইসলামের মৌলিক জ্ঞান | ঈমান, নামাজ, যাকাত, হজ, রোজা",
    description:
      "ইসলামের মূল ভিত্তি, আরকান এবং মৌলিক জ্ঞান সম্পর্কে সঠিক ও যাচাইকৃত তথ্য।",
    type: "website",
    locale: "bn_BD",
  },
  twitter: {
    card: "summary_large_image",
    title: "ইসলামের মৌলিক জ্ঞান",
    description: "ঈমান, নামাজ, যাকাত, রোজা ও হজসহ দ্বীনের সঠিক ধারণা",
  },
  alternates: {
    canonical: "/islam/basic",
  },
};

export default function BasicIslamPage() {
  return <BasicIslamClient />;
}