import { Metadata } from "next";
import IntroductionClient from "./IntroductionClient";

export const metadata: Metadata = {
  title: "বাংলাদেশের পরিচিতি | তথ্যবক্স",
  description:
    "বাংলাদেশের বিভিন্ন বিভাগ, জেলা ও সাধারণ তথ্যসহ সম্পূর্ণ পরিচিতি পড়ুন। ছবি, বিবরণ এবং যাচাইকৃত তথ্য।",
  keywords:
    "বাংলাদেশের পরিচিতি, বাংলাদেশ তথ্য, বিভাগ, জেলা, বাংলাদেশ পরিচিতি, তথ্যবক্স",
  openGraph: {
    title: "বাংলাদেশের পরিচিতি | তথ্যবক্স",
    description:
      "বাংলাদেশের বিভিন্ন বিভাগ, জেলা ও সাধারণ তথ্যসহ সম্পূর্ণ পরিচিতি পড়ুন।",
    type: "website",
    locale: "bn_BD",
    siteName: "Totthobox",
  },
  alternates: {
    canonical: "https://totthobox.com/bangladesh/introduction",
  },
};

export default function IntroductionPage() {
  return <IntroductionClient />;
}