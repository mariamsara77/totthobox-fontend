import type { Metadata } from "next";
import HistoryClient from "./HistoryClient";

export const metadata: Metadata = {
  title: "বাংলাদেশের ইতিহাস - প্রাচীনকাল থেকে বর্তমান | তথ্যবক্স",
  description:
    "প্রাচীনকাল, মধ্যযুগ ও মুক্তিযুদ্ধের গৌরবময় ইতিহাসসহ বাংলাদেশের ৬৪ জেলার ঐতিহাসিক স্থান, প্রত্নতাত্ত্বিক নিদর্শন ও ঐতিহ্যের সম্পূর্ণ বিবরণ।",
  alternates: {
    canonical: "https://totthobox.com/bangladesh/history",
  },
  openGraph: {
    title: "বাংলাদেশের ইতিহাস - প্রাচীনকাল থেকে বর্তমান | তথ্যবক্স",
    description:
      "প্রাচীনকাল, মধ্যযুগ ও মুক্তিযুদ্ধের গৌরবময় ইতিহাসসহ বাংলাদেশের ৬৪ জেলার ঐতিহাসিক স্থান ও প্রত্নতাত্ত্বিক নিদর্শনের বিবরণ।",
    url: "https://totthobox.com/bangladesh/history",
    siteName: "Totthobox",
    type: "website",
    locale: "bn_BD",
    images: [{ url: "https://totthobox.com/og-image.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "বাংলাদেশের ইতিহাস - প্রাচীনকাল থেকে বর্তমান | তথ্যবক্স",
    description:
      "প্রাচীনকাল, মধ্যযুগ ও মুক্তিযুদ্ধের গৌরবময় ইতিহাসসহ বাংলাদেশের ৬৪ জেলার ঐতিহাসিক স্থান ও প্রত্নতাত্ত্বিক নিদর্শনের বিবরণ।",
  },
};

export default function HistoryPage() {
  return <HistoryClient />;
}
