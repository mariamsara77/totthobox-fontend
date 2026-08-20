"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import useSWRInfinite from "swr/infinite";
import {
  Users,
  Search,
  X,
  ArrowRight,
  Briefcase,
  Loader2,
} from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://totthobox.com";
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

  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [positions, setPositions] = useState<{ id: number; title: string }[]>([]);

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
    { revalidateFirstPage: false, revalidateOnFocus: false }
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

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4 sm:p-6">
      <header>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="w-6 h-6 text-amber-600" />
          প্রোফাইল আর্কাইভ
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          বিশিষ্ট ব্যক্তিবর্গের জীবনী, কর্মজীবন ও অবদানের সম্পূর্ণ ইতিহাস
        </p>
      </header>

      <div className="space-y-3">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="নামে খুঁজুন..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-400/25 bg-zinc-400/10 text-sm"
            />
          </div>
          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("");
                setPosition("");
                setStatus("all");
                setFromDate("");
                setToDate("");
              }}
              className="p-2.5 rounded-xl border border-zinc-400/25"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="min-w-36 rounded-lg border border-zinc-400/25 bg-zinc-100 dark:bg-zinc-800 text-sm px-3 py-2"
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
            className="min-w-36 rounded-lg border border-zinc-400/25 bg-zinc-100 dark:bg-zinc-800 text-sm px-3 py-2"
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
            className="min-w-36 rounded-lg border border-zinc-400/25 bg-zinc-100 dark:bg-zinc-800 text-sm px-3 py-2"
          >
            <option value="all">অবস্থা (সকল)</option>
            <option value="current">বর্তমানে কর্মরত</option>
            <option value="former">সাবেক</option>
          </select>

          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="min-w-36 rounded-lg border border-zinc-400/25 bg-zinc-100 dark:bg-zinc-800 text-sm px-3 py-2"
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="min-w-36 rounded-lg border border-zinc-400/25 bg-zinc-100 dark:bg-zinc-800 text-sm px-3 py-2"
          />
        </div>
      </div>

      {hasFilters && !isLoading && (
        <p className="text-xs text-zinc-500">{total}টি ফলাফল</p>
      )}

      <section className="space-y-4">
        {isLoading ? (
           <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-2xl border border-zinc-400/25 bg-zinc-400/10 p-4 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-xl bg-zinc-200 dark:bg-zinc-700" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-3/4 rounded bg-zinc-200 dark:bg-zinc-700" />
                    <div className="h-3 w-full rounded bg-zinc-200 dark:bg-zinc-700" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-zinc-500">
            কোনো প্রোফাইল পাওয়া যায়নি
          </div>
        ) : (
          items.map((person) => (
            <Link
              key={person.id}
              href={`/bangladesh/public-figure/${person.slug}`}
              className="block rounded-2xl border border-zinc-400/25 bg-zinc-400/10 p-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition"
            >
              <div className="flex gap-4 items-start">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-200 dark:bg-zinc-800 shrink-0">
                  {person.image_url ? (
                    <img
                      src={person.image_url}
                      alt={person.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg font-bold text-zinc-400">
                      {person.name?.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold line-clamp-1">
                      {person.name}
                    </h2>
                    {person.is_current && (
                      <span className="text-xs px-2 py-0.5 rounded-md bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        বর্তমান
                      </span>
                    )}
                  </div>
                  {person.categories && person.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {person.categories.map((c) => (
                        <span
                          key={c.id}
                          className="text-xs px-2 py-0.5 rounded border border-zinc-400/30 text-zinc-500"
                        >
                          {c.name}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-zinc-500 flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5" />
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
              <div className="mt-3 pt-3 border-t border-zinc-400/25">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600">
                  বিস্তারিত পড়ুন <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))
        )}
      </section>

      {hasMore && (
        <div className="flex justify-center py-6">
          <button
            type="button"
            onClick={() => setSize(size + 1)}
            disabled={isValidating}
            className="px-5 py-2.5 rounded-xl border border-zinc-400/25 text-sm disabled:opacity-50"
          >
            {isValidating ? "লোড হচ্ছে..." : "আরও দেখুন"}
          </button>
        </div>
      )}
    </div>
  );
}