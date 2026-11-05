import type { Metadata } from "next";
import WorldClockClient from "./WorldClockClient";
import ToolStructuredData from "@/components/seo/ToolStructuredData";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "বিশ্ব ঘড়ি ও আন্তর্জাতিক টাইমজোন কনভার্টার | World Clock & Timezone",
  description:
    "বিশ্বের প্রধান শহরগুলোর রিয়েল-টাইম লাইভ সময়, দিন-রাত্রির স্ট্যাটাস এবং যেকোনো দেশের সাথে স্থানীয় সময়ের পার্থক্য সহজে রূপান্তর করুন।",
  keywords: [
    "world clock",
    "বিশ্ব ঘড়ি",
    "timezone converter",
    "বাংলাদেশ সময়",
    "dhaka time now",
    "লাইভ সময় রূপান্তর",
    "international time check",
  ],
  alternates: { canonical: "https://totthobox.com/international/world-clock" },
  openGraph: {
    title: "বিশ্ব ঘড়ি ও টাইমজোন কনভার্টার | Totthobox",
    description: "বিশ্বের প্রধান শহরগুলোর লাইভ সময় ও আন্তর্জাতিক টাইমজোন কনভার্সন টুল।",
    type: "website",
    url: "https://totthobox.com/international/world-clock",
    siteName: "Totthobox",
    locale: "bn_BD",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox World Clock" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "বিশ্ব ঘড়ি ও টাইমজোন কনভার্টার | Totthobox",
    description: "বিশ্বের প্রধান শহরগুলোর লাইভ সময় ও টাইমজোন রূপান্তর।",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }],
  },
};

export default function WorldClockPage() {
  return (
    <>
      <ToolStructuredData
        name="বিশ্ব ঘড়ি ও টাইমজোন কনভার্টার"
        description="বিশ্বের প্রধান শহরগুলোর রিয়েল-টাইম লাইভ সময়, দিন-রাত্রির স্ট্যাটাস এবং আন্তর্জাতিক টাইমজোন রূপান্তর করুন সহজে।"
        url="https://totthobox.com/international/world-clock"
        applicationCategory="UtilityApplication"
        featureList={[
          "লাইভ ডিজিটাল বিশ্ব ঘড়ি",
          "আন্তর্জাতিক টাইমজোন তুলনা ও রূপান্তর",
          "দিন ও রাত্রির স্বয়ংক্রিয় স্ট্যাটাস",
          "সরাসরি ফলাফল কপি করার সুবিধা",
        ]}
      />
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
        <WorldClockClient />
      </div>
    </>
  );
}
