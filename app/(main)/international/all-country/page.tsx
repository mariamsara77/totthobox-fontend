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

const DEFAULT_SORT: CountrySort = "name";

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
    : DEFAULT_SORT;
}

function getSafePage(value?: string) {
  const page = Number(value ?? "1");

  if (!Number.isFinite(page)) {
    return 1;
  }

  return Math.max(1, Math.floor(page));
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const params = await searchParams;

  const search = (params.search ?? "").trim();

  const region = (params.regionFilter ?? "").trim();

  const page = getSafePage(params.page);

  if (search) {
    return {
      title: `"${search.slice(0, 40)}" — দেশের তথ্য | ${SITE_NAME}`,

      description: `"${search}" সম্পর্কিত দেশের রাজধানী, জনসংখ্যা, আয়তন ও আন্তর্জাতিক তথ্য — ${SITE_NAME}।`,

      keywords: [search, "দেশের তালিকা", "রাজধানী", "জনসংখ্যা", SITE_NAME],

      robots: {
        index: false,
        follow: true,
      },

      alternates: {
        canonical: "/international/all-country",
      },

      openGraph: {
        title: `"${search.slice(0, 40)}" — দেশের তথ্য | ${SITE_NAME}`,

        description: `"${search}" সম্পর্কিত দেশের রাজধানী, জনসংখ্যা, আয়তন ও আন্তর্জাতিক তথ্য — ${SITE_NAME}।`,

        images: ["/og-image.png"],
      },
    };
  }

  if (region) {
    return {
      title: `${region} অঞ্চলের দেশসমূহ — রাজধানী ও তথ্য | ${SITE_NAME}`,

      description: `${region} অঞ্চলের দেশের রাজধানী, জনসংখ্যা, আয়তন ও আন্তর্জাতিক তথ্য — ${SITE_NAME}।`,

      keywords: [region, "দেশের তালিকা", `${region} দেশ`, SITE_NAME],

      robots: {
        index: false,
        follow: true,
      },

      alternates: {
        canonical: "/international/all-country",
      },

      openGraph: {
        title: `${region} অঞ্চলের দেশসমূহ — রাজধানী ও তথ্য | ${SITE_NAME}`,

        description: `${region} অঞ্চলের দেশের রাজধানী, জনসংখ্যা, আয়তন ও আন্তর্জাতিক তথ্য — ${SITE_NAME}।`,

        images: ["/og-image.png"],
      },
    };
  }

  const baseTitle = "বিশ্বকোষ: পৃথিবীর সব দেশের তালিকা, রাজধানী ও সাধারণ জ্ঞান";

  const baseDescription =
    "পৃথিবীর ২৫০+ দেশের রাজধানী, জনসংখ্যা, আয়তন, ভাষা ও আন্তর্জাতিক কোডসহ বিস্তারিত তথ্যভাণ্ডার — Totthobox।";

  return {
    title:
      page > 1
        ? `${baseTitle} — পৃষ্ঠা ${page} | ${SITE_NAME}`
        : `${baseTitle} | ${SITE_NAME}`,

    description: baseDescription,

    keywords: [
      "দেশের তালিকা",
      "সব দেশের রাজধানী",
      "পৃথিবীর দেশসমূহ",
      "দেশের জনসংখ্যা",
      "সাধারণ জ্ঞান",
      "বিশ্বকোষ",
      SITE_NAME,
    ],

    openGraph: {
      title:
        page > 1
          ? `${baseTitle} — পৃষ্ঠা ${page} | ${SITE_NAME}`
          : `${baseTitle} | ${SITE_NAME}`,

      description: baseDescription,

      images: ["/og-image.png"],
    },

    alternates: {
      canonical:
        page > 1
          ? `/international/all-country?page=${page}`
          : "/international/all-country",
    },
  };
}

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

  /*
   * একই cached source থেকে:
   *
   * 1. current page data
   * 2. overall statistics
   * 3. regions
   *
   * নেওয়া হচ্ছে।
   */
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

  let h1 = "বিশ্বকোষ: পৃথিবীর সকল দেশের বিস্তারিত তথ্য";

  let sub =
    "পৃথিবীর বিভিন্ন দেশের রাজধানী, জনসংখ্যা, আয়তন, আন্তর্জাতিক কোড ও অন্যান্য গুরুত্বপূর্ণ তথ্য এক জায়গায়।";

  if (search) {
    h1 = `"${search}" খোঁজার ফলাফল`;

    sub = "আপনার অনুসন্ধানের সঙ্গে মিল থাকা দেশগুলোর তথ্য নিচে দেখানো হয়েছে।";
  } else if (region) {
    h1 = `${region} অঞ্চলের দেশসমূহ`;

    sub =
      "এই অঞ্চলের দেশগুলোর রাজধানী, জনসংখ্যা, আয়তন ও আন্তর্জাতিক তথ্য দেখুন।";
  } else if (page > 1) {
    h1 = "পৃথিবীর দেশসমূহ — আরও বিস্তারিত তথ্য";

    sub =
      "দেশের তালিকার পরবর্তী অংশ থেকে রাজধানী, জনসংখ্যা, আয়তন ও আন্তর্জাতিক তথ্য দেখুন।";
  }

  return (
    <section className="max-w-2xl mx-auto space-y-4 p-4">
      <article className="max-w-none text-center pb-6 border-b border-zinc-400/25">
        <h1 className="text-3xl font-bold mb-4">{h1}</h1>

        <p className="text-lg leading-relaxed max-w-2xl mx-auto text-zinc-600 dark:text-zinc-400">
          {sub}
        </p>
      </article>

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
    </section>
  );
}
