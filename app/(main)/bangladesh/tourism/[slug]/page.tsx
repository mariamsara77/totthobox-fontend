import { Metadata } from "next";
import { notFound } from "next/navigation";
import TourismShowClient from "./TourismShowClient";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getTourism(slug: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";
  const res = await fetch(`${base}/api/tourism-bd/${slug}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
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

  const title = `${item.title} | বাংলাদেশের পর্যটন কেন্দ্র | তথ্যবক্স`;
  const description = (item.description || `${item.title} সম্পর্কে বিস্তারিত ভ্রমণ গাইড।`)
    .replace(/<[^>]+>/g, "")
    .slice(0, 155);

  return {
    title,
    description,
    keywords: `${item.title}, বাংলাদেশ পর্যটন, ${item.type_label || ""}, ভ্রমণ গাইড, তথ্যবক্স`,
    openGraph: {
      title,
      description,
      images: item.image_url ? [{ url: item.image_url }] : [],
      type: "article",
      locale: "bn_BD",
      siteName: "Totthobox",
    },
    alternates: {
      canonical: `https://totthobox.com/bangladesh/tourism/${item.slug}`,
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