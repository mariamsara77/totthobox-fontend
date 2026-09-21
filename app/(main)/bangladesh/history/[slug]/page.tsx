import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HistoryShowClient from "./HistoryShowClient";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getHistory(slug: string) {
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";
  const res = await fetch(`${base}/api/history-bd/${slug}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

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

  const title = `${item.title} | বাংলাদেশের ঐতিহাসিক স্থান | তথ্যবক্স`;
  const description = cleanDescription
    ? cleanDescription.length > 160
      ? `${cleanDescription.slice(0, 157).trimEnd()}...`
      : cleanDescription
    : `${item.title} সম্পর্কে বাংলাদেশের ইতিহাস ও ঐতিহ্যের তথ্য।`;

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
      index: Boolean(cleanDescription),
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

  return <HistoryShowClient history={item} />;
}
