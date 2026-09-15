"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaUsers,
  FaCalendarDay,
  FaWifi,
  FaMobileAlt,
  FaBolt,
  FaShieldAlt,
  FaHeart,
  FaArrowRight,
  FaEye,
} from "react-icons/fa";
import { AiOutlineAim } from "react-icons/ai";
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
} from "lucide-react";

type Analytics = {
  total: string;
  today: string;
  online: string;
  pwa: string;
};

const FALLBACK: Analytics = {
  total: "110k",
  today: "12.5k",
  online: "11.2k",
  pwa: "15k",
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
    details: "মুদ্রা, দৈর্ঘ্য, ওজন, তাপমাত্রা ও আরও।",
  },
  {
    href: "/tools/image-resizer",
    icon: Wrench,
    label: "বিভিন্ন টুলস",
    details: "ছবি রিসাইজ, বয়স ক্যালকুলেটর ইত্যাদি।",
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

export default function AboutUsClient() {
  const [analytics, setAnalytics] = useState<Analytics>(FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/analytics/user-count`,
          { next: { revalidate: 3600 } },
        );

        if (!res.ok) throw new Error("Failed to fetch");

        const json = await res.json();

        if (json.status === "success" && json.data) {
          setAnalytics({
            total: json.data.total || FALLBACK.total,
            today: json.data.today || FALLBACK.today,
            online: json.data.online || FALLBACK.online,
            pwa: json.data.pwa || FALLBACK.pwa,
          });
        }
      } catch (error) {
        console.error("Analytics fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-14 px-4 py-8">
      {/* Hero */}
      <header className="text-center space-y-5">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Totthobox-এ আপনাকে স্বাগতম
        </h1>
        <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          আপনার দৈনন্দিন প্রয়োজনীয় তথ্য, টুলস ও ডিজিটাল সেবা এক জায়গায় —
          নির্ভরযোগ্য ও সহজভাবে। ইতোমধ্যে{" "}
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            {loading ? "..." : `${analytics.total}+`}
          </span>{" "}
          জন ব্যবহার করেছেন।
        </p>
      </header>

      {/* Stats Dashboard */}
      <section className="space-y-5">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold">প্ল্যাটফর্ম স্ট্যাটিস্টিক্স</h2>
          <p className="text-sm text-zinc-500">লাইভ ইউজার ড্যাশবোর্ড</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="text-center p-5 rounded-2xl bg-zinc-400/10 hover:bg-zinc-400/15 transition">
            <div className="mx-auto mb-3 text-2xl flex justify-center opacity-80">
              <FaUsers />
            </div>
            <p className="text-xs sm:text-sm text-zinc-500">মোট ব্যবহারকারী</p>
            <p className="text-xl font-bold mt-1.5 tracking-tight">
              {loading ? "..." : `${analytics.total}+`}
            </p>
          </div>

          <div className="text-center p-5 rounded-2xl bg-zinc-400/10 hover:bg-zinc-400/15 transition">
            <div className="mx-auto mb-3 text-2xl flex justify-center opacity-80">
              <FaCalendarDay />
            </div>
            <p className="text-xs sm:text-sm text-zinc-500">আজকের ভিজিটর</p>
            <p className="text-xl font-bold mt-1.5 tracking-tight">
              {loading ? "..." : `${analytics.today}+`}
            </p>
          </div>

          <div className="text-center p-5 rounded-2xl bg-zinc-400/10 hover:bg-zinc-400/15 transition relative">
            <div className="absolute top-3.5 right-3.5 flex">
              <span className="size-2 bg-rose-500 rounded-full animate-ping absolute" />
              <span className="size-2 bg-rose-500 rounded-full relative" />
            </div>
            <div className="mx-auto mb-3 text-2xl flex justify-center opacity-80">
              <FaWifi />
            </div>
            <p className="text-xs sm:text-sm text-zinc-500">এই মুহূর্তে লাইভ</p>
            <p className="text-xl font-bold mt-1.5 tracking-tight">
              {loading ? "..." : `${analytics.online}+`}
            </p>
          </div>

          <div className="text-center p-5 rounded-2xl bg-zinc-400/10 hover:bg-zinc-400/15 transition">
            <div className="mx-auto mb-3 text-2xl flex justify-center opacity-80">
              <FaMobileAlt />
            </div>
            <p className="text-xs sm:text-sm text-zinc-500">
              অ্যাপ ইউজার (PWA)
            </p>
            <p className="text-xl font-bold mt-1.5 tracking-tight">
              {loading ? "..." : `${analytics.pwa}+`}
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 rounded-2xl bg-zinc-400/10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-zinc-400/15 text-lg">
              <AiOutlineAim />
            </div>
            <h2 className="text-lg font-bold">আমাদের লক্ষ্য</h2>
          </div>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            দৈনন্দিন জীবনের প্রয়োজনীয় সব ডিজিটাল টুলস, নির্ভরযোগ্য তথ্য এবং
            শিক্ষামূলক কনটেন্ট সহজে ও বিনামূল্যে সবার হাতের মুঠোয় পৌঁছে দেওয়া।
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-400/10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-zinc-400/15 text-lg">
              <FaEye />
            </div>
            <h2 className="text-lg font-bold">আমাদের ভিশন</h2>
          </div>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            বাংলাদেশের সবচেয়ে নির্ভরযোগ্য এবং স্বয়ংসম্পূর্ণ ডিজিটাল
            প্ল্যাটফর্ম হিসেবে নিজেদের প্রতিষ্ঠিত করা।
          </p>
        </div>
      </section>

      {/* Why Totthobox */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold">কেন Totthobox?</h2>
          <p className="text-sm text-zinc-500">আমরা যা অফার করি</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              icon: <FaBolt />,
              title: "দ্রুত ও সহজ",
              desc: "জটিল কিছু নেই। প্রয়োজনীয় তথ্য ও টুলস কয়েক সেকেন্ডেই পাবেন।",
            },
            {
              icon: <FaShieldAlt />,
              title: "নির্ভরযোগ্য তথ্য",
              desc: "যাচাইকৃত উৎস থেকে তথ্য সংগ্রহ করে উপস্থাপন করা হয়।",
            },
            {
              icon: <FaMobileAlt />,
              title: "মোবাইল ফ্রেন্ডলি + PWA",
              desc: "যেকোনো ডিভাইসে চমৎকার অভিজ্ঞতা। হোম স্ক্রিনে অ্যাপ হিসেবেও ব্যবহার করা যায়।",
            },
            {
              icon: <FaHeart />,
              title: "সম্পূর্ণ বিনামূল্যে",
              desc: "আমাদের মূল সেবাগুলো সবার জন্য উন্মুক্ত এবং বিনামূল্যে ব্যবহারযোগ্য।",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="p-5 rounded-2xl bg-zinc-400/10 hover:bg-zinc-400/15 transition"
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-zinc-400/15 text-lg shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm mt-1.5 text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold">আমাদের সেবাসমূহ</h2>
          <p className="text-sm text-zinc-500">
            এক নজরে Totthobox-এর মূল ফিচারগুলো
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Link
                key={service.href}
                href={service.href}
                className="flex flex-col items-center text-center p-4 rounded-2xl bg-zinc-400/10 hover:bg-zinc-400/20 transition group"
              >
                <div className="mb-3 transition-transform duration-200 group-hover:scale-110">
                  <Icon className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="text-sm font-semibold leading-tight">
                  {service.label}
                </h3>
                <p className="mt-1.5 text-xs text-zinc-500 leading-relaxed">
                  {service.details}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="p-8 sm:p-10 text-center space-y-5 rounded-2xl bg-zinc-400/10">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">আমাদের সাথে যুক্ত হোন</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
            যেকোনো মতামত, জিজ্ঞাসা বা সহযোগিতার জন্য আমাদের সাপোর্ট টিমের সাথে
            যোগাযোগ করুন।
          </p>
        </div>
        <Link
          href="/contact-us"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 transition"
        >
          যোগাযোগ করুন
          <FaArrowRight className="text-sm" />
        </Link>
      </div>
    </div>
  );
}
