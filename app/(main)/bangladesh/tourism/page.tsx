import { Metadata } from "next";
import TourismClient from "./TourismClient";

export const metadata: Metadata = {
  title: "বাংলাদেশের সকল পর্যটন কেন্দ্র ও ভ্রমণ গাইড | তথ্যবক্স",
  description:
    "বাংলাদেশের ৬৪ জেলার সেরা পর্যটন কেন্দ্র, ঐতিহাসিক স্থান ও প্রাকৃতিক সৌন্দর্যের বিস্তারিত ভ্রমণ গাইড।",
  keywords: "বাংলাদেশ পর্যটন, ভ্রমণ গাইড, দর্শনীয় স্থান, পর্যটন কেন্দ্র, তথ্যবক্স",
  alternates: {
    canonical: "https://totthobox.com/bangladesh/tourism",
  },
};

export default function TourismPage() {
  return <TourismClient />;
}