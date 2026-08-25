import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DowaShowClient from "./dowaShowClient";

async function getItem(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";
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
  if (!data) return { title: "পৃষ্ঠা পাওয়া যায়নি", robots: { index: false, follow: false } };

  const item = data.item;
  const title = `${item.bangla_name} - আরবি, উচ্চারণ, অর্থ ও আমল | দোয়া সংগ্রহ`;
  const description =
    (item.bangla_meaning
      ? item.bangla_meaning.replace(/<[^>]+>/g, "").slice(0, 155)
      : item.bangla_text?.slice(0, 155)) || item.bangla_name;

  return {
    title,
    description,
    keywords: [
      item.bangla_name,
      "bangla dowa",
      "দোয়ার ফজিলত",
      "প্রতিদিনের দোয়া",
      "আরবি দোয়া ও আমল",
    ],
    openGraph: {
      title,
      description,
      type: "article",
      images: item.first_media_url ? [{ url: item.first_media_url }] : [],
      locale: "bn_BD",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `/islam/dowan/${slug}`,
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