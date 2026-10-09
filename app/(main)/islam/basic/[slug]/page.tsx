import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BasicIslamShowClient from "./basicislamShowClient";

async function getItem(slug: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";
  if (!baseUrl) return null;

  try {
    const res = await fetch(`${baseUrl}/api/islam/basic/${slug}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;

    const contentType = res.headers.get("content-type");
    if (!contentType?.includes("application/json")) return null;

    const json = await res.json();
    return json.success ? json.data : null;
  } catch {
    return null;
  }
}

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
  const isThinContent = cleanDescription.length < 120;
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
      index: !isThinContent,
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
