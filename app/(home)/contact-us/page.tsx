import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "যোগাযোগ করুন (Contact Us) | Totthobox",
  description:
    "Totthobox-এর সাথে যোগাযোগ করুন। আপনার যেকোনো জিজ্ঞাসা, মতামত, বিজ্ঞাপন বা সাপোর্টের জন্য আমাদের মেসেজ দিন।",
  alternates: { canonical: "/contact-us" },
  openGraph: {
    title: "যোগাযোগ করুন | Totthobox",
    description:
      "Totthobox-এর সাথে যোগাযোগের জন্য মেসেজ, ইমেইল, ফোন ও অন্যান্য যোগাযোগের মাধ্যম।",
    url: "https://totthobox.com/contact-us",
    siteName: "Totthobox",
    type: "website",
    locale: "bn_BD",
  },
  keywords: [
    "যোগাযোগ",
    "কন্টাক্ট পেজ",
    "Totthobox contact",
    "সাপোর্ট সেন্টার",
    "মেসেজ দিন",
  ],
};

export default function ContactPage() {
  return <ContactClient />;
}
