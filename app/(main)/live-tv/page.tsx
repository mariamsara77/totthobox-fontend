import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import {
  Tv,
  Radio,
  RadioTower,
  Volume2,
  ShieldCheck,
  ExternalLink,
  AlertCircle,
  Siren,
  Flame,
  HeartPulse,
  Scale,
  Phone,
  Baby,
  Landmark,
  Info,
  Clock,
  Smartphone,
  GraduationCap,
  Car,
  HelpCircle,
  CalendarDays,
} from "lucide-react";
import { PageContainer } from "@/components/layout";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "লাইভ টিভি, বেতার ও জরুরি হটলাইন গাইড | তথ্যবক্স",
  description:
    "বিটিভি, বিটিভি চট্টগ্রাম, বিটিভি নিউজ, সংসদ টিভি ও বাংলাদেশ বেতারের পরিচিতি, এফএম ফ্রিকোয়েন্সি, অফিশিয়াল ওয়েবসাইট, দেখা-শোনার উপায় এবং ৯৯৯, ৩৩৩, ১০৯-সহ জরুরি হটলাইন নম্বর এক পাতায়।",
  alternates: { canonical: "https://totthobox.com/live-tv" },
  // কনটেন্ট সমৃদ্ধ হওয়ায় ইনডেক্স চালু করা হলো। আগের মতো বন্ধ রাখতে index: false করুন।
  robots: {
    index: true,
    follow: true,
  },
};

/* ------------------------------------------------------------------ */
/* ডেটা                                                               */
/* ------------------------------------------------------------------ */

type Helpline = {
  number: string;
  title: string;
  desc: string;
  icon: LucideIcon;
};

const HELPLINES: Helpline[] = [
  {
    number: "999",
    title: "জাতীয় জরুরি সেবা",
    desc: "পুলিশ, ফায়ার সার্ভিস ও অ্যাম্বুলেন্সের জরুরি সহায়তা। বাংলাদেশ পুলিশ পরিচালিত।",
    icon: Siren,
  },
  {
    number: "333",
    title: "জাতীয় তথ্য সেবা",
    desc: "সরকারি সেবা সম্পর্কে তথ্য, অভিযোগ ও আবেদনে সহায়তা। এটুআই-এর উদ্যোগে চালু।",
    icon: Landmark,
  },
  {
    number: "109",
    title: "নারী ও শিশু নির্যাতন প্রতিরোধ",
    desc: "নারী ও শিশুর প্রতি সহিংসতা বা বাল্যবিবাহের খবর জানানোর জাতীয় হেল্পলাইন।",
    icon: Phone,
  },
  {
    number: "1098",
    title: "জাতীয় শিশু হেল্পলাইন",
    desc: "শিশুর সুরক্ষা, নির্যাতন বা ঝুঁকির তথ্য জানাতে বিনামূল্যের সেবা।",
    icon: Baby,
  },
  {
    number: "16263",
    title: "স্বাস্থ্য বাতায়ন / স্বাস্থ্য তথ্য",
    desc: "স্বাস্থ্য অধিদপ্তরের স্বাস্থ্যসেবা বিষয়ক তথ্য ও পরামর্শ কেন্দ্র।",
    icon: HeartPulse,
  },
  {
    number: "16430",
    title: "সরকারি আইনি সহায়তা",
    desc: "জাতীয় আইনগত সহায়তা প্রদান সংস্থার ২৪ ঘণ্টার হেল্পলাইন।",
    icon: Scale,
  },
  {
    number: "106",
    title: "দুর্নীতি দমন কমিশন (দুদক)",
    desc: "ঘুষ বা দুর্নীতির অভিযোগ জানানোর জন্য দুদকের হটলাইন।",
    icon: ShieldCheck,
  },
  {
    number: "102",
    title: "ফায়ার সার্ভিস ও সিভিল ডিফেন্স",
    desc: "অগ্নিকাণ্ড ও উদ্ধার কাজে ফায়ার সার্ভিসের সরাসরি নম্বর।",
    icon: Flame,
  },
];

type TvChannel = {
  name: string;
  englishName: string;
  description: string;
  facts: string[];
  badge: string;
  officialUrl?: string;
  icon: LucideIcon;
};

const TV_CHANNELS: TvChannel[] = [
  {
    name: "বাংলাদেশ টেলিভিশন (বিটিভি)",
    englishName: "Bangladesh Television (BTV)",
    description:
      "দেশের প্রথম ও সবচেয়ে পুরোনো টিভি চ্যানেল। ১৯৬৪ সালে যাত্রা শুরু। সংবাদ, নাটক, শিক্ষা, কৃষি ও সংস্কৃতিভিত্তিক অনুষ্ঠান প্রচার করে। প্রধান কার্যালয় রামপুরা, ঢাকা।",
    facts: [
      "সরকারি মালিকানাধীন জাতীয় টেলিভিশন",
      "টেরেস্ট্রিয়াল (এন্টেনা) সম্প্রচার আছে",
      "১৯৮০ সালের ডিসেম্বরে রঙিন সম্প্রচার শুরু",
    ],
    badge: "রাষ্ট্রীয়",
    officialUrl: "https://btv.gov.bd",
    icon: Tv,
  },
  {
    name: "বিটিভি চট্টগ্রাম",
    englishName: "BTV Chattogram",
    description:
      "বিটিভির প্রথম আঞ্চলিক কেন্দ্র, ১৯৯৬ সালের ১৯ ডিসেম্বর চালু। চট্টগ্রাম ও দক্ষিণ-পূর্ব অঞ্চলের মানুষের জন্য আঞ্চলিক অনুষ্ঠান প্রচার করে।",
    facts: ["আঞ্চলিক চ্যানেল", "টেরেস্ট্রিয়াল সম্প্রচার আছে"],
    badge: "আঞ্চলিক",
    officialUrl: "https://btv.gov.bd",
    icon: Tv,
  },
  {
    name: "বিটিভি নিউজ",
    englishName: "BTV News",
    description:
      "রাষ্ট্রীয় সংবাদভিত্তিক চ্যানেল। ২০২৪ সালের ৩১ ডিসেম্বর বিটিভি ওয়ার্ল্ডের জায়গায় চালু হয়। বিটিভি ওয়ার্ল্ড ওই তারিখে বন্ধ হয়ে যায়।",
    facts: ["সংবাদভিত্তিক", "বিটিভি ওয়ার্ল্ডের স্থলাভিষিক্ত"],
    badge: "সংবাদ",
    officialUrl: "https://btv.gov.bd",
    icon: Tv,
  },
  {
    name: "সংসদ বাংলাদেশ টেলিভিশন",
    englishName: "Sangsad Bangladesh Television",
    description:
      "২০১১ সালের ২৫ জানুয়ারি যাত্রা শুরু। জাতীয় সংসদ ভবন থেকে অধিবেশনের সরাসরি সম্প্রচার এবং সংসদীয় আলোচনা প্রচার করে। করোনাকালে স্কুলের লাইভ ক্লাসও প্রচার করেছে।",
    facts: [
      "সংসদ অধিবেশনের লাইভ সম্প্রচার",
      "টেরেস্ট্রিয়াল সম্প্রচার আছে",
      "বিটিভি অ্যাপে অনলাইনে দেখা যায়",
    ],
    badge: "সংসদ",
    officialUrl: "https://parliament.gov.bd",
    icon: Landmark,
  },
];

type BetarChannel = {
  name: string;
  freq: string;
  note: string;
};

const BETAR_CHANNELS: BetarChannel[] = [
  {
    name: "ঢাকা-ক (জাতীয় কেন্দ্র)",
    freq: "মিডিয়াম ওয়েভ ৬৯৩ kHz",
    note: "বেতারের প্রধান জাতীয় চ্যানেল। গুরুত্বপূর্ণ রাষ্ট্রীয় অনুষ্ঠান সব আঞ্চলিক কেন্দ্র থেকে একযোগে প্রচার হয়।",
  },
  {
    name: "এফএম ১০৬.০",
    freq: "এফএম ১০৬.০ MHz",
    note: "ঢাকা থেকে প্রচারিত বেতারের এফএম সার্ভিস।",
  },
  {
    name: "এফএম ৯০.০",
    freq: "এফএম ৯০.০ MHz",
    note: "ঢাকা থেকে প্রচারিত বেতারের আরেকটি এফএম চ্যানেল।",
  },
  {
    name: "ট্রাফিক ব্রডকাস্টিং (ট্রাফিক এফএম)",
    freq: "এফএম ৮৮.৮ MHz",
    note: "দেশের প্রথম এফএম রেডিও স্টেশন (২৬ মে ২০০৫)। ঢাকার যানজট ও সড়কের তথ্য দেয়। ওয়েবসাইট: trafficfm.org।",
  },
];

type FmStation = { name: string; freq: string; area: string };

const PRIVATE_FM: FmStation[] = [
  { name: "রেডিও ফুর্তি", freq: "৮৮.০", area: "ঢাকা ও আশপাশ" },
  { name: "এবিসি রেডিও", freq: "৮৯.২", area: "ঢাকা" },
  { name: "রেডিও টুডে", freq: "৮৯.৬", area: "ঢাকা" },
  { name: "ঢাকা এফএম", freq: "৯০.৪", area: "ঢাকা" },
  { name: "পিপলস রেডিও", freq: "৯১.৬", area: "ঢাকা" },
  { name: "রেডিও শাদিন", freq: "৯২.৪", area: "ঢাকা" },
  { name: "জাগো এফএম", freq: "৯৪.৪", area: "ঢাকা" },
];

const TIMELINE = [
  {
    year: "১৯৩৯",
    text: "১৬ ডিসেম্বর ঢাকা বেতার কেন্দ্র প্রথম সম্প্রচারে আসে। এটিই বর্তমান বাংলাদেশ বেতারের সবচেয়ে পুরোনো কেন্দ্র।",
  },
  {
    year: "১৯৬৪",
    text: "পূর্ব পাকিস্তান আমলে ঢাকায় টেলিভিশন সম্প্রচার শুরু, যা পরে বাংলাদেশ টেলিভিশন (বিটিভি) হিসেবে পরিচিত হয়।",
  },
  { year: "১৯৮০", text: "বিটিভিতে রঙিন সম্প্রচার চালু হয়।" },
  {
    year: "১৯৯৬",
    text: "১৯ ডিসেম্বর বিটিভি চট্টগ্রাম কেন্দ্র যাত্রা শুরু করে।",
  },
  {
    year: "২০০৫",
    text: "২৬ মে ট্রাফিক এফএম ৮৮.৮ MHz-এ চালু, দেশের প্রথম এফএম রেডিও স্টেশন।",
  },
  {
    year: "২০০৬",
    text: "প্রথম বেসরকারি এফএম রেডিও 'রেডিও টুডে' সম্প্রচার শুরু করে।",
  },
  { year: "২০১১", text: "২৫ জানুয়ারি সংসদ বাংলাদেশ টেলিভিশন চালু হয়।" },
  {
    year: "২০২০",
    text: "করোনাকালে বিটিভি ও সংসদ টিভি স্কুলের শিক্ষার্থীদের জন্য লাইভ ক্লাস প্রচার করে।",
  },
  {
    year: "২০২১",
    text: "বিটিভি অ্যাপের মাধ্যমে বিটিভিসহ সহযোগী চ্যানেলগুলো বিশ্বব্যাপী স্ট্রিমিংয়ের জন্য উন্মুক্ত হয়।",
  },
  {
    year: "২০২৪",
    text: "৩১ ডিসেম্বর বিটিভি ওয়ার্ল্ড বন্ধ হয়ে বিটিভি নিউজ চালু হয়।",
  },
];

const HOW_TO = [
  {
    icon: Tv,
    title: "টেলিভিশনে দেখবেন যেভাবে",
    points: [
      "বিটিভি, বিটিভি চট্টগ্রাম ও সংসদ টিভি দেশের টেরেস্ট্রিয়াল (এন্টেনা) সম্প্রচারে থাকা তিনটি চ্যানেল।",
      "কেবল বা ডিশ সংযোগে চ্যানেল তালিকায় বিটিভি ও সংসদ টিভি খুঁজে নিন। চ্যানেল নম্বর অপারেটরভেদে আলাদা।",
      "সংসদ অধিবেশনের সময় সাধারণত সন্ধ্যায় সংসদ টিভিতে সরাসরি সম্প্রচার থাকে।",
    ],
  },
  {
    icon: Smartphone,
    title: "মোবাইল ও ইন্টারনেটে দেখা-শোনা",
    points: [
      "বিটিভি অ্যাপ বা btv.gov.bd থেকে অফিশিয়াল স্ট্রিম পেতে পারেন।",
      "বাংলাদেশ বেতারের অনুষ্ঠান betar.gov.bd ওয়েবসাইট ও 'Bangladesh Betar' মোবাইল অ্যাপে শোনা যায়।",
      "মোবাইল ডেটায় ভিডিও দেখলে ডেটা বেশি খরচ হয়, তাই সম্ভব হলে ওয়াইফাই ব্যবহার করুন।",
    ],
  },
  {
    icon: Radio,
    title: "রেডিওতে শুনবেন যেভাবে",
    points: [
      "এফএম সেট বা মোবাইলের বিল্ট-ইন এফএম রেডিওতে ফ্রিকোয়েন্সি মিলিয়ে নিন (যেমন ৮৮.৮, ৯০.০, ১০৬.০)।",
      "মিডিয়াম ওয়েভ (এএম) ফ্রিকোয়েন্সি দূরের এলাকায়ও পৌঁছায়, গ্রামাঞ্চলে ও দুর্যোগের সময় উপকারী।",
      "ফ্রিকোয়েন্সি এলাকাভেদে আলাদা হতে পারে। স্থানীয় বেতার কেন্দ্রের তথ্য betar.gov.bd-তে দেখুন।",
    ],
  },
];

const USES = [
  {
    icon: GraduationCap,
    title: "শিক্ষার্থী ও অভিভাবক",
    text: "রাষ্ট্রীয় চ্যানেলে শিক্ষামূলক অনুষ্ঠান ও জরুরি পরিস্থিতিতে লাইভ ক্লাসের ঘোষণা পাওয়া যায়।",
  },
  {
    icon: Landmark,
    title: "নাগরিক ও গবেষক",
    text: "সংসদ অধিবেশন ও সরকারি ঘোষণা সরাসরি অনুসরণ করা যায়, যা জনপ্রতিনিধিদের কাজ বোঝার সুযোগ দেয়।",
  },
  {
    icon: Car,
    title: "ঢাকার যাত্রী ও চালক",
    text: "ট্রাফিক এফএম ৮৮.৮ থেকে যানজট ও সড়কের অবস্থা সম্পর্কে হালনাগাদ তথ্য নেওয়া যায়।",
  },
  {
    icon: CalendarDays,
    title: "কৃষক ও গ্রামীণ জনগোষ্ঠী",
    text: "বেতারে কৃষি, আবহাওয়া ও স্বাস্থ্য বিষয়ক অনুষ্ঠান ইন্টারনেট ছাড়াই শোনা যায়।",
  },
];

const FAQS = [
  {
    q: "বিটিভি কোন কোন চ্যানেল পরিচালনা করে?",
    a: "বাংলাদেশ টেলিভিশন বর্তমানে বিটিভি (ঢাকা), বিটিভি চট্টগ্রাম, বিটিভি নিউজ এবং সংসদ বাংলাদেশ টেলিভিশন নামে চ্যানেলগুলো পরিচালনা বা সম্প্রচারে সহযোগিতা করে। সংসদ টিভি বিটিভির সুবিধা ব্যবহার করে সম্প্রচার করে।",
  },
  {
    q: "বিটিভি ওয়ার্ল্ড কি এখনো চালু আছে?",
    a: "না। বিটিভি ওয়ার্ল্ড ২০২৪ সালের ৩১ ডিসেম্বর বন্ধ হয়ে যায় এবং তার জায়গায় বিটিভি নিউজ চালু হয়েছে।",
  },
  {
    q: "সংসদ টিভিতে কী দেখা যায়?",
    a: "জাতীয় সংসদ অধিবেশনের সরাসরি সম্প্রচার, সংসদীয় আলোচনা ও গণশিক্ষামূলক অনুষ্ঠান। সংসদ অধিবেশন না থাকলে অন্যান্য অনুষ্ঠান প্রচারিত হতে পারে।",
  },
  {
    q: "বাংলাদেশ বেতার মোবাইলে কীভাবে শুনব?",
    a: "betar.gov.bd ওয়েবসাইটে অথবা 'Bangladesh Betar' মোবাইল অ্যাপে অনলাইন সম্প্রচার শোনা যায়। এছাড়া মোবাইলে এফএম রেডিও সুবিধা থাকলে ইন্টারনেট ছাড়াই এফএম ফ্রিকোয়েন্সিতে শুনতে পারবেন।",
  },
  {
    q: "এফএম আর মিডিয়াম ওয়েভের (এএম) পার্থক্য কী?",
    a: "এফএম সাধারণত স্বচ্ছ ও উন্নত মানের শব্দ দেয়, তবে সীমিত এলাকায় পৌঁছায়। মিডিয়াম ওয়েভ কম স্বচ্ছ হলেও অনেক দূর পর্যন্ত পৌঁছাতে পারে, তাই বড় এলাকায় সম্প্রচারে এটি ব্যবহার হয়।",
  },
  {
    q: "ট্রাফিক এফএম কী?",
    a: "বাংলাদেশ বেতারের ট্রাফিক ব্রডকাস্টিং সার্ভিস, যা ঢাকায় ৮৮.৮ MHz-এ প্রচারিত হয়। ২০০৫ সালে চালু হওয়া এটি দেশের প্রথম এফএম রেডিও স্টেশন।",
  },
  {
    q: "জরুরি অবস্থায় কোন নম্বরে ফোন করব?",
    a: "পুলিশ, ফায়ার সার্ভিস বা অ্যাম্বুলেন্স দরকার হলে ৯৯৯ নম্বরে ফোন করুন। সরকারি সেবা বিষয়ক তথ্যের জন্য ৩৩৩, নারী ও শিশু নির্যাতনের ঘটনায় ১০৯ এবং শিশু সুরক্ষায় ১০৯৮ নম্বর ব্যবহার করা যায়।",
  },
  {
    q: "তথ্যবক্স কি নিজে লাইভ স্ট্রিম করে?",
    a: "না। তথ্যবক্স কোনো টিভি বা রেডিও স্ট্রিম হোস্ট করে না। এই পাতায় শুধু তথ্য এবং অফিশিয়াল ওয়েবসাইটের লিংক দেওয়া হয়েছে, যাতে আপনি সরাসরি উৎস থেকে সেবা নিতে পারেন।",
  },
  {
    q: "এই পাতার কোনো তথ্য ভুল বা পুরোনো মনে হলে কী করব?",
    a: "ফ্রিকোয়েন্সি, চ্যানেল তালিকা ও হটলাইন নম্বর সময়ের সাথে বদলাতে পারে। ভুল পেলে আমাদের যোগাযোগ পাতায় জানান। আমরা যাচাই করে সংশোধন করব।",
  },
];

/* ------------------------------------------------------------------ */
/* ছোট কম্পোনেন্ট                                                      */
/* ------------------------------------------------------------------ */

function SectionHeading({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="max-w-2xl mx-auto space-y-1.5">
      <div className="flex items-center gap-2.5">
        <div className="flex size-9 items-center justify-center rounded-xl bg-red-500/10 text-red-600 dark:text-red-400">
          <Icon className="size-5" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-50">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

const cardCls =
  "rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 shadow-xs";

/* ------------------------------------------------------------------ */
/* পেজ                                                                 */
/* ------------------------------------------------------------------ */

export default function LiveTvPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <PageContainer className="max-w-5xl mx-auto py-6 sm:py-10 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Page Header */}
      <header className="space-y-3 text-center sm:text-left border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
          <Tv className="w-3.5 h-3.5" />
          রাষ্ট্রীয় ও তথ্য সম্প্রচার ডিরেক্টরি
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-900 dark:text-zinc-50">
          লাইভ টিভি, বেতার ও জরুরি হটলাইন গাইড
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
          বাংলাদেশ টেলিভিশন, সংসদ টিভি ও বাংলাদেশ বেতার সম্পর্কে প্রয়োজনীয় সব
          তথ্য এক জায়গায়। এখানে পাবেন চ্যানেল পরিচিতি, এফএম ফ্রিকোয়েন্সি,
          দেখা ও শোনার উপায়, সরকারি ওয়েবসাইটের লিংক এবং ৯৯৯, ৩৩৩, ১০৯-এর মতো
          গুরুত্বপূর্ণ হটলাইন নম্বর।
        </p>
        <p className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
          <Clock className="size-3.5" />
          তথ্য সর্বশেষ যাচাই: নভেম্বর ২০২৬
        </p>
      </header>

      {/* Notice & Disclaimer */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs sm:text-sm text-amber-800 dark:text-amber-300">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <p className="leading-relaxed">
          <strong>কপিরাইট ও সম্প্রচার নীতিমালা:</strong> তথ্যবক্স কোনো অননুমোদিত
          স্ট্রিমিং বা পাইরেটেড কনটেন্ট হোস্ট করে না। এখানে শুধুমাত্র রাষ্ট্রীয়
          টেলিভিশন ও বেতারের উন্মুক্ত তথ্য এবং অফিশিয়াল ওয়েব পোর্টালের
          রেফারেন্স লিংক দেওয়া হয়েছে।
        </p>
      </div>

      {/* Quick nav */}
      <nav
        aria-label="পাতার সূচিপত্র"
        className="flex flex-wrap gap-2 text-xs font-semibold"
      >
        {[
          ["#helpline", "জরুরি হটলাইন"],
          ["#tv", "টিভি চ্যানেল"],
          ["#betar", "বাংলাদেশ বেতার"],
          ["#fm", "এফএম তালিকা"],
          ["#how-to", "দেখা-শোনার উপায়"],
          ["#history", "ইতিহাস"],
          ["#faq", "প্রশ্নোত্তর"],
        ].map(([href, label]) => (
          <a
            key={href}
            href={href}
            className="rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-3 py-1.5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {label}
          </a>
        ))}
      </nav>

      {/* Helplines */}
      <section id="helpline" className="space-y-5 scroll-mt-24">
        <SectionHeading
          icon={Siren}
          title="জরুরি হটলাইন নম্বর"
          subtitle="বিপদে বা প্রয়োজনে নম্বরে ট্যাপ করলেই সরাসরি কল করা যাবে। নম্বরগুলো সরকারি উৎস অনুযায়ী দেওয়া হয়েছে।"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {HELPLINES.map((h) => {
            const Icon = h.icon;
            return (
              <a
                key={h.number}
                href={`tel:${h.number}`}
                className={`${cardCls} flex flex-col gap-2 hover:shadow-md transition-shadow`}
              >
                <div className="flex items-center justify-between">
                  <Icon className="size-5 text-red-600 dark:text-red-400" />
                  <span className="text-2xl font-black tabular-nums text-zinc-900 dark:text-zinc-50">
                    {h.number}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  {h.title}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {h.desc}
                </p>
              </a>
            );
          })}
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
          আরও সরকারি সেবার তথ্য পেতে{" "}
          <a
            href="https://bangladesh.gov.bd"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 dark:text-indigo-400 underline"
          >
            বাংলাদেশ জাতীয় তথ্য বাতায়ন
          </a>{" "}
          দেখতে পারেন।
        </p>
      </section>

      {/* TV Channels */}
      <section id="tv" className="space-y-5 scroll-mt-24">
        <SectionHeading
          icon={Tv}
          title="রাষ্ট্রীয় টেলিভিশন চ্যানেল"
          subtitle="দেশের চারটি রাষ্ট্রীয় টিভি চ্যানেলের পরিচিতি। বেসরকারি চ্যানেলগুলো কেবল ও স্যাটেলাইটে চলে, কিন্তু টেরেস্ট্রিয়ালে শুধু বিটিভি, বিটিভি চট্টগ্রাম ও সংসদ টিভি দেখা যায়।"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {TV_CHANNELS.map((ch) => {
            const Icon = ch.icon;
            return (
              <article
                key={ch.name}
                className={`${cardCls} flex flex-col justify-between hover:shadow-md transition-shadow`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-red-500/10 text-red-600 dark:text-red-400">
                      <Icon className="size-6" />
                    </div>
                    <span className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 text-xs font-bold text-zinc-600 dark:text-zinc-300">
                      {ch.badge}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                      {ch.name}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">
                      {ch.englishName}
                    </p>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {ch.description}
                  </p>
                  <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                    {ch.facts.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-red-500" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {ch.officialUrl && (
                  <div className="pt-5 mt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                    <a
                      href={ch.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 text-xs font-bold text-zinc-800 dark:text-zinc-200 transition-colors"
                    >
                      <span>অফিশিয়াল ওয়েবসাইট</span>
                      <ExternalLink className="size-3.5" />
                    </a>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {/* Betar */}
      <section id="betar" className="space-y-5 scroll-mt-24">
        <SectionHeading
          icon={Volume2}
          title="বাংলাদেশ বেতার"
          subtitle="দেশের জাতীয় বেতার সম্প্রচার সংস্থা। প্রধান কার্যালয় ঢাকায়। খবর, আবহাওয়া বার্তা, কৃষি, স্বাস্থ্য ও সংস্কৃতিমূলক অনুষ্ঠান প্রচার করে এবং বিদেশে বাংলা, ইংরেজি, আরবি, উর্দু, হিন্দি ও নেপালি ভাষায় অনুষ্ঠান সম্প্রচার করে।"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {BETAR_CHANNELS.map((c) => (
            <article key={c.name} className={`${cardCls} space-y-2`}>
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <RadioTower className="size-4" />
                <span className="text-xs font-bold">{c.freq}</span>
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                {c.name}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {c.note}
              </p>
            </article>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="https://betar.gov.bd"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 px-4 py-2.5 text-xs font-bold text-zinc-800 dark:text-zinc-200 transition-colors"
          >
            <span>বাংলাদেশ বেতারের অফিশিয়াল ওয়েবসাইট</span>
            <ExternalLink className="size-3.5" />
          </a>
          <a
            href="https://trafficfm.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 px-4 py-2.5 text-xs font-bold text-zinc-800 dark:text-zinc-200 transition-colors"
          >
            <span>ট্রাফিক এফএম ওয়েবসাইট</span>
            <ExternalLink className="size-3.5" />
          </a>
        </div>
      </section>

      {/* Private FM */}
      <section id="fm" className="space-y-5 scroll-mt-24">
        <SectionHeading
          icon={Radio}
          title="ঢাকার জনপ্রিয় এফএম রেডিও স্টেশন"
          subtitle="বেসরকারি এফএম রেডিওগুলো গান, খবর ও টক শো প্রচার করে। ফ্রিকোয়েন্সি তালিকা প্রকাশিত উৎস থেকে নেওয়া এবং স্টেশনভেদে বদলাতে পারে।"
        />
        <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-900/60 text-xs text-zinc-500 dark:text-zinc-400">
              <tr>
                <th className="px-4 py-3 font-bold">স্টেশন</th>
                <th className="px-4 py-3 font-bold">এফএম (MHz)</th>
                <th className="px-4 py-3 font-bold">এলাকা</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {PRIVATE_FM.map((s) => (
                <tr key={s.name} className="bg-white dark:bg-zinc-900/30">
                  <td className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100">
                    {s.name}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-zinc-700 dark:text-zinc-300">
                    {s.freq}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {s.area}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="flex items-start gap-2 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
          <Info className="size-4 shrink-0 mt-0.5" />
          <span>
            ঢাকার বাইরে চট্টগ্রাম, খুলনা, রাজশাহী ও অন্যান্য বিভাগে
            ফ্রিকোয়েন্সি আলাদা হতে পারে। কমিউনিটি রেডিও স্টেশনগুলো নির্দিষ্ট
            উপজেলা বা অঞ্চলের জন্য স্থানীয়ভাবে সম্প্রচার করে।
          </span>
        </p>
      </section>

      {/* How to */}
      <section id="how-to" className="space-y-5 scroll-mt-24">
        <SectionHeading
          icon={Smartphone}
          title="কীভাবে দেখবেন ও শুনবেন"
          subtitle="টিভি, মোবাইল ও রেডিও, তিন মাধ্যমেই রাষ্ট্রীয় সম্প্রচার পাওয়ার সহজ উপায়।"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {HOW_TO.map((h) => {
            const Icon = h.icon;
            return (
              <div key={h.title} className={`${cardCls} space-y-3`}>
                <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                  <Icon className="size-5 text-red-600 dark:text-red-400" />
                  <h3 className="text-sm font-bold">{h.title}</h3>
                </div>
                <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {h.points.map((p) => (
                    <li key={p} className="flex items-start gap-2">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-red-500" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {USES.map((u) => {
            const Icon = u.icon;
            return (
              <div
                key={u.title}
                className="flex items-start gap-3 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 p-4"
              >
                <Icon className="size-5 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    {u.title}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {u.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* History */}
      <section id="history" className="space-y-5 scroll-mt-24">
        <SectionHeading
          icon={CalendarDays}
          title="সম্প্রচারের ইতিহাস এক নজরে"
          subtitle="বাংলাদেশের টিভি ও রেডিও সম্প্রচারের গুরুত্বপূর্ণ মাইলফলক।"
        />
        <ol className="relative space-y-4 border-l-2 border-zinc-200 dark:border-zinc-800 pl-6">
          {TIMELINE.map((t) => (
            <li key={t.year + t.text} className="relative">
              <span className="absolute -left-[31px] top-1.5 size-3 rounded-full border-2 border-white dark:border-zinc-950 bg-red-500" />
              <span className="text-sm font-black text-red-600 dark:text-red-400">
                {t.year}
              </span>
              <p className="mt-0.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {t.text}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* FAQ */}
      <section id="faq" className="space-y-5 scroll-mt-24">
        <SectionHeading
          icon={HelpCircle}
          title="সাধারণ জিজ্ঞাসা"
          subtitle="লাইভ টিভি, বেতার ও হটলাইন নিয়ে পাঠকদের সবচেয়ে বেশি প্রশ্ন।"
        />
        <div className="space-y-3">
          {FAQS.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 open:shadow-xs"
            >
              <summary className="cursor-pointer list-none text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center justify-between gap-3">
                <span>{f.q}</span>
                <span className="text-zinc-400 transition-transform group-open:rotate-45 text-lg leading-none">
                  +
                </span>
              </summary>
              <p className="mt-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Safety & Compliance Assurance */}
      <div className="p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed space-y-2">
        <div className="flex items-center gap-2 font-bold text-zinc-700 dark:text-zinc-300">
          <ShieldCheck className="size-4 text-emerald-500" />
          <span>ডিজিটাল সেবা সুরক্ষা</span>
        </div>
        <p>
          তথ্যবক্স ডিজিটাল সিকিউরিটি আইন ও আন্তর্জাতিক মেধা-সম্পদ অধিকার (IPR)
          কঠোরভাবে মেনে চলে। কোনো কনটেন্ট নিয়ে আপত্তি থাকলে আমাদের{" "}
          <a
            href="/contact-us"
            className="text-indigo-600 dark:text-indigo-400 underline"
          >
            যোগাযোগ পাতায়
          </a>{" "}
          তাৎক্ষণিক অবহিত করার অনুরোধ রইল।
        </p>
        <p>
          এই পাতার তথ্য জনসাধারণের সুবিধার জন্য প্রকাশিত। ফ্রিকোয়েন্সি, চ্যানেল
          ও হটলাইন নম্বর পরিবর্তিত হতে পারে, তাই চূড়ান্ত তথ্যের জন্য সংশ্লিষ্ট
          প্রতিষ্ঠানের অফিশিয়াল ওয়েবসাইট দেখুন।
        </p>
      </div>
    </PageContainer>
  );
}
