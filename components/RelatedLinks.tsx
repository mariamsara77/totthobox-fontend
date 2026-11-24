"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, BookOpen, Calculator, Compass, Globe2, Heart, Wrench } from "lucide-react";

type RelatedItem = { href: string; label: string; description: string };

const groups: { match: (path: string) => boolean; title: string; items: RelatedItem[] }[] = [
  {
    match: (p) => p.startsWith("/bangla/"),
    title: "আরও দেখুন",
    items: [
      { href: "/bangla/calendar", label: "বাংলা ক্যালেন্ডার", description: "তারিখ, মাস ও বাংলা-ইংরেজি ক্যালেন্ডার দেখুন।" },
      { href: "/bangla/holiday", label: "ছুটির তালিকা", description: "বাংলাদেশের সরকারি ও গুরুত্বপূর্ণ ছুটির তথ্য দেখুন।" },
      { href: "/bangladesh/history", label: "বাংলাদেশের ইতিহাস", description: "বাংলাদেশের ইতিহাসের গুরুত্বপূর্ণ অধ্যায় পড়ুন।" },
      { href: "/bangladesh/introduction", label: "বাংলাদেশ পরিচিতি", description: "দেশের ভূগোল, প্রশাসন ও সাধারণ তথ্য জানুন।" },
    ],
  },
  {
    match: (p) => p.startsWith("/bangladesh/"),
    title: "আরও দেখুন",
    items: [
      { href: "/bangladesh/introduction", label: "বাংলাদেশ পরিচিতি", description: "বাংলাদেশ সম্পর্কে প্রয়োজনীয় মৌলিক তথ্য।" },
      { href: "/bangladesh/history", label: "বাংলাদেশের ইতিহাস", description: "ঐতিহাসিক ঘটনা ও গুরুত্বপূর্ণ সময়কাল।" },
      { href: "/bangladesh/tourism", label: "পর্যটন", description: "বাংলাদেশের দর্শনীয় স্থান ও ভ্রমণ তথ্য।" },
      { href: "/bangladesh/establishment", label: "প্রতিষ্ঠান ও তথ্য", description: "বাংলাদেশের বিভিন্ন প্রতিষ্ঠান ও সংশ্লিষ্ট তথ্য।" },
      { href: "/bangladesh/public-figure", label: "বিশিষ্ট ব্যক্তিত্ব", description: "বাংলাদেশের উল্লেখযোগ্য ব্যক্তিদের তথ্য।" },
    ],
  },
  {
    match: (p) => p.startsWith("/international/"),
    title: "গ্লোবাল তথ্য ও সেবা",
    items: [
      { href: "/international/world-clock", label: "বিশ্ব ঘড়ি ও টাইমজোন", description: "বিশ্বের বিভিন্ন শহরের লাইভ ঘড়ি ও সময় রূপান্তর।" },
      { href: "/international/crypto-forex", label: "লাইভ ক্রিপ্টো ও ফরেক্স", description: "বিটকয়েন ও আন্তর্জাতিক মুদ্রার রিয়েল-টাইম এক্সচেঞ্জ রেট।" },
      { href: "/international/calling-codes", label: "আন্তর্জাতিক ডায়ালিং কোড", description: "দেশের কান্ট্রি কোড ও জরুরি হটলাইন।" },
      { href: "/international/all-country", label: "সব দেশ ও বিশ্বকোষ", description: "দেশ, রাজধানী, মুদ্রা ও অন্যান্য আন্তর্জাতিক তথ্য।" },
      { href: "/converter/currency", label: "মুদ্রা কনভার্টার", description: "বাংলাদেশি টাকায় লাইভ কারেন্সি রূপান্তর।" },
    ],
  },
  {
    match: (p) => p.startsWith("/islam/"),
    title: "আরও দেখুন",
    items: [
      { href: "/islam/basic", label: "ইসলামিক তথ্য", description: "ইসলাম সম্পর্কে মৌলিক ও প্রয়োজনীয় তথ্য।" },
      { href: "/islam/dowan", label: "দোয়া", description: "প্রয়োজনীয় দোয়া, অর্থ ও পাঠের তথ্য।" },
      { href: "/bangla/calendar", label: "ক্যালেন্ডার", description: "তারিখ ও ক্যালেন্ডারের প্রয়োজনীয় তথ্য।" },
    ],
  },
  {
    match: (p) => p.startsWith("/converter/"),
    title: "সম্পর্কিত কনভার্টার",
    items: [
      { href: "/converter/number-to-word", label: "Number to Word", description: "সংখ্যাকে শব্দে রূপান্তর করুন।" },
      { href: "/converter/currency", label: "মুদ্রা কনভার্টার", description: "লাইভ কারেন্সি ও এক্সচেঞ্জ রেট রূপান্তর করুন।" },
      { href: "/converter/length", label: "দৈর্ঘ্য", description: "দৈর্ঘ্যের বিভিন্ন একক রূপান্তর করুন।" },
      { href: "/converter/weight", label: "ওজন", description: "ওজনের একক সহজে রূপান্তর করুন।" },
      { href: "/converter/temperature", label: "তাপমাত্রা", description: "Celsius, Fahrenheitসহ তাপমাত্রা রূপান্তর।" },
      { href: "/converter/time", label: "সময়", description: "সময় ও সময়ের একক রূপান্তর করুন।" },
      { href: "/tools/tax-vat-calculator", label: "ট্যাক্স ও ভ্যাট", description: "আয়কর ও ভ্যাট সহজে হিসাব করুন।" },
    ],
  },
  {
    match: (p) => p.startsWith("/tools/"),
    title: "সম্পর্কিত টুলস ও ক্যালকুলেটর",
    items: [
      { href: "/tools/internet-speed-test", label: "ইন্টারনেট স্পিড টেস্ট", description: "ডাউনলোড গতি ও পিং ল্যাটেন্সি পরিমাপ করুন।" },
      { href: "/tools/tax-vat-calculator", label: "আয়কর ও ভ্যাট হিসাব", description: "NBR স্লাব অনুযায়ী ব্যক্তিগত আয়কর ও ভ্যাট।" },
      { href: "/tools/password-generator", label: "পাসওয়ার্ড জেনারেটর", description: "শক্তিশালী নিরাপদ পাসওয়ার্ড ও হ্যাশ তৈরি করুন।" },
      { href: "/tools/age-calculator", label: "বয়স ক্যালকুলেটর", description: "জন্মতারিখ থেকে বয়স হিসাব করুন।" },
      { href: "/tools/percentage-calculator", label: "শতকরা ক্যালকুলেটর", description: "শতকরা ও পরিবর্তনের হিসাব করুন।" },
      { href: "/tools/word-and-character-counter", label: "Word Counter", description: "শব্দ, অক্ষর ও লেখার পরিমাণ গণনা করুন।" },
      { href: "/tools/image-resizer", label: "Image Resizer", description: "ছবির আকার প্রয়োজন অনুযায়ী পরিবর্তন করুন।" },
      { href: "/tools/qrcode-generator", label: "QR Code Generator", description: "দ্রুত QR কোড তৈরি করুন।" },
      { href: "/tools/zodiac-calculator", label: "রাশি ক্যালকুলেটর", description: "জন্মতারিখের ভিত্তিতে রাশি দেখুন।" },
      { href: "/tools/writing-practice", label: "Writing Practice", description: "বাংলা লেখার অনুশীলন করুন।" },
    ],
  },
  {
    match: (p) => p.startsWith("/software"),
    title: "আরও দেখুন",
    items: [
      { href: "/software/all", label: "সফটওয়্যার ডিরেক্টরি", description: "Windows, Android ও Mac-এর সফটওয়্যার খুঁজুন।" },
      { href: "/tools/image-resizer", label: "Image Resizer", description: "ছবির আকার পরিবর্তনের টুল ব্যবহার করুন।" },
      { href: "/pdf-editor", label: "PDF Editor", description: "PDF নিয়ে প্রয়োজনীয় কাজ করুন।" },
    ],
  },
  {
    match: (p) => p.startsWith("/signs/"),
    title: "আরও দেখুন",
    items: [
      { href: "/signs/all", label: "সব সংকেত", description: "বিভিন্ন ধরনের রাস্তা ও নিরাপত্তা সংকেত দেখুন।" },
      { href: "/bangladesh/tourism", label: "বাংলাদেশ পর্যটন", description: "ভ্রমণের জন্য দর্শনীয় স্থান সম্পর্কে জানুন।" },
      { href: "/bangladesh/introduction", label: "বাংলাদেশ পরিচিতি", description: "বাংলাদেশের সাধারণ ও প্রশাসনিক তথ্য।" },
    ],
  },
];

function iconFor(path: string) {
  if (path.startsWith("/converter")) return Calculator;
  if (path.startsWith("/tools")) return Wrench;
  if (path.startsWith("/bangladesh")) return Compass;
  if (path.startsWith("/international")) return Globe2;
  if (path.startsWith("/islam")) return Heart;
  return BookOpen;
}

export default function RelatedLinks() {
  const pathname = usePathname();
  const group = groups.find((item) => item.match(pathname));
  if (!group) return null;

  const items = group.items.filter((item) => item.href !== pathname).slice(0, 6);
  if (!items.length) return null;

  return (
    <section className="mx-auto w-full max-w-2xl px-4 pb-8 pt-6 sm:px-6 sm:pt-8" aria-labelledby="related-pages-title">
      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6">
        <div className="mb-4 space-y-1">
          <div>
            <h2 id="related-pages-title" className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {group.title}
            </h2>
            <p className="text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Totthobox-এর একই বিষয়ের আরও প্রয়োজনীয় তথ্য ও টুলস।
            </p>
          </div>
        </div>
        <nav aria-label={group.title}>
          <div className="grid gap-3 sm:grid-cols-2">
            {items.map((item) => {
              const Icon = iconFor(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group block rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-800/40 p-4 transition-all duration-200 hover:bg-white dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-xs hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1 text-sm font-semibold leading-5 text-zinc-900 dark:text-zinc-100">
                        {item.label}
                        <ArrowRight className="h-3.5 w-3.5 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                      </span>
                      <span className="mt-1 block text-xs sm:text-sm leading-5 text-zinc-500 dark:text-zinc-400">
                        {item.description}
                      </span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </section>
  );
}
