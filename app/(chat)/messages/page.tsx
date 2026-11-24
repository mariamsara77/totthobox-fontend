import type { Metadata } from "next";
import ModernChatApp from "@/components/messaging/ModernChatApp";

export const metadata: Metadata = {
  title: "মেসেজ",
  description: "Totthobox-এ নিরাপদ ও দ্রুত ব্যক্তিগত মেসেজিং।",
};

export default function MessagesPage() {
  return <ModernChatApp />;
}
