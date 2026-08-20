import type { Metadata } from "next";
import SignListClient from "./signListClient";

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const isAll = category === "all";

  if (isAll) {
    return {
      title: "সকল ট্রাফিক সাইন ও চিহ্ন | তথ্যবক্স",
      description:
        "বাংলাদেশের সকল ট্রাফিক সাইন ও রোড চিহ্নের সম্পূর্ণ তালিকা। প্রতিটি সাইনের ছবি, নাম, অর্থ এবং বিস্তারিত ব্যাখ্যা একসাথে দেখুন।",
      keywords: [
        "ট্রাফিক সাইন",
        "ট্রাফিক চিহ্ন",
        "রোড সাইন",
        "বাংলাদেশ ট্রাফিক সাইন",
        "সকল ট্রাফিক সাইন",
        "ট্রাফিক রুলস",
        "road signs bangladesh",
      ],
      alternates: { canonical: "/signs/all" },
    };
  }

  // Category-specific – fetch name if needed, fallback:
  return {
    title: `${category} | ট্রাফিক সাইন ও চিহ্ন | তথ্যবক্স`,
    description: `${category} ক্যাটাগরির সকল ট্রাফিক সাইন ও চিহ্নের ছবি, নাম এবং অর্থসহ বিস্তারিত বিবরণ পড়ুন।`,
    keywords: [category, "ট্রাফিক সাইন", "ট্রাফিক চিহ্ন", "রোড সাইন", "ট্রাফিক রুলস"],
    alternates: { canonical: `/signs/${category}` },
  };
}

export default async function SignListPage({ params }: Props) {
  const { category } = await params;
  return <SignListClient categorySlug={category} />;
}