export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import ChatPanel from "@/components/ai/ChatPanel";
import "highlight.js/styles/github.css";

export const metadata: Metadata = {
  title: "Totthobox AI: আপনার বুদ্ধিমত্তাসম্পন্ন এআই অ্যাসিস্ট্যান্ট",
};

export default function AiChatPage() {
  return <ChatPanel uuid={null} />;
}