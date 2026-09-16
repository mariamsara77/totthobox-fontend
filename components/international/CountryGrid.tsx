"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type {
  Country,
  CountryPage,
  CountrySort,
  CountryStats,
} from "@/lib/international/countries";

const PER_PAGE = 24;

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
  if (area <= 0) {
    return "জানা নেই";
  }

  if (area >= 1_000_000) {
    return `${(area / 1_000_000).toFixed(2)} মি. কিমি²`;
  }

  return `${area.toLocaleString("bn-BD")} কিমি²`;
}

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

  const requestIdRef = useRef(0);

  /*
   * Server component থেকে নতুন props এলে
   * client state synchronize হবে।
   */
  useEffect(() => {
    setCountries(initialCountries);
    setCurrentPage(initialPage);
    setTotal(initialTotal);
    setTotalPages(initialTotalPages);
    setHasMore(initialHasMore);
    setSearch(initialSearch);
    setRegionFilter(initialRegion);
    setSortBy(initialSort);
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
      const params = new URLSearchParams();

      if (nextSearch.trim()) {
        params.set("search", nextSearch.trim());
      }

      if (nextRegion.trim()) {
        params.set("regionFilter", nextRegion.trim());
      }

      if (nextSort !== "name") {
        params.set("sortBy", nextSort);
      }

      const query = params.toString();

      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router],
  );

  const handleSearchChange = (value: string) => {
    setSearch(value);

    updateUrl(value, regionFilter, sortBy);
  };

  const handleRegionChange = (value: string) => {
    setRegionFilter(value);

    updateUrl(search, value, sortBy);
  };

  const handleSortChange = (value: CountrySort) => {
    setSortBy(value);

    updateUrl(search, regionFilter, value);
  };

  const resetFilters = () => {
    setSearch("");
    setRegionFilter("");
    setSortBy("name");

    updateUrl("", "", "name");
  };

  /*
   * পরের page server API থেকে নিয়ে আসবে।
   *
   * গুরুত্বপূর্ণ:
   * API একই filtering/sorting ব্যবহার করছে,
   * তাই duplicate বা wrong ordering হবে না।
   */
  const loadNextPage = useCallback(async () => {
    if (loadingMore || !hasMore) {
      return;
    }

    const nextPage = currentPage + 1;

    setLoadingMore(true);
    setError(null);

    const requestId = ++requestIdRef.current;

    try {
      const params = new URLSearchParams();

      params.set("page", String(nextPage));

      params.set("perPage", String(PER_PAGE));

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (regionFilter.trim()) {
        params.set("region", regionFilter.trim());
      }

      params.set("sort", sortBy);

      const response = await fetch(
        `/api/international/countries?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error("Country API request failed");
      }

      const result = (await response.json()) as CountryPage;

      if (requestId !== requestIdRef.current) {
        return;
      }

      setCountries((previous) => {
        const existing = new Set(
          previous.map(
            (country) => country.cca3 || country.code || country.slug,
          ),
        );

        const newCountries = result.countries.filter((country) => {
          const key = country.cca3 || country.code || country.slug;

          return !existing.has(key);
        });

        return [...previous, ...newCountries];
      });

      setCurrentPage(result.page);
      setTotal(result.total);
      setTotalPages(result.totalPages);
      setHasMore(result.hasMore);
    } catch {
      if (requestId !== requestIdRef.current) {
        return;
      }

      setError("আরও দেশের তথ্য লোড করা সম্ভব হয়নি।");
    } finally {
      if (requestId === requestIdRef.current) {
        setLoadingMore(false);
      }
    }
  }, [currentPage, hasMore, loadingMore, regionFilter, search, sortBy]);

  /*
   * Native IntersectionObserver.
   *
   * react-intersection-observer package আর দরকার নেই।
   */
  useEffect(() => {
    const target = loadMoreRef.current;

    if (!target || !hasMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry?.isIntersecting) {
          void loadNextPage();
        }
      },
      {
        root: null,
        rootMargin: "800px 0px",
        threshold: 0,
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, loadNextPage]);

  const statsItems = useMemo(
    () => [
      {
        label: "মোট দেশ",
        value: `${stats.total.toLocaleString("bn-BD")} টি`,
      },
      {
        label: "বিশ্ব জনসংখ্যা",
        value: formatPopulation(stats.population),
      },
      {
        label: "অঞ্চল",
        value: `${stats.regions} টি`,
      },
      {
        label: "স্থলবেষ্টিত",
        value: `${stats.landlocked} টি`,
      },
    ],
    [stats],
  );

  return (
    <div className="space-y-8">
      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsItems.map((item) => (
          <div
            key={item.label}
            className="bg-zinc-400/10 border border-zinc-400/25 rounded-xl p-4 hover:bg-zinc-400/25 transition-colors"
          >
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {item.label}
            </p>

            <p className="text-xl font-bold mt-1">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-zinc-400/10 p-4 rounded-xl border border-zinc-400/25">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-50">
            <label htmlFor="country-search" className="sr-only">
              দেশের নাম বা রাজধানী খুঁজুন
            </label>

            <input
              id="country-search"
              type="search"
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="দেশের নাম বা রাজধানী খুঁজুন..."
              className="w-full px-4 py-2.5 rounded-lg border border-zinc-400/25 bg-transparent outline-none focus:ring-2 focus:ring-zinc-400/25 hover:bg-zinc-400/25"
            />
          </div>

          <select
            value={regionFilter}
            onChange={(event) => handleRegionChange(event.target.value)}
            aria-label="অঞ্চল নির্বাচন করুন"
            className="w-full sm:w-auto min-w-37.5 px-4 py-2.5 rounded-lg border border-zinc-400/25 bg-transparent outline-none hover:bg-zinc-400/25"
          >
            <option value="">সকল অঞ্চল</option>

            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(event) =>
              handleSortChange(event.target.value as CountrySort)
            }
            aria-label="সাজানোর পদ্ধতি"
            className="w-full sm:w-auto min-w-40 px-4 py-2.5 rounded-lg border border-zinc-400/25 bg-transparent outline-none hover:bg-zinc-400/25"
          >
            <option value="name">নাম (A-Z)</option>

            <option value="population_desc">জনসংখ্যা (বেশি → কম)</option>

            <option value="population_asc">জনসংখ্যা (কম → বেশি)</option>

            <option value="area_desc">আয়তন (বড় → ছোট)</option>

            <option value="area_asc">আয়তন (ছোট → বড়)</option>
          </select>
        </div>

        <div className="flex items-center justify-between gap-4 mt-3">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {total.toLocaleString("bn-BD")} টি দেশ পাওয়া গেছে
          </p>

          {(search || regionFilter || sortBy !== "name") && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-sm hover:underline"
            >
              ফিল্টার মুছুন
            </button>
          )}
        </div>
      </div>

      {/* Country cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {countries.length === 0 ? (
          <div className="md:col-span-2 py-12 text-center">
            <p className="text-lg">কোনো দেশের তথ্য পাওয়া যায়নি।</p>

            <button
              type="button"
              onClick={resetFilters}
              className="mt-3 text-sm underline"
            >
              সব ফিল্টার মুছুন
            </button>
          </div>
        ) : (
          countries.map((country) => (
            <article
              key={country.cca3 || country.code || country.slug}
              className="bg-zinc-400/10 border border-zinc-400/25 rounded-xl overflow-hidden hover:bg-zinc-400/25 transition-colors"
            >
              <div className="flex items-center gap-4 p-4 border-b border-zinc-400/25">
                <img
                  src={country.flag}
                  alt={`${country.name_bengali} এর পতাকা`}
                  loading="lazy"
                  decoding="async"
                  width={64}
                  height={44}
                  className="w-16 h-11 object-cover rounded border border-zinc-400/25"
                  onError={(event) => {
                    const image = event.currentTarget;

                    if (image.src.endsWith("/un.png")) {
                      return;
                    }

                    image.src = "https://flagcdn.com/w320/un.png";
                  }}
                />

                <div className="min-w-0">
                  <h2 className="text-lg font-bold truncate">
                    {country.name_bengali}{" "}
                    <span className="text-base">{country.flag_emoji}</span>
                  </h2>

                  <span className="text-xs px-2 py-0.5 bg-zinc-400/10 rounded-full">
                    {country.continent}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-4">
                <p className="text-sm leading-relaxed">
                  <strong>{country.name_bengali}</strong> ({country.name}){" "}
                  {country.continent} মহাদেশের একটি {country.independent}।
                  রাজধানী: <strong>{country.capital}</strong>। জনসংখ্যা প্রায়{" "}
                  {formatPopulation(country.population)}, আয়তন{" "}
                  {formatArea(country.area)}।
                </p>

                <div className="grid grid-cols-2 gap-y-2 pt-2 text-sm">
                  <div>
                    <span className="block text-xs text-zinc-600 dark:text-zinc-400">
                      ডায়ালিং কোড
                    </span>

                    <span className="font-mono">{country.phone_code}</span>
                  </div>

                  <div>
                    <span className="block text-xs text-zinc-600 dark:text-zinc-400">
                      ISO কোড
                    </span>

                    <span className="font-mono">{country.cca3}</span>
                  </div>
                </div>

                <div className="pt-3 flex justify-end">
                  <Link
                    href={`/international/country/${country.slug}`}
                    className="inline-flex items-center gap-1 text-sm hover:underline"
                  >
                    আরও পড়ুন →
                  </Link>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Infinite scroll trigger */}
      {hasMore && (
        <div
          ref={loadMoreRef}
          className="flex justify-center py-8 min-h-20"
          aria-live="polite"
          aria-busy={loadingMore}
        >
          {loadingMore ? (
            <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
              <span
                className="w-5 h-5 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin"
                aria-hidden="true"
              />

              <span>আরও দেশ লোড হচ্ছে...</span>
            </div>
          ) : (
            <span className="text-sm text-zinc-500">আরও তথ্য লোড হবে...</span>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center space-y-3 py-6">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{error}</p>

          <button
            type="button"
            onClick={() => void loadNextPage()}
            className="px-4 py-2 rounded-xl border border-zinc-400/25 bg-zinc-400/10 hover:bg-zinc-400/25 text-sm"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      )}

      {/* Final state */}
      {!hasMore && countries.length > 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-zinc-500">
            সব {total.toLocaleString("bn-BD")} টি দেশের তথ্য দেখানো হয়েছে।
          </p>
        </div>
      )}

      {/* 
        SEO fallback:
        JavaScript থাকলে user infinite scroll দেখবে।
        JavaScript ছাড়া পরের page-এ যাওয়া যাবে।
      */}
      {hasMore && (
        <noscript>
          <div className="text-center py-6">
            <Link
              href={{
                pathname,
                query: {
                  ...(search ? { search } : {}),
                  ...(regionFilter
                    ? {
                        regionFilter,
                      }
                    : {}),
                  ...(sortBy !== "name"
                    ? {
                        sortBy,
                      }
                    : {}),
                  page: currentPage + 1,
                },
              }}
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-zinc-400/25 bg-zinc-400/10 hover:bg-zinc-400/25 text-sm font-medium"
            >
              পরের পৃষ্ঠা দেখুন →
            </Link>
          </div>
        </noscript>
      )}

      {/* Prevent unused variable warning in strict builds */}
      {totalPages > 0 && null}
    </div>
  );
}
