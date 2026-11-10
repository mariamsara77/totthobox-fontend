import type { Metadata } from "next";
import Link from "next/link";
import {
  Calendar,
  ArrowLeftRight,
  Wrench,
  Cpu,
  PhoneCall,
  MapPin,
  Globe,
  BookOpen,
  ShieldAlert,
  ShieldCheck,
  Award,
  Users2,
  FileText,
  Mail,
  ArrowRight,
} from "lucide-react";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "আমাদের সম্পর্কে (About Us) | তথ্যবক্স",
  description:
    "Totthobox (তথ্যবক্স)-এর মিশন, ভিশন, সম্পাদকীয় মানদণ্ড ও সেবাসমূহ। জানুন কীভাবে আমরা যাচাইকৃত তথ্য ও দরকারি ডিজিটাল টুলস বিনামূল্যে সবার কাছে পৌঁছে দিই।",
  alternates: {
    canonical: "https://totthobox.com/about-us",
  },
  openGraph: {
    title: "আমাদের সম্পর্কে | তথ্যবক্স",
    description:
      "Totthobox (তথ্যবক্স)-এর মিশন, ভিশন, সম্পাদকীয় মানদণ্ড ও সেবাসমূহ সম্পর্কে বিস্তারিত জানুন।",
    url: "https://totthobox.com/about-us",
    siteName: "Totthobox",
    type: "website",
    locale: "bn_BD",
    images: [
      {
        url: "https://totthobox.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Totthobox About Us",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "আমাদের সম্পর্কে | তথ্যবক্স",
    description:
      "Totthobox (তথ্যবক্স)-এর মিশন, ভিশন ও সম্পাদকীয় মানদণ্ড।",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }],
  },
};

const serviceHighlights = [
  {
    href: "/bangla/calendar",
    icon: Calendar,
    title: "বাংলা ক্যালেন্ডার ও ছুটির হিসাব",
    desc: "বঙ্গাব্দ, হিজরি ও ইংরেজি তারিখের রূপান্তরসহ বাংলাদেশ সরকারের বার্ষিক ছুটির হালনাগাদ তালিকা।",
  },
  {
    href: "/converter/number-to-word",
    icon: ArrowLeftRight,
    title: "স্মার্ট কনভার্টার হাব",
    desc: "জমির পরিমাপ (কাঠা, বিঘা, শতক), মুদ্রা বিনিময়, ওজন, তাপমাত্রা ও সংখ্যাকে কথায় লেখার টুল।",
  },
  {
    href: "/tools/tax-vat-calculator",
    icon: Wrench,
    title: "ইউটিলিটি ও আয়কর টুলস",
    desc: "এনবিআর (NBR) কর নীতিমালা ভিত্তিক ট্যাক্স-ভ্যাট হিসাব, বয়স ও পার্সেন্টেজ ক্যালকুলেটর।",
  },
  {
    href: "/contact/police",
    icon: PhoneCall,
    title: "জরুরি সেবা ও হটলাইন",
    desc: "পুলিশ, ফায়ার সার্ভিস, অ্যাম্বুলেন্স ও সরকারি জরুরি হেল্পলাইনের যাচাইকৃত ফোন নম্বর ডিরেক্টরি।",
  },
  {
    href: "/bangladesh/introduction",
    icon: MapPin,
    title: "বাংলাদেশ পরিচিতি ও ইতিহাস",
    desc: "৬৪ জেলার ভৌগোলিক তথ্য, ঐতিহাসিক নিদর্শন, পর্যটন কেন্দ্র ও বিশিষ্ট গুণীজন পরিচিতি।",
  },
  {
    href: "/international/all-country",
    icon: Globe,
    title: "বিশ্বকোষ ও আন্তর্জাতিক তথ্য",
    desc: "বিশ্বের সকল দেশের রাজধানী, মুদ্রা, জনসংখ্যা, আন্তর্জাতিক ডায়ালিং কোড ও মানচিত্র।",
  },
  {
    href: "/islam/basic",
    icon: BookOpen,
    title: "ইসলামিক জ্ঞান ও প্রয়োজনীয় দোয়া",
    desc: "কালেমা, নামাজের নিয়ম, প্রামাণ্য দোয়া ও ইসলামিক শিষ্টাচার সংক্রান্ত নির্ভরযোগ্য গাইড।",
  },
  {
    href: "/software/all",
    icon: Cpu,
    title: "সফটওয়্যার ও অ্যাপস ডিরেক্টরি",
    desc: "দৈনন্দিন কাজের প্রয়োজনীয় অফিশিয়াল সফটওয়্যার পরিচিতি ও সিস্টেম রিকোয়ারমেন্ট গাইড।",
  },
];

export default function AboutUsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-12">
      {/* Hero */}
      <header className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20">
          <Award className="w-4 h-4" />
          বিশ্বস্ত ডিজিটাল তথ্য ও ইউটিলিটি প্ল্যাটফর্ম
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
          তথ্যবক্স (Totthobox) সম্পর্কে জানুন
        </h1>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
          আমাদের লক্ষ্য— দৈনন্দিন জীবনের প্রয়োজনীয় নাগরিক তথ্য, বৈজ্ঞানিক ও গাণিতিক হিসাব এবং জরুরি সেবাগুলোকে সবার জন্য সহজ, নির্ভরযোগ্য ও বিনামূল্যে উন্মুক্ত রাখা।
        </p>
      </header>

      {/* Mission & Vision */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20 space-y-3">
          <div className="p-3 w-fit rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            আমাদের লক্ষ্য (Our Mission)
          </h2>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            ইন্টারনেটে ছড়িয়ে থাকা খণ্ডিত ও অনেক সময় অপ্রমাণিত তথ্যের বিপরীতে একটি একক, গোছানো এবং প্রামাণিক বাংলা জ্ঞানভাণ্ডার গড়ে তোলা। নাগরিক যেন মাত্র কয়েক ক্লিকেই জমি পরিমাপ, ট্যাক্স হিসাব বা জরুরি হেল্পলাইন পেয়ে যান।
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20 space-y-3">
          <div className="p-3 w-fit rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Users2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            আমাদের দৃষ্টিভঙ্গি (Our Vision)
          </h2>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            একটি পরিচ্ছন্ন, বিজ্ঞাপন-ভারমুক্ত ও ব্যবহারকারী-বান্ধব প্রযুক্তির পরিবেশ সৃষ্টি করা যেখানে তথ্যের নির্ভুলতা এবং মানুষের গোপনীয়তা রক্ষা পায় সবার আগে।
          </p>
        </div>
      </section>

      {/* Editorial Standards */}
      <section className="p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-800/10 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <FileText className="w-5 h-5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            সম্পাদকীয় মানদণ্ড ও তথ্য যাচাইকরণ নীতি
          </h2>
        </div>
        <p className="text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          তথ্যবক্সের কনটেন্ট ও অ্যালগরিদম তৈরির পেছনে রয়েছে সুনির্দিষ্ট সম্পাদকীয় যাচাই পদ্ধতি:
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-sm text-zinc-700 dark:text-zinc-300">
          <li className="space-y-1">
            <strong className="text-zinc-900 dark:text-zinc-100">সরকারি ও প্রামাণ্য উৎস:</strong>
            <p className="text-zinc-600 dark:text-zinc-400">ট্যাক্স, ছুটি ও নাগরিক সেবার তথ্যে জাতীয় রাজস্ব বোর্ড (NBR) ও সরকারি গেজেটকে একমাত্র নির্ভরযোগ্য ভিত্তি ধরা হয়।</p>
          </li>
          <li className="space-y-1">
            <strong className="text-zinc-900 dark:text-zinc-100">গাণিতিক সমীকরণ পরীক্ষা:</strong>
            <p className="text-zinc-600 dark:text-zinc-400">সকল ক্যালকুলেটর ও কনভার্টারের সূত্রাবলী একাধিক টেস্ট-কেসে ম্যানুয়ালি মিলিয়ে প্রকাশ করা হয়।</p>
          </li>
          <li className="space-y-1">
            <strong className="text-zinc-900 dark:text-zinc-100">নিয়মিত হালনাগাদকরণ:</strong>
            <p className="text-zinc-600 dark:text-zinc-400">বছর ও নীতিমালা পরিবর্তনের সাথে সাথে ছুটির তালিকা, ট্যাক্স স্ল্যাব ও কোডগুলো আপডেট করা হয়।</p>
          </li>
          <li className="space-y-1">
            <strong className="text-zinc-900 dark:text-zinc-100">পাইরেসি ও ক্ষতিকর কন্টেন্ট বর্জন:</strong>
            <p className="text-zinc-600 dark:text-zinc-400">সফটওয়্যার তালিকায় কোনো প্রকার ক্র্যাক, ম্যালওয়্যার বা লাইসেন্সহীন ফাইল যুক্ত করা সম্পূর্ণ নিষিদ্ধ।</p>
          </li>
        </ul>
        <div className="pt-2">
          <Link
            href="/editorial-policy"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            আমাদের পূর্ণাঙ্গ সম্পাদকীয় নীতিমালা পড়ুন &rarr;
          </Link>
        </div>
      </section>

      {/* Services Grid */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            আমরা যেসব সেবা প্রদান করি
          </h2>
          <p className="text-sm text-zinc-500">সম্পূর্ণ উন্মুক্ত ও বিনামূল্যে ব্যবহারযোগ্য টুলস</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {serviceHighlights.map((service, idx) => {
            const Icon = service.icon;
            return (
              <Link
                key={idx}
                href={service.href}
                className="group p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/40 dark:bg-zinc-800/20 hover:bg-white dark:hover:bg-zinc-800 transition-all flex items-start gap-4"
              >
                <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-700/50 text-indigo-600 dark:text-indigo-400 shrink-0 group-hover:scale-105 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {service.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Contact & Editorial Desk CTA */}
      <section className="p-8 sm:p-10 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/30 text-center space-y-4">
        <div className="p-3 w-fit mx-auto rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
          <Mail className="w-5 h-5" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          আমাদের টিমের সাথে যোগাযোগ করুন
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
          যেকোনো তথ্যের ভুল সংশোধন, পরামর্শ বা পার্টনারশিপের জন্য আমাদের সম্পাদকীয় টিম সর্বদা উন্মুক্ত।
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/contact-us"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 transition text-sm"
          >
            যোগাযোগ ফর্ম &rarr;
          </Link>
          <a
            href="mailto:editorial@totthobox.com"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition text-sm"
          >
            editorial@totthobox.com
          </a>
        </div>
      </section>
    </main>
  );
}
