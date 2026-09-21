import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SignShowClient from "./signShowClient";

type Props = {
  params: Promise<{ category: string; sign: string }>;
};

async function getItem(category: string, sign: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";
  if (!baseUrl) return null;

  try {
    const res = await fetch(`${baseUrl}/api/signs/${category}/${sign}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch {
    return null;
  }
}

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

  return {
    title,
    description,
    robots: {
      index: cleanDescription.length > 0,
      follow: true,
    },\n    openGraph: {
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
