import { Metadata } from "next";
import CurrencyConverter from "@/components/converter/CurrencyConverter";

// আপনার দেওয়া SEO মেটাডেটা
export const metadata: Metadata = {
  title: "লাইভ কারেন্সি কনভার্টার - টাকার সর্বশেষ রেট জানুন | Totthobox",
  description:
    "ডলার, ইউরো, রিয়ালসহ বিশ্বের যেকোনো দেশের মুদ্রাকে বাংলাদেশি টাকায় কনভার্ট করুন। Totthobox-এ পান রিয়েল-টাইম এক্সচেঞ্জ রেট এবং নির্ভুল হিসাব।",
  keywords: [
    "কারেন্সি কনভার্টার",
    "ডলার রেট বাংলাদেশ",
    "টাকার রেট আজ",
    "মুদ্রা রূপান্তর",
    "currency converter bangla",
    "USD to BDT live",
    "exchange rate Totthobox",
  ],
  // ওপেন গ্রাফ (সোশ্যাল মিডিয়ায় শেয়ার করার জন্য)
  openGraph: {
    title: "লাইভ কারেন্সি কনভার্টার - টাকার সর্বশেষ রেট জানুন | Totthobox",
    description:
      "ডলার, ইউরো, রিয়ালসহ বিশ্বের যেকোনো দেশের মুদ্রাকে বাংলাদেশি টাকায় কনভার্ট করুন। Totthobox-এ পান রিয়েল-টাইম এক্সচেঞ্জ রেট এবং নির্ভুল হিসাব।",
    type: "website",
    locale: "bn_BD",
    siteName: "Totthobox",
  },
};

export default function CurrencyConverterPage() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <CurrencyConverter />
      </div>
  );
}