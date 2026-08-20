import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { 
  CalendarDays, 
  ArrowRightLeft, 
  Wrench, 
  MonitorPlay, 
  PhoneCall, 
  Map, 
  Globe, 
  BookOpen, 
  GraduationCap, 
  TriangleAlert, 
  Sparkles 
} from 'lucide-react';

// SEO Metadata
export const metadata: Metadata = {
  title: 'মূল সেবা | Totthobox',
  description: 'Totthobox-এ পাবেন বাংলাদেশ জেলা তথ্য, ইসলামিক শিক্ষা, স্বাস্থ্য জ্ঞান, জরুরী নম্বর, ছুটির তালিকা, কনভার্টার এবং প্রয়োজনীয় ডিজিটাল সেবা।',
  keywords: 'তথ্যবক্স, Totthobox, বাংলাদেশ সার্ভিস পোর্টাল, বাংলা ক্যালেন্ডার, জরুরি নম্বর, শিশুশিক্ষা, কনভার্টার, ইসলামিক শিক্ষা',
};

// Mock Data for Services
const services = [
  {
    href: '/calendar',
    icon: CalendarDays,
    label: 'বাংলা ক্যালেন্ডার',
    details: 'ছুটি ও বিশেষ দিবসের তালিকা।',
  },
  {
    href: '/converter',
    icon: ArrowRightLeft,
    label: 'কনভার্টার',
    details: 'মুদ্রা ও একক রূপান্তর টুলস।',
  },
  {
    href: '/tools',
    icon: Wrench,
    label: 'বিভিন্ন টুলস',
    details: 'ছবি রিসাইজ, বয়স ক্যালকুলেটর প্রভৃতি।',
  },
  {
    href: '/software',
    icon: MonitorPlay,
    label: 'সফটওয়্যার',
    details: 'সফটওয়্যার পরিচিতি ও তথ্য।',
  },
  {
    href: '/contact-numbers',
    icon: PhoneCall,
    label: 'জরুরি সেবা',
    details: 'হেল্পলাইন ও জরুরি নম্বর।',
  },
  {
    href: '/bangladesh',
    icon: Map,
    label: 'বাংলাদেশ',
    details: 'দর্শনিয় স্থান, গুণীজন ও অন্যান্য তথ্য।',
  },
  {
    href: '/international',
    icon: Globe,
    label: 'বিশ্বকোষ',
    details: 'পতাকা, রাজধানী ও মুদ্রার তথ্য।',
  },
  {
    href: '/islamic',
    icon: BookOpen,
    label: 'ইসলামিক',
    details: 'নামাজ, কালেমা ও দোয়া।',
  },
  {
    href: '/child-education',
    icon: GraduationCap,
    label: 'শিশুশিক্ষা',
    details: 'বর্ণমালা ও মৌলিক শিক্ষা।',
  },
  {
    href: '/signs',
    icon: TriangleAlert,
    label: 'সংকেত',
    details: 'স্বাস্থ্য ও ট্রাফিক সংকেত।',
  },
  {
    href: '/ai-chat',
    icon: Sparkles,
    label: 'Totthobox AI',
    details: 'চ্যাটবট সহায়তা ও তথ্য সেবা।',
  },
];

export default function ServicesPage() {
  return (
    <div className="max-w-7xl mx-auto p-4 lg:px-8 space-y-8 py-8">
      
      {/* Header */}
      <header className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white tracking-tight">
          মূল সেবা
        </h1>
        <p className="text-base sm:text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">
          আপনার দৈনন্দিন প্রয়োজনীয় তথ্য, টুলস ও ডিজিটাল সেবা এক জায়গায় — নির্ভরযোগ্য ও সহজভাবে।
        </p>
      </header>

      {/* Dashboard Placeholder (আপনার livewire dashboard-এর বিকল্প) */}
      <div className="w-full">
        <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 text-center">
          <p className="text-zinc-500 dark:text-zinc-400">ড্যাশবোর্ড সেকশন (এখানে আপনার ইউজারের ড্যাশবোর্ড উইজেট বসবে)</p>
        </div>
      </div>

      {/* Services Grid */}
      <section aria-labelledby="services-heading">
        <h2 id="services-heading" className="sr-only">সকল সেবা</h2>
        
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Link
                key={index}
                href={service.href}
                className="relative flex flex-col items-center h-full p-4 text-center transition-all duration-200 border border-transparent group rounded-3xl bg-zinc-50 dark:bg-white/5 hover:border-zinc-300 dark:hover:border-zinc-600/50 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"
              >
                <div className="mb-3 transition-transform duration-200 transform group-hover:scale-110 text-zinc-900 dark:text-white">
                  <Icon className="w-12 h-12 stroke-[1.5]" />
                </div>

                <h3 className="text-lg font-medium text-zinc-900 dark:text-white transition-colors group-hover:font-bold">
                  {service.label}
                </h3>

                <span className="mt-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {service.details}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <hr className="border-zinc-200 dark:border-zinc-700 opacity-50 my-12" />

      {/* Content Section (AdSense thin-content fix) */}
      <article className="space-y-6">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
          তথ্যবক্স (Totthobox) — আপনার দৈনন্দিন ডিজিটাল সহায়ক
        </h2>

        <div className="space-y-5 text-zinc-700 dark:text-zinc-300 prose prose-zinc dark:prose-invert max-w-none">
          <p className="text-base leading-relaxed">
            বর্তমানে সঠিক তথ্য দ্রুত পাওয়া অত্যন্ত জরুরি। <strong>Totthobox</strong> বাংলাদেশের ব্যবহারকারীদের
            জন্য তৈরি একটি সমন্বিত ডিজিটাল সার্ভিস পোর্টাল। এখানে দৈনন্দিন জীবনের প্রয়োজনীয় তথ্য, টুলস এবং
            শিক্ষামূলক কনটেন্ট এক প্ল্যাটফর্মে রাখা হয়েছে, যাতে আপনি সহজে নির্ভরযোগ্য তথ্য পেতে পারেন।
          </p>

          <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mt-8 mb-4">কী কী সেবা পাবেন</h3>

          <ul className="space-y-3 text-base leading-relaxed">
            <li>
              <strong>বাংলা ক্যালেন্ডার ও ছুটির তালিকা:</strong> বাংলা ও ইংরেজি তারিখ, সরকারি ছুটি এবং বিশেষ
              দিবসের তথ্য এক নজরে দেখুন। পরিকল্পনা করতে এবং দৈনন্দিন কাজের সময় নির্ধারণে এটি সহায়ক।
            </li>
            <li>
              <strong>জরুরি সেবা ও হেল্পলাইন:</strong> পুলিশ, ফায়ার সার্ভিস, অ্যাম্বুলেন্সসহ প্রয়োজনীয় জরুরি
              নম্বরগুলো সহজে খুঁজে পাওয়ার ব্যবস্থা রাখা হয়েছে, যাতে প্রয়োজনের মুহূর্তে দ্রুত যোগাযোগ করা যায়।
            </li>
            <li>
              <strong>ইসলামিক শিক্ষা:</strong> নামাজের নিয়ম, কালেমা, দোয়া এবং মৌলিক ইসলামিক জ্ঞান সহজ ভাষায়
              উপস্থাপন করা হয়েছে, যাতে নতুন শিক্ষার্থীরাও উপকৃত হতে পারেন।
            </li>
            <li>
              <strong>শিশুশিক্ষা:</strong> বর্ণমালা, সংখ্যা এবং মৌলিক ডিজিটাল শিক্ষার অনুশীলনের সুযোগ রয়েছে, যা
              শিশুদের শেখার প্রথম ধাপে সহায়তা করে।
            </li>
            <li>
              <strong>কনভার্টার ও টুলস:</strong> মুদ্রা রূপান্তর, সংখ্যা থেকে শব্দ, ছবি রিসাইজ এবং অন্যান্য
              দৈনন্দিন টুলস এক জায়গায় পাওয়া যায়।
            </li>
            <li>
              <strong>বিশ্বকোষ ও সংবাদ:</strong> দেশ-বিদেশের মৌলিক তথ্য (পতাকা, রাজধানী, মুদ্রা) এবং সর্বশেষ
              সংবাদের শিরোনাম দেখার সুবিধা রয়েছে।
            </li>
            <li>
              <strong>স্বাস্থ্য ও সংকেত:</strong> সাধারণ স্বাস্থ্য সংকেত এবং ট্রাফিক সংকেত সম্পর্কিত তথ্য সহজভাবে
              উপস্থাপন করা হয়েছে।
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mt-8 mb-4">কেন Totthobox ব্যবহার করবেন</h3>

          <p className="text-base leading-relaxed">
            আমরা বিশ্বাস করি প্রযুক্তি সহজ ও সবার জন্য ব্যবহারযোগ্য হওয়া উচিত। তাই Totthobox-এ জটিল মেনু বা
            অপ্রয়োজনীয় বিভ্রান্তি এড়িয়ে পরিষ্কার নেভিগেশন এবং দ্রুত লোডিংয়ের উপর গুরুত্ব দেওয়া হয়। কনটেন্ট
            নিয়মিত পর্যালোচনা ও আপডেট করা হয়, যাতে তথ্য যথাসম্ভব নির্ভুল থাকে।
          </p>

          <p className="text-base leading-relaxed">
            ভ্রমণ, শিক্ষা, জরুরি প্রয়োজন বা দৈনন্দিন হিসাব—যে কোনো কাজে প্রয়োজনীয় তথ্য এক প্ল্যাটফর্ম থেকে
            পাওয়ার চেষ্টা করা হয়েছে। নতুন ফিচার ও উন্নতি ধারাবাহিকভাবে যোগ করা হয়, যাতে সেবা আরও উপযোগী হয়।
          </p>

          <p className="text-base leading-relaxed">
            আপনার মতামত ও পরামর্শ আমাদের জন্য গুরুত্বপূর্ণ। কোনো তথ্য আপডেট বা সংশোধনের প্রয়োজন হলে যোগাযোগ
            পেজের মাধ্যমে জানাতে পারেন। Totthobox ব্যবহার করে আপনার দৈনন্দিন তথ্য অনুসন্ধান আরও সহজ হোক—এটাই
            আমাদের লক্ষ্য।
          </p>
        </div>
      </article>

    </div>
  );
}