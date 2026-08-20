import { Metadata } from "next";
import ImageResizer from "@/components/tools/ImageResizer";

export const metadata: Metadata = {
  title: "ছবি রিসাইজ, ক্রপ ও সাইজ কমানোর অনলাইন টুল | Image Resizer | Totthobox",
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
    "Totthobox",
  ],
  openGraph: {
    title: "ছবি রিসাইজ, ক্রপ ও সাইজ কমানোর অনলাইন টুল | Image Resizer | Totthobox",
    description:
      "যেকোনো ফর্ম, সিভি, ভিসা বা ভার্সিটি অ্যাডমিশনের জন্য ছবির রেজুলেশন (Pixel) ও সাইজ (KB) সহজেই ঠিক করুন। ছবি রিসাইজ, ক্রপ এবং কম্প্রেস করে JPG/PNG/WebP ফরম্যাটে ফ্রিতে ডাউনলোড করুন।",
    type: "website",
    locale: "bn_BD",
    siteName: "Totthobox",
  },
};

export default function ImageResizerPage() {
  return (
    <div className="mx-auto max-w-2xl p-4">
      <ImageResizer />
    </div>
  );
}