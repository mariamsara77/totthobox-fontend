import type { Metadata } from "next";
import TaxVatClient from "./TaxVatClient";
import ToolStructuredData from "@/components/seo/ToolStructuredData";
import ToolGuide from "@/components/ToolGuide";
import { taxVatCalculatorContent } from "@/lib/content/tools/tax-vat-calculator";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "বাংলাদেশ আয়কর ও ভ্যাট ক্যালকুলেটর (NBR Tax & VAT) | তথ্যবক্স",
  description:
    "সর্বশেষ এনবিআর আয়কর স্ল্যাব ও নিয়ম অনুযায়ী ব্যক্তিগত আয়কর, বিনিয়োগ কর রেয়াত এবং পণ্য বা সেবার ভ্যাট (VAT) সহজে ও নির্ভুলভাবে হিসাব করুন।",
  keywords: [
    "tax calculator bd",
    "income tax calculator bangladesh",
    "আয়কর ক্যালকুলেটর",
    "ভ্যাট হিসাব",
    "vat calculator bd",
    "nbr tax rate 2024-2025",
    "কর রেয়াত",
  ],
  alternates: { canonical: "https://totthobox.com/tools/tax-vat-calculator" },
  openGraph: {
    title: "বাংলাদেশ আয়কর ও ভ্যাট ক্যালকুলেটর | Totthobox",
    description: "NBR নিয়ম অনুযায়ী ব্যক্তিগত বার্ষিক আয়কর, বিনিয়োগ রেয়াত ও ভ্যাটের সহজ অনলাইন হিসাব।",
    type: "website",
    url: "https://totthobox.com/tools/tax-vat-calculator",
    siteName: "Totthobox",
    locale: "bn_BD",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox Tax Calculator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "বাংলাদেশ আয়কর ও ভ্যাট ক্যালকুলেটর | Totthobox",
    description: "এনবিআর নিয়ম অনুযায়ী আয়কর ও ভ্যাট হিসাবের নির্ভরযোগ্য টুল।",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }],
  },
};

export default function TaxVatPage() {
  return (
    <>
      <ToolStructuredData
        name="বাংলাদেশ আয়কর ও ভ্যাট ক্যালকুলেটর"
        description="এনবিআর এর সর্বশেষ নিয়ম ও স্লাব অনুযায়ী আপনার বার্ষিক আয়কর, বিনিয়োগ কর রেয়াত এবং ভ্যাট নিখুঁতভাবে হিসাব করুন।"
        url="https://totthobox.com/tools/tax-vat-calculator"
        applicationCategory="FinanceApplication"
        featureList={[
          "এনবিআর সর্বশেষ আয়কর স্লাব হিসাব",
          "কর রেয়াত ও বিনিয়োগ সুবিধা ক্যালকুলেশন",
          "সিটি কর্পোরেশন ভিত্তিক ন্যূনতম কর নিশ্চিতকরণ",
          "ভ্যাট এক্সক্লুসিভ ও ইনক্লুসিভ ক্যালকুলেটর",
        ]}
      />
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
        <TaxVatClient />
        <ToolGuide content={taxVatCalculatorContent} />
      </div>
    </>
  );
}
