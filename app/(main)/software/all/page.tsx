import type { Metadata } from "next";
import SoftwareClient from "./SoftwareClient";
import EditorialSection from "@/components/EditorialSection";
import AuthorReviewerBlock from "@/components/AuthorReviewerBlock";
import Disclaimer from "@/components/Disclaimer";
import { softwareArticle } from "@/lib/content/sections/software";

export const revalidate = 1800;

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

async function getInitialData() {
  try {
    const response = await fetch(`${API_BASE}/api/apps?page=1&per_page=12`, {
      next: { revalidate: 1800, tags: ["software-list"] },
    });
    if (!response.ok) return null;
    return response.json();
  } catch (e) {
    console.error("[software] Failed to load initial data:", e);
    return null;
  }
}

export const metadata: Metadata = {
  title: "Software & Apps Directory | তথ্যবক্স",
  description:
    "Windows, Android এবং Mac প্ল্যাটফর্মের সফটওয়্যার ও অ্যাপের তথ্য, ফিচার, সিস্টেম রিকোয়ারমেন্ট এবং অফিসিয়াল সোর্স।",
  alternates: {
    canonical: "https://totthobox.com/software/all",
  },
  openGraph: {
    title: "Software & Apps Directory | তথ্যবক্স",
    description:
      "Windows, Android এবং Mac প্ল্যাটফর্মের সফটওয়্যার ও অ্যাপের তথ্য, ফিচার, সিস্টেম রিকোয়ারমেন্ট এবং অফিসিয়াল সোর্স।",
    type: "website",
    locale: "bn_BD",
    siteName: "তথ্যবক্স",
    url: "https://totthobox.com/software/all",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Software & Apps Directory | তথ্যবক্স",
    description:
      "Windows, Android এবং Mac প্ল্যাটফর্মের সফটওয়্যার ও অ্যাপের তথ্য, ফিচার, সিস্টেম রিকোয়ারমেন্ট এবং অফিসিয়াল সোর্স।",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function SoftwarePage() {
  const initialData = await getInitialData();
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-8">
      <SoftwareClient platform="" initialData={initialData} />
      <Disclaimer type="software" />
      <AuthorReviewerBlock category="software" />
      <EditorialSection article={softwareArticle} />
    </div>
  );
}
