import type { Metadata } from "next";
import ChatApp from "@/components/messaging/ChatApp";

export const metadata: Metadata = {
  title: "চ্যাট",
  description: "Totthobox-এ ব্যক্তিগত কথোপকথন।",
};

export default function DirectMessagePage() {
  return <ChatApp />;
}
