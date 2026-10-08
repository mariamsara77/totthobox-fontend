"use client";

import Link from "next/link";
import { Newspaper, ExternalLink, Clock3, Languages, Layers3, Search } from "lucide-react";
import type { NewsItem, NewsSource, NewsSourceResponse } from "@/lib/news";
import { NEWS_CATEGORIES } from "@/lib/news";

type Props = {
  items: NewsItem[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
  };
  sources: NewsSourceResponse;
  selectedSource?: NewsSource | null;
  filters: {
    source?: string;
    search?: string;
    language?: string;
    category?: string;
    hours?: string;
  };
  basePath: string;
};

function formatTime(value?: string | null, language: "bn" | "en" = "bn") {
  if (!value) return "সময় পাওয়া যায়নি";

  try {
    return new Intl.DateTimeFormat(language === "bn" ? "bn-BD" : "en-BD", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function buildPageUrl(basePath: string, filters: Props["filters"], page: number) {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.language) params.set("language", filters.language);
  if (filters.category) params.set("category", filters.category);
  if (filters.hours) params.set("hours", filters.hours);
  if (page > 1) params.set("page", String(page));

  const query = params.toString();
  return query ? basePath + "?" + query : basePath;
}

function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-zinc-50/80 p-4 transition hover:-translate-y-0.5 hover:bg-zinc-100 dark:bg-zinc-900/70 dark:hover:bg-zinc-900">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
          <Newspaper className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            {item.source_name}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            {item.category && <span>{item.category}</span>}
            <span aria-hidden="true">•</span>
            <span>{formatTime(item.published_at, item.language)}</span>
          </div>
        </div>
      </div>

      <h2 className="text-base font-semibold leading-7 text-zinc-900 dark:text-zinc-100">
        {item.title}
      </h2>

      {item.summary ? (
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
          {item.summary}
        </p>
      ) : (
        <p className="mt-3 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          এই কার্ডে কেবল মূল সংবাদমাধ্যমের শিরোনাম ও প্রকাশ-তথ্য দেখানো হচ্ছে। সম্পূর্ণ প্রতিবেদনটি মূল উৎসে পড়ুন।
        </p>
      )}

      <div className="mt-auto pt-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {item.coverage_count > 1 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-200/70 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              <Layers3 className="h-3.5 w-3.5" aria-hidden="true" />
              {item.coverage_count}টি মাধ্যমে কাভার হয়েছে
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-200/70 px-2.5 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
            মূল প্রকাশ
          </span>
        </div>

        <a
          href={item.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
        >
          মূল সংবাদটি পড়ুন
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

function FilterForm({
  sources,
  filters,
  basePath,
}: {
  sources: NewsSourceResponse;
  filters: Props["filters"];
  basePath: string;
}) {
  return (
    <form
      action={basePath}
      method="get"
      className="grid gap-3 rounded-2xl bg-zinc-50/80 p-4 dark:bg-zinc-900/70 md:grid-cols-[1.5fr_1fr_1fr_1fr_auto]"
    >
      <label className="flex min-w-0 items-center gap-2 rounded-xl bg-white px-3 py-2 dark:bg-zinc-950">
        <Search className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
        <span className="sr-only">সংবাদ খুঁজুন</span>
        <input
          name="search"
          defaultValue={filters.search || ""}
          placeholder="শিরোনাম দিয়ে খুঁজুন"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400"
        />
      </label>

      {basePath === "/news" && (
        <select
          name="source"
          defaultValue={filters.source || ""}
          className="rounded-xl bg-white px-3 py-2 text-sm outline-none dark:bg-zinc-950"
          aria-label="সংবাদমাধ্যম"
        >
          <option value="">সব সংবাদমাধ্যম</option>
          {[...sources.bn, ...sources.en].map((source) => (
            <option key={source.key} value={source.key}>
              {source.name}
            </option>
          ))}
        </select>
      )}

      <select
        name="category"
        defaultValue={filters.category || ""}
        className="rounded-xl bg-white px-3 py-2 text-sm outline-none dark:bg-zinc-950"
        aria-label="বিভাগ"
      >
        {NEWS_CATEGORIES.map((category) => (
          <option key={category.value} value={category.value}>
            {category.label}
          </option>
        ))}
      </select>

      <select
        name="hours"
        defaultValue={filters.hours || "48"}
        className="rounded-xl bg-white px-3 py-2 text-sm outline-none dark:bg-zinc-950"
        aria-label="সময়"
      >
        <option value="6">শেষ ৬ ঘণ্টা</option>
        <option value="24">শেষ ২৪ ঘণ্টা</option>
        <option value="48">শেষ ৪৮ ঘণ্টা</option>
        <option value="168">শেষ ৭ দিন</option>
      </select>

      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-zinc-900"
      >
        দেখুন
      </button>

      {filters.language && (
        <input type="hidden" name="language" value={filters.language} />
      )}
    </form>
  );
}

export default function NewsHub({
  items,
  meta,
  sources,
  selectedSource,
  filters,
  basePath,
}: Props) {
  const language = filters.language;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-gradient-to-br from-zinc-50 to-white p-6 dark:from-zinc-900 dark:to-zinc-950 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-zinc-200/70 px-3 py-1.5 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              <Newspaper className="h-4 w-4" aria-hidden="true" />
              Totthobox News Discovery
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
              {selectedSource ? selectedSource.name + " সংবাদ" : "সর্বশেষ সংবাদ"}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-300">
              এখানে বিভিন্ন সংবাদমাধ্যমের সাম্প্রতিক শিরোনাম এক জায়গায় সাজানো হয়। Totthobox সম্পূর্ণ সংবাদ প্রতিবেদন পুনঃপ্রকাশ করে না; বিস্তারিত পড়তে প্রতিটি শিরোনামের মূল উৎসে যান।
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1.5 dark:bg-zinc-900">
              <Languages className="h-4 w-4" aria-hidden="true" />
              {language === "en" ? "English" : language === "bn" ? "বাংলা" : "বাংলা + English"}
            </span>
            <span className="rounded-full bg-zinc-100 px-3 py-1.5 dark:bg-zinc-900">
              {meta.total.toLocaleString("bn-BD")}টি ফলাফল
            </span>
          </div>
        </div>

        <div className="mt-6">
          <FilterForm sources={sources} filters={filters} basePath={basePath} />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href={basePath}
            className="rounded-full bg-zinc-900 px-3.5 py-1.5 text-xs font-semibold text-white dark:bg-white dark:text-zinc-900"
          >
            সব
          </Link>
          <Link
            href={basePath + "?language=bn"}
            className="rounded-full bg-zinc-100 px-3.5 py-1.5 text-xs font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
          >
            বাংলা
          </Link>
          <Link
            href={basePath + "?language=en"}
            className="rounded-full bg-zinc-100 px-3.5 py-1.5 text-xs font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
          >
            English
          </Link>
        </div>
      </div>

      {items.length > 0 ? (
        <>
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>

          {meta.last_page > 1 && (
            <nav
              className="mt-8 flex items-center justify-center gap-2"
              aria-label="সংবাদ পৃষ্ঠা"
            >
              {meta.current_page > 1 && (
                <Link
                  href={buildPageUrl(basePath, filters, meta.current_page - 1)}
                  className="rounded-xl bg-zinc-100 px-4 py-2 text-sm font-medium dark:bg-zinc-900"
                >
                  আগের
                </Link>
              )}
              <span className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-zinc-900">
                {meta.current_page} / {meta.last_page}
              </span>
              {meta.current_page < meta.last_page && (
                <Link
                  href={buildPageUrl(basePath, filters, meta.current_page + 1)}
                  className="rounded-xl bg-zinc-100 px-4 py-2 text-sm font-medium dark:bg-zinc-900"
                >
                  পরের
                </Link>
              )}
            </nav>
          )}
        </>
      ) : (
        <div className="mt-8 rounded-3xl bg-zinc-50 p-10 text-center dark:bg-zinc-900">
          <Newspaper className="mx-auto h-10 w-10 text-zinc-400" aria-hidden="true" />
          <h2 className="mt-4 text-lg font-semibold">কোনো সংবাদ পাওয়া যায়নি</h2>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।
          </p>
        </div>
      )}
    </section>
  );
}
