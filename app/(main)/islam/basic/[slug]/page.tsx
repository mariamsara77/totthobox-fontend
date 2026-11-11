import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import BasicIslamShowClient from "./basicislamShowClient";
import { fetchApi } from "@/lib/api/fetcher";
import { getSlugsForPath } from "@/lib/api/slugs";
import { CACHE_TTL, CACHE_TAGS } from "@/lib/cache-config";
import { isThinContent, extractRecordText } from "@/lib/seo/word-count";

export const revalidate = 86400;
export const dynamicParams = true;

export async function generateStaticParams() {
  return await getSlugsForPath("/api/islam/basic");
}

const getItem = cache(async function getItem(slug: string) {
  const json = await fetchApi<any>(`/api/islam/basic/${slug}`, {
    revalidate: CACHE_TTL.STATIC_CONTENT,
    tags: [CACHE_TAGS.ISLAM_BASIC, `islam-basic:${slug}`],
  });

  return json?.success ? json.data : null;
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getItem(slug);

  if (!data) {
    return {
      title: "পৃষ্ঠা পাওয়া যায়নি | তথ্যবক্স",
      robots: { index: false, follow: false },
    };
  }

  const item = data.item;
  const cleanDescription = (item.description_plain || item.description || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const isThin = isThinContent(extractRecordText(item), 300);
  const title = `${item.title} | ইসলামের মৌলিক জ্ঞান | তথ্যবক্স`;
  const description = cleanDescription
    ? cleanDescription.length > 160
      ? `${cleanDescription.slice(0, 157).trimEnd()}...`
      : cleanDescription
    : undefined;
  const canonical = `https://totthobox.com/islam/basic/${encodeURIComponent(item.slug || slug)}`;

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
      type: "article",
      url: canonical,
      siteName: "Totthobox",
      images: item.first_media_url ? [{ url: item.first_media_url }] : [],
      locale: "bn_BD",
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

export default async function BasicIslamShowPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getItem(slug);

  if (!data) notFound();

  return <BasicIslamShowClient initialData={data} slug={slug} />;
}
