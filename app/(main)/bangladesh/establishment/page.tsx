import type { Metadata } from "next";
import EstablishmentClient from "./EstablishmentClient";
import EditorialSection from "@/components/EditorialSection";
import { bangladeshEstablishmentArticle } from "@/lib/content/sections/bangladesh-establishment";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

async function getInitialData() {
  try {
    const response = await fetch(
      `${API_BASE}/api/establishment-bd?page=1&per_page=10`,
      { next: { revalidate: 1800, tags: ["establishment-bd-list"] } },
    );
    if (!response.ok) return null;
    return response.json();
  } catch (e) {
    console.error("[establishment] Failed to load initial data:", e);
    return null;
  }
}

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "বাংলাদেশের সকল গুরুত্বপূর্ণ স্থাপনা ও প্রতিষ্ঠান | তথ্যবক্স",
  description:
    "বাংলাদেশের ৬৪ জেলার সরকারি-বেসরকারি প্রতিষ্ঠান, ঐতিহাসিক ভবন, শিক্ষা প্রতিষ্ঠান, হাসপাতাল, অফিস ও প্রয়োজনীয় স্থাপনাসমূহের সম্পূর্ণ তালিকা ও বিস্তারিত গাইড।",
  alternates: {
    canonical: "https://totthobox.com/bangladesh/establishment",
  },
  openGraph: {
    title: "বাংলাদেশের সকল গুরুত্বপূর্ণ স্থাপনা ও প্রতিষ্ঠান | তথ্যবক্স",
    description:
      "বাংলাদেশের ৬৪ জেলার সরকারি-বেসরকারি প্রতিষ্ঠান, ঐতিহাসিক ভবন ও প্রয়োজনীয় স্থাপনাসমূহের সম্পূর্ণ তালিকা।",
    url: "https://totthobox.com/bangladesh/establishment",
    siteName: "Totthobox",
    type: "website",
    locale: "bn_BD",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "বাংলাদেশের সকল গুরুত্বপূর্ণ স্থাপনা ও প্রতিষ্ঠান | তথ্যবক্স",
    description:
      "বাংলাদেশের ৬৪ জেলার সরকারি-বেসরকারি প্রতিষ্ঠান, ঐতিহাসিক ভবন ও প্রয়োজনীয় স্থাপনাসমূহের সম্পূর্ণ তালিকা।",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }],
  },
};

export default async function EstablishmentPage() {
  const initialData = await getInitialData();
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-8">
      <EstablishmentClient initialData={initialData} />
      <EditorialSection article={bangladeshEstablishmentArticle} />
    </div>
  );
}
