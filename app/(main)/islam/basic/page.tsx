import type { Metadata } from "next";
import BasicIslamClient from "./basicislamClient";

export const metadata: Metadata = {
  title: "ইসলামের মৌলিক জ্ঞান | ঈমান, নামাজ, যাকাত, হজ, রোজা",
  description:
    "ইসলামের মূল ভিত্তি, আরকান এবং মৌলিক জ্ঞান সম্পর্কে সঠিক ও যাচাইকৃত তথ্য। ঈমান, নামাজ, যাকাত, রোজা ও হজসহ দ্বীনের সঠিক ধারণা এক জায়গায়।",
  alternates: {
    canonical: "https://totthobox.com/islam/basic",
  },
  openGraph: {
    title: "ইসলামের মৌলিক জ্ঞান | ঈমান, নামাজ, যাকাত, হজ, রোজা",
    description:
      "ইসলামের মূল ভিত্তি, আরকান এবং মৌলিক জ্ঞান সম্পর্কে সঠিক ও যাচাইকৃত তথ্য।",
    url: "https://totthobox.com/islam/basic",
    siteName: "Totthobox",
    type: "website",
    locale: "bn_BD",
  
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ইসলামের মৌলিক জ্ঞান",
    description: "ঈমান, নামাজ, যাকাত, রোজা ও হজসহ দ্বীনের সঠিক ধারণা",
  
    images: ["https://totthobox.com/og-image.png"],
  },
};

export default function BasicIslamPage() {
  return <BasicIslamClient />;
}
