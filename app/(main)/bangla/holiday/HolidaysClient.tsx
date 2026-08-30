"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import useSWRInfinite from "swr/infinite";
import { Calendar, Search, X, ArrowRight, ChevronDown } from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type Holiday = {
  id: number;
  title: string;
  slug: string;
  type: string;
  date: string;
  date_formatted: string;
  day_name_bn: string;
  month_short: string;
  day_numeric: string;
  details?: string;
  image_url?: string;
};

/* ───────────────── Skeleton ───────────────── */
function HolidaySkeleton() {
  return (
    <div className="rounded-2xl border border-zinc-400/25 bg-zinc-800/80 p-4 animate-pulse">
      <div className="flex gap-4 items-start">
        <div className="w-14 h-14 rounded-xl bg-zinc-400/10 shrink-0" />
        <div className="flex-1 space-y-2.5">
          <div className="h-5 w-3/4 rounded bg-zinc-400/10" />
          <div className="h-3 w-1/2 rounded bg-zinc-400/10" />
          <div className="h-3 w-full rounded bg-zinc-400/10" />
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-zinc-400/25">
        <div className="h-3 w-24 rounded bg-zinc-400/10" />
      </div>
    </div>
  );
}

export default function HolidaysClient() {
  const [search, setSearch] = useState("");
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString(),
  );
  const [selectedType, setSelectedType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.meta?.has_more) return null;

    const params = new URLSearchParams();
    params.set("page", String(pageIndex + 1));
    params.set("per_page", "15");

    if (debouncedSearch) params.set("search", debouncedSearch);
    if (selectedYear && !fromDate) params.set("year", selectedYear);
    if (selectedType) params.set("type", selectedType);
    if (fromDate) params.set("from", fromDate);
    if (toDate) params.set("to", toDate);

    return `${API_BASE}/api/holidays?${params.toString()}`;
  };

  const { data, error, size, setSize, isValidating } = useSWRInfinite(
    getKey,
    fetcher,
    { revalidateFirstPage: false, revalidateOnFocus: false },
  );

  const holidays: Holiday[] = data
    ? data.flatMap((page) => page.data || [])
    : [];
  const hasMore = data?.[data.length - 1]?.meta?.has_more ?? false;
  const total = data?.[0]?.meta?.total ?? 0;
  const years = data?.[0]?.filters?.years || [];
  const types = data?.[0]?.filters?.types || [];

  const isLoading = !data && !error;
  const isFiltering = isValidating && size === 1;

  useEffect(() => {
    setSize(1);
  }, [debouncedSearch, selectedYear, selectedType, fromDate, toDate, setSize]);

  const resetFilters = () => {
    setSearch("");
    setSelectedType("");
    setFromDate("");
    setToDate("");
    setSelectedYear(new Date().getFullYear().toString());
  };

  const hasActiveFilters = !!(search || selectedType || fromDate || toDate);

  return (
    <div className="max-w-2xl mx-auto space-y-4 p-4 sm:p-6">
      {/* Header */}
      <header className="border-b border-zinc-400/25 pb-4">
        <h1 className="text-2xl flex items-center gap-2">
          <Calendar className="size-5" />
          ছুটির ক্যালেন্ডার
        </h1>
        <p className="text-sm  mt-1">
          বাংলাদেশের সরকারি ও নির্ধারিত ছুটির সম্পূর্ণ তালিকা — {selectedYear}{" "}
          সাল
        </p>
      </header>

      {/* Search + Filters */}
      <nav className="space-y-4" aria-label="ছুটির ফিল্টার">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 " />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="নাম, স্লাগ বা বিবরণ দিয়ে খুঁজুন..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-400/10 border-0 focus:ring-2 focus:ring-zinc-500 outline-none"
              aria-label="ছুটি অনুসন্ধান"
            />
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="p-2.5 rounded-xl hover:bg-zinc-400/25 bg-zinc-400/10 "
              aria-label="ফিল্টার মুছুন"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto p-1">
          {/* Year */}
          <div className="relative shrink-0">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-xl px-4 py-2 outline-none"
              aria-label="বছর নির্বাচন"
            >
              {years.length > 0
                ? years.map((y: number) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))
                : Array.from({ length: 10 }).map((_, i) => {
                    const y = new Date().getFullYear() - 5 + i;
                    return (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    );
                  })}
            </select>
            {/* <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4  pointer-events-none" /> */}
          </div>

          {/* Type */}
          <div className="relative min-w-34 shrink-0">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-xl px-4 py-2 outline-none"
              aria-label="ধরন নির্বাচন"
            >
              <option value="">সকল ধরণ</option>
              {types.map((t: string) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {/* <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4  pointer-events-none" /> */}
          </div>

          {/* From */}
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-xl px-4 py-2 outline-none"
            aria-label="শুরুর তারিখ"
          />

          {/* To */}
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-xl px-4 py-2 outline-none"
            aria-label="শেষের তারিখ"
          />
        </div>
      </nav>

      {/* Results count */}
      {hasActiveFilters && !isLoading && (
        <p className="text-xs  " role="status">
          {total}টি ফলাফল পাওয়া গেছে
        </p>
      )}

      {/* List */}
      <section className="space-y-4" aria-label="ছুটির তালিকা">
        {isLoading || isFiltering ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-zinc-400/10 p-4 animate-pulse space-y-4"
            >
              <div className="flex gap-4">
                <div className="size-15 border border-zinc-400/10 rounded-lg bg-zinc-400/10 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-16 bg-zinc-400/10 rounded" />
                  <div className="h-5 w-full bg-zinc-400/10 rounded" />
                  <div className="h-4 w-full bg-zinc-400/10 rounded" />
                  <div className="h-4 w-full bg-zinc-400/10 rounded" />
                </div>
              </div>
              <hr className="border border-zinc-400/25" />
              <div className="h-4 w-2/8 bg-zinc-400/10 rounded" />
            </div>
          ))
        ) : holidays.length === 0 ? (
          <div className="text-center py-16 ">
            <p className="text-lg ">কোনো ছুটি পাওয়া যায়নি</p>
            <p className="text-sm mt-1">
              অন্য ফিল্টার বা সার্চ দিয়ে চেষ্টা করুন
            </p>
          </div>
        ) : (
          holidays.map((holiday) => (
            <Link
              key={holiday.id}
              href={`/bangla/holiday/${holiday.slug}`}
              className="block rounded-2xl bg-zinc-400/10 p-4"
            >
              <div className="flex gap-4 items-start">
                {/* Date Box */}
                <div className="shrink-0 flex flex-col items-center justify-center size-15 rounded-xl bg-zinc-400/10 border border-zinc-400/25">
                  <span className="text-[9px] uppercase font-bold ">
                    {holiday.month_short}
                  </span>
                  <span className="text-xl font-bold leading-none ">
                    {holiday.day_numeric}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <h2 className="text-lg   line-clamp-1">{holiday.title}</h2>

                  <p className="flex items-center gap-2 text-xs ">
                    <span>{holiday.day_name_bn}</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-700 dark:bg-zinc-600" />
                    <span className="capitalize">{holiday.type}</span>
                  </p>

                  {holiday.details && (
                    <p className="text-sm  line-clamp-2">{holiday.details}</p>
                  )}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-zinc-400/25">
                <span className="inline-flex items-center gap-1 text-sm opacity-50 hover:opacity-100">
                  বিস্তারিত পড়ুন
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))
        )}
      </section>

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center py-6">
          <button
            onClick={() => setSize(size + 1)}
            disabled={isValidating}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-400/25 bg-zinc-800/80 text-sm   hover:bg-zinc-900 hover:bg-zinc-800  disabled:opacity-50"
          >
            {isValidating ? "লোড হচ্ছে..." : "আরও দেখুন"}
          </button>
        </div>
      )}

      {/* SEO Content */}
      <section className="space-y-4 pt-8 border-t border-zinc-400/25">
        <h2 className="text-lg font-bold  flex items-center gap-2">
          <Calendar className="w-5 h-5 " />
          বাংলাদেশের সরকারি ছুটি সম্পর্কে
        </h2>

        <div className="space-y-4 text-sm  leading-relaxed">
          <p>
            বাংলাদেশ সরকার প্রতি বছর সরকারি, ঐচ্ছিক ও ধর্মীয় ছুটির তালিকা প্রকাশ
            করে। এই পেজে আপনি <strong>{selectedYear} সালের</strong> সম্পূর্ণ
            ছুটির ক্যালেন্ডার দেখতে পারবেন। জাতীয় দিবস, ধর্মীয় উৎসব এবং অন্যান্য
            গুরুত্বপূর্ণ ছুটির তারিখ একত্রিত করা হয়েছে।
          </p>
          <p>
            নাম, স্লাগ, বিবরণ, বছর, ধরণ বা তারিখ অনুযায়ী সহজেই খুঁজে নিতে
            পারবেন। “বিস্তারিত পড়ুন” বাটনে ক্লিক করে পুরো তথ্য, ছুটির ধরন এবং
            প্রাসঙ্গিক বিবরণ জানতে পারবেন। সরকারি ও ঐচ্ছিক ছুটি আলাদাভাবে
            ফিল্টার করে দেখা যায়।
          </p>
          <p>
            এই তালিকা নিয়মিত আপডেট করা হয় যাতে সরকার ঘোষিত সর্বশেষ ছুটির তথ্য
            যুক্ত থাকে। চাকরিজীবী, শিক্ষার্থী, ব্যবসায়ী এবং সাধারণ মানুষ সবাই এই
            তথ্য থেকে উপকৃত হতে পারেন।
          </p>
        </div>

        {/* Hidden SEO keywords for crawlers (optional) */}
        <p className="sr-only">
          ছুটির তালিকা {selectedYear}, সরকারি ছুটি বাংলাদেশ, ঐচ্ছিক ছুটি, জাতীয়
          দিবস, ধর্মীয় ছুটি, বাংলাদেশ ক্যালেন্ডার, পাবলিক হলিডে, Bangladesh
          public holidays, holiday calendar Bangladesh
        </p>
      </section>
    </div>
  );
}
