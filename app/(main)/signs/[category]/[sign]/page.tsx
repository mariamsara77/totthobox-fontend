import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import SignShowClient from "./signShowClient";
import { fetchApi } from "@/lib/api/fetcher";
import { CACHE_TTL, CACHE_TAGS } from "@/lib/cache-config";
import { isThinContent, extractRecordText } from "@/lib/seo/word-count";

export const revalidate = 86400;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const res = await fetchApi<any>("/api/signs/all", {
      revalidate: CACHE_TTL.STATIC_CONTENT,
      tags: [CACHE_TAGS.SIGNS],
    });
    const items = res?.data?.items || [];
    return items
      .filter((item: any) => item.slug && item.category?.slug)
      .map((item: any) => ({
        category: item.category.slug,
        sign: item.slug,
      }));
  } catch {
    return [];
  }
}

type Props = {
  params: Promise<{ category: string; sign: string }>;
};

const getItem = cache(async function getItem(category: string, sign: string) {
  const json = await fetchApi<any>(`/api/signs/${category}/${sign}`, {
    revalidate: CACHE_TTL.STATIC_CONTENT,
    tags: [CACHE_TAGS.SIGNS, `signs:${category}:${sign}`],
  });
  return json?.success ? json.data : null;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, sign } = await params;
  const data = await getItem(category, sign);

  if (!data) {
    return {
      title: "পৃষ্ঠা পাওয়া যায়নি | তথ্যবক্স",
      robots: { index: false, follow: false },
    };
  }

  const item = data.item;
  const cat = data.category;
  const cleanDescription = (item.description_plain || item.description || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const title = `${item.name} | ${cat.name} | ট্রাফিক সাইন | তথ্যবক্স`;
  const description = cleanDescription
    ? cleanDescription.length > 160
      ? `${cleanDescription.slice(0, 157).trimEnd()}...`
      : cleanDescription
    : `${item.name} ট্রাফিক সাইনের অর্থ ও ব্যবহার।`;
  const canonical = `https://totthobox.com/signs/${encodeURIComponent(category)}/${encodeURIComponent(sign)}`;

  const isThin = isThinContent(extractRecordText(item, ["name", "description_plain", "description"]), 300);

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

export default async function SignShowPage({ params }: Props) {
  const { category, sign } = await params;
  const data = await getItem(category, sign);
  if (!data) notFound();

  return (
    <SignShowClient
      initialData={data}
      categorySlug={category}
      signSlug={sign}
    />
  );
}
