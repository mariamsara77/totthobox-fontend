import type { Metadata } from "next";
import MessagingShell from "@/components/messaging/MessagingShell";

export const metadata: Metadata = {
  title: "মেসেজ",
  description: "Totthobox-এ নিরাপদ ও দ্রুত ব্যক্তিগত মেসেজিং।",
};

export default function MessagesPage() {
  return <MessagingShell />;
}
