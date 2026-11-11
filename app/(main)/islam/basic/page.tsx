import type { Metadata } from "next";
import BasicIslamClient from "./basicislamClient";
import EditorialSection from "@/components/EditorialSection";
import Disclaimer from "@/components/Disclaimer";
import { islamBasicArticle } from "@/lib/content/sections/islam-basic";
import { fetchApi } from "@/lib/api/fetcher";
import { CACHE_TAGS } from "@/lib/cache-config";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "ইসলামের মৌলিক জ্ঞান | ঈমান, নামাজ, যাকাত, হজ, রোজা | তথ্যবক্স",
  description:
    "ইসলামের মূল ভিত্তি, আরকান এবং মৌলিক জ্ঞান সম্পর্কে সঠিক ও যাচাইকৃত তথ্য। ঈমান, নামাজ, যাকাত, রোজা ও হজসহ দ্বীনের সঠিক ধারণা এক জায়গায়।",
  alternates: {
    canonical: "https://totthobox.com/islam/basic",
  },
  openGraph: {
    title: "ইসলামের মৌলিক জ্ঞান | ঈমান, নামাজ, যাকাত, হজ, রোজা",
    description:
      "ইসলামের মূল ভিত্তি, আরকান এবং মৌলিক জ্ঞান সম্পর্কে সঠিক ও যাচাইকৃত তথ্য।",
    url: "https://totthobox.com/islam/basic",
    siteName: "Totthobox",
    type: "website",
    locale: "bn_BD",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ইসলামের মৌলিক জ্ঞান | তথ্যবক্স",
    description: "ঈমান, নামাজ, যাকাত, রোজা ও হজসহ দ্বীনের সঠিক ধারণা",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }],
  },
};

async function getInitialData() {
  return await fetchApi<any>("/api/islam/basic?page=1&per_page=12", {
    revalidate: 86400,
    tags: [CACHE_TAGS.ISLAM_BASIC],
  });
}

// TODO(owner): add verified author/reviewer details and page-specific source citations when supplied.
export default async function BasicIslamPage() {
  const initialData = await getInitialData();
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-8">
      <BasicIslamClient initialData={initialData} />
      <Disclaimer type="islamic" />
      <EditorialSection article={islamBasicArticle} />
    </div>
  );
}
