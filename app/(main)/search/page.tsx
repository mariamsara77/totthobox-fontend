import type { Metadata } from "next";
import { Suspense } from "react";
import SearchPageClient from "./SearchPageClient";

export const metadata: Metadata = {
  title: "অনুসন্ধান | Totthobox",
  description:
    "Totthobox প্ল্যাটফর্মের সকল তথ্য, অনলাইন টুলস, কনভার্টার ও সেবা সহজে অনুসন্ধান করুন।",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "https://totthobox.com/search",
  },
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-4xl px-4 py-12 text-center text-sm text-zinc-500">
          অনুসন্ধান ইঞ্জিন লোড হচ্ছে...
        </div>
      }
    >
      <SearchPageClient />
    </Suspense>
  );
}
