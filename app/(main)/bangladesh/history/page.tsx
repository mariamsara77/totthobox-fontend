import type { Metadata } from "next";
import HistoryClient from "./HistoryClient";


const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

async function getInitialData() {
  const response = await fetch(
    `${API_BASE}/api/history-bd?page=1&per_page=10`,
    { next: { revalidate: 3600, tags: ["history-bd-list"] } },
  );
  if (!response.ok) throw new Error("Failed to load initial history-bd data");
  return response.json();
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
  },
};

export default async function HistoryPage() {
  const initialData = await getInitialData();
  return <HistoryClient initialData={initialData} />;
}
