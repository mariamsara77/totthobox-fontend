import type { Metadata } from "next";
import Link from "next/link";
import {
  Calendar,
  ArrowLeftRight,
  Wrench,
  Cpu,
  PhoneCall,
  MapPin,
  BookOpen,
  ShieldAlert,
  Newspaper,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  HeartHandshake,
} from "lucide-react";
import UserAnalytics from "@/components/UserAnalytics";
import { QuickFavoritesBar } from "@/components/tools/QuickFavorites";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "তথ্যবক্স — প্রয়োজনীয় সব তথ্য ও ডিজিটাল সেবা এক জায়গায়",
  description:
    "বাংলা ক্যালেন্ডার, বাংলাদেশ ও আন্তর্জাতিক তথ্য, ইসলামিক জ্ঞান, সফটওয়্যার, কনভার্টার ও দৈনন্দিন ইউটিলিটি টুলস এক জায়গায় বিনামূল্যে উপভোগ করুন।",
  alternates: { canonical: "https://totthobox.com/" },
  openGraph: {
    title: "তথ্যবক্স — প্রয়োজনীয় সব তথ্য ও ডিজিটাল সেবা এক জায়গায়",
    description:
      "বাংলা ক্যালেন্ডার, বাংলাদেশ ও আন্তর্জাতিক তথ্য, ইসলামিক জ্ঞান, সফটওয়্যার, কনভার্টার ও দৈনন্দিন ইউটিলিটি টুলস এক জায়গায়।",
    url: "https://totthobox.com/",
    siteName: "Totthobox",
    type: "website",
    locale: "bn_BD",
    images: [
      {
        url: "https://totthobox.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Totthobox - Digital Information Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "তথ্যবক্স — প্রয়োজনীয় সব তথ্য ও ডিজিটাল সেবা এক জায়গায়",
    description:
      "বাংলা ক্যালেন্ডার, বাংলাদেশ ও আন্তর্জাতিক তথ্য, ইসলামিক জ্ঞান, সফটওয়্যার, কনভার্টার ও দৈনন্দিন ইউটিলিটি টুলস এক জায়গায়।",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }],
  },
};

const services = [
  {
    href: "/bangla/calendar",
    icon: Calendar,
    label: "বাংলা ক্যালেন্ডার",
    details: "তারিখ, মাস ও সরকারি ছুটির তালিকা।",
    color: "text-amber-500",
  },
  {
    href: "/converter/number-to-word",
    icon: ArrowLeftRight,
    label: "কনভার্টার",
    details: "মুদ্রা, জমি, ওজন ও পরিমাপ রূপান্তর।",
    color: "text-blue-500",
  },
  {
    href: "/tools/image-resizer",
    icon: Wrench,
    label: "ইউটিলিটি টুলস",
    details: "ছবি রিসাইজ, বয়স ও শতকরা ক্যালকুলেটর।",
    color: "text-emerald-500",
  },
  {
    href: "/software/all",
    icon: Cpu,
    label: "সফটওয়্যার",
    details: "প্রয়োজনীয় সফটওয়্যার পরিচিতি ও তথ্য।",
    color: "text-indigo-500",
  },
  {
    href: "/contact/police",
    icon: PhoneCall,
    label: "জরুরি সেবা",
    details: "পুলিশ, অ্যাম্বুলেন্স ও হেল্পলাইন নম্বর।",
    color: "text-rose-500",
  },
  {
    href: "/bangladesh/introduction",
    icon: MapPin,
    label: "বাংলাদেশ",
    details: "ইতিহাস, পর্যটন, গুণীজন ও প্রশাসনিক তথ্য।",
    color: "text-teal-500",
  },
  {
    href: "/islam/basic",
    icon: BookOpen,
    label: "ইসলামিক জ্ঞান",
    details: "নামাজ, কালেমা, মৌলিক জ্ঞান ও দোয়া।",
    color: "text-emerald-600",
  },
  {
    href: "/signs/all",
    icon: ShieldAlert,
    label: "সংকেত ও নিয়ম",
    details: "ট্রাফিক ও স্বাস্থ্য সচেতনতার সংকেত।",
    color: "text-orange-500",
  },
  {
    href: "/news/headlines",
    icon: Newspaper,
    label: "সংবাদ শিরোনাম",
    details: "শীর্ষস্থানীয় সংবাদমাধ্যমের সর্বশেষ খবর।",
    color: "text-purple-500",
  },
  {
    href: "/ai/chat",
    icon: Sparkles,
    label: "Totthobox AI",
    details: "স্মার্ট এআই চ্যাটবট সহায়তা ও অনুসন্ধান।",
    color: "text-pink-500",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 space-y-12 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden text-center space-y-5 pt-4 pb-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          বাংলাদেশের সমন্বিত ডিজিটাল তথ্য ও সেবা পোর্টাল
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-zinc-900 dark:text-zinc-50 max-w-4xl mx-auto">
          প্রয়োজনীয় সব তথ্য ও সেবা <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to- from-indigo-600 via-sky-500 to-emerald-500 dark:from-indigo-400 dark:via-sky-400 dark:to-emerald-400">
            এক প্ল্যাটফর্মে
          </span>
        </h1>

        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          আপনার দৈনন্দিন জীবন ও কাজের প্রয়োজনীয় ডিজিটাল টুলস, নির্ভরযোগ্য তথ্য
          এবং সেবা — সম্পূর্ণ বিনামূল্যে ও সহজে ব্যবহারযোগ্য।
        </p>

        {/* Analytics Badge */}
        <div className="pt-1">
          <UserAnalytics />
        </div>

        <div className="pt-2 max-w-4xl mx-auto text-left">
          <QuickFavoritesBar />
        </div>
      </section>

      {/* Main Services Grid */}
      <section className="space-y-6" aria-labelledby="services-title">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <div>
            <h2
              id="services-title"
              className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100"
            >
              মূল সেবাসমূহ
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              আপনার কাঙ্ক্ষিত সেবাটি নির্বাচন করে সহজে ব্যবহার শুরু করুন
            </p>
          </div>
        </div>

        {/* Dynamic Services Cards */}
        <div className="grid grid-cols-2 gap-3.5 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Link
                key={index}
                href={service.href}
                prefetch={false}
                className="group relative flex flex-col items-center justify-between p-4 sm:p-5 text-center rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-400/10 hover:bg-white dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-xs hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <div className="w-full flex flex-col items-center">
                  <div
                    className={`mb-3.5 p-3 rounded-2xl bg-white dark:bg-zinc-900 shadow-xs transition-transform duration-200 group-hover:scale-110 ${service.color}`}
                  >
                    <Icon className="w-8 h-8 sm:w-9 sm:h-9 stroke-[1.75]" />
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {service.label}
                  </h3>

                  <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
                    {service.details}
                  </p>
                </div>

                <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-zinc-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  <span>প্রবেশ করুন</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Value Proposition Highlights */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pt-4">
        <div className="p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-800/20 space-y-3">
          <div className="p-3 w-fit rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            অতি দ্রুত ও লাইটওয়েট
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            কোনো অপ্রয়োজনীয় ভারী স্ক্রিপ্ট বা বিলম্ব ছাড়া চোখের পলকে পৃষ্ঠা
            লোড হয়। মোবাইল বা স্লো নেটওয়ার্কেও সেরা অভিজ্ঞতা।
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-800/20 space-y-3">
          <div className="p-3 w-fit rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            নির্ভরযোগ্য ও নিরাপদ তথ্য
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            সরকারি ও বিশ্বস্ত সোর্স থেকে যাচাইকৃত তথ্য এবং গোপনীয়তা নীতি মেনে
            ব্যবহারকারীর সম্পূর্ণ নিরাপত্তা নিশ্চিত।
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-800/20 space-y-3">
          <div className="p-3 w-fit rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            ১০০% উন্মুক্ত ও ফ্রি
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            সকল ক্যালকুলেটর, কনভার্টার, গাইড ও টুলস যেকোনো সময় বিনামূল্যে
            ব্যবহারযোগ্য। কোনো সাবস্ক্রিপশন ফি বা লুকায়িত চার্জ নেই।
          </p>
        </div>
      </section>

      {/* SEO & Editorial Knowledge Section */}
      <article className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/40 dark:bg-zinc-800/20 p-6 sm:p-10 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
            তথ্যবক্স (Totthobox) — আপনার নির্ভরযোগ্য ডিজিটাল সঙ্গী
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
            দৈনন্দিন জীবনের তথ্য খোঁজা থেকে শুরু করে প্রয়োজনীয় গাণিতিক ও
            ডিজিটাল টুলসের ব্যবহারকে সহজ ও সাবলীল করতে Totthobox তৈরি হয়েছে।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              প্রধান সেবাসমূহ এক নজরে
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>
                  <strong>বাংলা ক্যালেন্ডার ও ছুটির তালিকা:</strong> বঙ্গাব্দ,
                  খ্রিষ্টাব্দ, সরকারি ছুটি ও জাতীয় দিবসের হালনাগাদ তথ্য।
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>
                  <strong>স্মার্ট কনভার্টার হাব:</strong> জমির হিসাব, মুদ্রা,
                  ওজন, দৈর্ঘ্য, তাপমাত্রা ও সংখ্যাকে কথায় রূপান্তর।
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>
                  <strong>জরুরি হেল্পলাইন নম্বর:</strong> বাংলাদেশ পুলিশ, ফায়ার
                  সার্ভিস ও অ্যাম্বুলেন্সের যাচাইকৃত হটলাইন।
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>
                  <strong>বাংলাদেশ ও বিশ্বকোষ:</strong> ইতিহাস, দর্শনীয় স্থান,
                  বিশ্বের সকল দেশের পতাকা ও প্রশাসনিক তথ্য।
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              কেন লক্ষাধিক মানুষ Totthobox বেছে নিচ্ছেন?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              আমরা তথ্যের স্বচ্ছতা এবং সহজ ব্যবহারযোগ্যতাকে সর্বোচ্চ গুরুত্ব
              দিয়ে থাকি। বিভ্রান্তিকর তথ্য ও অতিরিক্ত বিজ্ঞাপনের ভিড়ে
              Totthobox একটি পরিচ্ছন্ন, বিজ্ঞাপন-নিয়ন্ত্রিত ও দ্রুতগতির পরিবেশ
              নিশ্চিত করে—যা স্মার্টফোন এবং পিসিতে সমানভাবে স্বাচ্ছন্দ্যময়।
            </p>
            <div className="pt-2">
              <Link
                href="/about-us"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                আমাদের সম্পর্কে আরও জানুন
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
