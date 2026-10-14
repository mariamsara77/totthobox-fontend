import type { Metadata } from "next";
import Link from "next/link";
import NewsHeadlines from "@/components/news/NewsHeadlines";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock3, ExternalLink, Newspaper } from "lucide-react";

type NewsRecord = {
  id: number | string;
  title: string;
  slug: string;
  source_url?: string | null;
  source_name?: string | null;
  source_key?: string | null;
  category?: string | null;
  language?: string | null;
  published_at?: string | null;
  image_url?: string | null;
  story_group?: string | null;
  coverage?: Array<{
    id: number | string;
    title: string;
    slug: string;
    source_url?: string | null;
    source_name?: string | null;
    source_key?: string | null;
    published_at?: string | null;
    image_url?: string | null;
  }>;
};

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com").replace(/\/$/, "");

async function getNews(slug: string): Promise<NewsRecord | null> {
  try {
    const response = await fetch(`${API_BASE}/api/news/${encodeURIComponent(slug)}`, {
      next: { revalidate: 300 },
      headers: { Accept: "application/json" },
    });
    if (response.status === 404) return null;
    if (!response.ok) return null;
    const result = await response.json();
    return result?.data ?? null;
  } catch {
    return null;
  }
}


type NewsSource = { key: string; name: string; count?: number; total?: number };

async function getNewsSource(sourceKey: string): Promise<NewsSource | null> {
  const endpoints = [`${API_BASE}/api/news/sources`, `${API_BASE}/api/sidebar/news-sources`];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, { next: { revalidate: 300 }, headers: { Accept: "application/json" } });
      if (!response.ok) continue;
      const result = await response.json();
      const data = result?.data ?? result;
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.sources)
          ? data.sources
          : [...(Array.isArray(data?.bn) ? data.bn : []), ...(Array.isArray(data?.en) ? data.en : []), ...(Array.isArray(data?.other) ? data.other : [])];
      const source = list.find((item: any) => String(item?.key ?? item?.source_key ?? "") === sourceKey);
      if (source) {
        const name = String(source.name ?? source.source_name ?? source.title ?? "").trim();
        if (name) return { key: sourceKey, name, count: Number(source.count ?? source.total ?? 0) };
      }
    } catch {
      // Try the fallback endpoint if the primary source list is unavailable.
    }
  }

  return null;
}

function formatDate(value?: string | null) {
  if (!value) return "সময় অনুপলব্ধ";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "সময় অনুপলব্ধ"
    : new Intl.DateTimeFormat("bn-BD", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const source = await getNewsSource(slug);
  if (source) {
    const title = `${source.name} — সংবাদ শিরোনাম | Totthobox`;
    const description = `${source.name} সংবাদমাধ্যমের সর্বশেষ শিরোনাম ও প্রকাশিত খবর এক জায়গায় দেখুন।`;
    return {
      title,
      description,
      alternates: { canonical: `/news/headlines/${encodeURIComponent(source.key)}` },
      openGraph: {
        title,
        description,
        url: `https://totthobox.com/news/headlines/${encodeURIComponent(source.key)}`,
        type: "website",
      },
      twitter: { card: "summary", title, description },
    };
  }
  const item = await getNews(slug);
  if (!item) return { title: "সংবাদ পাওয়া যায়নি", robots: { index: false, follow: true } };
  const description = `${item.title} — ${item.source_name || "Totthobox সংবাদ শিরোনাম"}`;
  return {
    title: item.title,
    description,
    alternates: { canonical: `/news/headlines/story/${encodeURIComponent(item.slug)}` },
    openGraph: {
      title: item.title,
      description,
      url: `https://totthobox.com/news/headlines/story/${encodeURIComponent(item.slug)}`,
      type: "article",
      ...(item.image_url ? { images: [item.image_url] } : {}),
    },
    twitter: {
      card: item.image_url ? "summary_large_image" : "summary",
      title: item.title,
      description,
      ...(item.image_url ? { images: [item.image_url] } : {}),
    },
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const source = await getNewsSource(slug);
  if (source) return <NewsHeadlines initialSourceKey={source.key} />;

  const item = await getNews(slug);
  if (!item) notFound();

  return (
    <article className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6 lg:py-10">
      <Link href="/news/headlines" className="mb-6 inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-400/10 dark:text-zinc-200">
        <ArrowLeft className="h-4 w-4" /> সব সংবাদ শিরোনাম
      </Link>
      <div className="overflow-hidden rounded-2xl border border-zinc-400/25 bg-white dark:bg-zinc-900">
        {item.image_url && <img src={item.image_url} alt="" className="max-h-[460px] w-full bg-zinc-100 object-cover dark:bg-zinc-800" />}
        <div className="p-5 sm:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            <span className="rounded-full bg-zinc-400/10 px-3 py-1 font-semibold text-zinc-700 dark:text-zinc-200">{item.source_name || "সংবাদমাধ্যম"}</span>
            {item.category && <span>{item.category}</span>}
            <span className="inline-flex items-center gap-1"><Clock3 className="h-4 w-4" />{formatDate(item.published_at)}</span>
          </div>
          <h1 className="text-2xl font-bold leading-relaxed tracking-tight text-zinc-900 dark:text-white sm:text-3xl">{item.title}</h1>
          <p className="mt-4 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
            এই শিরোনামের সম্পূর্ণ প্রতিবেদন মূল সংবাদমাধ্যমে পড়ুন। Totthobox শিরোনাম ও উৎসের তথ্য এক জায়গায় দেখায়; মূল প্রতিবেদন প্রকাশকের ওয়েবসাইটে থাকে।
          </p>
          {item.source_url && <a href={item.source_url} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-zinc-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200">মূল প্রতিবেদন পড়ুন <ExternalLink className="h-4 w-4" /></a>}
        </div>
      </div>

      {(item.coverage ?? []).length > 0 && (
        <section className="mt-8">
          <div className="mb-4 flex items-center gap-2"><Newspaper className="h-5 w-5 text-zinc-600 dark:text-zinc-300" /><h2 className="text-xl font-bold text-zinc-900 dark:text-white">একই খবরের অন্যান্য সংবাদমাধ্যম</h2></div>
          <div className="space-y-3">
            {(item.coverage ?? []).map((story) => (
              <div key={story.id} className="rounded-xl border border-zinc-400/25 p-4 transition hover:bg-zinc-400/5">
                <p className="mb-1 text-xs font-semibold text-zinc-600 dark:text-zinc-300">{story.source_name || "সংবাদমাধ্যম"} · {formatDate(story.published_at)}</p>
                <h3 className="font-semibold leading-6 text-zinc-900 dark:text-zinc-100">{story.title}</h3>
                {story.source_url && <a href={story.source_url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-zinc-700 hover:underline dark:text-zinc-200">প্রতিবেদন পড়ুন <ExternalLink className="h-3.5 w-3.5" /></a>}
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
