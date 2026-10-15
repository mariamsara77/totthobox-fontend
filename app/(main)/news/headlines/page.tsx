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
    siteName: "Totthobox",
    type: "website",
    locale: "bn_BD",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "সংবাদ শিরোনাম | Totthobox",
    description: "বিভিন্ন সংবাদমাধ্যমের সর্বশেষ শিরোনাম এক জায়গায়।",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }],
  },
};

export default function NewsHeadlinesPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-2xl animate-pulse px-4 py-6 sm:px-6"><div className="mb-6 h-32 rounded-2xl bg-zinc-400/10" /><div className="h-10 rounded-xl bg-zinc-400/10" /></div>}>
      <NewsHeadlines />
    </Suspense>
  );
}
