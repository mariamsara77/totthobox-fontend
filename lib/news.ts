export type NewsSource = {
  key: string;
  slug: string;
  name: string;
  language: "bn" | "en";
  home_url: string;
  total: number;
};

export type NewsItem = {
  id: number;
  title: string;
  slug: string;
  source_url: string;
  source_name: string;
  source_key: string;
  source_slug?: string | null;
  category?: string | null;
  language: "bn" | "en";
  published_at?: string | null;
  image_url?: string | null;
  story_group?: string | null;
  coverage_count: number;
};

export type NewsMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
  has_more: boolean;
};

export type NewsResponse = {
  data: NewsItem[];
  meta: NewsMeta;
  error?: boolean;
};

export type NewsSourceResponse = {
  bn: NewsSource[];
  en: NewsSource[];
};

const configuredApiBase =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://admin.totthobox.com";
const API_BASE = (
  /^https?:\/\//i.test(configuredApiBase)
    ? configuredApiBase
    : "https://admin.totthobox.com"
)
  .replace(/\/+$/, "")
  .replace(/\/api$/i, "");

// Source URL slugs are maintained in config/news_sources.php.
// This helper is only for unknown source keys with no configured slug.
export function sourceSlug(sourceKey: string): string {
  return sourceKey.replace(/_/g, "-");
}

function buildUrl(path: string, params: Record<string, string | number | undefined>) {
  const url = new URL(API_BASE + path);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

export async function getNewsSources(): Promise<NewsSourceResponse> {
  try {
    const response = await fetch(API_BASE + "/api/news/sources", {
      cache: "force-cache",
      next: { revalidate: 60, tags: ["news-sources"] },
    });
    if (!response.ok) return { bn: [], en: [] };
    const json: unknown = await response.json();
    if (!json || typeof json !== "object") return { bn: [], en: [] };
    const payload = json as Partial<NewsSourceResponse>;
    return {
      bn: Array.isArray(payload.bn) ? payload.bn : [],
      en: Array.isArray(payload.en) ? payload.en : [],
    };
  } catch {
    return { bn: [], en: [] };
  }
}

export async function getNews(params: {
  source?: string;
  language?: string;
  category?: string;
  search?: string;
  hours?: string;
  page?: string | number;
  per_page?: string | number;
}): Promise<NewsResponse> {
  const empty: NewsResponse = {
    data: [],
    error: true,
    meta: {
      current_page: 1,
      last_page: 1,
      per_page: 18,
      total: 0,
      from: null,
      to: null,
      has_more: false,
    },
  };

  const url = buildUrl("/api/news", {
    source: params.source,
    language: params.language,
    category: params.category,
    search: params.search,
    hours: params.hours,
    page: params.page || 1,
    per_page: params.per_page || 18,
  });

  try {
    const response = await fetch(url, {
      cache: "force-cache",
      next: { revalidate: 180, tags: ["news-feed"] },
    });
    if (!response.ok) return empty;
    const json: unknown = await response.json();
    if (!json || typeof json !== "object") return empty;
    const payload = json as { data?: unknown; meta?: unknown };
    if (!Array.isArray(payload.data) || !payload.meta || typeof payload.meta !== "object") return empty;
    const meta = payload.meta as Record<string, unknown>;
    return {
      data: payload.data as NewsItem[],
      error: false,
      meta: {
        current_page: Number(meta.current_page ?? 1),
        last_page: Number(meta.last_page ?? 1),
        per_page: Number(meta.per_page ?? 18),
        total: Number(meta.total ?? 0),
        from: typeof meta.from === "number" ? meta.from : null,
        to: typeof meta.to === "number" ? meta.to : null,
        has_more: Boolean(meta.has_more),
      },
    };
  } catch {
    return empty;
  }
}

export const NEWS_CATEGORIES = [
  { value: "", label: "সব বিভাগ" },
  { value: "National", label: "জাতীয়" },
  { value: "Politics", label: "রাজনীতি" },
  { value: "International", label: "আন্তর্জাতিক" },
  { value: "Economy", label: "অর্থনীতি" },
  { value: "Business", label: "ব্যবসা" },
  { value: "Sports", label: "খেলাধুলা" },
  { value: "Entertainment", label: "বিনোদন" },
  { value: "Latest", label: "সর্বশেষ" },
];
