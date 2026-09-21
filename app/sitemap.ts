import type { MetadataRoute } from "next";
import { getAllCountries } from "@/lib/countries";

const SITE_URL = "https://totthobox.com";
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

const publicRoutes = [
  "/",
  "/about-us",
  "/contact-us",
  "/services",
  "/privacy-policy",
  "/terms-of-service",
  "/bangla/calendar",
  "/bangla/holiday",
  "/bangladesh/introduction",
  "/bangladesh/history",
  "/bangladesh/tourism",
  "/bangladesh/establishment",
  "/bangladesh/public-figure",
  "/international/all-country",
  "/islam/basic",
  "/islam/dowan",
  "/converter/adarshalipi",
  "/converter/area",
  "/converter/currency",
  "/converter/data",
  "/converter/document",
  "/converter/energy",
  "/converter/file-data",
  "/converter/image",
  "/converter/land",
  "/converter/length",
  "/converter/media",
  "/converter/number-to-word",
  "/converter/speed",
  "/converter/temperature",
  "/converter/time",
  "/converter/volume",
  "/converter/weight",
  "/pdf-editor",
  "/tools/age-calculator",
  "/tools/image-resizer",
  "/tools/percentage-calculator",
  "/tools/qrcode-generator",
  "/tools/word-and-character-counter",
  "/tools/writing-practice",
  "/tools/zodiac-calculator",
  "/software/all",
  "/software/all/Windows",
  "/software/all/Android",
  "/software/all/Mac",
  "/software/all/Fonts",
  "/signs/all",
  "/contact/police",
];

function hasSoftwareContent(item: unknown): boolean {
  if (!item || typeof item !== "object") return false;

  const description =
    "description" in item && typeof item.description === "string"
      ? item.description
      : "";

  return description
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, "")
    .trim().length > 0;
}

async function fetchSlugs(
  endpoint: string,
  includeItem?: (item: unknown) => boolean,
): Promise<string[]> {
  const slugs: string[] = [];
  const seen = new Set<string>();
  const perPage = 50;

  for (let page = 1; page <= 100; page += 1) {
    try {
      const separator = endpoint.includes("?") ? "&" : "?";
      const response = await fetch(
        `${API_BASE}${endpoint}${separator}per_page=${perPage}&page=${page}`,
        { next: { revalidate: 3600 } },
      );

      if (!response.ok) break;

      const json = await response.json();
      const source = Array.isArray(json)
        ? json
        : Array.isArray(json?.data)
          ? json.data
          : Array.isArray(json?.items)
            ? json.items
            : Array.isArray(json?.data?.data)
              ? json.data.data
              : [];

      for (const item of source) {
        if (
          item &&
          typeof item.slug === "string" &&
          item.slug &&
          (!includeItem || includeItem(item))
        ) {
          if (!seen.has(item.slug)) {
            seen.add(item.slug);
            slugs.push(item.slug);
          }
        }
      }

      if (!json?.meta?.has_more || source.length === 0) break;
    } catch {
      break;
    }
  }

  return slugs;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = publicRoutes.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === "/" ? "daily" as const : "weekly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));

  const [
    countries,
    holidays,
    introductions,
    histories,
    tourism,
    establishments,
    islamBasic,
    islamDowa,
    people,
    apps,
  ] = await Promise.all([
    getAllCountries(),
    fetchSlugs("/api/holidays"),
    fetchSlugs("/api/intro-bd"),
    fetchSlugs("/api/history-bd"),
    fetchSlugs("/api/tourism-bd"),
    fetchSlugs("/api/establishment-bd"),
    fetchSlugs("/api/islam/basic"),
    fetchSlugs("/api/islam/dowa"),
    fetchSlugs("/api/people"),
    fetchSlugs("/api/apps", hasSoftwareContent),
  ]);

  const dynamicEntries: MetadataRoute.Sitemap = [
    ...countries.map((country) => ({
      url: `${SITE_URL}/international/country/${encodeURIComponent(country.slug)}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...holidays.map((slug) => ({
      url: `${SITE_URL}/bangla/holiday/${encodeURIComponent(slug)}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...introductions.map((slug) => ({
      url: `${SITE_URL}/bangladesh/introduction/${encodeURIComponent(slug)}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...histories.map((slug) => ({
      url: `${SITE_URL}/bangladesh/history/${encodeURIComponent(slug)}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...tourism.map((slug) => ({
      url: `${SITE_URL}/bangladesh/tourism/${encodeURIComponent(slug)}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...establishments.map((slug) => ({
      url: `${SITE_URL}/bangladesh/establishment/${encodeURIComponent(slug)}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...islamBasic.map((slug) => ({
      url: `${SITE_URL}/islam/basic/${encodeURIComponent(slug)}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...islamDowa.map((slug) => ({
      url: `${SITE_URL}/islam/dowan/${encodeURIComponent(slug)}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...people.map((slug) => ({
      url: `${SITE_URL}/bangladesh/public-figure/${encodeURIComponent(slug)}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...apps.map((slug) => ({
      url: `${SITE_URL}/software/${encodeURIComponent(slug)}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];

  const unique = new Map(
    [...staticEntries, ...dynamicEntries].map((entry) => [entry.url, entry]),
  );

  return [...unique.values()];
}
