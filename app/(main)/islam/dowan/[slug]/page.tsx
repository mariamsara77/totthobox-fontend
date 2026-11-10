import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import DowaShowClient from "./dowaShowClient";
import { fetchApi } from "@/lib/api/fetcher";
import { getSlugsForPath } from "@/lib/api/slugs";
import { CACHE_TTL, CACHE_TAGS } from "@/lib/cache-config";

export const revalidate = 86400;
export const dynamicParams = true;

export async function generateStaticParams() {
  return await getSlugsForPath("/api/islam/dowan");
}

const getItem = cache(async function getItem(slug: string) {
  const json = await fetchApi<any>(`/api/islam/dowan/${slug}`, {
    revalidate: CACHE_TTL.STATIC_CONTENT,
    tags: [CACHE_TAGS.ISLAM_DOWAN, `islam-dowan:${slug}`],
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
  const cleanArabic = (item.arabic_text || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const cleanMeaning = (item.bangla_meaning || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const cleanText = (item.bangla_text || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const cleanFojilot = (item.bangla_fojilot || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const contentLength = cleanArabic.length + cleanText.length + cleanMeaning.length + cleanFojilot.length;
  const hasUsefulContent =
    contentLength >= 120;
  const title = `${item.bangla_name} - আরবি, উচ্চারণ, অর্থ ও আমল | দোয়া সংগ্রহ | তথ্যবক্স`;
  const sourceDescription = cleanMeaning || cleanText || cleanFojilot;
  const description = sourceDescription
    ? sourceDescription.length > 160
      ? `${sourceDescription.slice(0, 157).trimEnd()}...`
      : sourceDescription
    : undefined;
  const canonical = `https://totthobox.com/islam/dowan/${encodeURIComponent(item.slug || slug)}`;

  return {
    title,
    description,
    robots: {
      index: hasUsefulContent,
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

export default async function DowaShowPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getItem(slug);
  if (!data) notFound();

  return <DowaShowClient initialData={data} slug={slug} />;
}
