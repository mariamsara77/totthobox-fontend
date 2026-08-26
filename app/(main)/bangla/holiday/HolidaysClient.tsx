"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import useSWRInfinite from "swr/infinite";
import { Calendar, Search, X, ArrowRight } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";
const PAGE_SIZE = 15;

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

type HolidayPage = {
  data: Holiday[];
  meta?: {
    has_more?: boolean;
    total?: number;
  };
  filters?: {
    years?: number[];
    types?: string[];
  };
};

const fetcher = async (url: string): Promise<HolidayPage> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Holiday request failed: ${response.status}`);
  }
  return response.json() as Promise<HolidayPage>;
};

function HolidaySkeleton() {
  return (
    <div className="space-y-4 rounded-2xl border border-zinc-400/25 bg-zinc-400/10 p-4">
      <div className="flex gap-4">
        <div className="h-14 w-14 shrink-0 rounded-xl bg-zinc-400/25" />
        <div className="flex-1 space-y-4">
          <div className="h-4 w-3/4 rounded-xl bg-zinc-400/25" />
          <div className="h-4 w-1/2 rounded-xl bg-zinc-400/25" />
          <div className="h-4 w-full rounded-xl bg-zinc-400/25" />
        </div>
      </div>
      <div className="border-t border-zinc-400/25 pt-4">
        <div className="h-4 w-24 rounded-xl bg-zinc-400/25" />
      </div>
    </div>
  );
}

export default function HolidaysClient() {
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    setMounted(true);
    setSelectedYear(String(new Date().getFullYear()));
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => window.clearTimeout(timeout);
  }, [search]);

  const getKey = (pageIndex: number, previousPageData: HolidayPage | null) => {
    if (!mounted || !selectedYear) return null;
    if (previousPageData && !previousPageData.meta?.has_more) return null;

    const params = new URLSearchParams({
      page: String(pageIndex + 1),
      per_page: String(PAGE_SIZE),
      year: selectedYear,
    });

    if (debouncedSearch) params.set("search", debouncedSearch);
    if (selectedType) params.set("type", selectedType);
    if (fromDate) params.set("from", fromDate);
    if (toDate) params.set("to", toDate);

    return `${API_BASE}/api/holidays?${params.toString()}`;
  };

  const { data, error, size, setSize, isValidating } = useSWRInfinite<HolidayPage>(
    getKey,
    fetcher,
    {
      revalidateFirstPage: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      keepPreviousData: false,
    },
  );

  useEffect(() => {
    if (!mounted) return;
    setSize(1);
  }, [mounted, debouncedSearch, selectedYear, selectedType, fromDate, toDate, setSize]);

  const holidays = data?.flatMap((page) => page.data ?? []) ?? [];
  const firstPage = data?.[0];
  const lastPage = data?.[data.length - 1];
  const hasMore = lastPage?.meta?.has_more ?? false;
  const total = firstPage?.meta?.total ?? 0;
  const years = firstPage?.filters?.years ?? [];
  const types = firstPage?.filters?.types ?? [];
  const isLoading = mounted && !data && !error;
  const isFiltering = mounted && isValidating && size === 1;
  const hasActiveFilters = Boolean(search || selectedType || fromDate || toDate);

  const resetFilters = () => {
    setSearch("");
    setSelectedType("");
    setFromDate("");
    setToDate("");
    setSelectedYear(String(new Date().getFullYear()));
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4">
      <header className="space-y-2 border-b border-zinc-400/25 pb-4">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Calendar className="h-5 w-5" />
          ছুটির ক্যালেন্ডার
        </h1>
        <p className="text-sm opacity-50">
          বাংলাদেশের সরকারি ও নির্ধারিত ছুটির সম্পূর্ণ তালিকা — {selectedYear || "চলতি"} সাল
        </p>
      </header>

      <section className="space-y-4" aria-label="ছুটির ফিল্টার">
        <div className="flex items-center gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-zinc-400/25 bg-zinc-400/10 p-4">
            <Search className="h-4 w-4 shrink-0" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="নাম বা বিবরণ দিয়ে খুঁজুন..."
              className="min-w-0 flex-1 bg-transparent outline-none"
              aria-label="ছুটি অনুসন্ধান"
            />
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-xl border border-zinc-400/25 bg-zinc-400/10 p-4 hover:bg-zinc-400/25"
              aria-label="ফিল্টার মুছুন"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <select
            value={selectedYear}
            onChange={(event) => setSelectedYear(event.target.value)}
            className="rounded-xl border border-zinc-400/25 bg-zinc-200 p-4 bg-zinc-400/10"
            aria-label="বছর নির্বাচন"
          >
            {years.length > 0
              ? years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))
              : selectedYear && <option value={selectedYear}>{selectedYear}</option>}
          </select>

          <select
            value={selectedType}
            onChange={(event) => setSelectedType(event.target.value)}
            className="rounded-xl border border-zinc-400/25 bg-zinc-200 p-4 bg-zinc-400/10"
            aria-label="ধরন নির্বাচন"
          >
            <option value="">সকল ধরণ</option>
            {types.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <input
            type="date"
            value={fromDate}
            onChange={(event) => setFromDate(event.target.value)}
            className="rounded-xl border border-zinc-400/25 bg-zinc-200 p-4 bg-zinc-400/10"
            aria-label="শুরুর তারিখ"
          />

          <input
            type="date"
            value={toDate}
            onChange={(event) => setToDate(event.target.value)}
            className="rounded-xl border border-zinc-400/25 bg-zinc-200 p-4 bg-zinc-400/10"
            aria-label="শেষের তারিখ"
          />
        </div>
      </section>

      {error && (
        <div className="space-y-2 rounded-2xl border border-zinc-400/25 bg-zinc-400/10 p-4" role="alert">
          <p className="font-medium">ছুটির তথ্য লোড করা যায়নি।</p>
          <p className="text-sm opacity-50">কিছুক্ষণ পর আবার চেষ্টা করুন।</p>
        </div>
      )}

      {hasActiveFilters && !isLoading && !error && (
        <p className="text-sm opacity-50" role="status">{total}টি ফলাফল পাওয়া গেছে</p>
      )}

      <section className="space-y-4" aria-label="ছুটির তালিকা">
        {isLoading || isFiltering ? (
          Array.from({ length: 5 }, (_, index) => <HolidaySkeleton key={index} />)
        ) : holidays.length === 0 ? (
          <div className="space-y-2 rounded-2xl border border-zinc-400/25 bg-zinc-400/10 p-6 text-center">
            <p className="font-medium">কোনো ছুটি পাওয়া যায়নি</p>
            <p className="text-sm opacity-50">অন্য ফিল্টার বা সার্চ দিয়ে চেষ্টা করুন।</p>
          </div>
        ) : (
          holidays.map((holiday) => (
            <Link
              key={holiday.id}
              href={`/bangla/holiday/${holiday.slug}`}
              className="block rounded-2xl border border-zinc-400/25 bg-zinc-400/10 p-4 hover:bg-zinc-400/25"
            >
              <div className="flex items-center gap-4">
                <div className="flex shrink-0 flex-col items-center justify-center rounded-xl border border-zinc-400/25 bg-zinc-400/25 p-4">
                  <span className="text-xs opacity-50">{holiday.month_short}</span>
                  <span className="text-xl font-bold">{holiday.day_numeric}</span>
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <h2 className="truncate text-lg font-medium">{holiday.title}</h2>
                  <p className="text-xs opacity-50">
                    {holiday.day_name_bn} · {holiday.type}
                  </p>
                  {holiday.details && (
                    <p className="text-sm opacity-50">{holiday.details}</p>
                  )}
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 border-t border-zinc-400/25 pt-4 text-sm">
                বিস্তারিত পড়ুন
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))
        )}
      </section>

      {hasMore && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setSize((currentSize) => currentSize + 1)}
            disabled={isValidating}
            className="rounded-xl border border-zinc-400/25 bg-zinc-400/10 p-4 hover:bg-zinc-400/25 disabled:opacity-50"
          >
            {isValidating ? "লোড হচ্ছে..." : "আরও দেখুন"}
          </button>
        </div>
      )}

      <section className="space-y-4 border-t border-zinc-400/25 pt-4">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <Calendar className="h-5 w-5" />
          বাংলাদেশের সরকারি ছুটি সম্পর্কে
        </h2>
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            বাংলাদেশ সরকার প্রতি বছর সরকারি, ঐচ্ছিক ও ধর্মীয় ছুটির তালিকা প্রকাশ করে। এই পেজে আপনি {selectedYear || "চলতি"} সালের ছুটির ক্যালেন্ডার দেখতে পারবেন।
          </p>
          <p className="opacity-50">
            নাম, বছর, ধরণ বা তারিখ অনুযায়ী তালিকা ফিল্টার করে প্রয়োজনীয় ছুটির তথ্য দ্রুত খুঁজে নিন।
          </p>
        </div>
      </section>
    </div>
  );
}
