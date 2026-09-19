"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import type {
  Country,
  CountryPage,
  CountrySort,
  CountryStats,
} from "@/lib/international/countries";

const PER_PAGE = 24;

type Props = {
  initialCountries: Country[];
  initialPage: number;
  initialTotal: number;
  initialTotalPages: number;
  initialHasMore: boolean;
  stats: CountryStats;
  regions: string[];
  initialSearch: string;
  initialRegion: string;
  initialSort: CountrySort;
};

function formatPopulation(population: number) {
  if (population >= 1_000_000_000) {
    return `${(population / 1_000_000_000).toFixed(2)} বিলিয়ন`;
  }
  if (population >= 1_000_000) {
    return `${(population / 1_000_000).toFixed(2)} মিলিয়ন`;
  }
  if (population >= 1_000) {
    return `${(population / 1_000).toFixed(1)} হাজার`;
  }
  return population > 0 ? population.toLocaleString("bn-BD") : "তথ্য নেই";
}

function formatArea(area: number) {
  if (area <= 0) return "জানা নেই";
  if (area >= 1_000_000) {
    return `${(area / 1_000_000).toFixed(2)} মি. কিমি²`;
  }
  return `${area.toLocaleString("bn-BD")} কিমি²`;
}

function buildQuery(
  search: string,
  region: string,
  sort: CountrySort,
  page?: number,
) {
  const params = new URLSearchParams();
  if (search.trim()) params.set("search", search.trim());
  if (region.trim()) params.set("regionFilter", region.trim());
  if (sort !== "name") params.set("sortBy", sort);
  if (page && page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function CountryGrid({
  initialCountries,
  initialPage,
  initialTotal,
  initialTotalPages,
  initialHasMore,
  stats,
  regions,
  initialSearch,
  initialRegion,
  initialSort,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [countries, setCountries] = useState<Country[]>(initialCountries);
  const [search, setSearch] = useState(initialSearch);
  const [regionFilter, setRegionFilter] = useState(initialRegion);
  const [sortBy, setSortBy] = useState<CountrySort>(initialSort);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [total, setTotal] = useState(initialTotal);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);
  const requestIdRef = useRef(0);
  const currentPageRef = useRef(initialPage);
  const hasMoreRef = useRef(initialHasMore);
  const searchRef = useRef(initialSearch);
  const regionRef = useRef(initialRegion);
  const sortRef = useRef(initialSort);

  // Sync when server props change (filter / page navigation)
  useEffect(() => {
    setCountries(initialCountries);
    setCurrentPage(initialPage);
    setTotal(initialTotal);
    setTotalPages(initialTotalPages);
    setHasMore(initialHasMore);
    setSearch(initialSearch);
    setRegionFilter(initialRegion);
    setSortBy(initialSort);

    currentPageRef.current = initialPage;
    hasMoreRef.current = initialHasMore;
    searchRef.current = initialSearch;
    regionRef.current = initialRegion;
    sortRef.current = initialSort;
    loadingRef.current = false;
    setLoadingMore(false);
    setError(null);
  }, [
    initialCountries,
    initialPage,
    initialTotal,
    initialTotalPages,
    initialHasMore,
    initialSearch,
    initialRegion,
    initialSort,
  ]);

  const updateUrl = useCallback(
    (nextSearch: string, nextRegion: string, nextSort: CountrySort) => {
      const query = buildQuery(nextSearch, nextRegion, nextSort);
      router.replace(`${pathname}${query}`, { scroll: false });
    },
    [pathname, router],
  );

  const changeFilters = useCallback(
    (nextSearch: string, nextRegion: string, nextSort: CountrySort) => {
      requestIdRef.current += 1;
      loadingRef.current = false;
      setLoadingMore(false);
      setError(null);

      searchRef.current = nextSearch;
      regionRef.current = nextRegion;
      sortRef.current = nextSort;

      setSearch(nextSearch);
      setRegionFilter(nextRegion);
      setSortBy(nextSort);
      updateUrl(nextSearch, nextRegion, nextSort);
    },
    [updateUrl],
  );

  const loadNextPage = useCallback(
    async (requestedPage?: number) => {
      if (loadingRef.current || !hasMoreRef.current) return;

      const nextPage = requestedPage ?? currentPageRef.current + 1;
      if (nextPage <= currentPageRef.current || nextPage > totalPages) {
        if (nextPage > totalPages) {
          hasMoreRef.current = false;
          setHasMore(false);
        }
        return;
      }

      loadingRef.current = true;
      setLoadingMore(true);
      setError(null);
      const requestId = ++requestIdRef.current;

      try {
        const response = await fetch("/api/international/countries", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            page: nextPage,
            perPage: PER_PAGE,
            search: searchRef.current.trim(),
            region: regionRef.current.trim(),
            sort: sortRef.current,
          }),
          cache: "no-store",
          credentials: "same-origin",
        });

        if (!response.ok) {
          throw new Error(`Country API returned ${response.status}`);
        }

        const result = (await response.json()) as CountryPage;

        if (requestId !== requestIdRef.current) return;

        setCountries((prev) => {
          const existing = new Set(prev.map((c) => c.cca3 || c.code || c.slug));
          const fresh = result.countries.filter((c) => {
            const key = c.cca3 || c.code || c.slug;
            return !existing.has(key);
          });
          return [...prev, ...fresh];
        });

        currentPageRef.current = result.page;
        hasMoreRef.current = result.hasMore;
        setCurrentPage(result.page);
        setTotal(result.total);
        setTotalPages(result.totalPages);
        setHasMore(result.hasMore);
      } catch (err) {
        if (requestId !== requestIdRef.current) return;
        console.error("Country pagination failed:", err);
        setError("আরও দেশের তথ্য লোড করা সম্ভব হয়নি।");
      } finally {
        if (requestId === requestIdRef.current) {
          loadingRef.current = false;
          setLoadingMore(false);
        }
      }
    },
    [totalPages],
  );

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !loadingRef.current) {
          void loadNextPage();
        }
      },
      { root: null, rootMargin: "800px 0px", threshold: 0 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, loadNextPage]);

  const nextPageHref = useMemo(() => {
    if (!hasMore) return pathname;
    return `${pathname}${buildQuery(search, regionFilter, sortBy, currentPage + 1)}`;
  }, [pathname, search, regionFilter, sortBy, currentPage, hasMore]);

  const handleNextClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (loadingRef.current || !hasMoreRef.current) return;
      e.preventDefault();
      void loadNextPage(currentPageRef.current + 1);
    },
    [loadNextPage],
  );

  const resetFilters = useCallback(() => {
    changeFilters("", "", "name");
  }, [changeFilters]);

  const statsItems = useMemo(
    () => [
      { label: "মোট দেশ", value: `${stats.total.toLocaleString("bn-BD")} টি` },
      { label: "বিশ্ব জনসংখ্যা", value: formatPopulation(stats.population) },
      { label: "অঞ্চল", value: `${stats.regions} টি` },
      { label: "স্থলবেষ্টিত", value: `${stats.landlocked} টি` },
    ],
    [stats],
  );

  return (
    <div className="space-y-10">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {statsItems.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-zinc-200/70 bg-white/60 p-4 shadow-sm dark:border-zinc-700/60 dark:bg-zinc-900/50"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              {item.label}
            </p>
            <p className="mt-1 text-xl font-bold tabular-nums">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-zinc-200/70 bg-white/60 p-4 shadow-sm dark:border-zinc-700/60 dark:bg-zinc-900/50 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <label htmlFor="country-search" className="sr-only">
              দেশের নাম বা রাজধানী খুঁজুন
            </label>
            <input
              id="country-search"
              type="search"
              value={search}
              onChange={(e) =>
                changeFilters(e.target.value, regionFilter, sortBy)
              }
              placeholder="দেশের নাম, রাজধানী বা কোড খুঁজুন..."
              className="w-full rounded-xl border border-zinc-400/25 bg-zinc-400/10 px-4 py-2.5 text-sm outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30"
            />
          </div>

          <select
            value={regionFilter}
            onChange={(e) => changeFilters(search, e.target.value, sortBy)}
            aria-label="অঞ্চল নির্বাচন করুন"
            className="w-full rounded-xl border border-zinc-400/25 bg-zinc-400/10 px-4 py-2.5 text-sm outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30 sm:w-44"
          >
            <option value="">সকল অঞ্চল</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) =>
              changeFilters(search, regionFilter, e.target.value as CountrySort)
            }
            aria-label="সাজানোর পদ্ধতি"
            className="w-full rounded-xl border border-zinc-400/25 bg-zinc-400/10 px-4 py-2.5 text-sm outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30 sm:w-52"
          >
            <option value="name">নাম (A–Z)</option>
            <option value="population_desc">জনসংখ্যা (বেশি → কম)</option>
            <option value="population_asc">জনসংখ্যা (কম → বেশি)</option>
            <option value="area_desc">আয়তন (বড় → ছোট)</option>
            <option value="area_asc">আয়তন (ছোট → বড়)</option>
          </select>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {total.toLocaleString("bn-BD")} টি দেশ পাওয়া গেছে
          </p>
          {(search || regionFilter || sortBy !== "name") && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-sm font-medium text-zinc-700 underline-offset-2 hover:underline dark:text-zinc-300"
            >
              ফিল্টার মুছুন
            </button>
          )}
        </div>
      </div>

      {/* Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
        {countries.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-zinc-300 py-16 text-center dark:border-zinc-700">
            <p className="text-lg font-medium">কোনো দেশের তথ্য পাওয়া যায়নি</p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-4 text-sm font-medium underline underline-offset-2"
            >
              সব ফিল্টার মুছুন
            </button>
          </div>
        ) : (
          countries.map((country) => (
            <article
              key={country.cca3 || country.code || country.slug}
              className="group overflow-hidden rounded-2xl border border-zinc-200/70 bg-white/70 shadow-sm transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-700/60 dark:bg-zinc-900/50 dark:hover:border-zinc-600"
            >
              <div className="flex items-center gap-4 border-b border-zinc-100 p-4 dark:border-zinc-800">
                <img
                  src={country.flag}
                  alt={`${country.name_bengali} এর পতাকা`}
                  loading="lazy"
                  decoding="async"
                  width={64}
                  height={44}
                  className="h-11 w-16 shrink-0 rounded-lg border border-zinc-200 object-cover dark:border-zinc-700"
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (!img.src.endsWith("/un.png")) {
                      img.src = "https://flagcdn.com/w320/un.png";
                    }
                  }}
                />
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-lg font-bold leading-tight">
                    {country.name_bengali}{" "}
                    <span className="text-base">{country.flag_emoji}</span>
                  </h2>
                  <span className="mt-1 inline-block rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    {country.continent}
                  </span>
                </div>
              </div>

              <div className="space-y-4 p-4">
                <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                  <strong>{country.name_bengali}</strong> ({country.name})
                  দেশটির রাজধানী <strong>{country.capital}</strong>। এটি{" "}
                  {country.continent} অঞ্চলের অন্তর্ভুক্ত।
                </p>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      জনসংখ্যা
                    </p>
                    <p className="font-semibold tabular-nums">
                      {formatPopulation(country.population)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      আয়তন
                    </p>
                    <p className="font-semibold tabular-nums">
                      {formatArea(country.area)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      অঞ্চল
                    </p>
                    <p className="font-semibold">{country.region}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      কোড
                    </p>
                    <p className="font-semibold">{country.cca3}</p>
                  </div>
                </div>

                <Link
                  href={`/international/country/${country.slug}`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-zinc-800 transition group-hover:underline dark:text-zinc-200"
                >
                  বিস্তারিত দেখুন
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Infinite scroll trigger */}
      {hasMore && (
        <div
          ref={loadMoreRef}
          className="flex min-h-20 items-center justify-center"
          aria-live="polite"
        >
          {loadingMore ? (
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-700 dark:border-zinc-600 dark:border-t-zinc-200"
                aria-hidden="true"
              />
              আরও দেশ লোড হচ্ছে...
            </div>
          ) : (
            <span className="text-xs text-zinc-400">আরও তথ্য লোড হবে...</span>
          )}
        </div>
      )}

      {/* Crawlable fallback (important for AdSense + SEO) */}
      {hasMore && (
        <div className="flex justify-center">
          <Link
            href={nextPageHref}
            onClick={handleNextClick}
            className="rounded-xl border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium shadow-sm transition hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:hover:bg-zinc-700"
          >
            পরের পৃষ্ঠা →
          </Link>
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-4 text-center dark:border-red-900/50 dark:bg-red-950/30"
        >
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          <button
            type="button"
            onClick={() => void loadNextPage(currentPageRef.current + 1)}
            className="mt-3 rounded-xl border border-red-300 bg-white px-4 py-2 text-sm font-medium dark:border-red-800 dark:bg-red-950"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      )}

      {!hasMore && countries.length > 0 && (
        <p className="py-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          সব {total.toLocaleString("bn-BD")} টি ফলাফল দেখানো হয়েছে।
        </p>
      )}
    </div>
  );
}
