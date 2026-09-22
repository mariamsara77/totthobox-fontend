import type { Metadata } from 'next';
import HolidaysClient from './HolidaysClient';


const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

async function getInitialData() {
  const response = await fetch(
    `${API_BASE}/api/holidays?page=1&per_page=15`,
    { next: { revalidate: 3600, tags: ["holidays-list"] } },
  );
  if (!response.ok) throw new Error("Failed to load initial holidays data");
  return response.json();
}

export const metadata: Metadata = {
  alternates: { canonical: "https://totthobox.com/bangla/holiday" },
  openGraph: { title: "ছুটির ক্যালেন্ডার | সরকারি ও ঐচ্ছিক ছুটির তালিকা", description: "বাংলাদেশের সরকারি, ঐচ্ছিক ও ধর্মীয় ছুটির সম্পূর্ণ তালিকা। বছর, ধরন ও তারিখ অনুযায়ী খুঁজুন।", url: "https://totthobox.com/bangla/holiday", siteName: "Totthobox", type: "website", locale: "bn_BD" },
  twitter: { card: "summary_large_image", title: "ছুটির ক্যালেন্ডার | Totthobox", description: "বাংলাদেশের সরকারি, ঐচ্ছিক ও ধর্মীয় ছুটির সম্পূর্ণ তালিকা।" },
  title: 'ছুটির ক্যালেন্ডার | সরকারি ও ঐচ্ছিক ছুটির তালিকা',
  description: 'বাংলাদেশের সরকারি, ঐচ্ছিক ও ধর্মীয় ছুটির সম্পূর্ণ তালিকা। বছর, ধরন ও তারিখ অনুযায়ী খুঁজুন।',
  keywords: 'ছুটির তালিকা, সরকারি ছুটি, বাংলাদেশ ক্যালেন্ডার, ঐচ্ছিক ছুটি',
};

export default async function HolidaysPage() {
  const initialData = await getInitialData();
  return <HolidaysClient initialData={initialData} />;
}