import type { Metadata } from "next";
import NewsHub from "@/components/news/NewsHub";
import { getNews, getNewsSources } from "@/lib/news";

export const metadata: Metadata = {
  title: "সংবাদ শিরোনাম | তথ্যবক্স",
  description:
    "বিভিন্ন সংবাদমাধ্যমের সাম্প্রতিক সংবাদ শিরোনাম এক জায়গায় দেখুন এবং মূল সংবাদমাধ্যমে সম্পূর্ণ প্রতিবেদন পড়ুন।",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "https://totthobox.com/news/headlines",
  },
  openGraph: {
    title: "সংবাদ শিরোনাম | তথ্যবক্স",
    description:
      "বিভিন্ন সংবাদমাধ্যমের সাম্প্রতিক সংবাদ শিরোনাম এক জায়গায় দেখুন এবং মূল সংবাদমাধ্যমে সম্পূর্ণ প্রতিবেদন পড়ুন।",
    type: "website",
    url: "https://totthobox.com/news/headlines",
    siteName: "Totthobox",
    locale: "bn_BD",
  },
};

type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function NewsHeadlinesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const filters = {
    source: first(params.source),
    search: first(params.search),
    language: first(params.language),
    category: first(params.category),
    hours: first(params.hours),
    page: first(params.page),
  };

  const [news, sources] = await Promise.all([
    getNews(filters),
    getNewsSources(),
  ]);

  return (
    <NewsHub
      items={news.data}
      error={news.error}
      meta={{
        current_page: news.meta.current_page,
        last_page: news.meta.last_page,
        total: news.meta.total,
      }}
      sources={sources}
      filters={filters}
      basePath="/news/headlines"
    />
  );
}
