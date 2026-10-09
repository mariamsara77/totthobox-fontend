import type { Metadata } from "next";
import PeopleClient from "./PeopleClient";


const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

async function getInitialData() {
  const response = await fetch(
    `${API_BASE}/api/people?page=1&per_page=10`,
    { next: { revalidate: 3600, tags: ["people-list"] } },
  );
  if (!response.ok) throw new Error("Failed to load initial people data");
  return response.json();
}

export const metadata: Metadata = {
  title: "প্রোফাইল আর্কাইভ: বিশিষ্ট ব্যক্তিবর্গের জীবনী ও কর্মজীবন | তথ্যবক্স",
  description:
    "বাংলাদেশের গুরুত্বপূর্ণ ব্যক্তিবর্গ, রাজনীতিবিদ, পেশাজীবী ও বিখ্যাত ব্যক্তিদের জীবনবৃত্তান্ত, বর্তমান পদবী এবং কর্মজীবনের বিস্তারিত ইতিহাস।",
  alternates: {
    canonical: "https://totthobox.com/bangladesh/public-figure",
  },
  openGraph: {
    title:
      "প্রোফাইল আর্কাইভ: বিশিষ্ট ব্যক্তিবর্গের জীবনী ও কর্মজীবন | তথ্যবক্স",
    description:
      "বাংলাদেশের গুরুত্বপূর্ণ ব্যক্তিবর্গ, রাজনীতিবিদ এবং পেশাজীবীদের জীবনবৃত্তান্ত ও কর্মজীবনের বিস্তারিত ইতিহাস।",
    url: "https://totthobox.com/bangladesh/public-figure",
    siteName: "Totthobox",
    type: "website",
    locale: "bn_BD",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "প্রোফাইল আর্কাইভ: বিশিষ্ট ব্যক্তিবর্গের জীবনী ও কর্মজীবন | তথ্যবক্স",
    description:
      "বাংলাদেশের গুরুত্বপূর্ণ ব্যক্তিবর্গ, রাজনীতিবিদ এবং পেশাজীবীদের জীবনবৃত্তান্ত ও কর্মজীবনের বিস্তারিত ইতিহাস।",
  },
};

export default async function PublicFigurePage() {
  const initialData = await getInitialData();
  return <PeopleClient initialData={initialData} />;
}
