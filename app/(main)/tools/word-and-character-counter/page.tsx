import type { Metadata } from "next";
import WordCounter from "@/components/tools/WordCounter";

export const metadata: Metadata = {
  title:
    "ওয়ার্ড অ্যান্ড ক্যারেক্টার কাউন্টার - শব্দ, অক্ষর ও লাইন হিসাব",
  description:
    "অনলাইনে তাৎক্ষণিকভাবে শব্দ, অক্ষর (স্পেসসহ/ছাড়া), বাক্য, প্যারাগ্রাফ, লাইন এবং পড়ার সময় হিসাব করুন। বাংলা ও ইংরেজি দুই ভাষাতেই নিখুঁত কাজ করে। Uppercase, Lowercase, Title Case টুলসহ।",
  alternates: {
    canonical: "https://totthobox.com/tools/word-counter",
  },
  openGraph: {
    title:
      "ওয়ার্ড অ্যান্ড ক্যারেক্টার কাউন্টার - শব্দ, অক্ষর ও লাইন হিসাব",
    description:
      "অনলাইনে তাৎক্ষণিকভাবে শব্দ, অক্ষর, বাক্য, প্যারাগ্রাফ ও পড়ার সময় হিসাব করুন। বাংলা ও ইংরেজি দুই ভাষাতেই নিখুঁত কাজ করে।",
    type: "website",
    locale: "bn_BD",
    siteName: "Totthobox",
    url: "https://totthobox.com/tools/word-counter",
  
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox" }],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "ওয়ার্ড অ্যান্ড ক্যারেক্টার কাউন্টার - শব্দ, অক্ষর ও লাইন হিসাব",
    description:
      "অনলাইনে তাৎক্ষণিকভাবে শব্দ, অক্ষর, বাক্য, প্যারাগ্রাফ ও পড়ার সময় হিসাব করুন।",
  
    images: ["https://totthobox.com/og-image.png"],
  },
};

export default function WordCounterPage() {
  return (
    <div className="tb-page-container tb-section mx-auto max-w-2xl">
      <WordCounter />
    </div>
  );
}
