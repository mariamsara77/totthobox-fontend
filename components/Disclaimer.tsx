import React from "react";
import Link from "next/link";
import { AlertCircle, Scale, ShieldAlert, HeartPulse, HardDriveDownload } from "lucide-react";

export type DisclaimerType = "tax" | "islamic" | "emergency" | "health" | "software" | "general";

interface DisclaimerProps {
  type?: DisclaimerType;
  className?: string;
  customText?: string;
}

const DISCLAIMER_CONFIG: Record<
  DisclaimerType,
  {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    text: string;
    badge: string;
    colorClasses: string;
  }
> = {
  tax: {
    title: "কর ও আর্থিক তথ্যের সতর্কীকরণ",
    icon: Scale,
    badge: "আর্থিক সতর্কতা",
    colorClasses: "border-amber-500/30 bg-amber-500/5 text-amber-900 dark:text-amber-200",
    text: "এই ক্যালকুলেটরের ফলাফলসমূহ জাতীয় রাজস্ব বোর্ড (NBR) এর অর্থ আইন ও প্রচলিত ট্যাক্স স্ল্যাব অনুযায়ী প্রস্তুতকৃত আনুমানিক হিসাব। কোনো চূড়ান্ত আইনি বা কর নির্ধারণী পদক্ষেপ গ্রহণের পূর্বে অনুমোদিত আয়কর আইনজীবী (Advocate) বা চার্টার্ড অ্যাকাউন্ট্যান্ট (CA)-এর সরাসরি পেশাদার পরামর্শ গ্রহণ করুন।",
  },
  islamic: {
    title: "ইসলামিক তথ্যের প্রামাণ্যতা ও শরীয়ত সতর্কতা",
    icon: AlertCircle,
    badge: "ধর্মীয় তথ্য সতর্কতা",
    colorClasses: "border-emerald-500/30 bg-emerald-500/5 text-emerald-900 dark:text-emerald-200",
    text: "এখানে উল্লেখিত দোয়া, জিকির ও আমলসমূহ পবিত্র কুরআন ও সিহাহ সিত্তাহ এর নির্ভরযোগ্য হাদিস গ্রন্থ অনুসারে উপস্থাপন করা হয়েছে। ব্যক্তিগত বা জটিল কোনো পারিবারিক মাসআলা ও সুনির্দিষ্ট ফতোয়ার জন্য স্থানীয় স্বীকৃত মুফতি বা বিজ্ঞ ইসলামিক স্কলারের সাথে সরাসরি যোগাযোগ করুন।",
  },
  emergency: {
    title: "জরুরি সেবা ও হেল্পলাইন নির্দেশনা",
    icon: ShieldAlert,
    badge: "জরুরি সতর্কতা",
    colorClasses: "border-rose-500/30 bg-rose-500/5 text-rose-900 dark:text-rose-200",
    text: "যেকোনো তাৎক্ষণিক জীবনহানি বা দুর্ঘটনার মতো জরুরি মুহূর্তে অবিলম্বে জাতীয় জরুরি হেল্পলাইন ৯৯৯ (পুলিশ, ফায়ার সার্ভিস, অ্যাম্বুলেন্স) অথবা সংশ্লিষ্ট সরকারি হাসপাতালে সরাসরি যোগাযোগ করুন। অনলাইন তথ্য কখনই সরাসরি জরুরি উদ্ধারকাজের বিকল্প নয়।",
  },
  health: {
    title: "স্বাস্থ্য ও চিকিৎসা বিষয়ক সতর্কতা",
    icon: HeartPulse,
    badge: "চিকিৎসা সতর্কতা",
    colorClasses: "border-rose-500/30 bg-rose-500/5 text-rose-900 dark:text-rose-200",
    text: "এই প্ল্যাটফর্মের স্বাস্থ্য বা জরুরি সেবা সংক্রান্ত তথ্য সাধারণ জনসচেতনতা বৃদ্ধির লক্ষ্যে সংকলিত। যেকোনো রোগ নির্ণয়, ওষুধ সেবন বা চিকিৎসা পরিকল্পনায় অবশ্যই বাংলাদেশ মেডিকেল অ্যান্ড ডেন্টাল কাউন্সিল (BMDC) নিবন্ধিত রেজিস্টার্ড চিকিৎসকের পরামর্শ নিন।",
  },
  software: {
    title: "নিরাপদ ডাউনলোড ও বৌদ্ধিক স্বত্বাধিকার নীতি",
    icon: HardDriveDownload,
    badge: "সফটওয়্যার সতর্কতা",
    colorClasses: "border-blue-500/30 bg-blue-500/5 text-blue-900 dark:text-blue-200",
    text: "তথ্যবক্স কঠোরভাবে পাইরেসি-বিরোধী নীতি মেনে চলে। এখানে তালিকাভুক্ত সকল সফটওয়্যার ও অ্যাপের অফিশিয়াল সোর্স বা ডেভেলপার লিঙ্ক নির্দেশ করা হয়েছে। আমরা কোনো প্রকার ক্র্যাকড, প্যাচড বা কপিরাইট লঙ্ঘিত ফাইল হোস্ট করি না।",
  },
  general: {
    title: "সাধারণ তথ্য ও সেবা দাবিত্যাগ",
    icon: AlertCircle,
    badge: "দাবিত্যাগ",
    colorClasses: "border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/40 text-zinc-800 dark:text-zinc-200",
    text: "তথ্যবক্সের সমস্ত তথ্য ও ইউটিলিটি টুলস উন্মুক্ত সেবার উদ্দেশ্যে তৈরি। তথ্যের নির্ভুলতা রক্ষায় সর্বোচ্চ যত্ন নেওয়া হলেও প্রযুক্তিগত কোনো ত্রুটি বা সরকারি পরিবর্তনের কারণে অনিচ্ছাকৃত অসামঞ্জস্যের জন্য কর্তৃপক্ষ দায়ী নয়।",
  },
};

export default function Disclaimer({ type = "general", className = "", customText }: DisclaimerProps) {
  const config = DISCLAIMER_CONFIG[type] || DISCLAIMER_CONFIG.general;
  const Icon = config.icon;

  return (
    <div
      role="note"
      aria-label={config.title}
      className={`p-4 sm:p-5 rounded-2xl border text-xs sm:text-sm space-y-2 ${config.colorClasses} ${className}`}
    >
      <div className="flex items-center gap-2 font-bold">
        <Icon className="w-4 h-4 shrink-0" />
        <span>{config.title}</span>
        <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 uppercase font-semibold">
          {config.badge}
        </span>
      </div>
      <p className="leading-relaxed opacity-90">{customText || config.text}</p>
      <div className="pt-1">
        <Link
          href="/disclaimer"
          className="text-[11px] font-semibold underline underline-offset-2 hover:opacity-80 transition"
        >
          আমাদের সম্পূর্ণ ডিসক্লেইমার ও দায়মুক্তি শর্তাবলী পড়ুন &rarr;
        </Link>
      </div>
    </div>
  );
}
