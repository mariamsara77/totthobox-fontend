"use client";

import { useState, useEffect, useMemo } from "react";
import { Clock, Globe, ArrowRightLeft, Search, Plus, Trash2, Sun, Moon, Calendar } from "lucide-react";
import { FavoriteButton } from "@/components/tools/QuickFavorites";
import { ShareToolButton, CopyResultButton } from "@/components/tools/ToolActions";

interface CityClock {
  id: string;
  city: string;
  country: string;
  timeZone: string;
  flag: string;
  offsetLabel: string;
}

const DEFAULT_CITIES: CityClock[] = [
  { id: "dhaka", city: "ঢাকা", country: "বাংলাদেশ", timeZone: "Asia/Dhaka", flag: "🇧🇩", offsetLabel: "UTC+6" },
  { id: "london", city: "লন্ডন", country: "যুক্তরাজ্য", timeZone: "Europe/London", flag: "🇬🇧", offsetLabel: "UTC+0/1" },
  { id: "newyork", city: "নিউইয়র্ক", country: "যুক্তরাষ্ট্র", timeZone: "America/New_York", flag: "🇺🇸", offsetLabel: "UTC-5/-4" },
  { id: "dubai", city: "দুবাই", country: "সংযুক্ত আরব আমিরাত", timeZone: "Asia/Dubai", flag: "🇦🇪", offsetLabel: "UTC+4" },
  { id: "tokyo", city: "টোকিও", country: "জাপান", timeZone: "Asia/Tokyo", flag: "🇯🇵", offsetLabel: "UTC+9" },
  { id: "singapore", city: "সিঙ্গাপুর", country: "সিঙ্গাপুর", timeZone: "Asia/Singapore", flag: "🇸🇬", offsetLabel: "UTC+8" },
  { id: "riyadh", city: "রিয়াদ", country: "সৌদি আরব", timeZone: "Asia/Riyadh", flag: "🇸🇦", offsetLabel: "UTC+3" },
  { id: "sydney", city: "সিডনি", country: "অস্ট্রেলিয়া", timeZone: "Australia/Sydney", flag: "🇦🇺", offsetLabel: "UTC+10/11" },
];

const ALL_TIMEZONES = [
  { city: "ঢাকা (Dhaka)", timeZone: "Asia/Dhaka", flag: "🇧🇩" },
  { city: "লন্ডন (London)", timeZone: "Europe/London", flag: "🇬🇧" },
  { city: "নিউইয়র্ক (New York)", timeZone: "America/New_York", flag: "🇺🇸" },
  { city: "লস অ্যাঞ্জেলেস (Los Angeles)", timeZone: "America/Los_Angeles", flag: "🇺🇸" },
  { city: "দুবাই (Dubai)", timeZone: "Asia/Dubai", flag: "🇦🇪" },
  { city: "রিয়াদ (Riyadh)", timeZone: "Asia/Riyadh", flag: "🇸🇦" },
  { city: "টোকিও (Tokyo)", timeZone: "Asia/Tokyo", flag: "🇯🇵" },
  { city: "সিঙ্গাপুর (Singapore)", timeZone: "Asia/Singapore", flag: "🇸🇬" },
  { city: "কুয়ালালামপুর (Kuala Lumpur)", timeZone: "Asia/Kuala_Lumpur", flag: "🇲🇾" },
  { city: "সিডনি (Sydney)", timeZone: "Australia/Sydney", flag: "🇦🇺" },
  { city: "টরন্টো (Toronto)", timeZone: "America/Toronto", flag: "🇨🇦" },
  { city: "বার্লিন (Berlin)", timeZone: "Europe/Berlin", flag: "🇩🇪" },
  { city: "প্যারিস (Paris)", timeZone: "Europe/Paris", flag: "🇫🇷" },
  { city: "নতুন দিল্লি (New Delhi)", timeZone: "Asia/Kolkata", flag: "🇮🇳" },
  { city: "কুয়েত সিটি (Kuwait)", timeZone: "Asia/Kuwait", flag: "🇰🇼" },
  { city: "দোহা (Doha)", timeZone: "Asia/Qatar", flag: "🇶🇦" },
];

export default function WorldClockClient() {
  const [now, setNow] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<"clocks" | "converter">("clocks");

  // Converter state
  const [baseDate, setBaseDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [baseTime, setBaseTime] = useState<string>("12:00");
  const [fromTz, setFromTz] = useState<string>("Asia/Dhaka");
  const [toTz, setToTz] = useState<string>("America/New_York");

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCityTime = (date: Date, timeZone: string) => {
    try {
      const timeStr = new Intl.DateTimeFormat("bn-BD", {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(date);

      const dateStr = new Intl.DateTimeFormat("bn-BD", {
        timeZone,
        weekday: "short",
        day: "numeric",
        month: "short",
      }).format(date);

      // Determine day/night based on local hour
      const hourFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone,
        hour: "numeric",
        hour12: false,
      });
      const localHour = parseInt(hourFormatter.format(date), 10);
      const isDay = localHour >= 6 && localHour < 18;

      return { timeStr, dateStr, isDay, localHour };
    } catch {
      return { timeStr: "--:--", dateStr: "--", isDay: true, localHour: 12 };
    }
  };

  // Convert specific time between timezones
  const conversionResult = useMemo(() => {
    try {
      const [hours, minutes] = baseTime.split(":").map(Number);
      const [year, month, day] = baseDate.split("-").map(Number);

      // Format a target date in fromTz
      const testIso = `${baseDate}T${baseTime}:00`;
      const targetDate = new Date(testIso);

      // Formatter in target timezone
      const toFormatter = new Intl.DateTimeFormat("bn-BD", {
        timeZone: toTz,
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const fromFormatter = new Intl.DateTimeFormat("bn-BD", {
        timeZone: fromTz,
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const convertedText = toFormatter.format(targetDate);
      const originalText = fromFormatter.format(targetDate);

      return {
        convertedText,
        originalText,
        fullSummary: `${fromTz} অনুযায়ী ${baseTime} (${baseDate}) = ${toTz} এ ${convertedText}`,
      };
    } catch {
      return null;
    }
  }, [baseDate, baseTime, fromTz, toTz]);

  const swapConverterTimezones = () => {
    setFromTz(toTz);
    setToTz(fromTz);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="space-y-3 text-center">
        <div className="flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            <Globe className="w-3.5 h-3.5" />
            আন্তর্জাতিক ডিজিটাল ইউটিলিটি
          </span>
          <FavoriteButton
            tool={{
              id: "world-clock",
              title: "বিশ্ব ঘড়ি ও টাইমজোন",
              path: "/international/world-clock",
              category: "গ্লোবাল তথ্য",
            }}
          />
          <ShareToolButton title="বিশ্ব ঘড়ি ও টাইমজোন কনভার্টার - Totthobox" />
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          বিশ্ব ঘড়ি ও টাইমজোন কনভার্টার
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          বিশ্বের প্রধান শহরগুলোর রিয়েল-টাইম লাইভ ঘড়ি, দিন-রাত্রির অবস্থান এবং যেকোনো দুটি দেশের মধ্যকার সময়ের পার্থক্য নিখুঁতভাবে হিসেব করুন।
        </p>

        {/* Tab Switcher */}
        <div className="flex justify-center pt-2">
          <div className="inline-flex p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-800/80">
            <button
              onClick={() => setActiveTab("clocks")}
              className={`min-h-[44px] px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${
                activeTab === "clocks"
                  ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              <Clock className="w-4 h-4" />
              বিশ্ব ঘড়ি (Live Clocks)
            </button>
            <button
              onClick={() => setActiveTab("converter")}
              className={`min-h-[44px] px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${
                activeTab === "converter"
                  ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              <ArrowRightLeft className="w-4 h-4" />
              টাইমজোন রূপান্তরকারী
            </button>
          </div>
        </div>
      </header>

      {/* ========== TAB 1: LIVE WORLD CLOCKS ========== */}
      {activeTab === "clocks" && (
        <section aria-label="লাইভ বিশ্ব ঘড়ি তালিকা" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            {DEFAULT_CITIES.map((item) => {
              const { timeStr, dateStr, isDay } = formatCityTime(now, item.timeZone);

              return (
                <article
                  key={item.id}
                  className="relative rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-gradient-to-br from-white to-zinc-50/70 dark:from-zinc-900 dark:to-zinc-900/60 p-4 sm:p-5 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between min-h-[140px]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl" role="img" aria-label={item.country}>
                        {item.flag}
                      </span>
                      <div>
                        <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                          {item.city}
                        </h2>
                        <p className="text-xs text-zinc-500">{item.country}</p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                        isDay
                          ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
                          : "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20"
                      }`}
                    >
                      {isDay ? <Sun className="w-3 h-3 text-amber-500" /> : <Moon className="w-3 h-3 text-indigo-400" />}
                      {isDay ? "দিন" : "রাত"}
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/70 flex items-baseline justify-between">
                    <div>
                      <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 tabular-nums font-mono">
                        {timeStr}
                      </p>
                      <p className="text-xs text-zinc-500 mt-0.5">{dateStr}</p>
                    </div>
                    <span className="text-[11px] font-semibold text-zinc-400 font-mono">
                      {item.offsetLabel}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* ========== TAB 2: TIMEZONE CONVERTER ========== */}
      {activeTab === "converter" && (
        <section aria-label="টাইমজোন রূপান্তর ক্যালকুলেটর" className="space-y-6">
          <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-900/60 p-4 sm:p-6 space-y-5 shadow-xs">
            {/* Input Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  তারিখ নির্বাচন করুন
                </label>
                <input
                  type="date"
                  value={baseDate}
                  onChange={(e) => setBaseDate(e.target.value)}
                  className="w-full min-h-[48px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/80 px-3.5 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-emerald-500/20 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  সময় নির্বাচন করুন (ঘণ্টা : মিনিট)
                </label>
                <input
                  type="time"
                  value={baseTime}
                  onChange={(e) => setBaseTime(e.target.value)}
                  className="w-full min-h-[48px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/80 px-3.5 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-emerald-500/20 text-zinc-900 dark:text-zinc-100"
                />
              </div>
            </div>

            {/* From & To Timezones */}
            <div className="grid grid-cols-1 sm:grid-cols-11 gap-3 items-center">
              <div className="sm:col-span-5 space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  যে দেশের সময় (From Timezone)
                </label>
                <select
                  value={fromTz}
                  onChange={(e) => setFromTz(e.target.value)}
                  className="w-full min-h-[48px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/80 px-3.5 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-emerald-500/20 text-zinc-900 dark:text-zinc-100"
                >
                  {ALL_TIMEZONES.map((tz) => (
                    <option key={`from-${tz.timeZone}`} value={tz.timeZone}>
                      {tz.flag} {tz.city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Swap Button */}
              <div className="sm:col-span-1 flex justify-center py-1 sm:pt-6">
                <button
                  type="button"
                  onClick={swapConverterTimezones}
                  aria-label="টাইমজোন অদলবদল করুন"
                  title="টাইমজোন অদলবদল করুন"
                  className="min-h-[44px] min-w-[44px] rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition flex items-center justify-center shadow-xs"
                >
                  <ArrowRightLeft className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                </button>
              </div>

              <div className="sm:col-span-5 space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  যে দেশে রূপান্তর করবেন (To Timezone)
                </label>
                <select
                  value={toTz}
                  onChange={(e) => setToTz(e.target.value)}
                  className="w-full min-h-[48px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/80 px-3.5 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-emerald-500/20 text-zinc-900 dark:text-zinc-100"
                >
                  {ALL_TIMEZONES.map((tz) => (
                    <option key={`to-${tz.timeZone}`} value={tz.timeZone}>
                      {tz.flag} {tz.city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Result Box */}
            {conversionResult && (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5 sm:p-6 text-center space-y-3">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                  রূপান্তরিত সময় ফলাফল
                </span>
                <p className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
                  {conversionResult.convertedText}
                </p>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                  মূল সময়: <span className="font-semibold text-zinc-800 dark:text-zinc-200">{baseTime}</span> ({fromTz})
                </p>

                <div className="flex justify-center pt-2">
                  <CopyResultButton
                    textToCopy={conversionResult.fullSummary}
                    label="সময় বিবরণী কপি করুন"
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* SEO & Knowledge Guide */}
      <section className="space-y-4 pt-6 border-t border-zinc-200/80 dark:border-zinc-800/80">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          আন্তর্জাতিক টাইমজোন ও সময় রূপান্তর নির্দেশিকা
        </h2>
        <div className="prose prose-zinc dark:prose-invert max-w-none text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed space-y-3">
          <p>
            বিশ্বজুড়ে ২৪টি মূল টাইমজোন রয়েছে যা গ্রিনিচ মান সময় (GMT) বা সমন্বিত আন্তর্জাতিক সময় (UTC) এর ভিত্তিতে পরিমাপ করা হয়। বাংলাদেশ স্ট্যান্ডার্ড টাইম (BST) হলো <strong>UTC+6</strong>।
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>লন্ডন (যুক্তরাজ্য):</strong> বাংলাদেশের চেয়ে ৬ ঘণ্টা পিছিয়ে (শীতকালে) বা ৫ ঘণ্টা পিছিয়ে (গ্রীষ্মকালে BST চলাকালীন)।</li>
            <li><strong>নিউইয়র্ক (যুক্তরাষ্ট্র):</strong> বাংলাদেশের চেয়ে ১০ থেকে ১১ ঘণ্টা পিছিয়ে।</li>
            <li><strong>দুবাই ও মধ্যপ্রাচ্য:</strong> বাংলাদেশের চেয়ে ২ ঘণ্টা পিছিয়ে (UTC+4)।</li>
            <li><strong>টোকিও (জাপান):</strong> বাংলাদেশের চেয়ে ৩ ঘণ্টা এগিয়ে (UTC+9)।</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
