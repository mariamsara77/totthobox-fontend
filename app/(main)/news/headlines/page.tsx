import type { Metadata } from "next";
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
  return <NewsHeadlines />;
}
