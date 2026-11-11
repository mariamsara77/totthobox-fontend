import type { Metadata } from "next";
import ImageConverter from "@/components/tools/AdvancedImageConverter";
import ToolGuide from "@/components/ToolGuide";
import { imageConverterGuide } from "@/lib/content/converters/image";

export const revalidate = 86400;

export const metadata: Metadata = {
  alternates: { canonical: "https://totthobox.com/converter/image" },
  title: "অনলাইন ইমেজ কনভার্টার - JPG, PNG, WebP, SVG, AVIF, ICO | Totthobox",
  description:
    "ব্রাউজারে দ্রুত ও নিরাপদে ছবি কনভার্ট করুন। JPG, PNG, WebP, GIF, SVG, AVIF ও ICO ফরম্যাট সমর্থন। ১০০% ফ্রি ও প্রাইভেট ইমেজ কনভার্সন গাইড।",
  openGraph: {
    title: "অনলাইন ইমেজ কনভার্টার - JPG, PNG, WebP, SVG, AVIF | Totthobox",
    description: "ব্রাউজারে নিরাপদে ছবি রূপান্তর, ক্রপ ও কালার অ্যাডজাস্টমেন্ট করার ফ্রি টুল।",
    url: "https://totthobox.com/converter/image",
    type: "website",
    siteName: "Totthobox",
    locale: "bn_BD",
    images: [
      {
        url: "https://totthobox.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Totthobox Image Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "অনলাইন ইমেজ কনভার্টার - JPG, PNG, WebP | Totthobox",
    description: "ব্রাউজারে নিরাপদে ছবি রূপান্তর ও অপ্টিমাইজেশন করুন।",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }],
  },
};

export default function ImageConverterPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-12">
      <div className="max-w-3xl mx-auto">
        <ImageConverter />
      </div>
      <ToolGuide guide={imageConverterGuide} />
    </div>
  );
}
