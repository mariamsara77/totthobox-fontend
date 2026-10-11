import type { Metadata } from "next";
import CurrencyConverter from "@/components/converter/CurrencyConverter";

// আপনার দেওয়া SEO মেটাডেটা
export const metadata: Metadata = {
  alternates: { canonical: "https://totthobox.com/converter/currency" },
  title: "লাইভ কারেন্সি কনভার্টার - টাকার সর্বশেষ রেট জানুন",
  description:
    "ডলার, ইউরো, রিয়ালসহ বিশ্বের যেকোনো দেশের মুদ্রাকে বাংলাদেশি টাকায় কনভার্ট করুন। Totthobox-এ পান রিয়েল-টাইম এক্সচেঞ্জ রেট এবং নির্ভুল হিসাব।",

  // ওপেন গ্রাফ (সোশ্যাল মিডিয়ায় শেয়ার করার জন্য)
  openGraph: {
    title: "লাইভ কারেন্সি কনভার্টার - টাকার সর্বশেষ রেট জানুন | Totthobox",
    description:
      "ডলার, ইউরো, রিয়ালসহ বিশ্বের যেকোনো দেশের মুদ্রাকে বাংলাদেশি টাকায় কনভার্ট করুন। Totthobox-এ পান রিয়েল-টাইম এক্সচেঞ্জ রেট এবং নির্ভুল হিসাব।",
    type: "website",
    locale: "bn_BD",
    siteName: "Totthobox",
  
    url: "https://totthobox.com/converter/currency",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "লাইভ কারেন্সি কনভার্টার - টাকার সর্বশেষ রেট জানুন",
    description: "ডলার, ইউরো, রিয়ালসহ বিশ্বের যেকোনো দেশের মুদ্রাকে বাংলাদেশি টাকায় কনভার্ট করুন। Totthobox-এ পান রিয়েল-টাইম এক্সচেঞ্জ রেট এবং নির্ভুল হিসাব।",
    images: ["https://totthobox.com/og-image.png"],
  },
};

export default function CurrencyConverterPage() {
  return (
    <div className="tb-page-container tb-section mx-auto max-w-2xl">
      <CurrencyConverter />
      </div>
  );
}