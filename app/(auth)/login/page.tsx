import { Metadata } from "next";
import { Suspense } from "react";
import LoginContent from "./LoginContent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "লগইন | আপনার অ্যাকাউন্টে প্রবেশ করুন",
  description: "আপনার অ্যাকাউন্টে প্রবেশ করতে ইউজারনেম/ইমেইল এবং পাসওয়ার্ড দিয়ে লগইন করুন।",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "লগইন | আপনার অ্যাকাউন্টে প্রবেশ করুন",
    description: "আপনার অ্যাকাউন্টে প্রবেশ করতে ইউজারনেম/ইমেইল এবং পাসওয়ার্ড দিয়ে লগইন করুন।",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Totthobox" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "লগইন | আপনার অ্যাকাউন্টে প্রবেশ করুন",
    description: "আপনার অ্যাকাউন্টে প্রবেশ করতে ইউজারনেম/ইমেইল এবং পাসওয়ার্ড দিয়ে লগইন করুন।",
    images: ["/opengraph-image"],
  },
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-10">লোডিং...</div>}>
      <LoginContent />
    </Suspense>
  );
}