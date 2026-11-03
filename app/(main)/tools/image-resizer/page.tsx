import type { Metadata } from "next";
import ImageResizer from "@/components/tools/ImageResizer";
import ToolStructuredData from "@/components/seo/ToolStructuredData";

export const metadata: Metadata = {
  title: "ছবি রিসাইজ, ক্রপ ও সাইজ কমানোর অনলাইন টুল | Image Resizer | তথ্যবক্স",
  description:
    "যেকোনো ফর্ম, সিভি, ভিসা বা ভার্সিটি অ্যাডমিশনের জন্য ছবির রেজুলেশন (Pixel) ও সাইজ (KB) সহজেই ঠিক করুন। ছবি রিসাইজ, ক্রপ এবং কম্প্রেস করে JPG/PNG/WebP ফরম্যাটে ফ্রিতে ডাউনলোড করুন।",
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
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox" }],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "ছবি রিসাইজ, ক্রপ ও সাইজ কমানোর অনলাইন টুল | Image Resizer | তথ্যবক্স",
    description:
      "যেকোনো ফর্ম, সিভি, ভিসা বা ভার্সিটি অ্যাডমিশনের জন্য ছবির রেজুলেশন (Pixel) ও সাইজ (KB) সহজেই ঠিক করুন।",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }],
  },
};

export default function ImageResizerPage() {
  return (
    <>
      <ToolStructuredData
        name="অনলাইন ইমেজ স্টুডিও ও রিসাইজার"
        description="চাকরি, ভিসা, ও শিক্ষা প্রতিষ্ঠানের আবেদনের জন্য ছবি নির্দিষ্ট পিক্সেল ও কেবি মাপে ক্রপ ও রিসাইজ করার টুল।"
        url="https://totthobox.com/tools/image-resizer"
        applicationCategory="DesignApplication"
        featureList={[
          "ছবি ক্রপ, রোটেট ও ফ্লিপ করার সুবিধা",
          "পিক্সেল বা পার্সেন্টেজ অনুযায়ী রিসাইজ",
          "কেবি সাইজ অপটিমাইজেশন ও কোয়ালিটি কন্ট্রোল",
          "WebP, JPG ও PNG ফরম্যাটে তাৎক্ষণিক ডাউনলোড",
        ]}
      />
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
        <ImageResizer />
      </div>
    </>
  );
}
