"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

// ✅ Separate handler component
function CallbackHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      // এখানে আপনার লগইন বা টোকেন হ্যান্ডেল করার লজিক বসান
    }
  }, [searchParams]);

  return <div>লগইন ভেরিফাই করা হচ্ছে...</div>;
}

// ✅ Main page component with Suspense
export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div>লোডিং...</div>}>
      <CallbackHandler />
    </Suspense>
  );
}

// ✅ Prevent Next.js from prerendering this page at build time
export const dynamic = "force-dynamic";
