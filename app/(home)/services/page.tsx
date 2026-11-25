import React from "react";
import { QuickFavoritesBar } from "@/components/tools/QuickFavorites";
import { PageContainer } from "@/components/layout";
import { Metadata } from "next";
import { ShieldCheck, HeartHandshake, Zap } from "lucide-react";
import CategorySection from "@/components/home/CategorySection";
import { NAVIGATION_REGISTRY } from "@/config/navigation";
import TrendingServices from "@/components/home/TrendingServices";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "সকল ডিজিটাল সেবা ও টুলস ডিরেক্টরি | তথ্যবক্স",
  description:
    "Totthobox-এর সম্পূর্ণ সেবা তালিকা: বাংলা ক্যালেন্ডার, স্মার্ট কনভার্টার, এনবিআর আয়কর, জরুরি নম্বর, ইসলামিক জ্ঞান ও বাংলাদেশ তথ্য এক জায়গায়।",
  alternates: { canonical: "https://totthobox.com/services" },
  openGraph: {
    title: "সকল ডিজিটাল সেবা ও টুলস ডিরেক্টরি | তথ্যবক্স",
    description: "Totthobox-এর তথ্যভিত্তিক সেবা, ক্যালেন্ডার, কনভার্টার, ডিজিটাল টুলস, বাংলাদেশ ও আন্তর্জাতিক তথ্য এক জায়গায়।",
    url: "https://totthobox.com/services",
    siteName: "Totthobox",
    type: "website",
    locale: "bn_BD",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "সকল ডিজিটাল সেবা ও টুলস ডিরেক্টরি | তথ্যবক্স",
    description: "Totthobox-এর তথ্যভিত্তিক সেবা, ক্যালেন্ডার, কনভার্টার, ডিজিটাল টুলস, বাংলাদেশ ও আন্তর্জাতিক তথ্য এক জায়গায়।",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }],
  },
};

export default function ServicesPage() {
  return (
    <PageContainer className="py-6 sm:py-10 space-y-10">
      {/* Header */}
      <header className="space-y-3 text-center sm:text-left border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <p className="text-xs font-medium text-[var(--accent-ink)]">
          সারগ্রাহী ডিজিটাল ক্যাটালগ
        </p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-zinc-900 dark:text-zinc-50">
          সকল সেবা ও ডিজিটাল টুলস ডিরেক্টরি
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
          আপনার দৈনন্দিন প্রয়োজনীয় তথ্য, হিসাব-নিকাশ, সরকারি ছুটির দিনপঞ্জি ও ডিজিটাল ইউটিলিটি টুলস এক ছাতার নিচে।
        </p>
        <div className="pt-2">
          <QuickFavoritesBar />
        </div>
      </header>

      {/* Trending Block */}
      <TrendingServices />

      {/* Categorized Sections */}
      <div className="space-y-12">
        {NAVIGATION_REGISTRY.map((cat) => (
          <CategorySection
            key={cat.id}
            id={cat.id}
            title={cat.title}
            subtitle={cat.description}
            iconName={cat.icon}
            viewAllHref={cat.viewAllHref}
            items={cat.items}
          />
        ))}
      </div>

      <hr className="border-zinc-200 dark:border-zinc-800 my-8" />

      {/* Content Section (AdSense thin-content fix & deep explanation) */}
      <article className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 sm:p-8 space-y-5">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          তথ্যবক্স (Totthobox) — সমন্বিত ডিজিটাল তথ্য ও সেবা সমাধান
        </h2>

        <div className="space-y-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
          <p>
            তথ্যপ্রযুক্তির আধুনিক যুগে সঠিক এবং নির্ভরযোগ্য তথ্য দ্রুত খুঁজে পাওয়া নাগরিক জীবনের অন্যতম প্রধান দাবি। 
            <strong>Totthobox (তথ্যবক্স)</strong> বাংলাদেশের সাধারণ মানুষ, শিক্ষার্থী, চাকরিপ্রার্থী এবং পেশাজীবীদের জন্য তৈরি একটি সমন্বিত ডিজিটাল সার্ভিস পোর্টাল। এখানে কোনো বিভ্রান্তি বা অতিরিক্ত বাণিজ্যিক জটিলতা ছাড়া একদম সরাসরি আপনার প্রয়োজনীয় কাজটি সমাধান করার ব্যবস্থা রাখা হয়েছে।
          </p>

          <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 pt-2">
            আমাদের সেবাসমূহের বিশেষত্ব
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800/60 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-100">
                <Zap className="size-4 text-emerald-500" />
                <span>তাৎক্ষণিক ফলাফল</span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                ক্লায়েন্ট সাইড ক্যালকুলেশন ও অপ্টিমাইজড অ্যালগরিদম নিশ্চিত করে মিলিসেকেন্ডে হিসাব ও রূপান্তর।
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800/60 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-100">
                <ShieldCheck className="size-4 text-indigo-500" />
                <span>যাচাইকৃত সূত্র</span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                সরকারি প্রজ্ঞাপন, গেজেট ও জাতীয় নির্দেশিকা অনুসারে তথ্যের নির্ভুলতা সবসময় হালনাগাদ রাখা হয়।
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800/60 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-100">
                <HeartHandshake className="size-4 text-sky-500" />
                <span>বিজ্ঞাপন ও গোপনীয়তা নিরাপত্তা</span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                ব্যবহারকারীর ডেটা কখনো বিক্রি বা অযথা ট্র্যাকিং করা হয় না। স্বচ্ছ কুকি ও সম্মতি নীতি মেনে চলা হয়।
              </p>
            </div>
          </div>
        </div>
      </article>
    </PageContainer>
  );
}
