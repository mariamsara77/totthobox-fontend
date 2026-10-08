import type { Metadata } from "next";
import NewsHub from "@/components/news/NewsHub";
import { getNews, getNewsSources } from "@/lib/news";

export const metadata: Metadata = {
  title: "সর্বশেষ সংবাদ ও সংবাদমাধ্যম | তথ্যবক্স",
  description:
    "বাংলাদেশের বিভিন্ন সংবাদমাধ্যমের সাম্প্রতিক শিরোনাম এক জায়গায় দেখুন এবং মূল সংবাদমাধ্যমে সম্পূর্ণ প্রতিবেদন পড়ুন।",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "https://totthobox.com/news",
  },
  openGraph: {
    title: "সর্বশেষ সংবাদ ও সংবাদমাধ্যম | তথ্যবক্স",
    description:
      "বিভিন্ন সংবাদমাধ্যমের সাম্প্রতিক শিরোনাম এক জায়গায় দেখুন এবং মূল উৎসে সম্পূর্ণ সংবাদ পড়ুন।",
    type: "website",
    url: "https://totthobox.com/news",
    siteName: "Totthobox",
    locale: "bn_BD",
  },
};

type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const filters = {
    search: first(params.search),
    language: first(params.language),
    category: first(params.category),
    hours: first(params.hours) || "48",
    source: first(params.source),
  };

  const [news, sources] = await Promise.all([
    getNews(filters),
    getNewsSources(),
  ]);

  return (
    <NewsHub
      items={news.data}
      meta={{
        current_page: news.meta.current_page,
        last_page: news.meta.last_page,
        total: news.meta.total,
      }}
      sources={sources}
      filters={filters}
      basePath="/news"
    />
  );
}
