import { getAllCountries } from "@/lib/countries";

const siteUrl = "https://totthobox.com";

const staticPaths = [
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
  "/bangladesh/establishment",
  "/bangladesh/tourism",
  "/bangladesh/public-figure",
  "/international/all-country",
  "/islam/basic",
  "/islam/dowan",
  "/signs/all",
  "/software/all",
  "/pdf-editor",
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
  "/tools/age-calculator",
  "/tools/image-resizer",
  "/tools/percentage-calculator",
  "/tools/qrcode-generator",
  "/tools/word-and-character-counter",
  "/tools/writing-practice",
  "/tools/zodiac-calculator",
];

const dynamicSources = [
  ["/api/holidays", "/bangla/holiday"],
  ["/api/intro-bd", "/bangladesh/introduction"],
  ["/api/history-bd", "/bangladesh/history"],
  ["/api/establishment-bd", "/bangladesh/establishment"],
  ["/api/tourism-bd", "/bangladesh/tourism"],
  ["/api/people", "/bangladesh/public-figure"],
  ["/api/islam/basic", "/islam/basic"],
  ["/api/islam/dowan", "/islam/dowan"],
  ["/api/apps", "/software"],
] as const;

function extractRecords(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object") return [];
  const record = value as { data?: unknown };
  return extractRecords(record.data);
}

async function getDynamicPaths() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";
  const results = await Promise.all(
    dynamicSources.map(async ([endpoint, prefix]) => {
      try {
        const response = await fetch(`${base}${endpoint}?per_page=1000`, {
          next: { revalidate: 3600 },
        });
        if (!response.ok) return [];
        const records = extractRecords(await response.json());
        return records.flatMap((record) => {
          if (!record || typeof record !== "object") return [];
          const slug = (record as { slug?: unknown }).slug;
          return typeof slug === "string" && slug.trim()
            ? [`${prefix}/${encodeURIComponent(slug.trim())}`]
            : [];
        });
      } catch {
        return [];
      }
    }),
  );

  return results.flat();
}

function escapeXml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

export async function GET() {
  const countries = await getAllCountries();
  const countryPaths = countries.map((country) => `/international/country/${encodeURIComponent(country.slug)}`);
  const paths = [...new Set([...staticPaths, ...countryPaths, ...(await getDynamicPaths())])];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths
    .map((path) => `<url><loc>${escapeXml(`${siteUrl}${path}`)}</loc></url>`)
    .join("")}</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=59",
    },
  });
}