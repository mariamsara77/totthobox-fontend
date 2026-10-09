import type { Metadata } from "next";
import TourismClient from "./TourismClient";

export const metadata: Metadata = {
  title: "বাংলাদেশের সকল পর্যটন কেন্দ্র ও ভ্রমণ গাইড | তথ্যবক্স",
  description:
    "বাংলাদেশের ৬৪ জেলার সেরা পর্যটন কেন্দ্র, ঐতিহাসিক স্থান, প্রাকৃতিক সৌন্দর্য ও ভ্রমণ গাইড। জেলা ও ধরন অনুসারে খুঁজুন।",
  alternates: {
    canonical: "https://totthobox.com/bangladesh/tourism",
  },
  openGraph: {
    title: "বাংলাদেশের সকল পর্যটন কেন্দ্র ও ভ্রমণ গাইড | তথ্যবক্স",
    description:
      "বাংলাদেশের ৬৪ জেলার সেরা পর্যটন কেন্দ্র, ঐতিহাসিক স্থান ও প্রাকৃতিক সৌন্দর্যের বিস্তারিত ভ্রমণ গাইড।",
    url: "https://totthobox.com/bangladesh/tourism",
    siteName: "Totthobox",
    type: "website",
    locale: "bn_BD",
  },
  twitter: {
    card: "summary_large_image",
    title: "বাংলাদেশের সকল পর্যটন কেন্দ্র ও ভ্রমণ গাইড | তথ্যবক্স",
    description:
      "বাংলাদেশের ৬৪ জেলার সেরা পর্যটন কেন্দ্র, ঐতিহাসিক স্থান ও প্রাকৃতিক সৌন্দর্যের বিস্তারিত ভ্রমণ গাইড।",
  },
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

type TourismItem = {
  id: number;
  title: string;
  slug: string;
  type_label?: string;
  description?: string;
  image_url?: string;
  thana?: string;
  district?: string;
};

type TourismPageResponse = {
  data: TourismItem[];
  meta?: {
    current_page?: number;
    per_page?: number;
    total?: number;
    last_page?: number;
    has_more?: boolean;
  };
};

async function getInitialTourism(): Promise<TourismPageResponse> {
  const params = new URLSearchParams({
    page: "1",
    per_page: "12",
  });

  const response = await fetch(
    API_BASE + "/api/tourism-bd?" + params.toString(),
    {
      next: {
        revalidate: 3600,
        tags: ["tourism-list"],
      },
    },
  );

  if (!response.ok) {
    return {
      data: [],
      meta: {
        current_page: 1,
        per_page: 12,
        total: 0,
        last_page: 1,
        has_more: false,
      },
    };
  }

  return response.json();
}

export default async function TourismPage() {
  const initialData = await getInitialTourism();

  return <TourismClient initialData={initialData} />;
}