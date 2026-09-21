import type { Metadata } from "next";
import TourismClient from "./TourismClient";

export const metadata: Metadata = {
  title: "বাংলাদেশের সকল পর্যটন কেন্দ্র ও ভ্রমণ গাইড | তথ্যবক্স",
  description:
    "বাংলাদেশের ৬৪ জেলার সেরা পর্যটন কেন্দ্র, ঐতিহাসিক স্থান, প্রাকৃতিক সৌন্দর্য ও ভ্রমণ গাইড। জেলা ও ধরন অনুসারে খুঁজুন।",
  alternates: {
    canonical: "https://totthobox.com/bangladesh/tourism",
  },
  openGraph: {
    title: "বাংলাদেশের সকল পর্যটন কেন্দ্র ও ভ্রমণ গাইড | তথ্যবক্স",
    description:
      "বাংলাদেশের ৬৪ জেলার সেরা পর্যটন কেন্দ্র, ঐতিহাসিক স্থান ও প্রাকৃতিক সৌন্দর্যের বিস্তারিত ভ্রমণ গাইড।",
    url: "https://totthobox.com/bangladesh/tourism",
    siteName: "Totthobox",
    type: "website",
    locale: "bn_BD",
  },
  twitter: {
    card: "summary_large_image",
    title: "বাংলাদেশের সকল পর্যটন কেন্দ্র ও ভ্রমণ গাইড | তথ্যবক্স",
    description:
      "বাংলাদেশের ৬৪ জেলার সেরা পর্যটন কেন্দ্র, ঐতিহাসিক স্থান ও প্রাকৃতিক সৌন্দর্যের বিস্তারিত ভ্রমণ গাইড।",
  },
};

export default function TourismPage() {
  return <TourismClient />;
}
