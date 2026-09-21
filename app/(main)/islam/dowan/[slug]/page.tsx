import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DowaShowClient from "./dowaShowClient";

async function getItem(slug: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";
  if (!baseUrl) return null;

  try {
    const res = await fetch(`${baseUrl}/api/islam/dowan/${slug}`, {
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
  const hasUsefulContent = Boolean(
    item.arabic_text || cleanText || cleanMeaning || cleanFojilot,
  );
  const title = `${item.bangla_name} - আরবি, উচ্চারণ, অর্থ ও আমল | দোয়া সংগ্রহ | তথ্যবক্স`;
  const sourceDescription = cleanMeaning || cleanText || cleanFojilot;
  const description = sourceDescription
    ? sourceDescription.length > 160
      ? `${sourceDescription.slice(0, 157).trimEnd()}...`
      : sourceDescription
    : `${item.bangla_name} সম্পর্কে দোয়া ও আমলের তথ্য।`;
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
