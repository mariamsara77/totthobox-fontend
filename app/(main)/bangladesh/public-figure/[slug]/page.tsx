import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import PersonShowClient from "./PersonShowClient";
import { fetchApi } from "@/lib/api/fetcher";
import { getSlugsForPath } from "@/lib/api/slugs";
import { CACHE_TTL, CACHE_TAGS } from "@/lib/cache-config";
import { isThinContent, extractRecordText } from "@/lib/seo/word-count";

export const revalidate = 86400;
export const dynamicParams = true;

export async function generateStaticParams() {
  return await getSlugsForPath("/api/people");
}

type Props = {
  params: Promise<{ slug: string }>;
};

type PersonMeta = {
  id: number;
  name: string;
  slug: string;
  bio?: string;
  image_url?: string;
  categories?: { id: number; name: string }[];
  current_role?: { title: string; from_year?: string | null } | null;
  histories?: { title: string; from_year?: string | null; to_year?: string | null }[];
};

const getPerson = cache(async function getPerson(slug: string): Promise<PersonMeta | null> {
  const json = await fetchApi<any>(
    `/api/people/${encodeURIComponent(slug)}`,
    {
      revalidate: CACHE_TTL.STATIC_CONTENT,
      tags: [CACHE_TAGS.PUBLIC_FIGURE, `public-figure:${slug}`],
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
  const person = await getPerson(slug);

  if (!person) {
    return {
      title: "প্রোফাইল পাওয়া যায়নি | তথ্যবক্স",
      robots: { index: false, follow: false },
    };
  }

  const cleanBio = getPlainText(person.bio);
  const role = person.current_role?.title?.trim();
  const personText = extractRecordText(person, ["name", "bio"]) + " " + (person.histories || []).map((h) => h.title).join(" ");
  const isThin = isThinContent(personText, 300);

  const title = `${person.name} | প্রোফাইল আর্কাইভ | তথ্যবক্স`;
  const fallbackDescription = role
    ? `${person.name}-এর ${role} ও কর্মজীবনের তথ্য।`
    : `${person.name}-এর প্রোফাইল ও কর্মজীবনের তথ্য।`;
  const description = cleanBio
    ? cleanBio.length > 160
      ? `${cleanBio.slice(0, 157).trimEnd()}...`
      : cleanBio
    : fallbackDescription;
  const canonical = `https://totthobox.com/bangladesh/public-figure/${encodeURIComponent(person.slug)}`;

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
      images: person.image_url ? [{ url: person.image_url }] : [],
      type: "profile",
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

export default async function PersonShowPage({ params }: Props) {
  const { slug } = await params;
  const person = await getPerson(slug);

  if (!person) {
    notFound();
  }

  return <PersonShowClient person={person} />;
}
