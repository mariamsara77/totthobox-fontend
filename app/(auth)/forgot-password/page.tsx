import type { Metadata } from "next";
import { Suspense } from "react";
import ForgotPasswordContent from "./ForgotPasswordContent";

export const metadata: Metadata = {
  title: "পাসওয়ার্ড ভুলে গেছেন? | Totthobox",
  description: "আপনার অ্যাকাউন্টের পাসওয়ার্ড রিসেট করতে ইমেইল ঠিকানা দিন।",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "পাসওয়ার্ড ভুলে গেছেন? | Totthobox",
    description: "আপনার অ্যাকাউন্টের পাসওয়ার্ড রিসেট করতে ইমেইল ঠিকানা দিন।",
    type: "website",
  },
};

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center py-10 opacity-50">লোড হচ্ছে...</div>}>
      <ForgotPasswordContent />
    </Suspense>
  );
}
