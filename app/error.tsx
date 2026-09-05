"use client";

import { useEffect } from "react";
import ErrorPage from "@/components/ErrorPage";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // এখানে Sentry / LogRocket ইত্যাদি কানেক্ট করতে পারেন
    console.error(error);
  }, [error]);

  // এরর মেসেজ অনুযায়ী ডাইনামিক টাইটেল/ডিসক্রিপশন
  const isNetworkError =
    error.message?.toLowerCase().includes("fetch") ||
    error.message?.toLowerCase().includes("network");

  const title = isNetworkError ? "নেটওয়ার্ক সমস্যা" : "কিছু একটা ভুল হয়েছে";

  const description = isNetworkError
    ? "ইন্টারনেট কানেকশন চেক করে আবার চেষ্টা করুন।"
    : "সার্ভারে অপ্রত্যাশিত সমস্যা হয়েছে। একটু পরে আবার চেষ্টা করুন।";

  return (
    <ErrorPage
      code="৫০০"
      title={title}
      description={description}
      showRetry
      onRetry={reset}
      digest={error.digest}
    />
  );
}
