import type { Metadata } from "next";
import { Suspense } from "react";
import SoftwareClient from "./SoftwareClient";

export const metadata: Metadata = {
  title: "Software & Apps Directory | তথ্যবক্স",
  description:
    "Windows, Android এবং Mac-এর সফটওয়্যার ও অ্যাপ সম্পর্কে তথ্য, ফিচার, সিস্টেম রিকোয়ারমেন্ট এবং অফিসিয়াল সোর্স খুঁজে দেখুন।",
  alternates: {
    canonical: "https://totthobox.com/software/all",
  },
  openGraph: {
    title: "Software & Apps Directory | তথ্যবক্স",
    description:
      "Windows, Android এবং Mac-এর সফটওয়্যার ও অ্যাপ সম্পর্কে তথ্য, ফিচার, সিস্টেম রিকোয়ারমেন্ট এবং অফিসিয়াল সোর্স খুঁজে দেখুন।",
    type: "website",
    locale: "bn_BD",
    siteName: "তথ্যবক্স",
  },
  twitter: {
    card: "summary_large_image",
    title: "Software & Apps Directory | তথ্যবক্স",
    description:
      "Windows, Android এবং Mac-এর সফটওয়্যার ও অ্যাপ সম্পর্কে তথ্য, ফিচার, সিস্টেম রিকোয়ারমেন্ট এবং অফিসিয়াল সোর্স খুঁজে দেখুন।",
  },
};

export default function SoftwarePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-2xl mx-auto p-4 sm:p-6 text-center">
          লোড হচ্ছে...
        </div>
      }
    >
      <SoftwareClient platform="" />
    </Suspense>
  );
}
