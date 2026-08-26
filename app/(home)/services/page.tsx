import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRightLeft,
  BookOpen,
  CalendarDays,
  Globe,
  Map,
  MonitorPlay,
  PhoneCall,
  Sparkles,
  TriangleAlert,
  Wrench,
} from "lucide-react";

export const metadata: Metadata = {
  title: "মূল সেবা | Totthobox",
  description:
    "Totthobox-এ পাবেন বাংলাদেশ জেলা তথ্য, ইসলামিক শিক্ষা, জরুরি নম্বর, ছুটির তালিকা, কনভার্টার এবং প্রয়োজনীয় ডিজিটাল সেবা।",
  keywords: [
    "তথ্যবক্স",
    "Totthobox",
    "বাংলাদেশ সার্ভিস পোর্টাল",
    "বাংলা ক্যালেন্ডার",
    "জরুরি নম্বর",
    "কনভার্টার",
    "ইসলামিক শিক্ষা",
  ],
};

const services = [
  { href: "/bangla/calendar", icon: CalendarDays, label: "বাংলা ক্যালেন্ডার", details: "ছুটি ও বিশেষ দিবসের তালিকা।" },
  { href: "/converter/number-to-word", icon: ArrowRightLeft, label: "কনভার্টার", details: "মুদ্রা ও একক রূপান্তর টুলস।" },
  { href: "/tools/image-resizer", icon: Wrench, label: "বিভিন্ন টুলস", details: "ছবি রিসাইজ, বয়স ক্যালকুলেটর প্রভৃতি।" },
  { href: "/software/all", icon: MonitorPlay, label: "সফটওয়্যার", details: "সফটওয়্যার পরিচিতি ও তথ্য।" },
  { href: "/contact/police", icon: PhoneCall, label: "জরুরি সেবা", details: "হেল্পলাইন ও জরুরি নম্বর।" },
  { href: "/bangladesh/introduction", icon: Map, label: "বাংলাদেশ", details: "দর্শনীয় স্থান, গুণীজন ও অন্যান্য তথ্য।" },
  { href: "/international/all-country", icon: Globe, label: "বিশ্বকোষ", details: "পতাকা, রাজধানী ও মুদ্রার তথ্য।" },
  { href: "/islam/basic", icon: BookOpen, label: "ইসলামিক", details: "নামাজ, কালেমা ও দোয়া।" },
  { href: "/signs/all", icon: TriangleAlert, label: "সংকেত", details: "স্বাস্থ্য ও ট্রাফিক সংকেত।" },
  { href: "/ai/chat", icon: Sparkles, label: "Totthobox AI", details: "চ্যাটবট সহায়তা ও তথ্য সেবা।" },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 py-8 lg:px-8">
      <header className="mx-auto max-w-2xl space-y-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight">মূল সেবা</h1>
        <p className="text-base opacity-50 sm:text-lg">
          আপনার দৈনন্দিন প্রয়োজনীয় তথ্য, টুলস ও ডিজিটাল সেবা এক জায়গায় — নির্ভরযোগ্য ও সহজভাবে।
        </p>
      </header>

      <section aria-labelledby="services-heading" className="space-y-4">
        <h2 id="services-heading" className="sr-only">সকল সেবা</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {services.map(({ href, icon: Icon, label, details }) => (
            <Link
              key={href}
              href={href}
              className="group flex h-full flex-col items-center rounded-2xl bg-zinc-400/10 p-4 text-center transition-colors hover:bg-zinc-400/25"
            >
              <div className="mb-4 transition-transform duration-200 group-hover:scale-105">
                <Icon aria-hidden="true" className="h-10 w-10 stroke-[1.5]" />
              </div>
              <h3 className="text-base font-medium">{label}</h3>
              <span className="mt-2 text-xs leading-relaxed opacity-50">{details}</span>
            </Link>
          ))}
        </div>
      </section>

      <hr className="border-zinc-400/25" />

      <article className="space-y-4">
        <h2 className="text-2xl font-bold">তথ্যবক্স (Totthobox) — আপনার দৈনন্দিন ডিজিটাল সহায়ক</h2>
        <div className="space-y-5 text-base leading-relaxed">
          <p>
            বর্তমানে সঠিক তথ্য দ্রুত পাওয়া অত্যন্ত জরুরি। <strong>Totthobox</strong> বাংলাদেশের ব্যবহারকারীদের জন্য তৈরি একটি সমন্বিত ডিজিটাল সার্ভিস পোর্টাল। এখানে দৈনন্দিন জীবনের প্রয়োজনীয় তথ্য, টুলস এবং শিক্ষামূলক কনটেন্ট এক প্ল্যাটফর্মে রাখা হয়েছে।
          </p>

          <h3 className="pt-4 text-xl font-bold">কী কী সেবা পাবেন</h3>
          <ul className="list-inside list-disc space-y-3">
            <li><strong>বাংলা ক্যালেন্ডার ও ছুটির তালিকা:</strong> বাংলা ও ইংরেজি তারিখ, সরকারি ছুটি এবং বিশেষ দিবসের তথ্য এক নজরে দেখুন।</li>
            <li><strong>জরুরি সেবা ও হেল্পলাইন:</strong> পুলিশ, ফায়ার সার্ভিস, অ্যাম্বুলেন্সসহ প্রয়োজনীয় জরুরি নম্বরগুলো সহজে খুঁজে পাওয়ার ব্যবস্থা রাখা হয়েছে।</li>
            <li><strong>ইসলামিক শিক্ষা:</strong> নামাজের নিয়ম, কালেমা, দোয়া এবং মৌলিক ইসলামিক জ্ঞান সহজ ভাষায় উপস্থাপন করা হয়েছে।</li>
            <li><strong>কনভার্টার ও টুলস:</strong> মুদ্রা রূপান্তর, সংখ্যা থেকে শব্দ, ছবি রিসাইজ এবং অন্যান্য দৈনন্দিন টুলস এক জায়গায় পাওয়া যায়।</li>
            <li><strong>বিশ্বকোষ:</strong> দেশ-বিদেশের মৌলিক তথ্য, পতাকা, রাজধানী ও মুদ্রার তথ্য সহজে পাওয়া যায়।</li>
            <li><strong>স্বাস্থ্য ও সংকেত:</strong> সাধারণ স্বাস্থ্য এবং ট্রাফিক সংকেত সম্পর্কিত তথ্য সহজভাবে উপস্থাপন করা হয়েছে।</li>
          </ul>

          <h3 className="pt-4 text-xl font-bold">কেন Totthobox ব্যবহার করবেন</h3>
          <p className="opacity-50">
            আমরা বিশ্বাস করি প্রযুক্তি সহজ ও সবার জন্য ব্যবহারযোগ্য হওয়া উচিত। তাই Totthobox-এ পরিষ্কার নেভিগেশন এবং দ্রুত লোডিংয়ের উপর গুরুত্ব দেওয়া হয়। নতুন ফিচার ও উন্নতি ধারাবাহিকভাবে যোগ করা হয়, যাতে দৈনন্দিন তথ্য অনুসন্ধান আরও সহজ হয়।
          </p>
        </div>
      </article>
    </div>
  );
}
