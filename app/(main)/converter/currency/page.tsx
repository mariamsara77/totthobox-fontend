import type { Metadata } from "next";
import CurrencyConverter from "@/components/converter/CurrencyConverter";
import ToolStructuredData from "@/components/seo/ToolStructuredData";
import ToolGuide from "@/components/ToolGuide";
import { currencyConverterGuide } from "@/lib/content/converters/currency";

export const revalidate = 86400;

export const metadata: Metadata = {
  alternates: { canonical: "https://totthobox.com/converter/currency" },
  title: "লাইভ কারেন্সি কনভার্টার - টাকার সর্বশেষ রেট জানুন | Totthobox",
  description:
    "ডলার, ইউরো, রিয়ালসহ বিশ্বের যেকোনো দেশের মুদ্রাকে বাংলাদেশি টাকায় কনভার্ট করুন। Totthobox-এ পান রিয়েল-টাইম এক্সচেঞ্জ রেট এবং পূর্ণাঙ্গ কারেন্সি গাইড।",
  openGraph: {
    title: "লাইভ কারেন্সি কনভার্টার - টাকার সর্বশেষ রেট জানুন | Totthobox",
    description:
      "ডলার, ইউরো, রিয়ালসহ বিশ্বের যেকোনো দেশের মুদ্রাকে বাংলাদেশি টাকায় কনভার্ট করুন। Totthobox-এ পান রিয়েল-টাইম এক্সচেঞ্জ রেট এবং পূর্ণাঙ্গ কারেন্সি গাইড।",
    type: "website",
    locale: "bn_BD",
    siteName: "Totthobox",
    url: "https://totthobox.com/converter/currency",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "লাইভ কারেন্সি কনভার্টার - টাকার সর্বশেষ রেট জানুন | Totthobox",
    description:
      "ডলার, ইউরো, রিয়ালসহ বিশ্বের যেকোনো দেশের মুদ্রাকে বাংলাদেশি টাকায় কনভার্ট করুন। Totthobox-এ পান রিয়েল-টাইম এক্সচেঞ্জ রেট এবং পূর্ণাঙ্গ কারেন্সি গাইড।",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }],
  },
};

export default function CurrencyConverterPage() {
  return (
    <>
      <ToolStructuredData
        name="লাইভ কারেন্সি কনভার্টার"
        description="বিশ্বের সকল আন্তর্জাতিক মুদ্রার লাইভ এক্সচেঞ্জ রেট ও টাকায় রূপান্তরের নির্ভরযোগ্য কনভার্টার।"
        url="https://totthobox.com/converter/currency"
        applicationCategory="FinanceApplication"
        featureList={[
          "বিশ্বের ১৬০+ দেশের মুদ্রার লাইভ রেট",
          "তাত্ক্ষণিক দ্বিমুখী মুদ্রা রূপান্তর",
          "বাংলাদেশি টাকায় লাইভ কারেন্সি ভ্যালু",
          "স্বয়ংক্রিয় লাইভ রেট আপডেট",
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-12">
        <div className="max-w-2xl mx-auto">
          <CurrencyConverter />
        </div>
        <ToolGuide guide={currencyConverterGuide} />
      </div>
    </>
  );
}
