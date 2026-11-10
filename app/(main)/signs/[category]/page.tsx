import type { Metadata } from "next";
import SignListClient from "./signListClient";

export const revalidate = 1800;

type Props = { params: Promise<{ category: string }> };

async function getSignCategoryData(categorySlug: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";
  try {
    const res = await fetch(`${baseUrl}/api/signs/${categorySlug}`, {
      next: { revalidate: 1800 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch {
    return null;
  }
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

  return <SignListClient categorySlug={category} initialData={initialData} />;
}
