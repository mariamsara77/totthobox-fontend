import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import IntroductionShowClient from "./IntroductionShowClient";
import { fetchApi } from "@/lib/api/fetcher";
import { getSlugsForPath } from "@/lib/api/slugs";
import { CACHE_TTL, CACHE_TAGS } from "@/lib/cache-config";
import { isThinContent, extractRecordText } from "@/lib/seo/word-count";

export const revalidate = 86400;
export const dynamicParams = true;

export async function generateStaticParams() {
  return await getSlugsForPath("/api/intro-bd");
}

type Props = {
  params: Promise<{ slug: string }>;
};

type IntroMeta = {
  id: number;
  title: string;
  slug: string;
  description?: string;
  intro_category?: string;
  image_url?: string;
};

const getIntro = cache(async function getIntro(slug: string): Promise<IntroMeta | null> {
  const json = await fetchApi<any>(
    `/api/intro-bd/${encodeURIComponent(slug)}`,
    {
      revalidate: CACHE_TTL.STATIC_CONTENT,
      tags: [CACHE_TAGS.INTRODUCTION, `introduction:${slug}`],
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const intro = await getIntro(slug);

  if (!intro) {
    return {
      title: "তথ্য পাওয়া যায়নি | তথ্যবক্স",
      robots: { index: false, follow: false },
    };
  }

  const cleanDescription = getPlainText(intro.description);
  const contentDescription = extractRecordText(intro)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const isThin = isThinContent(extractRecordText(intro), 300);
  const title = `${intro.title} | বাংলাদেশের পরিচিতি | তথ্যবক্স`;
  const descriptionSource =
    cleanDescription ||
    contentDescription ||
    `${intro.title} — বাংলাদেশের পরিচিতি ও প্রাসঙ্গিক তথ্য।`;
  const description =
    descriptionSource.length > 160
      ? `${descriptionSource.slice(0, 157).trimEnd()}...`
      : descriptionSource;
  const canonical = `https://totthobox.com/bangladesh/introduction/${encodeURIComponent(intro.slug)}`;

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
      images: intro.image_url ? [{ url: intro.image_url }] : [],
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

export default async function IntroductionShowPage({ params }: Props) {
  const { slug } = await params;
  const intro = await getIntro(slug);

  if (!intro) {
    notFound();
  }

  return <IntroductionShowClient intro={intro} />;
}
