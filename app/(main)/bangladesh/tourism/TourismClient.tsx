"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import useSWRInfinite from "swr/infinite";
import { Map, Search, X, ArrowRight, MapPin, Loader2 } from "lucide-react";
import InfiniteScrollTrigger from "@/components/InfiniteScrollTrigger";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";
const fetcher = (url: string) => fetch(url).then((r) => r.json());

type Item = {
  id: number;
  title: string;
  slug: string;
  type_label?: string;
  description?: string;
  image_url?: string;
  thana?: string;
  district?: string;
};

export default function TourismClient() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [type, setType] = useState("");
  const [divisionId, setDivisionId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [thanaId, setThanaId] = useState("");

  const [divisions, setDivisions] = useState<{ id: number; name: string }[]>(
    [],
  );
  const [types, setTypes] = useState<{ value: string; label: string }[]>([]);
  const [districts, setDistricts] = useState<{ id: number; name: string }[]>(
    [],
  );
  const [thanas, setThanas] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    fetch(`${API_BASE}/api/tourism-bd/filters`)
      .then((r) => r.json())
      .then((j) => {
        setDivisions(j.divisions || []);
        setTypes(j.types || []);
      });
  }, []);

  useEffect(() => {
    setDistrictId("");
    setThanaId("");
    setThanas([]);
    if (!divisionId) {
      setDistricts([]);
      return;
    }
    fetch(`${API_BASE}/api/tourism-bd/districts?division_id=${divisionId}`)
      .then((r) => r.json())
      .then((j) => setDistricts(j.data || []));
  }, [divisionId]);

  useEffect(() => {
    setThanaId("");
    if (!districtId) {
      setThanas([]);
      return;
    }
    fetch(`${API_BASE}/api/tourism-bd/thanas?district_id=${districtId}`)
      .then((r) => r.json())
      .then((j) => setThanas(j.data || []));
  }, [districtId]);

  const getKey = (pageIndex: number, prev: any) => {
    if (prev && !prev.meta?.has_more) return null;
    const p = new URLSearchParams();
    p.set("page", String(pageIndex + 1));
    p.set("per_page", "10");
    if (debouncedSearch) p.set("search", debouncedSearch);
    if (type) p.set("type", type);
    if (divisionId) p.set("division_id", divisionId);
    if (districtId) p.set("district_id", districtId);
    if (thanaId) p.set("thana_id", thanaId);
    return `${API_BASE}/api/tourism-bd?${p.toString()}`;
  };

  const { data, size, setSize, isValidating, error } = useSWRInfinite(
    getKey,
    fetcher,
    {
      revalidateFirstPage: false,
      revalidateOnFocus: false,
    },
  );

  const items: Item[] = data ? data.flatMap((p) => p.data || []) : [];
  const hasMore = data?.[data.length - 1]?.meta?.has_more ?? false;
  const total = data?.[0]?.meta?.total ?? 0;
  const isLoading = !data && !error;

  useEffect(() => {
    setSize(1);
  }, [debouncedSearch, type, divisionId, districtId, thanaId, setSize]);

  const hasFilters = !!(search || type || divisionId || districtId || thanaId);

  const resetFilters = () => {
    setSearch("");
    setType("");
    setDivisionId("");
    setDistrictId("");
    setThanaId("");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 px-4 py-6 sm:py-8">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2.5 tracking-tight">
          <Map className="w-7 h-7" />
          বাংলাদেশের পর্যটন কেন্দ্র
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          সকল জেলার দর্শনীয় স্থান, ভ্রমণ গাইড ও পর্যটন তথ্য এক জায়গায়
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
              placeholder="নামে বা বিবরণে খুঁজুন..."
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
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="min-w-[140px] rounded-xl bg-zinc-400/10 text-sm px-3 py-2.5 outline-none"
          >
            <option value="">সকল ধরন</option>
            {types.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>

          <select
            value={divisionId}
            onChange={(e) => setDivisionId(e.target.value)}
            className="min-w-[120px] rounded-xl bg-zinc-400/10 text-sm px-3 py-2.5 outline-none"
          >
            <option value="">সকল বিভাগ</option>
            {divisions.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <select
            value={districtId}
            onChange={(e) => setDistrictId(e.target.value)}
            disabled={!divisionId}
            className="min-w-[120px] rounded-xl bg-zinc-400/10 text-sm px-3 py-2.5 outline-none disabled:opacity-50"
          >
            <option value="">সকল জেলা</option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <select
            value={thanaId}
            onChange={(e) => setThanaId(e.target.value)}
            disabled={!districtId}
            className="min-w-[120px] rounded-xl bg-zinc-400/10 text-sm px-3 py-2.5 outline-none disabled:opacity-50"
          >
            <option value="">সকল থানা</option>
            {thanas.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
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
            <Map className="w-10 h-10 mx-auto opacity-40 mb-3" />
            <p className="text-base font-medium">কোনো স্থান পাওয়া যায়নি</p>
            <p className="text-sm text-zinc-500 mt-1">
              অন্য কীওয়ার্ড বা ফিল্টার দিয়ে চেষ্টা করুন
            </p>
          </div>
        ) : (
          items.map((item) => (
            <Link
              key={item.id}
              href={`/bangladesh/tourism/${item.slug}`}
              className="block rounded-2xl bg-zinc-400/10 p-4 transition hover:bg-zinc-400/20"
            >
              <div className="flex gap-4 items-start">
                <div className="shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-zinc-400/15">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-40">
                      <Map className="w-7 h-7" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-semibold line-clamp-1">
                      {item.title}
                    </h2>
                    {item.type_label && (
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-zinc-400/15">
                        {item.type_label}
                      </span>
                    )}
                  </div>

                  <p className="text-xs flex items-center gap-1 text-zinc-500">
                    <MapPin className="w-3 h-3" />
                    {item.thana || "—"} • {item.district || "—"}
                  </p>

                  {item.description && (
                    <p className="text-sm line-clamp-2 text-zinc-600 dark:text-zinc-400">
                      {item.description.replace(/<[^>]+>/g, "")}
                    </p>
                  )}
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

      {/* SEO Content Block - AdSense friendly */}
      <section className="space-y-4 pt-8 border-t border-zinc-400/20">
        <h2 className="text-xl font-bold">
          বাংলাদেশের পর্যটন কেন্দ্র সম্পর্কে
        </h2>
        <div className="space-y-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          <p>
            বাংলাদেশে রয়েছে অসংখ্য দর্শনীয় স্থান, ঐতিহাসিক নিদর্শন এবং প্রাকৃতিক
            সৌন্দর্য। সুন্দরবন, কক্সবাজার, সিলেটের চা বাগান, বান্দরবানের পাহাড়,
            কুয়াকাটাসহ দেশের প্রতিটি জেলায়ই ভ্রমণের আকর্ষণীয় স্থান রয়েছে।
          </p>
          <p>
            এই পেজে আপনি বাংলাদেশের সকল জেলার পর্যটন কেন্দ্রের তালিকা পাবেন।
            বিভাগ, জেলা বা ধরন অনুসারে ফিল্টার করে সহজেই আপনার পছন্দের স্থান
            খুঁজে নিতে পারবেন। প্রতিটি স্থানের সংক্ষিপ্ত বিবরণ ও অবস্থান দেওয়া
            আছে।
          </p>
          <p>
            ভ্রমণ পরিকল্পনা করার আগে স্থানের বিস্তারিত তথ্য জেনে নিন। তথ্যবক্স
            থেকে সহজেই নির্ভরযোগ্য পর্যটন গাইড পেয়ে যাবেন।
          </p>
        </div>
      </section>
    </div>
  );
}
