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
  {
    href: "/bangla/calendar",
    icon: Calendar,
    label: "বাংলা ক্যালেন্ডার",
    details: "ছুটি ও বিশেষ দিবসের তালিকা।",
  },
  {
    href: "/converter/number-to-word",
    icon: ArrowLeftRight,
    label: "কনভার্টার",
    details: "মুদ্রা ও একক রূপান্তর টুলস।",
  },
  {
    href: "/tools/image-resizer",
    icon: Wrench,
    label: "বিভিন্ন টুলস",
    details: "ছবি রিসাইজ, বয়স ক্যালকুলেটর।",
  },
  {
    href: "/software/all",
    icon: Cpu,
    label: "সফটওয়্যার",
    details: "সফটওয়্যার পরিচিতি ও তথ্য।",
  },
  {
    href: "/contact/police",
    icon: PhoneCall,
    label: "জরুরি সেবা",
    details: "হেল্পলাইন ও জরুরি নম্বর।",
  },
  {
    href: "/bangladesh/introduction",
    icon: MapPin,
    label: "বাংলাদেশ",
    details: "দর্শনীয় স্থান, গুণীজন ও তথ্য।",
  },
  {
    href: "/international/all-country",
    icon: Globe,
    label: "বিশ্বকোষ",
    details: "পতাকা, রাজধানী ও মুদ্রার তথ্য।",
  },
  {
    href: "/islam/basic",
    icon: BookOpen,
    label: "ইসলামিক",
    details: "নামাজ, কালেমা ও দোয়া।",
  },
  {
    href: "/signs/all",
    icon: ShieldAlert,
    label: "সংকেত",
    details: "স্বাস্থ্য ও ট্রাফিক সংকেত।",
  },
  {
    href: "/ai/chat",
    icon: Sparkles,
    label: "Totthobox AI",
    details: "চ্যাটবট সহায়তা ও তথ্য সেবা।",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/70 px-5 py-12 shadow-[0_30px_90px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045] sm:px-10 sm:py-16">
        <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-[radial-gradient(circle,rgba(99,91,255,0.24),transparent_68%)] blur-2xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-20 size-72 rounded-full bg-[radial-gradient(circle,rgba(14,165,233,0.16),transparent_68%)] blur-2xl" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-2 text-xs font-semibold tracking-wide text-zinc-700 dark:text-zinc-200">
            <span className="size-1.5 rounded-full bg-[var(--brand-primary)] shadow-[0_0_0_4px_var(--brand-glow)]" />
            ডিজিটাল তথ্য সেবা পোর্টাল
          </span>

          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-black leading-tight tracking-[-0.045em] text-zinc-950 dark:text-white sm:text-5xl lg:text-6xl">
            প্রয়োজনীয় সব তথ্য ও সেবা
            <span className="block bg-gradient-to-r from-[var(--brand-primary-strong)] via-[var(--brand-primary)] to-[var(--brand-secondary)] bg-clip-text text-transparent">
              এক জায়গায়
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-base">
            আপনার দৈনন্দিন প্রয়োজনীয় তথ্য, টুলস ও ডিজিটাল সেবা — দ্রুত,
            পরিষ্কার ও সহজ অভিজ্ঞতায়।
          </p>

          <div className="mt-7 flex justify-center">
            <UserAnalytics />
          </div>
        </div>
      </section>

      <main className="mt-10 space-y-10 sm:mt-12">
        <section aria-labelledby="services-title">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
                Explore
              </p>
              <h2 id="services-title" className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                মূল সেবাসমূহ
              </h2>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                আপনার প্রয়োজন অনুযায়ী একটি সেবা বেছে নিন।
              </p>
            </div>
            <span className="hidden text-xs text-zinc-400 sm:block">১০টি সেবার সংগ্রহ</span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.href}
                  href={service.href}
                  className="group relative flex min-h-44 flex-col overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/75 p-4 shadow-sm backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[var(--brand-border)] hover:shadow-[0_20px_45px_var(--brand-glow)] dark:border-white/10 dark:bg-white/[0.04]"
                >
                  <span className="absolute right-3 top-3 text-[10px] font-semibold text-zinc-300 transition group-hover:text-[var(--brand-primary)]">
                    0{index + 1}
                  </span>

                  <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--brand-surface)] text-[var(--brand-primary-strong)] transition duration-300 group-hover:scale-105 group-hover:bg-[var(--brand-primary)] group-hover:text-white">
                    <Icon className="size-6 stroke-[1.8]" />
                  </div>

                  <div className="mt-auto pt-7">
                    <h3 className="flex items-center gap-1.5 text-sm font-bold leading-5 sm:text-base">
                      {service.label}
                      <ArrowUpRight className="size-3.5 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </h3>
                    <p className="mt-1.5 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                      {service.details}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <article className="rounded-[2rem] border border-zinc-200/70 bg-white/65 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.035] sm:p-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
              About Totthobox
            </p>
            <h2 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">
              তথ্যবক্স (Totthobox) — আপনার দৈনন্দিন ডিজিটাল সহায়ক
            </h2>
            <p className="mt-4 text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-base">
              বর্তমানে সঠিক তথ্য দ্রুত পাওয়া অত্যন্ত জরুরি। <strong>Totthobox</strong>{" "}
              বাংলাদেশের ব্যবহারকারীদের জন্য তৈরি একটি সমন্বিত ডিজিটাল সার্ভিস
              পোর্টাল। এখানে দৈনন্দিন জীবনের প্রয়োজনীয় তথ্য, টুলস এবং
              শিক্ষামূলক কনটেন্ট এক প্ল্যাটফর্মে রাখা হয়েছে।
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl bg-[var(--brand-surface)] p-5">
              <h3 className="text-base font-bold">কী কী সেবা পাবেন</h3>
              <ul className="mt-4 space-y-3 text-xs leading-6 text-zinc-600 dark:text-zinc-300 sm:text-sm">
                <li><strong>বাংলা ক্যালেন্ডার & ছুটির তালিকা:</strong> তারিখ, সরকারি ছুটি ও বিশেষ দিবস।</li>
                <li><strong>জরুরি সেবা ও হেল্পলাইন:</strong> পুলিশ, ফায়ার সার্ভিস ও অ্যাম্বুলেন্সের নম্বর।</li>
                <li><strong>ইসলামিক শিক্ষা:</strong> নামাজের নিয়ম, কালেমা, দোয়া ও সহজ নিয়মাবলী।</li>
                <li><strong>শিশুশিক্ষা:</strong> বর্ণমালা ও মৌলিক শিক্ষার সহজ ডিজিটাল মাধ্যম।</li>
                <li><strong>টুলস & কনভার্টার:</strong> কারেন্সি, সংখ্যা থেকে শব্দ ও পিকচার রিসাইজার।</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-zinc-200/70 bg-white/60 p-5 dark:border-white/10 dark:bg-white/[0.025]">
              <h3 className="text-base font-bold">কেন Totthobox ব্যবহার করবেন</h3>
              <p className="mt-4 text-xs leading-6 text-zinc-600 dark:text-zinc-300 sm:text-sm">
                আমরা বিশ্বাস করি প্রযুক্তি সবার জন্য সহজ হওয়া উচিত। পরিষ্কার
                নেভিগেশন ও দ্রুত স্পিডের উপর ভিত্তি করে সাইটটি তৈরি, যা আপনাকে
                অপ্রয়োজনীয় ঝামেলা থেকে মুক্ত রেখে প্রয়োজনীয় তথ্য ও সেবা খুঁজে
                পেতে সাহায্য করবে।
              </p>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
