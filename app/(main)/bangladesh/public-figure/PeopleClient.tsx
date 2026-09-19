"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import useSWRInfinite from "swr/infinite";
import { Users, Search, X, ArrowRight, Briefcase, Loader2 } from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";
const fetcher = (url: string) => fetch(url).then((r) => r.json());

type PersonItem = {
  id: number;
  name: string;
  slug: string;
  image_url?: string;
  categories?: { id: number; name: string }[];
  is_current?: boolean;
  current_role?: string | null;
  role_from_year?: string | null;
};

export default function PeopleClient() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    [],
  );
  const [positions, setPositions] = useState<{ id: number; title: string }[]>(
    [],
  );

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    fetch(`${API_BASE}/api/people/filters`)
      .then((r) => r.json())
      .then((j) => {
        setCategories(j.categories || []);
        setPositions(j.positions || []);
      });
  }, []);

  const getKey = (pageIndex: number, prev: any) => {
    if (prev && !prev.meta?.has_more) return null;
    const p = new URLSearchParams();
    p.set("page", String(pageIndex + 1));
    p.set("per_page", "10");
    if (debouncedSearch) p.set("search", debouncedSearch);
    if (category) p.set("category", category);
    if (position) p.set("position", position);
    if (status && status !== "all") p.set("status", status);
    if (fromDate) p.set("from", fromDate);
    if (toDate) p.set("to", toDate);
    return `${API_BASE}/api/people?${p.toString()}`;
  };

  const { data, size, setSize, isValidating, error } = useSWRInfinite(
    getKey,
    fetcher,
    {
      revalidateFirstPage: false,
      revalidateOnFocus: false,
    },
  );

  const items: PersonItem[] = data ? data.flatMap((p) => p.data || []) : [];
  const hasMore = data?.[data.length - 1]?.meta?.has_more ?? false;
  const total = data?.[0]?.meta?.total ?? 0;
  const isLoading = !data && !error;

  useEffect(() => {
    setSize(1);
  }, [debouncedSearch, category, position, status, fromDate, toDate, setSize]);

  const hasFilters =
    !!(search || category || position || fromDate || toDate) ||
    status !== "all";

  const resetFilters = () => {
    setSearch("");
    setCategory("");
    setPosition("");
    setStatus("all");
    setFromDate("");
    setToDate("");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 px-4 py-6 sm:py-8">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2.5 tracking-tight">
          <Users className="w-7 h-7" />
          প্রোফাইল আর্কাইভ
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          বিশিষ্ট ব্যক্তিবর্গের জীবনী, কর্মজীবন ও অবদানের সম্পূর্ণ ইতিহাস
        </p>
      </header>

      {/* Search + Filters */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="নামে খুঁজুন..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-400/10 text-sm outline-none hover:bg-zinc-400/15 transition"
            />
          </div>

          {hasFilters && (
            <button
              onClick={resetFilters}
              className="px-3.5 rounded-xl bg-zinc-400/10 hover:bg-zinc-400/20 transition"
              title="ফিল্টার মুছুন"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="min-w-[140px] rounded-xl bg-zinc-400/10 text-sm px-3 py-2.5 outline-none"
          >
            <option value="">সকল ক্যাটাগরি</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="min-w-[140px] rounded-xl bg-zinc-400/10 text-sm px-3 py-2.5 outline-none"
          >
            <option value="">সকল পদবী</option>
            {positions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="min-w-[140px] rounded-xl bg-zinc-400/10 text-sm px-3 py-2.5 outline-none"
          >
            <option value="all">অবস্থা (সকল)</option>
            <option value="current">বর্তমানে কর্মরত</option>
            <option value="former">সাবেক</option>
          </select>

          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="min-w-[140px] rounded-xl bg-zinc-400/10 text-sm px-3 py-2.5 outline-none"
            title="শুরুর তারিখ"
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="min-w-[140px] rounded-xl bg-zinc-400/10 text-sm px-3 py-2.5 outline-none"
            title="শেষ তারিখ"
          />
        </div>
      </div>

      {hasFilters && !isLoading && (
        <p className="text-xs text-zinc-500">{total}টি ফলাফল পাওয়া গেছে</p>
      )}

      {/* List */}
      <section className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="rounded-2xl bg-zinc-400/10 p-4 animate-pulse"
              >
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-xl bg-zinc-400/15" />
                  <div className="flex-1 space-y-2.5 pt-1">
                    <div className="h-4 w-3/4 rounded bg-zinc-400/15" />
                    <div className="h-3 w-1/2 rounded bg-zinc-400/15" />
                    <div className="h-3 w-full rounded bg-zinc-400/15" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 rounded-2xl bg-zinc-400/5">
            <Users className="w-10 h-10 mx-auto opacity-40 mb-3" />
            <p className="text-base font-medium">কোনো প্রোফাইল পাওয়া যায়নি</p>
            <p className="text-sm text-zinc-500 mt-1">
              অন্য কীওয়ার্ড বা ফিল্টার দিয়ে চেষ্টা করুন
            </p>
          </div>
        ) : (
          items.map((person) => (
            <Link
              key={person.id}
              href={`/bangladesh/public-figure/${person.slug}`}
              className="block rounded-2xl bg-zinc-400/10 p-4 transition hover:bg-zinc-400/20"
            >
              <div className="flex gap-4 items-start">
                <div className="shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-zinc-400/15">
                  {person.image_url ? (
                    <img
                      src={person.image_url}
                      alt={person.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg font-medium opacity-60">
                      {person.name?.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-semibold line-clamp-1">
                      {person.name}
                    </h2>
                    {person.is_current && (
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-green-500/15 text-green-700 dark:text-green-400">
                        বর্তমান
                      </span>
                    )}
                  </div>

                  {person.categories && person.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {person.categories.map((c) => (
                        <span
                          key={c.id}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-zinc-400/15"
                        >
                          {c.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-xs flex items-center gap-1.5 text-zinc-500">
                    <Briefcase className="w-3.5 h-3.5 shrink-0" />
                    {person.current_role
                      ? `${person.current_role}${
                          person.role_from_year
                            ? ` (${person.role_from_year})`
                            : ""
                        }`
                      : "সাবেক / কর্মজীবনের ইতিহাস নেই"}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-zinc-400/20">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium">
                  বিস্তারিত পড়ুন
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))
        )}
      </section>

      {/* Load more */}
      {hasMore && (
        <div className="flex justify-center pt-2">
          <button
            onClick={() => setSize(size + 1)}
            disabled={isValidating}
            className="px-6 py-2.5 rounded-xl bg-zinc-400/10 text-sm font-medium hover:bg-zinc-400/20 transition disabled:opacity-50"
          >
            {isValidating ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                লোড হচ্ছে...
              </span>
            ) : (
              "আরও দেখুন"
            )}
          </button>
        </div>
      )}

      {/* SEO + AdSense Content Block */}
      <section className="space-y-4 pt-8 border-t border-zinc-400/20">
        <h2 className="text-xl font-bold">প্রোফাইল আর্কাইভ সম্পর্কে</h2>
        <div className="space-y-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          <p>
            বাংলাদেশের ইতিহাস, রাজনীতি, শিক্ষা, সংস্কৃতি ও বিভিন্ন ক্ষেত্রে
            অবদান রেখেছেন এমন বিশিষ্ট ব্যক্তিবর্গের জীবনী ও কর্মজীবনের তথ্য
            এখানে সংরক্ষিত আছে। রাজনীতিবিদ, পেশাজীবী, শিক্ষাবিদ, শিল্পীসহ
            বিভিন্ন ক্যাটাগরির ব্যক্তিদের প্রোফাইল পাওয়া যাবে।
          </p>
          <p>
            ক্যাটাগরি, পদবী বা অবস্থা অনুসারে ফিল্টার করে সহজেই আপনার প্রয়োজনীয়
            ব্যক্তির প্রোফাইল খুঁজে নিতে পারবেন। প্রতিটি প্রোফাইলে
            জীবনবৃত্তান্ত, কর্মজীবনের ইতিহাস ও গুরুত্বপূর্ণ তথ্য দেওয়া আছে।
          </p>
          <p>
            তথ্যবক্স থেকে নির্ভরযোগ্য ও হালনাগাদ প্রোফাইল তথ্য নিয়ে বিশিষ্ট
            ব্যক্তিবর্গ সম্পর্কে বিস্তারিত জানুন।
          </p>
        </div>
      </section>
    </div>
  );
}
