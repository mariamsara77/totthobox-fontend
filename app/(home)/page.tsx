import type { Metadata } from "next";
import Link from "next/link";
import {
  Zap,
  ShieldCheck,
  HeartHandshake,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import UserAnalytics from "@/components/UserAnalytics";
import { QuickFavoritesBar } from "@/components/tools/QuickFavorites";
import StickyCategoryNav from "@/components/navigation/StickyCategoryNav";
import TrendingServices from "@/components/home/TrendingServices";
import CategorySection from "@/components/home/CategorySection";
import HeroSearch from "@/components/home/HeroSearch";
import { ALL_NAV_ITEMS, NAVIGATION_REGISTRY } from "@/config/navigation";
import AdSlot from "@/components/AdSlot";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "তথ্যবক্স — প্রয়োজনীয় সব তথ্য ও ডিজিটাল সেবা এক জায়গায়",
  description:
    "বাংলা ক্যালেন্ডার, স্মার্ট কনভার্টার, এনবিআর আয়কর ও ইউটিলিটি ক্যালকুলেটর, জরুরি হটলাইন, ইসলামিক জ্ঞান ও বাংলাদেশ সংক্রান্ত দরকারি সেবা এক প্ল্যাটফর্মে সম্পূর্ণ বিনামূল্যে।",
  alternates: { canonical: "https://totthobox.com" },
  openGraph: {
    title: "তথ্যবক্স — প্রয়োজনীয় সব তথ্য ও ডিজিটাল সেবা এক জায়গায়",
    description:
      "বাংলা ক্যালেন্ডার, স্মার্ট কনভার্টার, এনবিআর আয়কর ও ইউটিলিটি ক্যালকুলেটর, জরুরি হটলাইন ও বাংলাদেশ সংক্রান্ত দরকারি সেবা এক প্ল্যাটফর্মে।",
    url: "https://totthobox.com",
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
      "বাংলা ক্যালেন্ডার, স্মার্ট কনভার্টার, এনবিআর আয়কর ও ইউটিলিটি ক্যালকুলেটর, জরুরি হটলাইন ও দরকারি ডিজিটাল সেবা।",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }],
  },
};

const toBn = (n: number) =>
  n.toString().replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)]);

interface ValueProp {
  Icon: LucideIcon;
  title: string;
  text: string;
}

const VALUE_PROPS: ValueProp[] = [
  {
    Icon: Zap,
    title: "অতি দ্রুত ও লাইটওয়েট",
    text: "কোনো ভারী স্ক্রিপ্ট বা অযথা অপেক্ষা ছাড়া যেকোনো মোবাইল ও ধীর গতির নেটওয়ার্কেও দ্রুত পেজ লোড হয়।",
  },
  {
    Icon: ShieldCheck,
    title: "যাচাইকৃত ও প্রামাণ্য তথ্য",
    text: "বাংলাদেশ জাতীয় তথ্য বাতায়ন, এনবিআর কর কোড ও প্রামাণ্য উৎস অনুযায়ী সকল সূত্র মিলিয়ে দেখা।",
  },
  {
    Icon: HeartHandshake,
    title: "১০০% উন্মুক্ত ও নিরাপদ",
    text: "সকল ক্যালকুলেটর, কনভার্টার ও গাইড সবার জন্য বিনামূল্যে উন্মুক্ত এবং ব্যক্তিগত তথ্যের সুরক্ষা নিশ্চিত।",
  },
];

interface Faq {
  q: string;
  a: string;
  link?: { href: string; label: string };
}

const FAQS: Faq[] = [
  {
    q: "তথ্যবক্সের সেবাগুলো কি সম্পূর্ণ বিনামূল্যে",
    a: "হ্যাঁ, তথ্যবক্সের সমস্ত ইউটিলিটি টুলস, ক্যালকুলেটর, একক রূপান্তরক এবং তথ্যাবলি সর্বসাধারণের জন্য আজীবন বিনামূল্যে ব্যবহারযোগ্য। কোনো লুকায়িত চার্জ নেই।",
  },
  {
    q: "জমির পরিমাপ ও আয়কর হিসাব কতটা নির্ভুল",
    a: "আমাদের কনভার্টারে সরকারি ভূমিনীতি (১ শতাংশ = ৪৩৫.৬ বর্গফুট) এবং জাতীয় রাজস্ব বোর্ডের (NBR) সর্বশেষ কর স্ল্যাব অনুযায়ী অ্যালগরিদম তৈরি করা হয়েছে।",
  },
  {
    q: "তথ্যবক্সে কি কোনো অ্যাকাউন্ট খোলা বাধ্যতামূলক",
    a: "না, টুলস ব্যবহার, ছুটি দেখা বা তথ্য খোঁজার জন্য কোনো লগইন প্রয়োজন নেই। তবে আপনি চাইলে নিজস্ব বুকমার্ক ও প্রোফাইল সেটিং সংরক্ষণের জন্য যুক্ত হতে পারেন।",
  },
  {
    q: "কোনো তথ্যের ভুল পেলে কীভাবে জানাব",
    a: "আমাদের রয়েছে সার্বক্ষণিক সম্পাদকীয় সহায়তা। যোগাযোগ ফর্ম বা ইমেইলের মাধ্যমে সংশোধন জানালে আমাদের টিম দ্রুত তা যাচাই করে আপডেট করে।",
    link: { href: "/contact-us", label: "যোগাযোগ পেজে যান" },
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function HomePage() {
  const serviceCount = ALL_NAV_ITEMS.length;
  const categoryCount = NAVIGATION_REGISTRY.length;

  return (
    <div className="min-h-screen pb-20 md:pb-12">
      {/* Hero */}
      <section className="pwa-safe-top md:pt-0">
        <div className="mx-auto max-w-4xl space-y-5 px-4 py-8 text-center sm:space-y-6 sm:py-12">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            তথ্যবক্স · বাংলাদেশের নাগরিক ডিজিটাল পঞ্জিকা ও ইউটিলিটি হাব
          </p>

          <h1 className="text-balance text-3xl font-semibold leading-[1.35] tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
            প্রয়োজনীয় সকল তথ্য ও সেবা{" "}
            <span className="text-[var(--accent-ink)]">
              এক প্ল্যাটফর্মে হাতের মুঠোয়
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-base leading-8 text-zinc-600 dark:text-zinc-400">
            দৈনন্দিন জীবনের প্রয়োজনীয় ক্যালকুলেটর, স্মার্ট কনভার্টার, সরকারি
            ছুটির তালিকা, বাংলাদেশ বিশ্বকোষ ও জরুরি সেবা সম্পূর্ণ বিনামূল্যে।
          </p>

          <HeroSearch />

          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-700 tabular-nums dark:text-zinc-300">
            <li className="flex items-center gap-1.5">
              <CheckCircle2
                className="size-4 text-[var(--accent-ink)]"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              {toBn(serviceCount)}টি সেবা, {toBn(categoryCount)}টি বিভাগে
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2
                className="size-4 text-[var(--accent-ink)]"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              সম্পূর্ণ বিনামূল্যে
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2
                className="size-4 text-[var(--accent-ink)]"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              লগইন ছাড়াই ব্যবহার
            </li>
          </ul>

          <div className="flex justify-center">
            <UserAnalytics />
          </div>

          <div className="mx-auto max-w-4xl pt-1 text-left">
            <QuickFavoritesBar />
          </div>
        </div>
      </section>

      {/* Category tabs */}
      <StickyCategoryNav />

      {/* Services */}
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-8 sm:py-10">
        <TrendingServices />

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

        {/* Reserved ad space (zero layout shift) */}
        <div className="mx-auto max-w-4xl">
          <AdSlot
            pageType="article"
            contentWords={650}
            placement="between-sections"
            minHeight={280}
            className="my-6"
          />
        </div>

        {/* Why Totthobox */}
        <section
          aria-label="তথ্যবক্সের বৈশিষ্ট্য"
          className="grid grid-cols-1 gap-4 border-t border-zinc-200 pt-10 md:grid-cols-3 dark:border-zinc-800"
        >
          {VALUE_PROPS.map(({ Icon, title, text }) => (
            <div
              key={title}
              className="space-y-3 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex size-10 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-[var(--accent-ink)] dark:border-zinc-800 dark:bg-zinc-800">
                <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold leading-snug text-zinc-900 dark:text-zinc-100">
                {title}
              </h3>
              <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                {text}
              </p>
            </div>
          ))}
        </section>

        {/* FAQ */}
        <section
          aria-labelledby="faq-heading"
          className="mx-auto max-w-3xl space-y-5"
        >
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
            }}
          />

          <div className="space-y-1.5 text-center">
            <p className="text-xs font-medium text-[var(--accent-ink)]">
              সাধারণ প্রশ্নোত্তর
            </p>
            <h2
              id="faq-heading"
              className="text-xl font-semibold leading-snug text-zinc-900 sm:text-2xl dark:text-zinc-100"
            >
              তথ্যবক্স সম্পর্কে সচরাচর জিজ্ঞাসিত প্রশ্ন
            </h2>
          </div>

          <div className="space-y-2.5">
            {FAQS.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-xl border border-zinc-200 bg-white open:border-[var(--accent-soft-border)] dark:border-zinc-800 dark:bg-zinc-900"
              >
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-4 py-3 text-base font-medium leading-snug text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] dark:text-zinc-100 [&::-webkit-details-marker]:hidden">
                  <span>{faq.q}</span>
                  <ChevronDown
                    className="size-5 shrink-0 text-zinc-500 transition-transform group-open:rotate-180 motion-reduce:transition-none"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </summary>
                <div className="space-y-2 px-4 pb-4 text-sm leading-7 text-zinc-600 sm:text-base dark:text-zinc-400">
                  <p>{faq.a}</p>
                  {faq.link && (
                    <Link
                      href={faq.link.href}
                      className="inline-block font-medium text-[var(--accent-ink)] underline underline-offset-4"
                    >
                      {faq.link.label}
                    </Link>
                  )}
                </div>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
