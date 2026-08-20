import type { Metadata } from "next";
import PracticeClient from "@/components/practices/practiceClient";

export const metadata: Metadata = {
  title: "লেখা প্র্যাকটিস ও ড্রয়িং টুল - Totthobox",
  description:
    "Totthobox-এর উন্নত ড্রয়িং এবং রাইটিং টুলের মাধ্যমে বাংলা ও ইংরেজি অক্ষর লেখা প্র্যাকটিস করুন। শিশুদের হাতের লেখা উন্নত করতে এবং ডিজিটাল ড্রয়িংয়ের জন্য সেরা প্ল্যাটফর্ম।",
  keywords: [
    "লেখা প্র্যাকটিস",
    "হাতের লেখা শেখা",
    "বাংলা অক্ষর ট্রেসিং",
    "ডিজিটাল ড্রয়িং বোর্ড",
    "Totthobox writing practice",
    "online drawing tool bangla",
  ],
  openGraph: {
    title: "লেখা প্র্যাকটিস ও ড্রয়িং টুল - Totthobox",
    description:
      "Totthobox-এর উন্নত ড্রয়িং এবং রাইটিং টুলের মাধ্যমে বাংলা ও ইংরেজি অক্ষর লেখা প্র্যাকটিস করুন।",
    type: "website",
  },
};

export default function WritingPracticePage() {
  return <PracticeClient />;
}