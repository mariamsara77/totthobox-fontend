import type { Metadata } from "next";
import HistoryClient from "./HistoryClient";
import EditorialSection from "@/components/EditorialSection";
import { bangladeshHistoryArticle } from "@/lib/content/sections/bangladesh-history";

export const revalidate = 1800;

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

async function getInitialData() {
  try {
    const response = await fetch(
      `${API_BASE}/api/history-bd?page=1&per_page=10`,
      { next: { revalidate: 1800, tags: ["history-bd-list"] } },
    );
    if (!response.ok) return null;
    return response.json();
  } catch (e) {
    console.error("[history] Failed to load initial data:", e);
    return null;
  }
}

export const metadata: Metadata = {
  title: "বাংলাদেশের ইতিহাস - প্রাচীনকাল থেকে বর্তমান | তথ্যবক্স",
  description:
    "প্রাচীনকাল, মধ্যযুগ ও মুক্তিযুদ্ধের গৌরবময় ইতিহাসসহ বাংলাদেশের ৬৪ জেলার ঐতিহাসিক স্থান, প্রত্নতাত্ত্বিক নিদর্শন ও ঐতিহ্যের সম্পূর্ণ বিবরণ।",
  alternates: {
    canonical: "https://totthobox.com/bangladesh/history",
  },
  openGraph: {
    title: "বাংলাদেশের ইতিহাস - প্রাচীনকাল থেকে বর্তমান | তথ্যবক্স",
    description:
      "প্রাচীনকাল, মধ্যযুগ ও মুক্তিযুদ্ধের গৌরবময় ইতিহাসসহ বাংলাদেশের ৬৪ জেলার ঐতিহাসিক স্থান ও প্রত্নতাত্ত্বিক নিদর্শনের বিবরণ।",
    url: "https://totthobox.com/bangladesh/history",
    siteName: "Totthobox",
    type: "website",
    locale: "bn_BD",
    images: [{ url: "https://totthobox.com/og-image.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "বাংলাদেশের ইতিহাস - প্রাচীনকাল থেকে বর্তমান | তথ্যবক্স",
    description:
      "প্রাচীনকাল, মধ্যযুগ ও মুক্তিযুদ্ধের গৌরবময় ইতিহাসসহ বাংলাদেশের ৬৪ জেলার ঐতিহাসিক স্থান ও প্রত্নতাত্ত্বিক নিদর্শনের বিবরণ।",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }],
  },
};

// TODO(owner): add verified author/reviewer details and page-specific source citations when supplied.
export default HistoryPage() {
  const initialData = await getInitialData();
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-8">
      <HistoryClient initialData={initialData} />
      <EditorialSection article={bangladeshHistoryArticle} />
    </div>
  );
}
