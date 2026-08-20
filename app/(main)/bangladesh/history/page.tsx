import { Metadata } from "next";
import HistoryClient from "./HistoryClient";

export const metadata: Metadata = {
  title:
    "বাংলাদেশের ইতিহাস - প্রাচীনকাল থেকে বর্তমান | তথ্যবক্স",
  description:
    "প্রাচীনকাল, মধ্যযুগ ও মুক্তিযুদ্ধের গৌরবময় ইতিহাসসহ বাংলাদেশের ৬৪ জেলার ঐতিহাসিক স্থান ও প্রত্নতাত্ত্বিক নিদর্শনের বিবরণ।",
  keywords:
    "বাংলাদেশের ইতিহাস, প্রাচীন বাংলা, ঐতিহাসিক স্থান, প্রাচীন নিদর্শন, তথ্যবক্স",
  alternates: {
    canonical: "https://totthobox.com/bangladesh/history",
  },
};

export default function HistoryPage() {
  return <HistoryClient />;
}