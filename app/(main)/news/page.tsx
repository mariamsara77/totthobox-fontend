import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "খবর ও সংবাদ শিরোনাম | Totthobox",
  description: "জাতীয়, আন্তর্জাতিক ও গুরুত্বপূর্ণ ব্রেকিং নিউজ এবং সংবাদ শিরোনাম এক জায়গায়।",
  alternates: { canonical: "https://totthobox.com/news/headlines" },
};

export default function NewsRedirect() {
  redirect("/news/headlines");
}
