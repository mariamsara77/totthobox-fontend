"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  WifiOff,
  RefreshCw,
  Calendar,
  Calculator,
  Phone,
  KeyRound,
  ArrowRight,
} from "lucide-react";

const OFFLINE_CAPABLE_TOOLS = [
  {
    title: "বয়স ক্যালকুলেটর",
    description: "অফলাইনেও জন্ম তারিখ দিয়ে সঠিক বয়স ও দিনক্ষণ গণনা করুন",
    href: "/tools/age-calculator",
    icon: Calendar,
  },
  {
    title: "জমি ও ক্ষেত্রফল পরিমাপ",
    description: "শতক, কাঠা, বিঘা ও একরের লোকাল ক্যালকুলেশন",
    href: "/converter/area",
    icon: Calculator,
  },
  {
    title: "জরুরি সেবা নম্বর (৯৯৯)",
    description: "পুলিশ, অ্যাম্বুলেন্স ও ফায়ার সার্ভিসের জরুরি হটলাইন",
    href: "/contact/emergency",
    icon: Phone,
  },
  {
    title: "পাসওয়ার্ড জেনারেটর",
    description: "ইন্টারনেট ছাড়াই ক্রিপ্টোগ্রাফিক স্ট্রং পাসওয়ার্ড তৈরি করুন",
    href: "/tools/password-generator",
    icon: KeyRound,
  },
];

export default function OfflinePage() {
  const [isReloading, setIsReloading] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      window.location.reload();
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, []);

  const handleRetry = () => {
    if (isReloading) return;
    setIsReloading(true);
    window.location.reload();
  };

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-white px-4 py-12 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
      <section className="w-full max-w-lg text-center space-y-6">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-100/80 text-zinc-700 shadow-xs dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
          <WifiOff className="size-7" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-zinc-900 dark:text-zinc-50">
            আপনি বর্তমানে অফলাইনে আছেন
          </h1>

          <p className="mx-auto max-w-sm text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            আপনার ইন্টারনেট সংযোগ পাওয়া যাচ্ছে না। সংযোগ ফিরে এলে পেজটি স্বয়ংক্রিয়ভাবে রিলোড হবে।
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleRetry}
            disabled={isReloading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 active:scale-[0.98] disabled:cursor-wait disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-xs"
          >
            <RefreshCw
              className={`size-4 ${isReloading ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
            {isReloading ? "আবার চেষ্টা করা হচ্ছে..." : "আবার চেষ্টা করুন"}
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-5 py-2.5 text-sm font-semibold text-zinc-800 dark:text-zinc-200 transition hover:bg-zinc-50 dark:hover:bg-zinc-700 shadow-xs"
          >
            <span>হোমে যান</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {/* Offline-ready tools */}
        <div className="pt-6 text-left border-t border-zinc-200 dark:border-zinc-800 space-y-3">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            অফলাইনে ব্যবহারযোগ্য ফিচারসমূহ:
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {OFFLINE_CAPABLE_TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group flex items-start gap-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/60 p-3 hover:border-zinc-400 dark:hover:border-zinc-600 transition shadow-xs"
                >
                  <div className="size-8 shrink-0 flex items-center justify-center rounded-lg bg-white dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 shadow-xs group-hover:text-primary-600">
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-primary-600">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                      {tool.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
