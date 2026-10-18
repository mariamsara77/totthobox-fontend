import type { Metadata } from "next";
import { cache } from "react";

// Public news content can be served from ISR instead of rendering on every visit.
export const revalidate = 300;

// Generate public news routes on first visit, then serve the cached ISR output.
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return [];
}
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
  summary?: string | null;
  description?: string | null;
  excerpt?: string | null;
  author?: string | null;
  author_name?: string | null;
  author_url?: string | null;
  author_twitter?: string | null;
  published_at?: string | null;
  updated_at?: string | null;
  modified_at?: string | null;
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
const SITE_URL = "https://totthobox.com";
const FALLBACK_SOCIAL_IMAGE = `${SITE_URL}/og-image.png`;

function absolutePublicUrl(value?: string | null): string | undefined {
  if (!value?.trim()) return undefined;
  try {
    const url = new URL(value, SITE_URL);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function socialImageUrl(value?: string | null): string {
  return absolutePublicUrl(value) ?? FALLBACK_SOCIAL_IMAGE;
}

function cleanSeoText(value: string | null | undefined, fallback: string): string {
  const cleaned = (value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return (cleaned || fallback).slice(0, 200);
}

function isoDate(value?: string | null): string | undefined {
  if (!value) return undefined;
  const time = Date.parse(value);
  return Number.isNaN(time) ? undefined : new Date(time).toISOString();
}

const getNews = cache(async (slug: string): Promise<NewsRecord | null> => {
  try {
    const response = await fetch(`${API_BASE}/api/news/${encodeURIComponent(slug)}`, {
      next: { revalidate: 300 },
      headers: { Accept: "application/json" },
    });
    if (response.status === 404 || !response.ok) return null;
    const result = await response.json();
    return result?.data ?? null;
  } catch {
    return null;
  }
});


type NewsSource = { key: string; name: string; count?: number; total?: number };

const getNewsSource = cache(async (sourceKey: string): Promise<NewsSource | null> => {
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
});

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
    const title = `${source.name} — সংবাদ শিরোনাম`;
    const description = cleanSeoText(
      `${source.name} সংবাদমাধ্যমের সর্বশেষ শিরোনাম ও প্রকাশিত খবর এক জায়গায় দেখুন।`,
      "বিভিন্ন সংবাদমাধ্যমের সর্বশেষ শিরোনাম এক জায়গায় দেখুন।",
    );
    const canonical = `${SITE_URL}/news/headlines/${encodeURIComponent(source.key)}`;
    return {
      title,
      description,
      alternates: { canonical },
      openGraph: {
        title: `${title} | Totthobox`,
        description,
        url: canonical,
        siteName: "Totthobox",
        locale: "bn_BD",
        type: "website",
        images: [{ url: FALLBACK_SOCIAL_IMAGE, alt: "Totthobox" }],
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | Totthobox`,
        description,
        images: [{ url: FALLBACK_SOCIAL_IMAGE, alt: "Totthobox" }],
      },
    };
  }

  const item = await getNews(slug);
  if (!item) return { title: "সংবাদ পাওয়া যায়নি", robots: { index: false, follow: true } };

  const canonical = `${SITE_URL}/news/headlines/story/${encodeURIComponent(item.slug)}`;
  const description = cleanSeoText(
    item.summary ?? item.description ?? item.excerpt,
    `${item.title} — ${item.source_name || "Totthobox সংবাদ শিরোনাম"}`,
  );
  const image = socialImageUrl(item.image_url);
  const authorName = item.author_name?.trim() || item.author?.trim() || item.source_name?.trim();
  const authorUrl = absolutePublicUrl(item.author_url);
  const publishedTime = isoDate(item.published_at);
  const modifiedTime = isoDate(item.updated_at ?? item.modified_at);

  return {
    title: item.title,
    description,
    ...(authorName ? { authors: [{ name: authorName, ...(authorUrl ? { url: authorUrl } : {}) }] } : {}),
    alternates: { canonical },
    openGraph: {
      title: item.title,
      description,
      url: canonical,
      siteName: "Totthobox",
      locale: item.language?.toLowerCase().startsWith("en") ? "en_US" : "bn_BD",
      type: "article",
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
      ...(authorUrl ? { authors: [authorUrl] } : {}),
      images: [{ url: image, alt: item.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description,
      ...(item.author_twitter ? { creator: item.author_twitter } : {}),
      images: [{ url: image, alt: item.title }],
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

  const canonicalUrl = `${SITE_URL}/news/headlines/story/${encodeURIComponent(item.slug)}`;
  const articleDescription = cleanSeoText(
    item.summary ?? item.description ?? item.excerpt,
    `${item.title} — ${item.source_name || "Totthobox সংবাদ শিরোনাম"}`,
  );
  const articleImage = socialImageUrl(item.image_url);
  const articleAuthorName = item.author_name?.trim() || item.author?.trim() || item.source_name?.trim() || "Totthobox";
  const published = isoDate(item.published_at);
  const modified = isoDate(item.updated_at ?? item.modified_at);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: item.title,
    description: articleDescription,
    url: canonicalUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    image: [articleImage],
    ...(published ? { datePublished: published } : {}),
    ...(modified ? { dateModified: modified } : {}),
    author: { "@type": "Organization", name: articleAuthorName },
    publisher: {
      "@type": "Organization",
      name: "Totthobox",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: FALLBACK_SOCIAL_IMAGE },
    },
    ...(item.category ? { articleSection: item.category } : {}),
    inLanguage: item.language?.toLowerCase().startsWith("en") ? "en" : "bn-BD",
    isAccessibleForFree: true,
  };

  return (
    <>
      <script
        id="news-article-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
        }}
      />
    <article className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6 lg:py-10">
      <Link href="/news/headlines" className="mb-6 inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-400/10 dark:text-zinc-200">
        <ArrowLeft className="h-4 w-4" /> সব সংবাদ শিরোনাম
      </Link>
      <div className="overflow-hidden rounded-2xl border border-zinc-400/25 bg-white dark:bg-zinc-400/10">
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
    </>
  );
}
