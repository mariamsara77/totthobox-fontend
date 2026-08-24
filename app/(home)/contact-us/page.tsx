import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
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
    type: "website",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}