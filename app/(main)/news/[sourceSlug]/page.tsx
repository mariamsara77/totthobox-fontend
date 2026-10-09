import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NewsHub from "@/components/news/NewsHub";
import { getNews, getNewsSources } from "@/lib/news";

type SearchParams = Record<string, string | string[] | undefined>;

type Props = {
  params: Promise<{ sourceSlug: string }>;
  searchParams: Promise<SearchParams>;
};

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

async function getSource(sourceSlug: string) {
  const sources = await getNewsSources();
  const source = [...sources.bn, ...sources.en].find((item) => item.slug === sourceSlug);
  return source ? { key: source.key, source, sources } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sourceSlug } = await params;
  const found = await getSource(sourceSlug);

  if (!found) {
    return {
      title: "সংবাদমাধ্যম পাওয়া যায়নি | তথ্যবক্স",
      robots: { index: false, follow: false },
    };
  }

  const { source } = found;

  return {
    title: source.name + " সংবাদ | তথ্যবক্স",
    description:
      source.name +
      "-এর সাম্প্রতিক সংবাদ শিরোনাম এক জায়গায় দেখুন এবং মূল সংবাদমাধ্যমে সম্পূর্ণ প্রতিবেদন পড়ুন।",
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: "https://totthobox.com/news/" + sourceSlug,
    },
    openGraph: {
      title: source.name + " সংবাদ | তথ্যবক্স",
      description: source.name + "-এর সাম্প্রতিক শিরোনাম ও মূল সংবাদ লিংক।",
      type: "website",
      url: "https://totthobox.com/news/" + sourceSlug,
      siteName: "Totthobox",
      locale: source.language === "bn" ? "bn_BD" : "en_US",
    },
  };
}

export default async function NewsSourcePage({ params, searchParams }: Props) {
  const { sourceSlug } = await params;
  const query = await searchParams;
  const found = await getSource(sourceSlug);

  if (!found) notFound();

  const filters = {
    source: found.key,
    search: first(query.search),
    language: first(query.language),
    category: first(query.category),
    hours: first(query.hours),
    page: first(query.page),
  };

  const news = await getNews(filters);

  return (
    <NewsHub
      items={news.data}
      error={news.error}
      meta={{
        current_page: news.meta.current_page,
        last_page: news.meta.last_page,
        total: news.meta.total,
      }}
      sources={found.sources}
      selectedSource={found.source}
      filters={filters}
      basePath={"/news/" + sourceSlug}
    />
  );
}
