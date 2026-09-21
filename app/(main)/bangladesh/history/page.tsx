import type { Metadata } from "next";
import Link from "next/link";
import HistoryClient from "./HistoryClient";

export const metadata: Metadata = {
  title: "বাংলাদেশের ইতিহাস - প্রাচীনকাল থেকে বর্তমান | তথ্যবক্স",
  description:
    "প্রাচীনকাল, মধ্যযুগ ও মুক্তিযুদ্ধের গৌরবময় ইতিহাসসহ বাংলাদেশের ৬৪ জেলার ঐতিহাসিক স্থান, প্রত্নতাত্ত্বিক নিদর্শন ও ঐতিহ্যের সম্পূর্ণ বিবরণ।",
  alternates: {
    canonical: "https://totthobox.com/bangladesh/history",
  },
  openGraph: {
    title: "বাংলাদেশের ইতিহাস - প্রাচীনকাল থেকে বর্তমান | তথ্যবক্স",
    description:
      "প্রাচীনকাল, মধ্যযুগ ও মুক্তিযুদ্ধের গৌরবময় ইতিহাসসহ বাংলাদেশের ৬৪ জেলার ঐতিহাসিক স্থান ও প্রত্নতাত্ত্বিক নিদর্শনের বিবরণ।",
    url: "https://totthobox.com/bangladesh/history",
    siteName: "Totthobox",
    type: "website",
    locale: "bn_BD",
    images: [{ url: "https://totthobox.com/og-image.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "বাংলাদেশের ইতিহাস - প্রাচীনকাল থেকে বর্তমান | তথ্যবক্স",
    description:
      "প্রাচীনকাল, মধ্যযুগ ও মুক্তিযুদ্ধের গৌরবময় ইতিহাসসহ বাংলাদেশের ৬৪ জেলার ঐতিহাসিক স্থান ও প্রত্নতাত্ত্বিক নিদর্শনের বিবরণ।",
  },
};

export default function HistoryPage() {
  return (
    <>
      <HistoryClient />
      <section className="sr-only">
        <h2>বাংলাদেশের ইতিহাসের বিষয়ভিত্তিক নির্দেশিকা</h2>
        <p>
          তথ্যবক্সে বাংলাদেশের ইতিহাসের বিভিন্ন সময়কাল, ঐতিহাসিক স্থান,
          প্রত্নতাত্ত্বিক নিদর্শন এবং ঐতিহ্য সম্পর্কে তথ্য খুঁজে পাওয়া যায়।
          বিভাগ, জেলা, থানা ও যুগ অনুযায়ী তালিকা থেকে প্রয়োজনীয় বিষয় নির্বাচন
          করে বিস্তারিত পেজে যাওয়া যায়।
        </p>
        <nav aria-label="ইতিহাসের প্রধান বিভাগ">
          <Link href="/bangladesh/history">সব ঐতিহাসিক স্থান</Link>
          <Link href="/bangladesh/tourism">বাংলাদেশের পর্যটন</Link>
          <Link href="/bangladesh/introduction">বাংলাদেশ পরিচিতি</Link>
          <Link href="/bangladesh/establishment">বাংলাদেশ প্রতিষ্ঠার ইতিহাস</Link>
        </nav>
      </section>
    </>
  );
}
