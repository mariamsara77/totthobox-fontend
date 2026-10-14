import type { Metadata } from "next";
import { Suspense } from "react";
import NewsHeadlines from "@/components/news/NewsHeadlines";

export const metadata: Metadata = {
  title: "সংবাদ শিরোনাম",
  description: "বাংলা ও ইংরেজি সংবাদমাধ্যমের সর্বশেষ শিরোনাম এক জায়গায় দেখুন।",
  alternates: { canonical: "/news/headlines" },
  openGraph: {
    title: "সংবাদ শিরোনাম | Totthobox",
    description: "বিভিন্ন সংবাদমাধ্যমের সর্বশেষ শিরোনাম এক জায়গায়।",
    url: "https://totthobox.com/news/headlines",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "সংবাদ শিরোনাম | Totthobox",
    description: "বিভিন্ন সংবাদমাধ্যমের সর্বশেষ শিরোনাম এক জায়গায়।",
  },
};

export default function NewsHeadlinesPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl animate-pulse px-4 py-10"><div className="mb-6 h-32 rounded-2xl bg-zinc-400/10" /><div className="h-10 rounded-xl bg-zinc-400/10" /></div>}>
      <NewsHeadlines />
    </Suspense>
  );
}
