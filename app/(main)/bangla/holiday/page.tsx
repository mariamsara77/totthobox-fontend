import { Metadata } from 'next';
import HolidaysClient from './HolidaysClient';

export const metadata: Metadata = {
  title: 'ছুটির ক্যালেন্ডার | সরকারি ও ঐচ্ছিক ছুটির তালিকা',
  description: 'বাংলাদেশের সরকারি, ঐচ্ছিক ও ধর্মীয় ছুটির সম্পূর্ণ তালিকা। বছর, ধরন ও তারিখ অনুযায়ী খুঁজুন।',
  keywords: 'ছুটির তালিকা, সরকারি ছুটি, বাংলাদেশ ক্যালেন্ডার, ঐচ্ছিক ছুটি',
};

export default function HolidaysPage() {
  return <HolidaysClient />;
}