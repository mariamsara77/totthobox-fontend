import { Metadata } from "next";
import IntroductionClient from "./IntroductionClient";

export const metadata: Metadata = {
  title: "বাংলাদেশের পরিচিতি | বিভাগ, জেলা ও সাধারণ তথ্য | তথ্যবক্স",
  description:
    "বাংলাদেশের সকল বিভাগ, জেলা, ভৌগোলিক অবস্থান, ইতিহাস, সংস্কৃতি ও গুরুত্বপূর্ণ তথ্যসহ সম্পূর্ণ পরিচিতি। সহজে সার্চ ও ক্যাটাগরি অনুসারে খুঁজুন।",
  keywords: [
    "বাংলাদেশের পরিচিতি",
    "বাংলাদেশ তথ্য",
    "বিভাগ",
    "জেলা",
    "বাংলাদেশ পরিচিতি",
    "বাংলাদেশ ভূগোল",
    "তথ্যবক্স",
  ],
  alternates: {
    canonical: "https://totthobox.com/bangladesh/introduction",
  },
  openGraph: {
    title: "বাংলাদেশের পরিচিতি | বিভাগ, জেলা ও সাধারণ তথ্য | তথ্যবক্স",
    description:
      "বাংলাদেশের সকল বিভাগ, জেলা ও সাধারণ তথ্যসহ সম্পূর্ণ পরিচিতি পড়ুন।",
    url: "https://totthobox.com/bangladesh/introduction",
    siteName: "Totthobox",
    type: "website",
    locale: "bn_BD",
  },
  twitter: {
    card: "summary_large_image",
    title: "বাংলাদেশের পরিচিতি | বিভাগ, জেলা ও সাধারণ তথ্য | তথ্যবক্স",
    description:
      "বাংলাদেশের সকল বিভাগ, জেলা ও সাধারণ তথ্যসহ সম্পূর্ণ পরিচিতি পড়ুন।",
  },
};

export default function IntroductionPage() {
  return <IntroductionClient />;
}
