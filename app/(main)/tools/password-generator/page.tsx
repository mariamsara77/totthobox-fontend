import type { Metadata } from "next";
import PasswordGeneratorClient from "./PasswordGeneratorClient";
import ToolStructuredData from "@/components/seo/ToolStructuredData";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "নিরাপদ পাসওয়ার্ড ও হ্যাশ জেনারেটর | Strong Password & Hash Generator",
  description:
    "ওয়েব ক্রিপ্টো এপিআই দিয়ে তৈরি করুন হ্যাক-প্রুফ শক্তিশালী র্যান্ডম পাসওয়ার্ড, মেমোর্যাবল পাসফ্রেজ ও তাৎক্ষণিক SHA-256 হ্যাশ। সম্পূর্ণ বিনামূল্যে ও ক্লায়েন্ট-সাইড সুরক্ষিত।",
  keywords: [
    "password generator",
    "পাসওয়ার্ড জেনারেটর",
    "strong password generator",
    "random password",
    "sha256 generator",
    "পাসফ্রেজ জেনারেটর",
    "password security bd",
  ],
  alternates: { canonical: "https://totthobox.com/tools/password-generator" },
  openGraph: {
    title: "নিরাপদ পাসওয়ার্ড ও হ্যাশ জেনারেটর | Totthobox",
    description: "ক্লায়েন্ট সাইড সুরক্ষিত ক্রিপ্টোগ্রাফিক পাসওয়ার্ড ও SHA-256 হ্যাশ জেনারেটর।",
    type: "website",
    url: "https://totthobox.com/tools/password-generator",
    siteName: "Totthobox",
    locale: "bn_BD",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox Password Generator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "নিরাপদ পাসওয়ার্ড ও হ্যাশ জেনারেটর | Totthobox",
    description: "হ্যাক-প্রুফ পাসওয়ার্ড ও হ্যাশ জেনারেটর টুল।",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }],
  },
};

export default function PasswordGeneratorPage() {
  return (
    <>
      <ToolStructuredData
        name="নিরাপদ পাসওয়ার্ড ও হ্যাশ জেনারেটর"
        description="ক্রিপ্টোগ্রাফিক সুরক্ষা ও এনট্রপি ভিত্তিক শক্তিশালী পাসওয়ার্ড, মেমোর্যাবল পাসফ্রেজ ও SHA-256 হ্যাশ তৈরি করুন।"
        url="https://totthobox.com/tools/password-generator"
        applicationCategory="DeveloperApplication"
        featureList={[
          "ওয়েব ক্রিপ্টো র্যান্ডম পাসওয়ার্ড তৈরি",
          "পাসওয়ার্ড শক্তি ও ক্র্যাক সময় পরিমাপ",
          "মেমোর্যাবল পাসফ্রেজ মোড",
          "তাৎক্ষণিক SHA-256 হ্যাশ জেনারেশন",
        ]}
      />
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
        <PasswordGeneratorClient />
      </div>
    </>
  );
}
