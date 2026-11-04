"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Clock3,
  ExternalLink,
  Newspaper,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";

type NewsItem = {
  id: number | string;
  title: string;
  slug: string;
  source_url?: string | null;
  source_name?: string | null;
  source_key?: string | null;
  source_slug?: string | null;
  category?: string | null;
  language?: string | null;
  published_at?: string | null;
  image_url?: string | null;
  coverage_count?: number;
};

type NewsSource = {
  key: string;
  name: string;
  language?: string;
  total?: number;
};

type NewsPayload = {
  data?: NewsItem[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    has_more: boolean;
  };
};

const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com"
).replace(/\/$/, "");

function formatDate(value?: string | null) {
  if (!value) return "সময় অনুপলব্ধ";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "সময় অনুপলব্ধ";
  return new Intl.DateTimeFormat("bn-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function NewsHeadlines({
  initialSourceKey = "",
}: {
  initialSourceKey?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const source = initialSourceKey || searchParams.get("source") || "";
  const language = searchParams.get("language") ?? "";
  const category = searchParams.get("category") ?? "";
  const date = searchParams.get("date") ?? ""; // YYYY-MM-DD
  const page = Math.max(1, Number(searchParams.get("page") || 1));

  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") ?? "",
  );
  const [payload, setPayload] = useState<NewsPayload>({});
  const [sources, setSources] = useState<NewsSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const queryString = searchParams.toString();

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          (payload.data ?? [])
            .map((item) => item.category?.trim())
            .filter((value): value is string => Boolean(value)),
        ),
      ).sort(),
    [payload.data],
  );

  // Sync search input when URL changes
  useEffect(() => {
    setSearchInput(searchParams.get("search") ?? "");
  }, [queryString, searchParams]);

  // Load sources once
  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_BASE}/api/news/sources`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("সংবাদমাধ্যমের তালিকা লোড করা যায়নি।");
        return res.json();
      })
      .then((result) => {
        const data = result?.data ?? result;
        const list = Array.isArray(data)
          ? data
          : [
              ...(Array.isArray(data?.bn) ? data.bn : []),
              ...(Array.isArray(data?.en) ? data.en : []),
            ];

        const normalized = list
          .map((item: any) => ({
            key: String(item?.key ?? item?.source_key ?? ""),
            name: String(item?.name ?? item?.source_name ?? "").trim(),
            language: String(item?.language ?? "").toLowerCase(),
            total: Number(item?.total ?? item?.count ?? 0),
          }))
          .filter((item: NewsSource) => item.key && item.name);

        setSources(normalized);
      })
      .catch((err) => {
        if (err?.name !== "AbortError") setSources([]);
      });

    return () => controller.abort();
  }, []);

  // Fetch news list
  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams();

    if (source) params.set("source", source);
    if (language) params.set("language", language);
    if (category) params.set("category", category);
    if (date) params.set("date", date);

    const term = searchParams.get("search");
    if (term) params.set("search", term);

    params.set("page", String(page));
    params.set("per_page", "18");
    // ← NO diverse=1 here. Full results by default.

    setLoading(true);
    setError("");
    const started = Date.now();

    fetch(`${API_BASE}/api/news?${params.toString()}`, {
      signal: controller.signal,
      cache: "no-store",
      headers: { Accept: "application/json" },
    })
      .then(async (res) => {
        if (!res.ok)
          throw new Error(
            "সংবাদ শিরোনাম লোড করা যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।",
          );
        return res.json();
      })
      .then((result: NewsPayload) => {
        setPayload({
          data: Array.isArray(result?.data) ? result.data : [],
          meta: result?.meta,
        });
      })
      .catch((err) => {
        if (err?.name !== "AbortError") {
          setError(err instanceof Error ? err.message : "একটি সমস্যা হয়েছে।");
          setPayload({ data: [], meta: undefined });
        }
      })
      .finally(() => {
        const remaining = Math.max(0, 280 - (Date.now() - started));
        window.setTimeout(() => {
          if (!controller.signal.aborted) setLoading(false);
        }, remaining);
      });

    return () => controller.abort();
  }, [source, language, category, date, page, searchParams]);

  function updateFilters(changes: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());

    // Handle source specially (it changes the path)
    if ("source" in changes) {
      const nextSource = changes.source;
      // remove source from query string
      params.delete("source");
      // apply other changes
      for (const [key, value] of Object.entries(changes)) {
        if (key === "source") continue;
        if (value) params.set(key, value);
        else params.delete(key);
      }
      if (!("page" in changes)) params.delete("page");

      const basePath = nextSource
        ? `/news/headlines/${encodeURIComponent(nextSource)}`
        : "/news/headlines";

      router.replace(
        `${basePath}${params.size ? `?${params.toString()}` : ""}`,
        { scroll: false },
      );
      return;
    }

    // Normal query updates
    for (const [key, value] of Object.entries(changes)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    if (!("page" in changes)) params.delete("page");

    router.replace(`${pathname}${params.size ? `?${params.toString()}` : ""}`, {
      scroll: false,
    });
  }

  function submitSearch(e: FormEvent) {
    e.preventDefault();
    updateFilters({ search: searchInput.trim() || null });
  }

  const meta = payload.meta;

  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6">
      {/* Header */}
      <div className="mb-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-400/10 sm:p-7">
        <div className="flex items-start gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900">
            <Newspaper className="h-6 w-6" />
          </span>
          <div>
            <p className="mb-1 text-sm font-semibold text-zinc-600 dark:text-zinc-300">
              Totthobox News
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
              সংবাদ শিরোনাম
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              বিভিন্ন সংবাদমাধ্যমের সর্বশেষ শিরোনাম এক জায়গায় দেখুন। তারিখ দিয়ে
              ফিল্টার করে পুরনো দিনের খবরও খুঁজে নিতে পারবেন।
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <form
        onSubmit={submitSearch}
        className="mb-6 grid grid-cols-1 gap-3 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-400/10 sm:grid-cols-2"
      >
        {/* Search */}
        <label className="relative block sm:col-span-2">
          <span className="sr-only">সংবাদ খুঁজুন</span>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="শিরোনাম খুঁজুন..."
            className="!m-0 !h-11 !min-w-0 !w-full !rounded-xl !border !border-zinc-200 !bg-zinc-50 !py-0 pl-9 pr-3 text-sm leading-normal !shadow-none !outline-none transition placeholder:text-zinc-500 focus:!border-zinc-400 focus:!bg-white dark:!border-zinc-700 dark:!bg-zinc-400/10 dark:focus:!border-zinc-500"
          />
        </label>

        {/* Source */}
        <label>
          <span className="sr-only">সংবাদমাধ্যম</span>
          <select
            value={source}
            onChange={(e) => updateFilters({ source: e.target.value || null })}
            className="h-11 w-full cursor-pointer rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-800 outline-none transition hover:border-zinc-300 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30 dark:border-zinc-700 dark:bg-zinc-400/10 dark:text-zinc-100"
          >
            <option value="">সব সংবাদমাধ্যম</option>
            {sources.map((item) => (
              <option key={item.key} value={item.key}>
                {item.name}
                {typeof item.total === "number" && item.total > 0
                  ? ` (${item.total.toLocaleString("bn-BD")})`
                  : ""}
              </option>
            ))}
          </select>
        </label>

        {/* Category */}
        <label>
          <span className="sr-only">বিভাগ</span>
          <select
            value={category}
            onChange={(e) =>
              updateFilters({ category: e.target.value || null })
            }
            className="h-11 w-full cursor-pointer rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-800 outline-none transition hover:border-zinc-300 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30 dark:border-zinc-700 dark:bg-zinc-400/10 dark:text-zinc-100"
          >
            <option value="">সব বিভাগ</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        {/* Language */}
        <label>
          <span className="sr-only">ভাষা</span>
          <select
            value={language}
            onChange={(e) =>
              updateFilters({ language: e.target.value || null })
            }
            className="h-11 w-full cursor-pointer rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-800 outline-none transition hover:border-zinc-300 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30 dark:border-zinc-700 dark:bg-zinc-400/10 dark:text-zinc-100"
          >
            <option value="">সব ভাষা</option>
            <option value="bn">বাংলা</option>
            <option value="en">English</option>
          </select>
        </label>

        {/* Date filter – the key feature you wanted */}
        <label className="relative">
          <span className="sr-only">তারিখ নির্বাচন</span>
          <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="date"
            value={date}
            onChange={(e) => updateFilters({ date: e.target.value || null })}
            className="h-11 w-full cursor-pointer rounded-xl border border-zinc-200 bg-zinc-50 pl-9 pr-3 text-sm text-zinc-800 outline-none transition hover:border-zinc-300 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30 dark:border-zinc-700 dark:bg-zinc-400/10 dark:text-zinc-100"
          />
        </label>

        <button
          type="submit"
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 sm:col-span-2"
        >
          <Search className="h-4 w-4" /> খুঁজুন
        </button>
      </form>

      {/* Title + count */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-3 dark:border-zinc-800">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
          {source
            ? (sources.find((s) => s.key === source)?.name ??
              "নির্বাচিত সংবাদমাধ্যম")
            : date
              ? `${new Date(date).toLocaleDateString("bn-BD", { dateStyle: "long" })} এর শিরোনাম`
              : "সর্বশেষ শিরোনাম"}
        </h2>
        {meta && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            মোট {meta.total.toLocaleString("bn-BD")}টি শিরোনাম
          </p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
        >
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 gap-3" aria-busy="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <article
              key={i}
              className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-400/10"
            >
              <div className="h-36 animate-pulse bg-zinc-400/10 sm:h-40" />
              <div className="animate-pulse p-4 space-y-3">
                <div className="flex gap-2">
                  <div className="h-6 w-24 rounded-full bg-zinc-400/10" />
                  <div className="h-3 w-16 rounded-full bg-zinc-400/10" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full rounded-md bg-zinc-400/10" />
                  <div className="h-4 w-5/6 rounded-md bg-zinc-400/10" />
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (payload.data ?? []).length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 px-5 py-14 text-center dark:border-zinc-700">
          <Newspaper className="mx-auto mb-3 h-9 w-9 text-zinc-400" />
          <h3 className="font-semibold text-zinc-900 dark:text-white">
            কোনো সংবাদ পাওয়া যায়নি
          </h3>
          <p className="mt-1 text-sm text-zinc-500">
            অন্য তারিখ, শব্দ বা সংবাদমাধ্যম দিয়ে আবার চেষ্টা করুন।
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchInput("");
              router.replace("/news/headlines");
            }}
            className="mt-4 rounded-xl bg-zinc-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900"
          >
            সব শিরোনাম দেখুন
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3">
            {(payload.data ?? []).map((item) => (
              <article
                key={item.id ?? item.slug}
                className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-400/10 dark:hover:border-zinc-700"
              >
                {item.image_url ? (
                  <Link
                    href={`/news/headlines/story/${encodeURIComponent(item.slug)}`}
                    tabIndex={-1}
                    aria-hidden="true"
                    className="block h-44 overflow-hidden bg-zinc-400/10"
                  >
                    <img
                      src={item.image_url}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    />
                  </Link>
                ) : (
                  <div className="flex h-24 items-center justify-center bg-zinc-400/10 text-zinc-600 dark:text-zinc-300">
                    <Newspaper className="h-8 w-8 opacity-70" />
                  </div>
                )}

                <div className="flex flex-1 flex-col p-4">
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                    {item.source_name && (
                      <span className="rounded-full bg-zinc-400/10 px-2.5 py-1 font-semibold text-zinc-700 dark:text-zinc-200">
                        {item.source_name}
                      </span>
                    )}
                    {item.category && <span>{item.category}</span>}
                  </div>

                  <h3 className="line-clamp-3 text-base font-semibold leading-7 text-zinc-900 dark:text-zinc-100">
                    <Link
                      href={`/news/headlines/story/${encodeURIComponent(item.slug)}`}
                      className="hover:text-zinc-600 dark:hover:text-white"
                    >
                      {item.title}
                    </Link>
                  </h3>

                  <div className="mt-auto flex items-center justify-between gap-3 pt-4 text-xs text-zinc-500 dark:text-zinc-400">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 className="h-3.5 w-3.5" />
                      {formatDate(item.published_at)}
                    </span>
                    {item.source_url && (
                      <a
                        href={item.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="মূল সংবাদ পড়ুন"
                        className="inline-flex shrink-0 items-center gap-1 font-semibold text-zinc-700 hover:underline dark:text-zinc-200"
                      >
                        বিস্তারিত <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          {meta && meta.last_page > 1 && (
            <nav
              aria-label="সংবাদ পৃষ্ঠা"
              className="mt-7 flex items-center justify-center gap-3"
            >
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => updateFilters({ page: String(page - 1) })}
                className="inline-flex items-center gap-1 rounded-xl border border-zinc-400/30 px-4 py-2 text-sm transition hover:bg-zinc-400/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" /> আগের
              </button>
              <span className="text-sm text-zinc-600 dark:text-zinc-300">
                পৃষ্ঠা {page.toLocaleString("bn-BD")} /{" "}
                {meta.last_page.toLocaleString("bn-BD")}
              </span>
              <button
                type="button"
                disabled={page >= meta.last_page}
                onClick={() => updateFilters({ page: String(page + 1) })}
                className="inline-flex items-center gap-1 rounded-xl border border-zinc-400/30 px-4 py-2 text-sm transition hover:bg-zinc-400/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                পরের <ChevronRight className="h-4 w-4" />
              </button>
            </nav>
          )}
        </>
      )}
    </section>
  );
}
