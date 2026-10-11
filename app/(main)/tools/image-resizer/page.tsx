import type { Metadata } from "next";
import ImageResizer from "@/components/tools/ImageResizer";

export const metadata: Metadata = {
  title: "ছবি রিসাইজ, ক্রপ ও সাইজ কমানোর অনলাইন টুল | Image Resizer",
  description:
    "যেকোনো ফর্ম, সিভি, ভিসা বা ভার্সিটি অ্যাডমিশনের জন্য ছবির রেজুলেশন (Pixel) ও সাইজ (KB) সহজেই ঠিক করুন। ছবি রিসাইজ, ক্রপ এবং কম্প্রেস করে JPG/PNG/WebP ফরম্যাটে ফ্রিতে ডাউনলোড করুন।",
  alternates: {
    canonical: "https://totthobox.com/tools/image-resizer",
  },
  openGraph: {
    title:
      "ছবি রিসাইজ, ক্রপ ও সাইজ কমানোর অনলাইন টুল | Image Resizer",
    description:
      "যেকোনো ফর্ম, সিভি, ভিসা বা ভার্সিটি অ্যাডমিশনের জন্য ছবির রেজুলেশন (Pixel) ও সাইজ (KB) সহজেই ঠিক করুন।",
    type: "website",
    locale: "bn_BD",
    siteName: "Totthobox",
    url: "https://totthobox.com/tools/image-resizer",
  
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox" }],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "ছবি রিসাইজ, ক্রপ ও সাইজ কমানোর অনলাইন টুল | Image Resizer",
    description:
      "যেকোনো ফর্ম, সিভি, ভিসা বা ভার্সিটি অ্যাডমিশনের জন্য ছবির রেজুলেশন (Pixel) ও সাইজ (KB) সহজেই ঠিক করুন।",
  
    images: ["https://totthobox.com/og-image.png"],
  },
};

export default function ImageResizerPage() {
  return (
    <div className="tb-page-container tb-section mx-auto max-w-2xl">
      <ImageResizer />
    </div>
  );
}
