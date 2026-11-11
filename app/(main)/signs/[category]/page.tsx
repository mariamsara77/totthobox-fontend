import type { Metadata } from "next";
import SignListClient from "./signListClient";
import EditorialSection from "@/components/EditorialSection";
import { signsArticle } from "@/lib/content/sections/signs";
import { fetchApi } from "@/lib/api/fetcher";
import { CACHE_TTL, CACHE_TAGS } from "@/lib/cache-config";

export const revalidate = 86400;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const cats = await fetchApi<any[]>("/api/sidebar/sign-categories", {
      revalidate: CACHE_TTL.STATIC_CONTENT,
      tags: [CACHE_TAGS.SIGNS],
    });
    const params = [{ category: "all" }];
    if (Array.isArray(cats)) {
      cats.forEach((c) => {
        if (c.slug) params.push({ category: c.slug });
      });
    }
    return params;
  } catch {
    return [{ category: "all" }];
  }
}

type Props = { params: Promise<{ category: string }> };

async function getSignCategoryData(categorySlug: string) {
  const json = await fetchApi<any>(`/api/signs/${categorySlug}`, {
    revalidate: CACHE_TTL.STATIC_CONTENT,
    tags: [CACHE_TAGS.SIGNS, `signs:${categorySlug}`],
  });
  return json?.success ? json.data : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const isAll = category === "all";
  const data = await getSignCategoryData(category);
  const catName = isAll
    ? "সকল ট্রাফিক সাইন ও রোড চিহ্ন"
    : data?.category?.name || category;

  return {
    title: `${catName} | ট্রাফিক সাইন ও চিহ্ন নির্দেশিকা | তথ্যবক্স`,
    description: `বাংলাদেশের ${catName}-এর সচিত্র তালিকা। প্রতিটি সাইন বা চিহ্নের ছবি, নাম, সঠিক অর্থ ও ট্রাফিক আইন সম্পর্কিত বিস্তারিত নিয়ম জানুন।`,
    alternates: {
      canonical: `https://totthobox.com/signs/${category}`,
    },
    openGraph: {
      title: `${catName} | ট্রাফিক সাইন ও রোড চিহ্ন নির্দেশিকা | তথ্যবক্স`,
      description: `বাংলাদেশের ${catName}-এর সচিত্র তালিকা ও অর্থসহ বিস্তারিত নিয়ম।`,
      url: `https://totthobox.com/signs/${category}`,
      siteName: "Totthobox",
      type: "website",
      locale: "bn_BD",
    },
    twitter: {
      card: "summary_large_image",
      title: `${catName} | ট্রাফিক সাইন নির্দেশিকা | তথ্যবক্স`,
      description: `বাংলাদেশের ${catName}-এর সচিত্র তালিকা ও অর্থসহ বিস্তারিত নিয়ম।`,
    },
  };
}

export default async function SignListPage({ params }: Props) {
  const { category } = await params;
  const initialData = await getSignCategoryData(category);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-8">
      <SignListClient categorySlug={category} initialData={initialData} />
      <EditorialSection article={signsArticle} />
    </div>
  );
}
