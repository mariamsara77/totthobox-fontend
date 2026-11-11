import type { Metadata } from "next";
import DowaClient from "./dowaClient";
import EditorialSection from "@/components/EditorialSection";
import { islamDowanArticle } from "@/lib/content/sections/islam-dowan";
import { fetchApi } from "@/lib/api/fetcher";
import { CACHE_TAGS } from "@/lib/cache-config";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "দোয়া সংগ্রহ | দৈনন্দিন জীবনের প্রয়োজনীয় দোয়া ও আমল | তথ্যবক্স",
  description:
    "দৈনন্দিন জীবনের প্রয়োজনীয় ও নিত্যদিনের গুরুত্বপূর্ণ দোয়া, জিকির ও আমলসমূহের সম্পূর্ণ বাংলা তালিকা। ঘুমানো, খাওয়া, সফরসহ বিভিন্ন পরিস্থিতির দোয়া।",
  alternates: {
    canonical: "https://totthobox.com/islam/dowan",
  },
  openGraph: {
    title: "দোয়া সংগ্রহ | দৈনন্দিন জীবনের প্রয়োজনীয় দোয়া ও আমল",
    description:
      "ঘুমানো, খাওয়া, সফর, বিপদ-আপদসহ বিভিন্ন পরিস্থিতির জন্য গুরুত্বপূর্ণ দোয়া এক জায়গায়।",
    url: "https://totthobox.com/islam/dowan",
    siteName: "Totthobox",
    type: "website",
    locale: "bn_BD",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "দোয়া সংগ্রহ | তথ্যবক্স",
    description: "দৈনন্দিন জীবনের প্রয়োজনীয় দোয়া ও আমল",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }],
  },
};

async function getInitialData() {
  return await fetchApi<any>("/api/islam/dowan?page=1&per_page=12", {
    revalidate: 86400,
    tags: [CACHE_TAGS.ISLAM_DOWAN],
  });
}

export default async function DowaPage() {
  const initialData = await getInitialData();
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-8">
      <DowaClient initialData={initialData} />
      <EditorialSection article={islamDowanArticle} />
    </div>
  );
}
