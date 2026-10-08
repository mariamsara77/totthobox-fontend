export type NewsSource = {
  key: string;
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
  category?: string | null;
  language: "bn" | "en";
  published_at?: string | null;
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
};

export type NewsSourceResponse = {
  bn: NewsSource[];
  en: NewsSource[];
};

const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com").replace(/\/$/, "");

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
      next: { revalidate: 300, tags: ["news-sources"] },
    });

    if (!response.ok) return { bn: [], en: [] };

    const json = await response.json();
    return {
      bn: Array.isArray(json?.bn) ? json.bn : [],
      en: Array.isArray(json?.en) ? json.en : [],
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

  try {
    const response = await fetch(
      buildUrl("/api/news", {
        source: params.source,
        language: params.language,
        category: params.category,
        search: params.search,
        hours: params.hours,
        page: params.page || 1,
        per_page: params.per_page || 18,
      }),
      {
        next: { revalidate: 180, tags: ["news-feed"] },
      },
    );

    if (!response.ok) return empty;

    const json = await response.json();
    return {
      data: Array.isArray(json?.data) ? json.data : [],
      meta: {
        current_page: Number(json?.meta?.current_page || 1),
        last_page: Number(json?.meta?.last_page || 1),
        per_page: Number(json?.meta?.per_page || 18),
        total: Number(json?.meta?.total || 0),
        from: json?.meta?.from ?? null,
        to: json?.meta?.to ?? null,
        has_more: Boolean(json?.meta?.has_more),
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
