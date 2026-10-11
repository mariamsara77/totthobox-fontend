import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  alternates: { canonical: "https://totthobox.com/contact-us" },
  title: "যোগাযোগ করুন (Contact Us) | Totthobox",
  description:
    "Totthobox-এর সাথে যোগাযোগ করুন। আপনার যেকোনো জিজ্ঞাসা, মতামত, বিজ্ঞাপন বা সাপোর্টের জন্য আমাদের মেসেজ দিন।",
  keywords: [
    "যোগাযোগ",
    "কন্টাক্ট পেজ",
    "Totthobox contact",
    "সাপোর্ট সেন্টার",
    "মেসেজ দিন",
  ],
  openGraph: {
    title: "যোগাযোগ করুন | Totthobox",
    description: "Totthobox-এর সাথে যোগাযোগ করুন।",
    url: "https://totthobox.com/contact-us",
    siteName: "Totthobox",
    type: "website",
    locale: "bn_BD",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox — information, tools and digital services" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "যোগাযোগ করুন | Totthobox",
    description: "Totthobox-এর সাথে যোগাযোগ করুন।",
    images: ["/og-image.png"],
  },
};

export default function ContactPage() {
  return <ContactClient />;
}