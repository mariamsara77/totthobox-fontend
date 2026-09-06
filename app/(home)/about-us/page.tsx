import type { Metadata } from "next";
import AboutUsClient from "./AboutUs"; // নিচের client component

export const metadata: Metadata = {
  title: "আমাদের সম্পর্কে (About Us) | Totthobox",
  description:
    "Totthobox (তথ্যবক্স) - আপনার প্রয়োজনীয় সকল তথ্য ও ডিজিটাল সেবা এক জায়গায়। আমাদের লক্ষ্য, ভিশন এবং সেবাসমূহ সম্পর্কে বিস্তারিত জানুন।",
  keywords: [
    "about us",
    "আমাদের সম্পর্কে",
    "Totthobox about",
    "তথ্যবক্স",
    "ডিজিটাল সেবা",
    "বিশ্বকোষ",
  ],
  openGraph: {
    title: "আমাদের সম্পর্কে | Totthobox",
    description:
      "Totthobox (তথ্যবক্স) - আপনার প্রয়োজনীয় সকল তথ্য ও ডিজিটাল সেবা এক জায়গায়।",
    type: "website",
  },
};

export default function AboutPage() {
  return <AboutUsClient />;
}
