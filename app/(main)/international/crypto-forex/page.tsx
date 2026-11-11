import type { Metadata } from "next";
import CryptoForexClient from "./CryptoForexClient";
import ToolStructuredData from "@/components/seo/ToolStructuredData";
import EditorialSection from "@/components/EditorialSection";
import { internationalCryptoForexArticle } from "@/lib/content/sections/international-crypto-forex";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "লাইভ ক্রিপ্টো ও ফরেক্স রেট কনভার্টার | Live Crypto & Forex Converter",
  description:
    "বিটকয়েন, ইথেরিয়াম, ইউএসডিটিসহ শীর্ষ ক্রিপ্টোকারেন্সির লাইভ দাম এবং ডলার, ইউরো, টাকার রিয়েল-টাইম এক্সচেঞ্জ রেট রূপান্তর করুন সহজে।",
  alternates: { canonical: "https://totthobox.com/international/crypto-forex" },
  openGraph: {
    title: "লাইভ ক্রিপ্টো ও ফরেক্স রেট কনভার্টার | Totthobox",
    description: "বিটকয়েন, ইথেরিয়াম ও আন্তর্জাতিক মুদ্রার রিয়েল-টাইম লাইভ রূপান্তর এবং এক্সচেঞ্জ রেট।",
    type: "website",
    url: "https://totthobox.com/international/crypto-forex",
    siteName: "Totthobox",
    locale: "bn_BD",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox Crypto Forex" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "লাইভ ক্রিপ্টো ও ফরেক্স রেট কনভার্টার | Totthobox",
    description: "রিয়েল-টাইম ক্রিপ্টো ও ফরেক্স এক্সচেঞ্জ রেট ক্যালকুলেটর।",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }],
  },
};

export default function CryptoForexPage() {
  return (
    <>
      <ToolStructuredData
        name="লাইভ ক্রিপ্টো ও ফরেক্স এক্সচেঞ্জ রেট কনভার্টার"
        description="বিটকয়েন, ইথেরিয়াম, ইউএসডিটি সহ শীর্ষ ক্রিপ্টোকারেন্সির লাইভ দাম এবং বিডিটি, ইউএসডি, ইউরো মুদ্রার রিয়েল-টাইম রূপান্তর।"
        url="https://totthobox.com/international/crypto-forex"
        applicationCategory="FinanceApplication"
        featureList={[
          "বিটকয়েন ও শীর্ষ ক্রিপ্টোর লাইভ মূল্য",
          "ডলার, ইউরো ও রিয়াল সহ আন্তর্জাতিক ফরেক্স রেট",
          "তাত্ক্ষণিক ক্রিপ্টো-টু-ফিয়াট রূপান্তর ক্যালকুলেটর",
          "২৪ ঘণ্টার মূল্য পরিবর্তন নির্দেশক",
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-8">
        <div className="max-w-2xl mx-auto">
          <CryptoForexClient />
        </div>
        <EditorialSection article={internationalCryptoForexArticle} />
      </div>
    </>
  );
}
