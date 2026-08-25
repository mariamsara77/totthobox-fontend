import { Metadata } from "next";
import { Suspense } from "react";
import RegisterContent from "./RegisterContent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "রেজিস্ট্রেশন | অ্যাকাউন্ট তৈরি করুন",
  description: "নতুন অ্যাকাউন্ট তৈরি করতে আপনার তথ্য দিয়ে রেজিস্ট্রেশন সম্পন্ন করুন।",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "রেজিস্ট্রেশন | অ্যাকাউন্ট তৈরি করুন",
    description: "নতুন অ্যাকাউন্ট তৈরি করতে আপনার তথ্য দিয়ে রেজিস্ট্রেশন সম্পন্ন করুন।",
    type: "website",
  },
};

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="text-center py-10">লোডিং...</div>}>
      <RegisterContent />
    </Suspense>
  );
}