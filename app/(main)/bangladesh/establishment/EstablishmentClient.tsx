"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import useSWRInfinite from "swr/infinite";
import {
  Building2,
  Search,
  X,
  ArrowRight,
  MapPin,
  Loader2,
} from "lucide-react";

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

export default function EstablishmentClient() {
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
    fetch(`${API_BASE}/api/establishment-bd/filters`)
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
    fetch(
      `${API_BASE}/api/establishment-bd/districts?division_id=${divisionId}`,
    )
      .then((r) => r.json())
      .then((j) => setDistricts(j.data || []));
  }, [divisionId]);

  useEffect(() => {
    setThanaId("");
    if (!districtId) {
      setThanas([]);
      return;
    }
    fetch(`${API_BASE}/api/establishment-bd/thanas?district_id=${districtId}`)
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
    return `${API_BASE}/api/establishment-bd?${p.toString()}`;
  };

  const { data, size, setSize, isValidating, error } = useSWRInfinite(
    getKey,
    fetcher,
    { revalidateFirstPage: false, revalidateOnFocus: false },
  );

  const items: Item[] = data ? data.flatMap((p) => p.data || []) : [];
  const hasMore = data?.[data.length - 1]?.meta?.has_more ?? false;
  const total = data?.[0]?.meta?.total ?? 0;
  const isLoading = !data && !error;

  useEffect(() => {
    setSize(1);
  }, [debouncedSearch, type, divisionId, districtId, thanaId, setSize]);

  const hasFilters = !!(search || type || divisionId || districtId || thanaId);

  return (
    <div className="max-w-2xl mx-auto space-y-4 p-4 sm:p-6">
      <header>
        <h1 className="text-2xl font-bold flex items-center gap-2 text-zinc-50 text-zinc-100">
          <Building2 className="w-6 h-6 text-amber-600" />
          বাংলাদেশের স্থাপনাসমূহ
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          সকল জেলার গুরুত্বপূর্ণ সরকারি ও বেসরকারি প্রতিষ্ঠান, অফিস ও স্থাপনার
          সম্পূর্ণ তালিকা
        </p>
      </header>

      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="নামে বা বিবরণে খুঁজুন..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-400/25 bg-zinc-800/80 text-sm"
            />
          </div>
          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setType("");
                setDivisionId("");
                setDistrictId("");
                setThanaId("");
              }}
              className="p-2.5 rounded-xl border border-zinc-400/25"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="min-w-40 rounded-lg border border-zinc-400/25 bg-zinc-400/10 text-sm px-3 py-2"
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
            className="min-w-32 rounded-lg border border-zinc-400/25 bg-zinc-400/10 text-sm px-3 py-2"
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
            className="min-w-32 rounded-lg border border-zinc-400/25 bg-zinc-400/10 text-sm px-3 py-2 disabled:opacity-50"
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
            className="min-w-32 rounded-lg border border-zinc-400/25 bg-zinc-400/10 text-sm px-3 py-2 disabled:opacity-50"
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
        <p className="text-xs text-zinc-400">{total}টি ফলাফল</p>
      )}

      <section className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-zinc-400/25 bg-zinc-800/80 p-4 animate-pulse"
              >
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-xl bg-zinc-400/10" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-3/4 rounded bg-zinc-400/10" />
                    <div className="h-3 w-full rounded bg-zinc-400/10" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-zinc-400">
            কোনো স্থাপনা পাওয়া যায়নি
          </div>
        ) : (
          items.map((item) => (
            <Link
              key={item.id}
              href={`/bangladesh/establishment/${item.slug}`}
              className="rounded-2xl border border-zinc-400/25 p-4"
            >
              <div className="flex gap-4 items-start">
                <div className="rounded-2xl border border-zinc-400/25 p-4">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="w-7 h-7 text-zinc-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg  line-clamp-1">
                      {item.title}
                    </h2>
                    {item.type_label && (
                      <span className="text-xs px-2 py-0.5 rounded border border-zinc-400/30 text-zinc-400">
                        {item.type_label}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {item.thana || "..."} • {item.district || "..."}
                  </p>
                  {item.description && (
                    <p className="text-sm  line-clamp-2">
                      {item.description.replace(/<[^>]+>/g, "")}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-zinc-400/25">
                <span className="inline-flex items-center gap-2 text-xs  text-amber-600">
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
