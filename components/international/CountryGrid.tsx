'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';

type Country = {
  slug: string;
  name: string;
  name_bengali: string;
  independent: string;
  code: string;
  cca3: string;
  region: string;
  subregion: string;
  continent: string;
  capital: string;
  area: number;
  population: number;
  phone_code: string;
  flag: string;
  flag_emoji: string;
  languages: string[];
  landlocked: boolean;
};

const PER_PAGE = 12;

function formatPopulation(pop: number) {
  if (pop >= 1_000_000_000) return `${(pop / 1_000_000_000).toFixed(2)} বিলিয়ন`;
  if (pop >= 1_000_000) return `${(pop / 1_000_000).toFixed(2)} মিলিয়ন`;
  if (pop >= 1_000) return `${(pop / 1_000).toFixed(1)} হাজার`;
  return pop > 0 ? pop.toLocaleString('bn-BD') : 'তথ্য নেই';
}

function formatArea(area: number) {
  if (area <= 0) return 'জানা নেই';
  if (area >= 1_000_000) return `${(area / 1_000_000).toFixed(2)} মি. কিমি²`;
  return `${area.toLocaleString('bn-BD')} কিমি²`;
}

async function fetchCountries(): Promise<Country[]> {
  const [mainRes, popRes, contRes] = await Promise.all([
    fetch('https://raw.githubusercontent.com/mledoze/countries/master/dist/countries.json', {
      next: { revalidate: 2592000 }, // 1 month
    }),
    fetch('https://raw.githubusercontent.com/samayo/country-json/master/src/country-by-population.json', {
      next: { revalidate: 2592000 },
    }),
    fetch('https://raw.githubusercontent.com/samayo/country-json/master/src/country-by-continent.json', {
      next: { revalidate: 2592000 },
    }),
  ]);

  if (!mainRes.ok) return [];

  const main = await mainRes.json();
  const popData = popRes.ok ? await popRes.json() : [];
  const contData = contRes.ok ? await contRes.json() : [];

  const popMap: Record<string, number> = {};
  popData.forEach((item: any) => {
    popMap[item.country] = item.population ?? 0;
  });

  const contMap: Record<string, string> = {};
  contData.forEach((item: any) => {
    contMap[item.country] = item.continent ?? null;
  });

  return main
    .map((c: any) => {
      const commonName = c.name?.common ?? 'Unknown';
      const officialName = c.name?.official ?? commonName;
      const code = c.cca2 ?? '';
      const population = popMap[commonName] ?? popMap[officialName] ?? 0;
      const continent = contMap[commonName] ?? contMap[officialName] ?? c.region ?? 'N/A';
      const nameBengali =
        c.name?.native?.ben?.common ?? c.translations?.ben?.common ?? commonName;

      let phoneCode = 'N/A';
      if (c.idd?.root) {
        phoneCode = c.idd.root + (c.idd.suffixes?.[0] ?? '');
      }

      const lowerCode = (code || 'un').toLowerCase();

      return {
        slug: commonName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
        name: commonName,
        name_bengali: nameBengali,
        independent: c.independent ? 'স্বাধীন রাষ্ট্র' : 'অধীনস্থ অঞ্চল',
        code,
        cca3: c.cca3 ?? 'N/A',
        region: c.region ?? 'Unknown',
        subregion: c.subregion ?? '',
        continent,
        capital: c.capital?.[0] ?? 'তথ্য নেই',
        area: Number(c.area ?? 0),
        population: Number(population),
        phone_code: phoneCode,
        flag: `https://flagcdn.com/w320/${lowerCode}.png`,
        flag_emoji: c.flag ?? '🌐',
        languages: c.languages ? Object.values(c.languages) : [],
        landlocked: !!c.landlocked,
      } as Country;
    })
    .sort((a: Country, b: Country) => a.name.localeCompare(b.name));
}

export function CountryGrid({
  initialSearch = '',
  initialRegion = '',
  initialSort = 'name',
}: {
  initialSearch?: string;
  initialRegion?: string;
  initialSort?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [regionFilter, setRegionFilter] = useState(initialRegion);
  const [sortBy, setSortBy] = useState(initialSort);
  const [loadedCount, setLoadedCount] = useState(PER_PAGE);

  // Fetch once
  useEffect(() => {
    fetchCountries()
      .then(setCountries)
      .finally(() => setLoading(false));
  }, []);

  // Sync URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (regionFilter) params.set('regionFilter', regionFilter);
    if (sortBy !== 'name') params.set('sortBy', sortBy);
    const q = params.toString();
    router.replace(q ? `?${q}` : '/international/all-country', { scroll: false });
  }, [search, regionFilter, sortBy, router]);

  const filtered = useMemo(() => {
    const s = search.toLowerCase().trim();
    let col = countries.filter((c) => {
      const match =
        !s ||
        c.name.toLowerCase().includes(s) ||
        (c.name_bengali || '').toLowerCase().includes(s) ||
        c.capital.toLowerCase().includes(s) ||
        c.code.toLowerCase().includes(s);
      const regionOk = !regionFilter || c.region === regionFilter;
      return match && regionOk;
    });

    switch (sortBy) {
      case 'population_desc':
        col = col.sort((a, b) => b.population - a.population);
        break;
      case 'population_asc':
        col = col.sort((a, b) => a.population - b.population);
        break;
      case 'area_desc':
        col = col.sort((a, b) => b.area - a.area);
        break;
      case 'area_asc':
        col = col.sort((a, b) => a.area - b.area);
        break;
      default:
        col = col.sort((a, b) => a.name.localeCompare(b.name));
    }
    return col;
  }, [countries, search, regionFilter, sortBy]);

  const displayed = filtered.slice(0, loadedCount);

  const stats = useMemo(() => {
    return {
      total: countries.length,
      population: countries.reduce((sum, c) => sum + c.population, 0),
      regions: new Set(countries.map((c) => c.region).filter(Boolean)).size,
      landlocked: countries.filter((c) => c.landlocked).length,
    };
  }, [countries]);

  const regions = useMemo(() => {
    return Array.from(new Set(countries.map((c) => c.region).filter(Boolean))).sort();
  }, [countries]);

  // Infinite scroll
  const { ref, inView } = useInView({ threshold: 0 });
  useEffect(() => {
    if (inView && loadedCount < filtered.length) {
      setLoadedCount((prev) => prev + PER_PAGE);
    }
  }, [inView, loadedCount, filtered.length]);

  // Reset load on filter change
  useEffect(() => {
    setLoadedCount(PER_PAGE);
  }, [search, regionFilter, sortBy]);

  const resetFilters = () => {
    setSearch('');
    setRegionFilter('');
    setSortBy('name');
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
          ))}
        </div>
        <div className="h-32 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats */}
      {countries.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-zinc-400/10 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
            <p className="text-sm text-zinc-500">মোট দেশ</p>
            <p className="text-xl font-bold">{stats.total.toLocaleString('bn-BD')} টি</p>
          </div>
          <div className="bg-zinc-400/10 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
            <p className="text-sm text-zinc-500">বিশ্ব জনসংখ্যা</p>
            <p className="text-xl font-bold">{formatPopulation(stats.population)}</p>
          </div>
          <div className="bg-zinc-400/10 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
            <p className="text-sm text-zinc-500">অঞ্চল</p>
            <p className="text-xl font-bold">{stats.regions} টি</p>
          </div>
          <div className="bg-zinc-400/10 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
            <p className="text-sm text-zinc-500">স্থলবেষ্টিত</p>
            <p className="text-xl font-bold">{stats.landlocked} টি</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-zinc-400/10 p-4 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="দেশের নাম বা রাজধানী খুঁজুন..."
              className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-400"
            />
          </div>

          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="w-full sm:w-auto min-w-[150px] px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
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
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:w-auto min-w-[160px] px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
          >
            <option value="name">নাম (A-Z)</option>
            <option value="population_desc">জনসংখ্যা (বেশি → কম)</option>
            <option value="population_asc">জনসংখ্যা (কম → বেশি)</option>
            <option value="area_desc">আয়তন (বড় → ছোট)</option>
            <option value="area_asc">আয়তন (ছোট → বড়)</option>
          </select>
        </div>

        <div className="flex items-center justify-between mt-3">
          <p className="text-sm text-zinc-500 font-medium">
            {filtered.length.toLocaleString('bn-BD')} টি দেশ পাওয়া গেছে
          </p>
          {(search || regionFilter || sortBy !== 'name') && (
            <button
              onClick={resetFilters}
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:underline"
            >
              ফিল্টার মুছুন
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {displayed.length === 0 ? (
          <div className="md:col-span-2 py-12 text-center">
            <p className="text-zinc-500 text-lg">কোনো দেশের তথ্য পাওয়া যায়নি।</p>
            <button onClick={resetFilters} className="mt-3 text-sm underline">
              সব ফিল্টার মুছুন
            </button>
          </div>
        ) : (
          displayed.map((country, idx) => (
            <div key={country.code}>
              {idx > 0 && idx % 6 === 0 && (
                <div className="md:col-span-2 hidden md:flex bg-zinc-100 dark:bg-zinc-800 rounded-xl items-center justify-center p-4 min-h-[120px] text-zinc-400 text-sm border border-dashed border-zinc-300 dark:border-zinc-700 mb-6">
                  Advertisement
                </div>
              )}
              <article className="bg-zinc-400/10 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 p-4 border-b border-zinc-400/25">
                  <img
                    src={country.flag}
                    alt={`${country.name_bengali} এর পতাকা`}
                    loading="lazy"
                    decoding="async"
                    className="w-16 h-11 object-cover rounded shadow-sm border border-zinc-400/25"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://flagcdn.com/w320/un.png';
                    }}
                  />
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 truncate">
                      {country.name_bengali} <span className="text-base">{country.flag_emoji}</span>
                    </h2>
                    <span className="text-xs font-medium px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full">
                      {country.continent}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    <strong>{country.name_bengali}</strong> ({country.name}) {country.continent}{' '}
                    মহাদেশের একটি {country.independent}। রাজধানী: <strong>{country.capital}</strong>।
                    জনসংখ্যা প্রায় {formatPopulation(country.population)}, আয়তন{' '}
                    {formatArea(country.area)}।
                  </p>

                  <div className="grid grid-cols-2 gap-y-2 pt-2 text-sm">
                    <div>
                      <span className="text-zinc-500 block text-xs">ডায়ালিং কোড</span>
                      <span className="font-medium font-mono">{country.phone_code}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-xs">ISO কোড</span>
                      <span className="font-medium font-mono">{country.cca3}</span>
                    </div>
                  </div>

                  <div className="pt-3 flex justify-end">
                    <Link
                      href={`/international/all-country/${country.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:underline"
                    >
                      আরও পড়ুন →
                    </Link>
                  </div>
                </div>
              </article>
            </div>
          ))
        )}
      </div>

      {loadedCount < filtered.length && (
        <div ref={ref} className="flex justify-center py-8">
          <div className="flex items-center gap-4 text-zinc-500">
            <div className="w-5 h-5 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">আরও দেশ লোড হচ্ছে...</span>
          </div>
        </div>
      )}
    </div>
  );
}