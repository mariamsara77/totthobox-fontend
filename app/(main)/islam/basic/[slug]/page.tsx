import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BasicIslamShowClient from "./basicislamShowClient";

async function getItem(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";
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
  if (!data) return { title: "পৃষ্ঠা পাওয়া যায়নি" };

  const item = data.item;
  const title = `${item.title} | ইসলামের মৌলিক জ্ঞান`;
  const description =
    item.description_plain?.slice(0, 155) || `${item.title} সম্পর্কে বিস্তারিত জানুন।`;

  return {
    title,
    description,
    keywords: [
      item.title,
      "ইসলামিক জ্ঞান",
      "ইসলামের মৌলিক জ্ঞান",
      "তথ্যবক্স",
      "ঈমান",
      "নামাজ",
      "যাকাত",
      "হজ",
      "রোজা",
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
      canonical: `/islam/basic/${slug}`,
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