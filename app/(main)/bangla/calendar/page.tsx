import type { Metadata } from "next";
import AdvancedBanglaCalendar from "./AdvancedBanglaCalendar";
import { BookOpen, Calendar, Clock, HelpCircle, ShieldCheck } from "lucide-react";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "বাংলা ক্যালেন্ডার — আজকের বাংলা তারিখ, বঙ্গাব্দ ও সরকারি ছুটি | তথ্যবক্স",
  description:
    "আজকের সঠিক বাংলা তারিখ, বঙ্গাব্দ সাল, ঋতু, হিজরি ও ইংরেজি তারিখের হিসাব দেখুন। বাংলা একাডেমি প্রমিত বর্ষপঞ্জি ও বাংলাদেশ সরকারের সরকারি ছুটির তালিকা।",
  alternates: { canonical: "https://totthobox.com/bangla/calendar" },
  openGraph: {
    title: "বাংলা ক্যালেন্ডার — আজকের বাংলা তারিখ ও সরকারি ছুটি | তথ্যবক্স",
    description:
      "আজকের বাংলা তারিখ, বঙ্গাব্দ, ঋতু, হিজরি এবং বাংলাদেশ সরকারের সরকারি ছুটির হালনাগাদ তালিকা।",
    type: "website",
    url: "https://totthobox.com/bangla/calendar",
    siteName: "Totthobox",
    locale: "bn_BD",
    images: [
      {
        url: "https://totthobox.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "বাংলা ক্যালেন্ডার ও আজকের তারিখ - Totthobox",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "বাংলা ক্যালেন্ডার ও আজকের তারিখ | Totthobox",
    description:
      "আজকের বাংলা তারিখ, বঙ্গাব্দ সাল ও সরকারি ছুটির হালনাগাদ তালিকা।",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }],
  },
};

async function getHolidays(year: number) {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";
  try {
    const res = await fetch(`${apiUrl}/api/holidays-calendar?year=${year}`, {
      next: { revalidate: 1800 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "বাংলা সন বা বঙ্গাব্দ কীভাবে হিসাব করা হয়?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "বাংলা সন সাধারণত গ্রেগরিয়ান বা ইংরেজি বর্ষপঞ্জির ১৪ এপ্রিল থেকে শুরু হয়। ইংরেজি বছর থেকে ৫৯৩ বা ৫৯৪ বিয়োগ করে বাংলা সন গণনা করা হয়। ১৪ এপ্রিল বা তার পরে হলে ৫৯৩ এবং তার পূর্বে হলে ৫৯৪ বিয়োগ করতে হয়।",
      },
    },
    {
      "@type": "Question",
      name: "বাংলা বর্ষপঞ্জিতে কোন কোন মাস কত দিনে গণনা করা হয়?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "বাংলা একাডেমির প্রমিত নিয়ম অনুযায়ী, বছরের প্রথম পাঁচ মাস (বৈশাখ, জ্যৈষ্ঠ, আষাঢ়, শ্রাবণ, ভাদ্র) ৩১ দিনে এবং পরবর্তী সাত মাস (আশ্বিন, কার্তিক, অগ্রহায়ণ, পৌষ, মাঘ, ফাল্গুন, চৈত্র) ৩০ দিনে গণনা করা হয়। গ্রেগরিয়ান অধিবর্ষে (Leap Year) ফাল্গুন মাস ৩১ দিনের হয়।",
      },
    },
    {
      "@type": "Question",
      name: "পহেলা বৈশাখ সবসময় ১৪ এপ্রিলেই কেন অনুষ্ঠিত হয়?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "বাংলাদেশে ১৯৬৬ সালে ড. মুহম্মদ শহীদুল্লাহ্ কমিটির সুপারিশ এবং পরবর্তীতে বাংলা একাডেমির সংশোধিত নিয়ম অনুযায়ী বৈশাখ মাসের প্রথম দিন অর্থাৎ পহেলা বৈশাখ সবসময় প্রতি বছর ১৪ এপ্রিলে নির্দিষ্ট করা হয়েছে।",
      },
    },
    {
      "@type": "Question",
      name: "বঙ্গাব্দের প্রবর্তক কে ছিলেন?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ঐতিহাসিকদের মতে, মুঘল সম্রাট আকবর তাঁর শাসনামলে কৃষকদের কাছ থেকে রাজস্ব বা খাজনা আদায় সহজ করার উদ্দেশ্যে ৯৬৩ হিজরি মোতাবেক ১৫৫৬ খ্রিষ্টাব্দে ফসলি সন হিসেবে বাংলা সনের সংস্কার ও প্রবর্তন করেন।",
      },
    },
    {
      "@type": "Question",
      name: "হিজরি ও বাংলা তারিখের মধ্যে পার্থক্য কী?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "বাংলা বর্ষপঞ্জি সৌর পঞ্জিকা (Solar Calendar) ভিত্তিক, যার বছর ৩৬৫ বা ৩৬৬ দিনের হয়। অন্যদিকে হিজরি বর্ষপঞ্জি চান্দ্র পঞ্জিকা (Lunar Calendar) ভিত্তিক, যার বছর ৩৫৪ বা ৩৫৫ দিনের হয়। ফলে প্রতি বছর হিজরি ও বাংলা মাসের সংযোগ ১০-১১ দিন করে পিছিয়ে যায়।",
      },
    },
  ],
};

export default async function BanglaCalendarPage() {
  const currentYear = new Date().getFullYear();
  const initialHolidays = await getHolidays(currentYear);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-10">
      {/* Interactive Calendar Tool with Pre-fetched SSR Data */}
      <AdvancedBanglaCalendar initialHolidays={initialHolidays} />

      {/* Comprehensive Editorial & Reference Guide (SSR) */}
      <article className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 p-6 sm:p-10 space-y-8">
        {/* Header */}
        <header className="space-y-3 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            <Calendar className="w-3.5 h-3.5" />
            বাংলা একাডেমি প্রমিত বর্ষপঞ্জি অনুসারে প্রস্তুত
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
            বাংলা ক্যালেন্ডারের ইতিহাস, গঠনরীতি ও প্রমিত নিয়ম
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
            বাঙালি সংস্কৃতির অন্যতম অবিচ্ছেদ্য অংশ হলো বঙ্গাব্দ বা বাংলা বর্ষপঞ্জি। কৃষিভিত্তিক অর্থনীতি থেকে শুরু করে ধর্মীয় উৎসব, সরকারি কাজ ও সামাজিক অনুষ্ঠান—সবকিছুতেই বাংলা ক্যালেন্ডারের তাৎপর্য অপরিসীম।
          </p>
        </header>

        {/* Section 1: History */}
        <section className="space-y-4">
          <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            বঙ্গাব্দের উৎপত্তি ও ঐতিহাসিক প্রেক্ষাপট
          </h3>
          <div className="space-y-3 text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
            <p>
              ঐতিহাসিক তথ্য অনুসারে, মুঘল সম্রাট আকবরের রাজত্বকালে ফসলি সন হিসেবে বাংলা সনের কার্যকর সূচনা হয়। তৎকালীন সময়ে রাজস্ব আদায় করা হতো হিজরি চান্দ্র বর্ষপঞ্জি অনুযায়ী। কিন্তু চান্দ্র বছরের হিসাবের সাথে কৃষকদের ফসল কাটার মৌসুমের তারতম্য দেখা দিত, যার ফলে কৃষকদের কর প্রদানে চরম ভোগান্তির শিকার হতে হতো।
            </p>
            <p>
              সম্রাট আকবর তৎকালীন বিখ্যাত জ্যোতির্বিদ আমির ফতেহউল্লাহ সিরাজীকে সৌর বছর এবং হিজরি বর্ষের সমন্বয়ে একটি সময়োপযোগী বর্ষপঞ্জি প্রণয়নের দায়িত্ব দেন। সম্রাট আকবরের সিংহাসন আরোহণের বছর অর্থাৎ ৯৬৩ হিজরি (১৫৫৬ খ্রিষ্টাব্দ) থেকে এই নতুন বর্ষপঞ্জি কার্যকর করা হয়।
            </p>
          </div>
        </section>

        {/* Section 2: Bangla Academy Reforms */}
        <section className="space-y-4">
          <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            বাংলাদেশে বাংলা সনের বৈজ্ঞানিক সংস্কার
          </h3>
          <div className="space-y-3 text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
            <p>
              প্রাচীন বাংলা ক্যালেন্ডারে বিভিন্ন মাসের দিন সংখ্যা ৩২ বা ৩১ দিনের মধ্যে উঠানামা করত, যা আন্তর্জাতিক খ্রিষ্টীয় বর্ষপঞ্জির সাথে সামঞ্জস্যপূর্ণ ছিল না। ১৯৬৬ সালে বিশিষ্ট ভাষাবিদ ও পণ্ডিত ড. মুহম্মদ শহীদুল্লাহ্-এর নেতৃত্বে বাংলা একাডেমি একটি সংস্কার কমিটি গঠন করে।
            </p>
            <p>
              উক্ত কমিটির সুপারিশ এবং পরবর্তীতে ১৯৯৫ ও ২০১৯ সালের আধুনিকীকরণের ভিত্তিতে বর্তমান নিয়মে দিন গণনা করা হয়:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/60 space-y-1">
                <span className="text-xs font-semibold uppercase text-emerald-600 dark:text-emerald-400">
                  বৈশাখ থেকে ভাদ্র (প্রথম ৫ মাস)
                </span>
                <p className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  প্রতি মাস ৩১ দিনে গণনা
                </p>
                <p className="text-xs text-zinc-500">
                  বৈশাখ, জ্যৈষ্ঠ, আষাঢ়, শ্রাবণ ও ভাদ্র।
                </p>
              </div>
              <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/60 space-y-1">
                <span className="text-xs font-semibold uppercase text-indigo-600 dark:text-indigo-400">
                  আশ্বিন থেকে চৈত্র (পরবর্তী ৭ মাস)
                </span>
                <p className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  প্রতি মাস ৩০ দিনে গণনা
                </p>
                <p className="text-xs text-zinc-500">
                  অধিবর্ষের (Leap Year) ক্ষেত্রে ফাল্গুন মাস ৩১ দিনের হয়।
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Calculation Rules */}
        <section className="space-y-4">
          <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            ইংরেজি থেকে বাংলা তারিখ রূপান্তরের নিয়ম
          </h3>
          <div className="space-y-3 text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
            <p>
              ইংরেজি তারিখ থেকে বাংলা সাল নির্ধারণের ক্ষেত্রে সাধারণ গাণিতিক সূত্র হলো:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-sm">
              <li>
                <strong>১ জানুয়ারি থেকে ১৩ এপ্রিল:</strong> ইংরেজি বছর থেকে ৫৯৪ বিয়োগ করতে হবে।
              </li>
              <li>
                <strong>১৪ এপ্রিল থেকে ৩১ ডিসেম্বর:</strong> ইংরেজি বছর থেকে ৫৯৩ বিয়োগ করতে হবে।
              </li>
            </ul>
            <p className="text-xs text-zinc-500">
              উদাহরণস্বরূপ: ২০২৬ সালের পহেলা বৈশাখ (১৪ এপ্রিল) হবে ১৪৩৩ বঙ্গাব্দ (২০২৬ - ৫৯৩ = ১৪৩৩)।
            </p>
          </div>
        </section>

        {/* Section 4: FAQs */}
        <section className="space-y-4 pt-2">
          <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            বাংলা বর্ষপঞ্জি সম্পর্কিত জরুরি প্রশ্নোত্তর
          </h3>
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {faqSchema.mainEntity.map((faq, idx) => (
              <div key={idx} className="py-3.5 space-y-1.5">
                <h4 className="font-semibold text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
                  {faq.name}
                </h4>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {faq.acceptedAnswer.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Sources & Editorial Note */}
        <footer className="pt-4 border-t border-zinc-200/80 dark:border-zinc-800/80 text-xs text-zinc-500 space-y-1">
          <p>
            <strong>তথ্যের উৎস:</strong> বাংলা একাডেমি সংশোধিত বাংলা বর্ষপঞ্জি নির্দেশিকা, বাংলাদেশ গেজেট এবং জাতীয় দিবস ও সরকারি ছুটির সরকারি প্রজ্ঞাপন।
          </p>
          <p>
            সর্বশেষ হালনাগাদ: {new Date().toLocaleDateString("bn-BD", { year: "numeric", month: "long" })} | তথ্যবক্স সম্পাদকীয় বিভাগ কর্তৃক যাচাইকৃত।
          </p>
        </footer>
      </article>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </div>
  );
}
