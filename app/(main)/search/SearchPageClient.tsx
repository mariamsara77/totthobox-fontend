"use client";

import { useEffect, useState, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  FunnelIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";
import { getSearchUrl } from "@/lib/searchRoutes";
import SearchResultItem from "@/components/search/SearchResultItem";
import SearchEmpty from "@/components/search/SearchEmpty";
import type { SearchItem } from "@/types/search";
import { trackSearch, trackOutboundClick } from "@/lib/analytics";

export default function SearchPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [, startTransition] = useTransition();

  const {
    search,
    setSearch,
    results,
    scope,
    total,
    hasMore,
    loading,
    metaLoading,
    selectedIndex,
    setSelectedIndex,
    prefixes,
    hints,
    showResults,
    showNoResults,
    loadMore,
    clearSearch,
    choosePrefix,
    fetchResults,
    limit,
  } = useGlobalSearch();

  const [hasInitialized, setHasInitialized] = useState(false);

  // Sync URL query param on mount if provided
  useEffect(() => {
    if (!hasInitialized && initialQuery.trim().length >= 2) {
      setSearch(initialQuery);
      fetchResults(initialQuery, 10);
      setHasInitialized(true);
    }
  }, [initialQuery, hasInitialized, setSearch, fetchResults]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (search.trim().length >= 2) {
      trackSearch(search, total);
      fetchResults(search, limit);
      startTransition(() => {
        router.replace(`/search?q=${encodeURIComponent(search.trim())}`, {
          scroll: false,
        });
      });
    }
  };

  const handleClear = () => {
    clearSearch();
    startTransition(() => {
      router.replace("/search", { scroll: false });
    });
  };

  const handleSelectPrefix = (prefix: string) => {
    choosePrefix(prefix);
  };

  const handleItemClick = (item: SearchItem) => {
    const url = getSearchUrl(item);
    if (url.startsWith("http://") || url.startsWith("https://")) {
      trackOutboundClick(url, "search_page_result");
      window.location.assign(url);
      return;
    }
    router.push(url);
  };

  return (
    <div className="mx-auto max-w-4xl px-3 sm:px-6 py-6 sm:py-10 space-y-6">
      {/* Search Header Banner */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 p-4 sm:p-6 shadow-xs backdrop-blur-md">
        <div className="flex items-center gap-2 mb-2 text-primary-600 dark:text-primary-400">
          <SparklesIcon className="size-5 shrink-0" />
          <span className="text-xs font-semibold tracking-wider uppercase">
            স্মার্ট সার্চ ইঞ্জিন
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          সাইটে অনুসন্ধান করুন
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          অনলাইন টুলস, কনভার্টার, জরুরি নম্বর, ছুটির দিন, দেশ পরিচিতি ও সব প্রয়োজনীয় সেবা এক ক্লিকে খুঁজুন।
        </p>

        {/* Search Input Form */}
        <form onSubmit={handleSearchSubmit} className="mt-5 relative">
          <div className="flex items-center rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 shadow-xs focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20">
            <MagnifyingGlassIcon className="size-5 text-zinc-400 mr-2.5 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="কী খুঁজছেন? যেমন: বয়স, জমি পরিমাপ, ৯৯৯, অভ্র, ডলার রেট..."
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent text-sm sm:text-base text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden"
            />

            {loading && (
              <span
                aria-label="খোঁজা হচ্ছে"
                className="size-4 shrink-0 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-600 dark:border-zinc-700 dark:border-t-zinc-300 mr-2"
              />
            )}

            {search && !loading && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="মুছুন"
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 mr-1"
              >
                <XMarkIcon className="size-4" />
              </button>
            )}

            <button
              type="submit"
              className="rounded-lg bg-primary-600 hover:bg-primary-700 text-white px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-colors shadow-xs"
            >
              অনুসন্ধান
            </button>
          </div>
        </form>

        {/* Filter Pills / Prefixes */}
        {prefixes.length > 0 && (
          <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-2">
              <FunnelIcon className="size-3.5" />
              <span>বিভাগ অনুযায়ী ফিল্টার করুন:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {prefixes.map((pref) => (
                <button
                  key={pref}
                  type="button"
                  onClick={() => handleSelectPrefix(pref)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                    search.startsWith(`${pref}:`)
                      ? "bg-primary-600 text-white shadow-xs"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  }`}
                >
                  {pref}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results Section */}
      <div className="space-y-3">
        {showResults && (
          <div className="flex items-center justify-between px-1 text-xs text-zinc-500">
            <span>
              {total || results.length}টি ফলাফল পাওয়া গেছে
              {scope && ` (${scope} বিভাগে)`}
            </span>
            <span className="hidden sm:inline">
              ক্লিক করে সরাসরি পেজে প্রবেশ করুন
            </span>
          </div>
        )}

        {showResults ? (
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 divide-y divide-zinc-100 dark:divide-zinc-800 overflow-hidden shadow-xs">
            {results.map((item, index) => (
              <SearchResultItem
                key={`${item._search_type}-${item._search_slug}-${index}`}
                item={item}
                index={index}
                selected={index === selectedIndex}
                query={search}
                onSelect={() => handleItemClick(item)}
                onHover={() => setSelectedIndex(index)}
              />
            ))}
          </div>
        ) : showNoResults ? (
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-xs">
            <SearchEmpty type="no-results" search={search} onClear={handleClear} />
          </div>
        ) : loading && !results.length ? (
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-xs">
            <SearchEmpty type="skeleton" />
          </div>
        ) : (
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-xs text-center space-y-3">
            <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400">
              <MagnifyingGlassIcon className="size-6" />
            </div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              কীভাবে সার্চ করবেন?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
              উপরে সার্চ বক্সে যেকোনো শব্দ বাংলা বা ইংরেজিতে টাইপ করুন। যেমন: &quot;বয়স&quot;, &quot;age&quot;, &quot;land&quot;, &quot;৯৯৯&quot;, &quot;পাসওয়ার্ড&quot;, &quot;ডলার&quot;।
            </p>
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={loadMore}
              disabled={loading}
              className="rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-5 py-2 text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors shadow-xs disabled:opacity-50"
            >
              {loading ? "লোড হচ্ছে..." : "আরও ফলাফল দেখুন"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
