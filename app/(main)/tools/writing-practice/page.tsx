import type { Metadata } from "next";
import PracticeClient from "@/components/practices/practiceClient";

export const metadata: Metadata = {
  title:
    "লেখা প্র্যাকটিস ও ড্রয়িং টুল - হাতের লেখা শেখার সেরা প্ল্যাটফর্ম | তথ্যবক্স",
  description:
    "Totthobox-এর উন্নত ড্রয়িং এবং রাইটিং টুলের মাধ্যমে বাংলা ও ইংরেজি অক্ষর লেখা প্র্যাকটিস করুন। শিশুদের হাতের লেখা উন্নত করতে এবং ডিজিটাল ড্রয়িংয়ের জন্য সেরা অনলাইন প্ল্যাটফর্ম।",
  alternates: {
    canonical: "https://totthobox.com/tools/writing-practice",
  },
  openGraph: {
    title: "লেখা প্র্যাকটিস ও ড্রয়িং টুল | তথ্যবক্স",
    description:
      "বাংলা ও ইংরেজি অক্ষর লেখা প্র্যাকটিস করুন। শিশুদের হাতের লেখা উন্নত করতে এবং ডিজিটাল ড্রয়িংয়ের জন্য সেরা টুল।",
    type: "website",
    locale: "bn_BD",
    siteName: "Totthobox",
    url: "https://totthobox.com/tools/writing-practice",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "লেখা প্র্যাকটিস ও ড্রয়িং টুল | তথ্যবক্স",
    description:
      "বাংলা ও ইংরেজি অক্ষর লেখা প্র্যাকটিস করুন। শিশুদের হাতের লেখা উন্নত করতে সেরা টুল।",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }],
  },
};

export default function WritingPracticePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
      <PracticeClient />
    </div>
  );
}
