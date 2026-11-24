import type { Metadata } from "next";
import MediaConverter from "@/components/converter/MediaConverter";
import ToolGuide from "@/components/ToolGuide";
import { mediaConverterGuide } from "@/lib/content/converters/media";

export const revalidate = 86400;

export const metadata: Metadata = {
  alternates: { canonical: "https://totthobox.com/converter/media" },
  title: "অনলাইন মিডিয়া কনভার্টার - MP4, MP3, WAV, WebM, AAC | Totthobox",
  description:
    "ব্রাউজারে নিরাপদে অডিও ও ভিডিও কনভার্ট করুন। MP4, WebM, MP3, WAV ও AAC ফরম্যাট সমর্থন। ১০০% প্রাইভেট ভিডিও থেকে অডিও এক্সট্র্যাক্ট গাইড।",
  openGraph: {
    title: "অনলাইন মিডিয়া কনভার্টার - MP4, MP3, WAV, WebM | Totthobox",
    description: "ব্রাউজারে নিরাপদে অডিও ও ভিডিও রূপান্তর এবং এক্সট্র্যাক্ট করার সর্বাধুনিক ফ্রি টুল।",
    url: "https://totthobox.com/converter/media",
    siteName: "Totthobox",
    type: "website",
    locale: "bn_BD",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox Media Converter" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "অনলাইন মিডিয়া কনভার্টার - MP4, MP3, WebM | Totthobox",
    description: "ব্রাউজারে নিরাপদে অডিও ও ভিডিও রূপান্তর করার ফ্রি টুল।",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }],
  },
};

export default function MediaConverterPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-12">
      <div className="max-w-2xl mx-auto">
        <MediaConverter />
      </div>
      <ToolGuide guide={mediaConverterGuide} />
    </div>
  );
}
