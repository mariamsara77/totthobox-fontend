import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const revalidate = 86400;

export const metadata: Metadata = {
  alternates: { canonical: "https://totthobox.com/contact-us" },
  title: "যোগাযোগ করুন (Contact Us) | তথ্যবক্স",
  description:
    "Totthobox-এর সাথে যোগাযোগ করুন। আপনার যেকোনো জিজ্ঞাসা, মতামত, তথ্যের ভুল সংশোধন বা সাপোর্টের জন্য সরাসরি মেসেজ দিন।",
  openGraph: {
    title: "যোগাযোগ করুন | Totthobox",
    description:
      "Totthobox-এর সাথে যোগাযোগ করুন। আপনার যেকোনো জিজ্ঞাসা, মতামত বা তথ্যের ভুল সংশোধনের জন্য মেসেজ দিন।",
    url: "https://totthobox.com/contact-us",
    siteName: "Totthobox",
    type: "website",
    locale: "bn_BD",
    images: [{ url: "https://totthobox.com/og-image.png", width: 1200, height: 630, alt: "Totthobox" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "যোগাযোগ করুন | Totthobox",
    description:
      "Totthobox-এর সাথে যোগাযোগ করুন। আপনার যেকোনো জিজ্ঞাসা, মতামত বা সাপোর্টের জন্য আমাদের মেসেজ দিন।",
    images: [{ url: "https://totthobox.com/og-image.png", alt: "Totthobox" }],
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
