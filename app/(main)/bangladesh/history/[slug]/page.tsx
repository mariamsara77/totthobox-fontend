import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import HistoryShowClient from "./HistoryShowClient";
import { fetchApi } from "@/lib/api/fetcher";
import { getSlugsForPath } from "@/lib/api/slugs";
import { CACHE_TTL, CACHE_TAGS } from "@/lib/cache-config";
import { isThinContent, extractRecordText } from "@/lib/seo/word-count";

export const revalidate = 86400;
export const dynamicParams = true;

export async function generateStaticParams() {
  return await getSlugsForPath("/api/history-bd");
}

type Props = {
  params: Promise<{ slug: string }>;
};

const getHistory = cache(async function getHistory(slug: string) {
  const json = await fetchApi<any>(`/api/history-bd/${slug}`, {
    revalidate: CACHE_TTL.STATIC_CONTENT,
    tags: [CACHE_TAGS.HISTORY, `history:${slug}`],
  });
  return json?.data || null;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getHistory(slug);

  if (!item) {
    return {
      title: "স্থান পাওয়া যায়নি | তথ্যবক্স",
      robots: { index: false, follow: false },
    };
  }

  const cleanDescription = (item.description || "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();

  // Keep genuinely thin records (< 300 words) out of search until their existing source content is enriched.
  const isThin = isThinContent(extractRecordText(item), 300);

  const title = `${item.title} | বাংলাদেশের ঐতিহাসিক স্থান | তথ্যবক্স`;
  const contentDescription = extractRecordText(item)
    .replace(/<[^>]+>/g, " ")
    .replace(/\\s+/g, " ")
    .trim();
  const descriptionSource =
    cleanDescription ||
    contentDescription ||
    `${item.title} — বাংলাদেশের ইতিহাস ও ঐতিহাসিক স্থান সম্পর্কে বিস্তারিত তথ্য।`;
  const description =
    descriptionSource.length > 160
      ? `${descriptionSource.slice(0, 157).trimEnd()}...`
      : descriptionSource;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: item.image_url ? [{ url: item.image_url }] : [],
      type: "article",
      locale: "bn_BD",
      siteName: "Totthobox",
      url: `https://totthobox.com/bangladesh/history/${encodeURIComponent(item.slug)}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `https://totthobox.com/bangladesh/history/${encodeURIComponent(item.slug)}`,
    },
    robots: {
      index: !isThin,
      follow: true,
    },
  };
}

export default async function HistoryShowPage({ params }: Props) {
  const { slug } = await params;
  const item = await getHistory(slug);

  if (!item) {
    notFound();
  }

  // TODO(owner): add the actual author/reviewer details and page-specific sources after they are supplied.
  return <HistoryShowClient history={item} />;
}
