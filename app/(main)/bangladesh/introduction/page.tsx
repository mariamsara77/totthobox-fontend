import type { Metadata } from "next";
import IntroductionClient from "./IntroductionClient";
import EditorialSection from "@/components/EditorialSection";
import { bangladeshIntroductionArticle } from "@/lib/content/sections/bangladesh-introduction";

export const revalidate = 1800;

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

async function getInitialData() {
  try {
    const response = await fetch(`${API_BASE}/api/intro-bd`, {
      next: { revalidate: 1800, tags: ["introduction-list"] },
    });
    if (!response.ok) return null;
    return response.json();
  } catch (e) {
    console.error("[introduction] Failed to load initial data:", e);
    return null;
  }
}

export const metadata: Metadata = {
  title: "বাংলাদেশের পরিচিতি | বিভাগ, জেলা ও সাধারণ তথ্য | তথ্যবক্স",
  description:
    "বাংলাদেশের সকল বিভাগ, জেলা, ভৌগোলিক অবস্থান, ইতিহাস, সংস্কৃতি ও গুরুত্বপূর্ণ তথ্যসহ সম্পূর্ণ পরিচিতি। সহজে সার্চ ও ক্যাটাগরি অনুসারে খুঁজুন।",
  alternates: {
    canonical: "https://totthobox.com/bangladesh/introduction",
  },
  openGraph: {
    title: "বাংলাদেশের পরিচিতি | বিভাগ, জেলা ও সাধারণ তথ্য | তথ্যবক্স",
    description:
      "বাংলাদেশের সকল বিভাগ, জেলা ও সাধারণ তথ্যসহ সম্পূর্ণ পরিচিতি পড়ুন।",
    url: "https://totthobox.com/bangladesh/introduction",
    siteName: "Totthobox",
    type: "website",
    locale: "bn_BD",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "বাংলাদেশের পরিচিতি | বিভাগ, জেলা ও সাধারণ তথ্য | তথ্যবক্স",
    description:
      "বাংলাদেশের সকল বিভাগ, জেলা ও সাধারণ তথ্যসহ সম্পূর্ণ পরিচিতি পড়ুন।",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }],
  },
};

export default async function IntroductionPage() {
  const initialData = await getInitialData();
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-8">
      <IntroductionClient initialData={initialData} />
      <EditorialSection article={bangladeshIntroductionArticle} />
    </div>
  );
}
