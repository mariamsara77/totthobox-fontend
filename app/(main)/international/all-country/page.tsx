import type { Metadata } from "next";

import { CountryGrid } from "@/components/international/CountryGrid";

import {
  getAllCountries,
  getCountryPage,
  getCountryRegions,
  getCountryStats,
  type CountrySort,
} from "@/lib/international/countries";

type SearchParams = {
  search?: string;
  regionFilter?: string;
  sortBy?: string;
  page?: string;
};

const SITE_NAME = "Totthobox";

const PER_PAGE = 24;

const SORT_VALUES: CountrySort[] = [
  "name",
  "population_desc",
  "population_asc",
  "area_desc",
  "area_asc",
];

function getSafeSort(value?: string): CountrySort {
  return SORT_VALUES.includes(value as CountrySort)
    ? (value as CountrySort)
    : "name";
}

function getSafePage(value?: string): number {
  const page = Number(value ?? "1");

  if (!Number.isFinite(page) || page < 1) {
    return 1;
  }

  return Math.floor(page);
}

function buildCanonical(
  search: string,
  region: string,
  sort: CountrySort,
  page: number,
) {
  const params = new URLSearchParams();

  if (search) {
    params.set("search", search);
  }

  if (region) {
    params.set("regionFilter", region);
  }

  if (sort !== "name") {
    params.set("sortBy", sort);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();

  return query
    ? `/international/all-country?${query}`
    : "/international/all-country";
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const params = await searchParams;

  const search = (params.search ?? "").trim();

  const region = (params.regionFilter ?? "").trim();

  const sort = getSafeSort(params.sortBy);

  const page = getSafePage(params.page);

  const canonical = buildCanonical(search, region, sort, page);

  if (search) {
    return {
      title: `"${search.slice(0, 40)}" — দেশের তথ্য | ${SITE_NAME}`,

      description: `"${search}" সম্পর্কিত দেশের রাজধানী, জনসংখ্যা, আয়তন ও আন্তর্জাতিক তথ্য — ${SITE_NAME}।`,

      robots: {
        index: false,
        follow: true,
      },

      alternates: {
        canonical,
      },
    };
  }

  if (region) {
    return {
      title: `${region} অঞ্চলের দেশসমূহ — রাজধানী ও তথ্য | ${SITE_NAME}`,

      description: `${region} অঞ্চলের দেশের রাজধানী, জনসংখ্যা, আয়তন ও আন্তর্জাতিক তথ্য — ${SITE_NAME}।`,

      robots: {
        index: false,
        follow: true,
      },

      alternates: {
        canonical,
      },
    };
  }

  const title =
    page > 1
      ? `বিশ্বের সব দেশের তালিকা — পৃষ্ঠা ${page} | ${SITE_NAME}`
      : `বিশ্বের সব দেশের তালিকা, রাজধানী ও সাধারণ জ্ঞান | ${SITE_NAME}`;

  return {
    title,

    description:
      "পৃথিবীর বিভিন্ন দেশের রাজধানী, জনসংখ্যা, আয়তন, ভাষা ও আন্তর্জাতিক কোডসহ গুরুত্বপূর্ণ তথ্য — Totthobox।",

    robots: {
      index: true,
      follow: true,
    },

    alternates: {
      canonical,
    },

    openGraph: {
      title,

      description:
        "বিশ্বের বিভিন্ন দেশের রাজধানী, জনসংখ্যা, আয়তন ও আন্তর্জাতিক তথ্য।",

      url: canonical,

      type: "website",
    },
  };
}

// ... keep your generateMetadata exactly as is (it is already good)

export default async function InternationalAllCountryPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const search = (params.search ?? "").trim();
  const region = (params.regionFilter ?? "").trim();
  const sort = getSafeSort(params.sortBy);
  const page = getSafePage(params.page);

  const [pageResult, allCountries] = await Promise.all([
    getCountryPage({
      search,
      region,
      sort,
      page,
      perPage: PER_PAGE,
    }),
    getAllCountries(),
  ]);

  const stats = getCountryStats(allCountries);
  const regions = getCountryRegions(allCountries);

  let title = "বিশ্বকোষ: পৃথিবীর সকল দেশের বিস্তারিত তথ্য";
  let description =
    "পৃথিবীর বিভিন্ন দেশের রাজধানী, জনসংখ্যা, আয়তন, আন্তর্জাতিক কোড ও অন্যান্য গুরুত্বপূর্ণ তথ্য এক জায়গায়।";

  if (search) {
    title = `"${search}" খোঁজার ফলাফল`;
    description =
      "আপনার অনুসন্ধানের সঙ্গে মিল থাকা দেশগুলোর তথ্য নিচে দেখানো হয়েছে।";
  } else if (region) {
    title = `${region} অঞ্চলের দেশসমূহ`;
    description =
      "এই অঞ্চলের দেশগুলোর রাজধানী, জনসংখ্যা, আয়তন ও আন্তর্জাতিক তথ্য দেখুন।";
  } else if (page > 1) {
    title = `পৃথিবীর দেশসমূহ — পৃষ্ঠা ${page}`;
    description =
      "দেশের তালিকার পরবর্তী অংশ থেকে রাজধানী, জনসংখ্যা, আয়তন ও আন্তর্জাতিক তথ্য দেখুন।";
  }

  return (
    <section className="mx-auto max-w-2xl space-y-8 px-4 py-8 sm:px-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
      </header>

      {/* Only show on clean first page — gives AdSense real content */}
      {!search && !region && page === 1 && (
        <div className="rounded-2xl border border-zinc-200/60 bg-zinc-50/80 p-6 dark:border-zinc-700/50 dark:bg-zinc-900/40">
          <h2 className="text-xl font-semibold">বিশ্বের দেশগুলোর তথ্য</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
            এই তালিকায় বিশ্বের বিভিন্ন দেশের নাম, রাজধানী, জনসংখ্যা, আয়তন,
            অঞ্চল, আন্তর্জাতিক কোড এবং অন্যান্য সাধারণ তথ্য দ্রুত খুঁজে দেখা
            যায়। দেশ অনুসন্ধান, অঞ্চল নির্বাচন এবং বিভিন্ন তথ্য অনুযায়ী তালিকা
            সাজানোর সুবিধাও রয়েছে। Totthobox-এ সব তথ্য এক জায়গায় সাজানো হয়েছে
            যাতে শিক্ষার্থী, গবেষক ও ভ্রমণ পরিকল্পনাকারীরা সহজেই ব্যবহার করতে
            পারেন।
          </p>
        </div>
      )}

      <CountryGrid
        initialCountries={pageResult.countries}
        initialPage={pageResult.page}
        initialTotal={pageResult.total}
        initialTotalPages={pageResult.totalPages}
        initialHasMore={pageResult.hasMore}
        stats={stats}
        regions={regions}
        initialSearch={search}
        initialRegion={region}
        initialSort={sort}
      />

      {!search && !region && page === 1 && (
        <div className="rounded-2xl border border-zinc-200/60 bg-zinc-50/80 p-6 dark:border-zinc-700/50 dark:bg-zinc-900/40">
          <h2 className="text-xl font-semibold">
            দেশভিত্তিক তথ্য কেন কাজে লাগে?
          </h2>
          <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
            দেশগুলোর রাজধানী, জনসংখ্যা, আয়তন, অঞ্চল এবং আন্তর্জাতিক কোড সাধারণ
            জ্ঞান, শিক্ষামূলক গবেষণা এবং ভ্রমণ পরিকল্পনায় কাজে লাগতে পারে।
            Totthobox-এ এসব তথ্য সহজে খুঁজে দেখার জন্য দেশভিত্তিক তালিকাটি
            সাজানো হয়েছে। প্রতিটি দেশের বিস্তারিত পাতায় আরও তথ্য পাওয়া যায়।
          </p>
        </div>
      )}
    </section>
  );
}
