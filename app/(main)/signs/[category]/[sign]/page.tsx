import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SignShowClient from "./signShowClient";

type Props = {
  params: Promise<{ category: string; sign: string }>;
};

async function getItem(category: string, sign: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
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
  if (!data) return { title: "পৃষ্ঠা পাওয়া যায়নি" };

  const item = data.item;
  const cat = data.category;
  const title = `${item.name} | ${cat.name} | ট্রাফিক সাইন | তথ্যবক্স`;
  const description =
    item.description_plain?.slice(0, 155) ||
    `${item.name} ট্রাফিক সাইনের অর্থ ও ব্যবহার।`;

  return {
    title,
    description,
    keywords: [item.name, cat.name, "ট্রাফিক সাইন", "রোড সাইন", "ট্রাফিক চিহ্ন"],
    openGraph: {
      title,
      description,
      images: item.first_media_url ? [{ url: item.first_media_url }] : [],
      locale: "bn_BD",
    },
    alternates: {
      canonical: `/signs/${category}/${sign}`,
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