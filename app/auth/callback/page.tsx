"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

// ১. মূল লজিকটি একটি আলাদা কম্পোনেন্টে নিয়ে আসুন
function CallbackHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    // আপনার লগইন বা টোকেন হ্যান্ডেল করার বাকি লজিক...
    console.log("Token:", token);
  }, [searchParams]);

  return <div>লগইন ভেরিফাই করা হচ্ছে...</div>;
}

// ২. মূল ডিফল্ট পেজ কম্পোনেন্টে <Suspense> দিয়ে র‍্যাপ করুন
export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div>লোডিং...</div>}>
      <CallbackHandler />
    </Suspense>
  );
}
