import { Metadata } from "next";
import AgeCalculator from "@/components/tools/AgeCalculator";

export const metadata: Metadata = {
  title: "স্মার্ট এজ ক্যালকুলেটর - সঠিক বয়স ও বয়সের পার্থক্য হিসাব | Totthobox",
  description:
    "অনলাইনে নিখুঁতভাবে আপনার বয়স, পরবর্তী জন্মদিন, দুইজনের বয়সের পার্থক্য এবং আরও অনেক কিছু হিসাব করুন। বাংলায় সহজ ও দ্রুত এজ ক্যালকুলেটর।",
  keywords: [
    "এজ ক্যালকুলেটর",
    "বয়স হিসাব",
    "age calculator bangla",
    "বয়সের পার্থক্য",
    "জন্মদিন কাউন্টডাউন",
    "অনলাইন বয়স ক্যালকুলেটর",
    "Totthobox",
  ],
  openGraph: {
    title: "স্মার্ট এজ ক্যালকুলেটর - সঠিক বয়স ও বয়সের পার্থক্য হিসাব | Totthobox",
    description:
      "অনলাইনে নিখুঁতভাবে আপনার বয়স, পরবর্তী জন্মদিন, দুইজনের বয়সের পার্থক্য এবং আরও অনেক কিছু হিসাব করুন। বাংলায় সহজ ও দ্রুত এজ ক্যালকুলেটর।",
    type: "website",
    locale: "bn_BD",
    siteName: "Totthobox",
  },
};

export default function AgeCalculatorPage() {
  return (
    <div className="mx-auto max-w-2xl p-4">
      <AgeCalculator />
    </div>
  );
}