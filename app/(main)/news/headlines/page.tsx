import type { Metadata } from "next";
import { Suspense } from "react";
import NewsHeadlines, {
  type NewsPayload,
  type NewsSource,
} from "@/components/news/NewsHeadlines";

export const revalidate = 3600;

const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com"
).replace(/\/$/, "");

export const metadata: Metadata = {
  title: "সংবাদ শিরোনাম | Totthobox",
  description: "বাংলা ও ইংরেজি সংবাদমাধ্যমের সর্বশেষ শিরোনাম এক জায়গায় দেখুন।",
  alternates: { canonical: "https://totthobox.com/news/headlines" },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "সংবাদ শিরোনাম | Totthobox",
    description: "বিভিন্ন সংবাদমাধ্যমের সর্বশেষ শিরোনাম এক জায়গায়।",
    url: "https://totthobox.com/news/headlines",
    siteName: "Totthobox",
    type: "website",
    locale: "bn_BD",
    images: [
      {
        url: "https://totthobox.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Totthobox",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "সংবাদ শিরোনাম | Totthobox",
    description: "বিভিন্ন সংবাদমাধ্যমের সর্বশেষ শিরোনাম এক জায়গায়।",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }],
  },
};

function firstParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

function normalizeSources(result: unknown): NewsSource[] {
  const data = (result as { data?: unknown })?.data ?? result;
  const list = Array.isArray(data)
    ? data
    : [
        ...(Array.isArray((data as { bn?: unknown[] })?.bn)
          ? (data as { bn: unknown[] }).bn
          : []),
        ...(Array.isArray((data as { en?: unknown[] })?.en)
          ? (data as { en: unknown[] }).en
          : []),
      ];

  return list
    .map((item) => {
      const rec = item as Record<string, unknown>;
      return {
        key: String(rec?.key ?? rec?.source_key ?? ""),
        name: String(rec?.name ?? rec?.source_name ?? "").trim(),
        language: String(rec?.language ?? "").toLowerCase(),
        total: Number(rec?.total ?? rec?.count ?? 0),
      };
    })
    .filter((item) => item.key && item.name);
}

async function fetchInitialHeadlines(
  params: URLSearchParams,
): Promise<{ payload: NewsPayload; sources: NewsSource[] }> {
  try {
    const [newsRes, sourcesRes] = await Promise.all([
      fetch(`${API_BASE}/api/news?${params.toString()}`, {
        next: { revalidate: 300 },
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(5000),
      }),
      fetch(`${API_BASE}/api/news/sources`, {
        next: { revalidate: 1800 },
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(5000),
      }),
    ]);

    const newsJson = newsRes.ok ? ((await newsRes.json()) as NewsPayload) : {};
    const sourcesJson = sourcesRes.ok ? await sourcesRes.json() : [];

    return {
      payload: {
        data: Array.isArray(newsJson?.data) ? newsJson.data : [],
        meta: newsJson?.meta,
      },
      sources: normalizeSources(sourcesJson),
    };
  } catch {
    return { payload: { data: [] }, sources: [] };
  }
}

export default async function NewsHeadlinesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolved = await searchParams;
  const source = firstParam(resolved.source);
  const language = firstParam(resolved.language);
  const category = firstParam(resolved.category);
  const date = firstParam(resolved.date);
  const search = firstParam(resolved.search);
  const page = Math.max(1, Number(firstParam(resolved.page) || 1) || 1);

  const apiParams = new URLSearchParams();
  if (source) apiParams.set("source", source);
  if (language) apiParams.set("language", language);
  if (category) apiParams.set("category", category);
  if (date) apiParams.set("date", date);
  if (search) apiParams.set("search", search);
  apiParams.set("page", String(page));
  apiParams.set("per_page", "18");

  const { payload, sources } = await fetchInitialHeadlines(apiParams);

  const initialQueryKey = [
    source,
    language,
    category,
    date,
    search,
    String(page),
  ].join("|");

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl animate-pulse px-4 py-6 sm:px-6">
          <div className="mb-6 h-32 rounded-2xl bg-zinc-400/10" />
          <div className="h-10 rounded-xl bg-zinc-400/10" />
        </div>
      }
    >
      <NewsHeadlines
        initialPayload={payload}
        initialSources={sources}
        initialQueryKey={initialQueryKey}
      />
    </Suspense>
  );
}
