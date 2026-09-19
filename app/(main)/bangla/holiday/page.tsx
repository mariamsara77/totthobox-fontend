import { Metadata } from 'next';
import HolidaysClient from './HolidaysClient';

export const metadata: Metadata = {
  alternates: { canonical: "https://totthobox.com/bangla/holiday" },
  openGraph: { title: "ছুটির ক্যালেন্ডার | সরকারি ও ঐচ্ছিক ছুটির তালিকা", description: "বাংলাদেশের সরকারি, ঐচ্ছিক ও ধর্মীয় ছুটির সম্পূর্ণ তালিকা। বছর, ধরন ও তারিখ অনুযায়ী খুঁজুন।", url: "https://totthobox.com/bangla/holiday", siteName: "Totthobox", type: "website", locale: "bn_BD" },
  twitter: { card: "summary_large_image", title: "ছুটির ক্যালেন্ডার | Totthobox", description: "বাংলাদেশের সরকারি, ঐচ্ছিক ও ধর্মীয় ছুটির সম্পূর্ণ তালিকা।" },
  title: 'ছুটির ক্যালেন্ডার | সরকারি ও ঐচ্ছিক ছুটির তালিকা',
  description: 'বাংলাদেশের সরকারি, ঐচ্ছিক ও ধর্মীয় ছুটির সম্পূর্ণ তালিকা। বছর, ধরন ও তারিখ অনুযায়ী খুঁজুন।',
  keywords: 'ছুটির তালিকা, সরকারি ছুটি, বাংলাদেশ ক্যালেন্ডার, ঐচ্ছিক ছুটি',
};

export default function HolidaysPage() {
  return <HolidaysClient />;
}