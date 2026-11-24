import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import TourismShowClient from "./TourismShowClient";
import { fetchApi } from "@/lib/api/fetcher";
import { getSlugsForPath } from "@/lib/api/slugs";
import { CACHE_TTL, CACHE_TAGS } from "@/lib/cache-config";
import { isThinContent, extractRecordText } from "@/lib/seo/word-count";

export const revalidate = 86400;
export const dynamicParams = true;

export async function generateStaticParams() {
  return await getSlugsForPath("/api/tourism-bd");
}

type Props = {
  params: Promise<{ slug: string }>;
};

type TourismMeta = {
  id: number;
  title: string;
  slug: string;
  description?: string;
  type_label?: string;
  image_url?: string;
};

const getTourism = cache(async function getTourism(slug: string): Promise<TourismMeta | null> {
  const json = await fetchApi<any>(
    `/api/tourism-bd/${encodeURIComponent(slug)}`,
    {
      revalidate: CACHE_TTL.STATIC_CONTENT,
      tags: [CACHE_TAGS.TOURISM, `tourism:${slug}`],
    },
  );

  return json?.data ?? null;
});

function getPlainText(value?: string): string {
  return (value || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getMetaDescription(title: string, description?: string): string {
  const clean = getPlainText(description);
  if (!clean) return `${title} সম্পর্কে বাংলাদেশের পর্যটন কেন্দ্রের তথ্য।`;

  return clean.length > 160
    ? `${clean.slice(0, 157).trimEnd()}...`
    : clean;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getTourism(slug);

  if (!item) {
    return {
      title: "স্থান পাওয়া যায়নি | তথ্যবক্স",
      robots: { index: false, follow: false },
    };
  }

  const cleanDescription = getPlainText(item.description);
  const isThin = isThinContent(extractRecordText(item), 300);
  const title = `${item.title} | বাংলাদেশের পর্যটন কেন্দ্র | তথ্যবক্স`;
  const contentDescription = extractRecordText(item)
    .replace(/<[^>]+>/g, " ")
    .replace(/\\s+/g, " ")
    .trim();
  const descriptionSource =
    (cleanDescription ? getMetaDescription(item.title, item.description) : "") ||
    contentDescription ||
    `${item.title} — বাংলাদেশের পর্যটন কেন্দ্র, অবস্থান ও দর্শনীয় তথ্য।`;
  const description =
    descriptionSource.length > 160
      ? `${descriptionSource.slice(0, 157).trimEnd()}...`
      : descriptionSource;
  const canonical = `https://totthobox.com/bangladesh/tourism/${encodeURIComponent(item.slug)}`;

  return {
    title,
    description,
    robots: {
      index: !isThin,
      follow: true,
    },
    openGraph: {
      title,
      description,
      images: item.image_url ? [{ url: item.image_url }] : [],
      type: "article",
      locale: "bn_BD",
      siteName: "Totthobox",
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical,
    },
  };
}

export default async function TourismShowPage({ params }: Props) {
  const { slug } = await params;
  const item = await getTourism(slug);

  if (!item) {
    notFound();
  }

  return <TourismShowClient tourism={item} />;
}
