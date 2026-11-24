import "server-only";

export type Country = {
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

export type CountrySort =
  | "name"
  | "population_desc"
  | "population_asc"
  | "area_desc"
  | "area_asc";

export type CountryQuery = {
  search?: string;
  region?: string;
  sort?: CountrySort;
  page?: number;
  perPage?: number;
};

export type CountryPage = {
  countries: Country[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
};

export type CountryStats = {
  total: number;
  population: number;
  regions: number;
  landlocked: number;
};

const DATA_REVALIDATE = 60 * 60 * 24 * 30;

const DEFAULT_PER_PAGE = 24;
const MAX_PER_PAGE = 48;

const COUNTRIES_URL =
  "https://raw.githubusercontent.com/mledoze/countries/master/dist/countries.json";

const POPULATION_URL =
  "https://raw.githubusercontent.com/samayo/country-json/master/src/country-by-population.json";

const CONTINENT_URL =
  "https://raw.githubusercontent.com/samayo/country-json/master/src/country-by-continent.json";

type PopulationItem = {
  country?: string;
  population?: number;
};

type ContinentItem = {
  country?: string;
  continent?: string;
};

function normalize(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function createSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function fetchJson<T>(
  url: string,
): Promise<T | null> {
  try {
    const response = await fetch(url, {
      next: {
        revalidate: DATA_REVALIDATE,
      },
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.error(
        `Country data request failed: ${response.status}`,
        url,
      );

      return null;
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error(
      "Country data request error:",
      error,
    );

    return null;
  }
}

export async function getAllCountries(): Promise<Country[]> {
  const [
    main,
    populationData,
    continentData,
  ] = await Promise.all([
    fetchJson<any[]>(COUNTRIES_URL),
    fetchJson<PopulationItem[]>(POPULATION_URL),
    fetchJson<ContinentItem[]>(CONTINENT_URL),
  ]);

  if (!main || !Array.isArray(main)) {
    return [];
  }

  const populationMap = new Map<
    string,
    number
  >();

  if (Array.isArray(populationData)) {
    for (const item of populationData) {
      if (!item?.country) {
        continue;
      }

      populationMap.set(
        normalize(item.country),
        Number(item.population ?? 0),
      );
    }
  }

  const continentMap = new Map<
    string,
    string
  >();

  if (Array.isArray(continentData)) {
    for (const item of continentData) {
      if (!item?.country) {
        continue;
      }

      continentMap.set(
        normalize(item.country),
        String(item.continent ?? ""),
      );
    }
  }

  const countries: Country[] = [];

  for (const country of main) {
    const commonName = String(
      country?.name?.common ?? "Unknown",
    );

    const officialName = String(
      country?.name?.official ?? commonName,
    );

    const code = String(
      country?.cca2 ?? "",
    );

    const cca3 = String(
      country?.cca3 ?? "",
    );

    const population =
      populationMap.get(
        normalize(commonName),
      ) ??
      populationMap.get(
        normalize(officialName),
      ) ??
      Number(country?.population ?? 0);

    const continent =
      continentMap.get(
        normalize(commonName),
      ) ??
      continentMap.get(
        normalize(officialName),
      ) ??
      String(country?.region ?? "Unknown");

    const bengaliName =
      country?.name?.native?.ben?.common ??
      country?.translations?.ben?.common ??
      commonName;

    let phoneCode = "N/A";

    if (country?.idd?.root) {
      const root = String(
        country.idd.root,
      );

      const suffix = String(
        country.idd.suffixes?.[0] ?? "",
      );

      phoneCode = `${root}${suffix}`;
    }

    const lowerCode =
      (code || "un").toLowerCase();

    const languages = country?.languages
      ? Object.values(country.languages).map(
          String,
        )
      : [];

    countries.push({
      slug: createSlug(commonName),

      name: commonName,

      name_bengali: String(bengaliName),

      independent: country?.independent
        ? "স্বাধীন রাষ্ট্র"
        : "অধীনস্থ অঞ্চল",

      code,

      cca3,

      region: String(
        country?.region ?? "Unknown",
      ),

      subregion: String(
        country?.subregion ?? "",
      ),

      continent,

      capital: String(
        country?.capital?.[0] ??
          "তথ্য নেই",
      ),

      area: Number(
        country?.area ?? 0,
      ),

      population: Number(population),

      phone_code: phoneCode,

      flag: `https://flagcdn.com/w320/${lowerCode}.png`,

      flag_emoji: String(
        country?.flag ?? "🌐",
      ),

      languages,

      landlocked: Boolean(
        country?.landlocked,
      ),
    });
  }

  return countries.sort((a, b) =>
    a.name.localeCompare(
      b.name,
      undefined,
      {
        sensitivity: "base",
      },
    ),
  );
}

function sortCountries(
  countries: Country[],
  sort: CountrySort,
): Country[] {
  const result = [...countries];

  switch (sort) {
    case "population_desc":
      return result.sort(
        (a, b) =>
          b.population - a.population,
      );

    case "population_asc":
      return result.sort(
        (a, b) =>
          a.population - b.population,
      );

    case "area_desc":
      return result.sort(
        (a, b) =>
          b.area - a.area,
      );

    case "area_asc":
      return result.sort(
        (a, b) =>
          a.area - b.area,
      );

    case "name":
    default:
      return result.sort((a, b) =>
        a.name.localeCompare(
          b.name,
          undefined,
          {
            sensitivity: "base",
          },
        ),
      );
  }
}

function filterCountries(
  countries: Country[],
  search: string,
  region: string,
): Country[] {
  const normalizedSearch =
    normalize(search);

  const normalizedRegion =
    normalize(region);

  return countries.filter(
    (country) => {
      const matchesSearch =
        !normalizedSearch ||
        normalize(
          country.name,
        ).includes(normalizedSearch) ||
        normalize(
          country.name_bengali,
        ).includes(normalizedSearch) ||
        normalize(
          country.capital,
        ).includes(normalizedSearch) ||
        normalize(
          country.code,
        ).includes(normalizedSearch) ||
        normalize(
          country.cca3,
        ).includes(normalizedSearch);

      const matchesRegion =
        !normalizedRegion ||
        normalize(
          country.region,
        ) === normalizedRegion;

      return (
        matchesSearch &&
        matchesRegion
      );
    },
  );
}

export async function getCountryPage({
  search = "",
  region = "",
  sort = "name",
  page = 1,
  perPage = DEFAULT_PER_PAGE,
}: CountryQuery): Promise<CountryPage> {
  const countries =
    await getAllCountries();

  const filtered =
    filterCountries(
      countries,
      search,
      region,
    );

  const sorted =
    sortCountries(
      filtered,
      sort,
    );

  const safePage = Math.max(
    1,
    Math.floor(
      Number(page) || 1,
    ),
  );

  const safePerPage = Math.min(
    MAX_PER_PAGE,
    Math.max(
      1,
      Math.floor(
        Number(perPage) ||
          DEFAULT_PER_PAGE,
      ),
    ),
  );

  const total = sorted.length;

  const totalPages =
    total === 0
      ? 1
      : Math.ceil(
          total / safePerPage,
        );

  const start =
    (safePage - 1) *
    safePerPage;

  const pageCountries =
    sorted.slice(
      start,
      start + safePerPage,
    );

  return {
    countries: pageCountries,

    page: safePage,

    perPage: safePerPage,

    total,

    totalPages,

    hasMore:
      safePage < totalPages,
  };
}

export function getCountryStats(
  countries: Country[],
): CountryStats {
  return {
    total: countries.length,

    population:
      countries.reduce(
        (sum, country) =>
          sum + country.population,
        0,
      ),

    regions:
      new Set(
        countries
          .map(
            (country) =>
              country.region,
          )
          .filter(Boolean),
      ).size,

    landlocked:
      countries.filter(
        (country) =>
          country.landlocked,
      ).length,
  };
}

export function getCountryRegions(
  countries: Country[],
): string[] {
  return Array.from(
    new Set(
      countries
        .map(
          (country) =>
            country.region,
        )
        .filter(Boolean),
    ),
  ).sort((a, b) =>
    a.localeCompare(
      b,
      undefined,
      {
        sensitivity: "base",
      },
    ),
  );
}