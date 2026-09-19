import { Metadata } from "next";
import ImageResizer from "@/components/tools/ImageResizer";

export const metadata: Metadata = {
  title: "ছবি রিসাইজ, ক্রপ ও সাইজ কমানোর অনলাইন টুল | Image Resizer | তথ্যবক্স",
  description:
    "যেকোনো ফর্ম, সিভি, ভিসা বা ভার্সিটি অ্যাডমিশনের জন্য ছবির রেজুলেশন (Pixel) ও সাইজ (KB) সহজেই ঠিক করুন। ছবি রিসাইজ, ক্রপ এবং কম্প্রেস করে JPG/PNG/WebP ফরম্যাটে ফ্রিতে ডাউনলোড করুন।",
  keywords: [
    "image resizer",
    "photo crop online",
    "compress image kb",
    "300x300 photo maker",
    "signature resizer",
    "visa photo resize",
    "reduce picture size",
    "ছবির সাইজ কমানো",
    "ছবি রিসাইজ",
    "পাসপোর্ট সাইজ ছবি",
    "cv photo maker",
    "image format converter",
    "তথ্যবক্স",
  ],
  alternates: {
    canonical: "https://totthobox.com/tools/image-resizer",
  },
  openGraph: {
    title:
      "ছবি রিসাইজ, ক্রপ ও সাইজ কমানোর অনলাইন টুল | Image Resizer | তথ্যবক্স",
    description:
      "যেকোনো ফর্ম, সিভি, ভিসা বা ভার্সিটি অ্যাডমিশনের জন্য ছবির রেজুলেশন (Pixel) ও সাইজ (KB) সহজেই ঠিক করুন।",
    type: "website",
    locale: "bn_BD",
    siteName: "Totthobox",
    url: "https://totthobox.com/tools/image-resizer",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "ছবি রিসাইজ, ক্রপ ও সাইজ কমানোর অনলাইন টুল | Image Resizer | তথ্যবক্স",
    description:
      "যেকোনো ফর্ম, সিভি, ভিসা বা ভার্সিটি অ্যাডমিশনের জন্য ছবির রেজুলেশন (Pixel) ও সাইজ (KB) সহজেই ঠিক করুন।",
  },
};

export default function ImageResizerPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
      <ImageResizer />
    </div>
  );
}
