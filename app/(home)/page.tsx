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
  Sparkles,
  ArrowUpRight,
  Search,
  BookMarked,
  Compass,
  Lightbulb,
} from "lucide-react";
import UserAnalytics from "@/components/UserAnalytics";

export const metadata: Metadata = {
  title: "তথ্যবক্স — প্রয়োজনীয় সব তথ্য ও ডিজিটাল সেবা এক জায়গায়",
  description:
    "বাংলা ক্যালেন্ডার, বাংলাদেশ ও আন্তর্জাতিক তথ্য, ইসলামিক জ্ঞান, সফটওয়্যার, কনভার্টার ও দৈনন্দিন ইউটিলিটি টুলস এক জায়গায়।",
  alternates: { canonical: "https://totthobox.com/" },
  openGraph: {
    title: "তথ্যবক্স — প্রয়োজনীয় সব তথ্য ও ডিজিটাল সেবা এক জায়গায়",
    description:
      "বাংলা ক্যালেন্ডার, বাংলাদেশ ও আন্তর্জাতিক তথ্য, ইসলামিক জ্ঞান, সফটওয়্যার, কনভার্টার ও দৈনন্দিন ইউটিলিটি টুলস এক জায়গায়।",
    url: "https://totthobox.com/",
    siteName: "Totthobox",
    type: "website",
    locale: "bn_BD",
  },
  twitter: {
    card: "summary_large_image",
    title: "তথ্যবক্স — প্রয়োজনীয় সব তথ্য ও ডিজিটাল সেবা এক জায়গায়",
    description:
      "বাংলা ক্যালেন্ডার, বাংলাদেশ ও আন্তর্জাতিক তথ্য, ইসলামিক জ্ঞান, সফটওয়্যার, কনভার্টার ও দৈনন্দিন ইউটিলিটি টুলস এক জায়গায়।",
  },
};

const services = [
  { href: "/bangla/calendar", icon: Calendar, label: "বাংলা ক্যালেন্ডার", details: "তারিখ, মাস, ছুটি ও বিশেষ দিবস।" },
  { href: "/converter/number-to-word", icon: ArrowLeftRight, label: "কনভার্টার", details: "সংখ্যা, মুদ্রা ও একক রূপান্তর।" },
  { href: "/tools/image-resizer", icon: Wrench, label: "বিভিন্ন টুলস", details: "ছবি, হিসাব ও দৈনন্দিন ইউটিলিটি।" },
  { href: "/software/all", icon: Cpu, label: "সফটওয়্যার", details: "Software ও app সম্পর্কে তথ্য।" },
  { href: "/contact/police", icon: PhoneCall, label: "জরুরি সেবা", details: "হেল্পলাইন ও প্রয়োজনীয় যোগাযোগ।" },
  { href: "/bangladesh/introduction", icon: MapPin, label: "বাংলাদেশ", details: "দেশ, ইতিহাস ও গুরুত্বপূর্ণ তথ্য।" },
  { href: "/international/all-country", icon: Globe, label: "বিশ্বকোষ", details: "দেশ, রাজধানী, পতাকা ও মুদ্রা।" },
  { href: "/islam/basic", icon: BookOpen, label: "ইসলামিক", details: "মৌলিক জ্ঞান, দোয়া ও পাঠ।" },
  { href: "/signs/all", icon: ShieldAlert, label: "সংকেত", details: "স্বাস্থ্য, নিরাপত্তা ও ট্রাফিক সংকেত।" },
  { href: "/ai/chat", icon: Sparkles, label: "Totthobox AI", details: "AI সহায়তায় তথ্য খুঁজে নিন।" },
];

const quickLinks = [
  { href: "/bangladesh/tourism", label: "বাংলাদেশ পর্যটন", icon: Compass },
  { href: "/bangla/holiday", label: "ছুটির তালিকা", icon: Calendar },
  { href: "/tools/age-calculator", label: "বয়স ক্যালকুলেটর", icon: Lightbulb },
  { href: "/international/all-country", label: "সব দেশ", icon: Globe },
];

export default function HomePage() {
  return (
    <div className="w-full">
      <section className="relative overflow-hidden">
        <div className="hero-grid pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -left-28 top-8 size-80 rounded-full bg-[radial-gradient(circle,rgba(19,142,160,0.18),transparent_68%)] blur-3xl" />
        <div className="pointer-events-none absolute right-[-7rem] top-[-4rem] size-96 rounded-full bg-[radial-gradient(circle,rgba(8,127,115,0.18),transparent_68%)] blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-8rem] left-1/2 size-72 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(227,168,61,0.10),transparent_70%)] blur-3xl" />

        <div className="relative mx-auto w-full max-w-7xl px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-14 lg:px-8 lg:pt-16">
          <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/55 bg-white/72 p-5 shadow-[0_34px_100px_rgba(8,60,55,0.10)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#0c1e1b]/78 sm:p-8 lg:p-10">
            <div className="grid items-center gap-10 lg:grid-cols-[1.12fr_0.88fr]">
              <div className="max-w-3xl">
                <span className="eyebrow inline-flex items-center gap-2 text-[10px] font-bold uppercase sm:text-xs">
                  <span className="flex size-2 items-center justify-center rounded-full bg-[var(--brand-highlight)] shadow-[0_0_0_5px_rgb(227_168_61_/_0.12)]" />
                  Digital information hub
                </span>

                <h1 className="mt-5 text-4xl font-black leading-[1.08] tracking-tight text-[#0e2b28] dark:text-white sm:text-5xl lg:text-6xl">
                  প্রয়োজনীয় তথ্য,
                  <span className="brand-gradient-text block">একটি পরিষ্কার অভিজ্ঞতায়।</span>
                </h1>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-[#56706b] dark:text-[#b7ceca] sm:text-base">
                  বাংলাদেশ ও বিশ্বের তথ্য, ক্যালেন্ডার, টুলস, সফটওয়্যার, ইসলামিক জ্ঞান ও প্রয়োজনীয় ডিজিটাল সেবা—খুঁজে নিন সহজে, ব্যবহার করুন স্বচ্ছন্দে।
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Link
                    href="/bangladesh/introduction"
                    className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-[var(--brand-primary-strong)] px-5 text-sm font-semibold text-white shadow-[0_14px_30px_var(--brand-glow)] transition hover:-translate-y-0.5 hover:bg-[var(--brand-primary)]"
                  >
                    <Compass className="size-4" />
                    তথ্য ঘুরে দেখুন
                    <ArrowUpRight className="size-4" />
                  </Link>

                  <span className="inline-flex min-h-12 items-center gap-2 rounded-2xl border border-[var(--brand-border)] bg-white/65 px-4 text-xs font-medium text-[#58736f] dark:bg-white/[0.035] dark:text-[#c4d8d4] sm:text-sm">
                    <BookMarked className="size-4 text-[var(--brand-secondary)]" />
                    নির্ভরযোগ্য ও ব্যবহারবান্ধব কনটেন্ট
                  </span>
                </div>

                <div className="mt-6">
                  <UserAnalytics />
                </div>
              </div>

              <div className="surface-panel relative overflow-hidden rounded-[1.75rem] p-5 sm:p-6">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--brand-primary)] via-[var(--brand-secondary)] to-[var(--brand-highlight)]" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--brand-primary-strong)]">Find something useful</p>
                    <h2 className="mt-2 text-xl font-extrabold tracking-tight">আজ কী জানতে চান?</h2>
                  </div>
                  <span className="feature-icon flex size-11 items-center justify-center rounded-2xl">
                    <Search className="size-5" />
                  </span>
                </div>

                <div className="mt-5 rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface)] p-4">
                  <p className="text-sm font-semibold">দ্রুত শুরু করুন</p>
                  <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                    নিচের যেকোনো ক্যাটাগরি থেকে সরাসরি প্রয়োজনীয় তথ্য বা টুলে যান।
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2.5">
                  {quickLinks.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className="group rounded-2xl border border-zinc-200/70 bg-white/70 p-3 transition hover:-translate-y-0.5 hover:border-[var(--brand-border)] hover:bg-[var(--brand-surface)] dark:border-white/10 dark:bg-white/[0.025]"
                    >
                      <Icon className="size-4 text-[var(--brand-primary)]" />
                      <span className="mt-2 block text-xs font-semibold leading-5">{label}</span>
                      <ArrowUpRight className="mt-2 size-3.5 text-zinc-300 transition group-hover:translate-x-0.5 group-hover:text-[var(--brand-primary)]" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <section aria-labelledby="services-title">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow text-[10px] font-bold uppercase sm:text-xs">Explore the hub</p>
              <h2 id="services-title" className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
                জনপ্রিয় সেবা ও তথ্য
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                প্রয়োজন অনুযায়ী একটি বিভাগ বেছে নিন। প্রতিটি সেবার ভেতরেই নির্দিষ্ট তথ্য ও ব্যবহারযোগ্য টুলস রয়েছে।
              </p>
            </div>
            <span className="inline-flex w-fit items-center rounded-full border border-[var(--brand-border)] bg-[var(--brand-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--brand-primary-strong)]">
              ১০টি বিভাগ
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
            {services.map(({ href, icon: Icon, label, details }, index) => (
              <Link key={href} href={href} className="feature-card group rounded-[1.6rem] p-4 sm:p-5">
                <span className="absolute right-4 top-4 text-[10px] font-black tracking-[0.16em] text-zinc-300 dark:text-zinc-700">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="feature-icon flex size-12 items-center justify-center rounded-2xl">
                  <Icon className="size-6" strokeWidth={1.9} />
                </span>
                <div className="mt-8">
                  <h3 className="flex items-start gap-1.5 text-sm font-extrabold leading-5 sm:text-base">
                    {label}
                    <ArrowUpRight className="mt-0.5 size-3.5 shrink-0 text-zinc-300 transition group-hover:translate-x-0.5 group-hover:text-[var(--brand-primary)]" />
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                    {details}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div className="section-rule my-12" />

        <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]" aria-labelledby="about-title">
          <article className="surface-panel overflow-hidden rounded-[1.8rem] p-6 sm:p-8">
            <p className="eyebrow text-[10px] font-bold uppercase sm:text-xs">About Totthobox</p>
            <h2 id="about-title" className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
              তথ্যবক্স — আপনার দৈনন্দিন ডিজিটাল সহায়ক
            </h2>
            <p className="mt-5 text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-base">
              বর্তমানে সঠিক তথ্য দ্রুত পাওয়া অত্যন্ত জরুরি। <strong>Totthobox</strong> বাংলাদেশের ব্যবহারকারীদের জন্য তৈরি একটি সমন্বিত ডিজিটাল সার্ভিস পোর্টাল। এখানে দৈনন্দিন জীবনের প্রয়োজনীয় তথ্য, টুলস এবং শিক্ষামূলক কনটেন্ট এক প্ল্যাটফর্মে রাখা হয়েছে।
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {[
                ["তথ্য", "বাংলাদেশ, বিশ্ব, ইতিহাস ও সাধারণ জ্ঞান।"],
                ["টুলস", "কনভার্টার ও দৈনন্দিন কাজের ব্যবহারযোগ্য সমাধান।"],
                ["জ্ঞান", "ইসলামিক ও শিক্ষামূলক কনটেন্ট।"],
                ["সহায়তা", "জরুরি সেবা, সংকেত ও প্রয়োজনীয় রিসোর্স।"],
              ].map(([title, detail]) => (
                <div key={title} className="rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface)] p-4">
                  <p className="text-sm font-bold">{title}</p>
                  <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">{detail}</p>
                </div>
              ))}
            </div>
          </article>

          <aside className="surface-panel rounded-[1.8rem] p-6 sm:p-8">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--brand-highlight)]/15 text-[var(--brand-primary-strong)]">
              <Lightbulb className="size-5" />
            </div>
            <h2 className="mt-5 text-xl font-extrabold">Designed for everyday discovery</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
              তথ্যবক্সের লক্ষ্য হলো জটিল তথ্যকে সহজে খুঁজে পাওয়া, পড়া ও কাজে লাগানো। তাই প্রতিটি বিভাগে পরিষ্কার নেভিগেশন, দ্রুত অ্যাক্সেস এবং responsive experience রাখা হয়েছে।
            </p>
            <div className="mt-6 rounded-2xl border border-[var(--brand-border)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-primary)]">Keep exploring</p>
              <p className="mt-1 text-sm font-semibold">একটি বিভাগ দিয়ে শুরু করুন—প্রয়োজনের তথ্যটি হয়তো এক ধাপ দূরেই।</p>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}
