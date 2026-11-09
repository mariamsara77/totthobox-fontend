import type { Metadata } from "next";
import { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordForm";

export const metadata: Metadata = {
  title: "নতুন পাসওয়ার্ড নির্ধারণ করুন | Totthobox",
  description: "আপনার Totthobox অ্যাকাউন্টের জন্য নতুন শক্তিশালী পাসওয়ার্ড সেট করুন।",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "নতুন পাসওয়ার্ড নির্ধারণ করুন | Totthobox",
    description: "আপনার Totthobox অ্যাকাউন্টের জন্য নতুন শক্তিশালী পাসওয়ার্ড সেট করুন।",
    type: "website",
  },
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center py-10 opacity-50">লোড হচ্ছে...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
