import { Metadata } from "next";
import WordCounter from "@/components/tools/WordCounter";

export const metadata: Metadata = {
  title: "ওয়ার্ড অ্যান্ড ক্যারেক্টার কাউন্টার - শব্দ, অক্ষর ও লাইন হিসাব | Totthobox",
  description:
    "অনলাইনে তাৎক্ষণিকভাবে শব্দ, অক্ষর (স্পেসসহ/ছাড়া), বাক্য, প্যারাগ্রাফ, লাইন এবং পড়ার সময় হিসাব করুন। বাংলা ও ইংরেজি দুই ভাষাতেই নিখুঁত কাজ করে। Uppercase, Lowercase, Title Case টুলসহ।",
  keywords: [
    "ওয়ার্ড কাউন্টার",
    "ক্যারেক্টার কাউন্টার",
    "word counter bangla",
    "character counter",
    "শব্দ গণনা",
    "অক্ষর গণনা",
    "অনলাইন ওয়ার্ড কাউন্টার",
    "uppercase",
    "lowercase",
    "title case",
    "Totthobox",
  ],
  openGraph: {
    title: "ওয়ার্ড অ্যান্ড ক্যারেক্টার কাউন্টার - শব্দ, অক্ষর ও লাইন হিসাব | Totthobox",
    description:
      "অনলাইনে তাৎক্ষণিকভাবে শব্দ, অক্ষর (স্পেসসহ/ছাড়া), বাক্য, প্যারাগ্রাফ, লাইন এবং পড়ার সময় হিসাব করুন। বাংলা ও ইংরেজি দুই ভাষাতেই নিখুঁত কাজ করে।",
    type: "website",
    locale: "bn_BD",
    siteName: "Totthobox",
  },
};

export default function WordCounterPage() {
  return (
    <div className="mx-auto max-w-2xl p-4">
      <WordCounter />
    </div>
  );
}