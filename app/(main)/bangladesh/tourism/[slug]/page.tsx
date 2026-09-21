import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TourismShowClient from "./TourismShowClient";

type Props = {
  params: Promise<{ slug: string }>;
};

type TourismMeta = {
  title: string;
  slug: string;
  description?: string;
  type_label?: string;
  image_url?: string;
};

async function getTourism(slug: string): Promise<TourismMeta | null> {
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

  const res = await fetch(
    `${base}/api/tourism-bd/${encodeURIComponent(slug)}`,
    { cache: "no-store" },
  );

  if (!res.ok) return null;

  const json = await res.json();
  return json?.data ?? null;
}

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
  const title = `${item.title} | বাংলাদেশের পর্যটন কেন্দ্র | তথ্যবক্স`;
  const description = getMetaDescription(item.title, item.description);
  const canonical = `https://totthobox.com/bangladesh/tourism/${encodeURIComponent(item.slug)}`;

  return {
    title,
    description,
    robots: {
      index: cleanDescription.length > 0,
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
