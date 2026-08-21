import type { Metadata } from "next";
import ChatPanel from "@/components/ai/ChatPanel";
import "highlight.js/styles/github.css"; // Markdown এর কোড হাইলাইটিংয়ের জন্য

export const metadata: Metadata = {
  title: "Totthobox AI: আপনার বুদ্ধিমত্তাসম্পন্ন এআই অ্যাসিস্ট্যান্ট",
};

export default function AiChatPage() {
  // uuid null মানে এটি একটি নতুন চ্যাট সেশন
  return <ChatPanel uuid={null} />;
}
