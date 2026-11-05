import type { Metadata } from "next";
import WordCounter from "@/components/tools/WordCounter";
import ToolStructuredData from "@/components/seo/ToolStructuredData";

export const revalidate = 86400;

export const metadata: Metadata = {
  title:
    "ওয়ার্ড অ্যান্ড ক্যারেক্টার কাউন্টার - শব্দ, অক্ষর ও লাইন হিসাব | তথ্যবক্স",
  description:
    "অনলাইনে তাৎক্ষণিকভাবে শব্দ, অক্ষর (স্পেসসহ/ছাড়া), বাক্য, প্যারাগ্রাফ, লাইন এবং পড়ার সময় হিসাব করুন। বাংলা ও ইংরেজি দুই ভাষাতেই নিখুঁত কাজ করে। Uppercase, Lowercase, Title Case টুলসহ।",
  alternates: {
    canonical: "https://totthobox.com/tools/word-and-character-counter",
  },
  openGraph: {
    title:
      "ওয়ার্ড অ্যান্ড ক্যারেক্টার কাউন্টার - শব্দ, অক্ষর ও লাইন হিসাব | তথ্যবক্স",
    description:
      "অনলাইনে তাৎক্ষণিকভাবে শব্দ, অক্ষর, বাক্য, প্যারাগ্রাফ ও পড়ার সময় হিসাব করুন। বাংলা ও ইংরেজি দুই ভাষাতেই নিখুঁত কাজ করে।",
    type: "website",
    locale: "bn_BD",
    siteName: "Totthobox",
    url: "https://totthobox.com/tools/word-and-character-counter",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox" }],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "ওয়ার্ড অ্যান্ড ক্যারেক্টার কাউন্টার - শব্দ, অক্ষর ও লাইন হিসাব | তথ্যবক্স",
    description:
      "অনলাইনে তাৎক্ষণিকভাবে শব্দ, অক্ষর, বাক্য, প্যারাগ্রাফ ও পড়ার সময় হিসাব করুন।",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }],
  },
};

export default function WordCounterPage() {
  return (
    <>
      <ToolStructuredData
        name="ওয়ার্ড অ্যান্ড ক্যারেক্টার কাউন্টার"
        description="অনলাইনে শব্দ, অক্ষর, বাক্য, অনুচ্ছেদ এবং রিডিং টাইম পরিমাপের শক্তিশালী টুল।"
        url="https://totthobox.com/tools/word-and-character-counter"
        applicationCategory="UtilityApplication"
        featureList={[
          "বাংলা ও ইংরেজি শব্দ এবং অক্ষরের নিখুঁত গণনা",
          "স্পেসসহ ও স্পেস ছাড়া ক্যারেক্টার হিসাব",
          "পড়ার সময় (Reading Time) ও বলার সময় গণনা",
          "বাক্য রূপান্তর (UPPERCASE, lowercase, Title Case)",
        ]}
      />
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
        <WordCounter />
      </div>
    </>
  );
}
