import type { Metadata } from "next";
import ChatPanel from "@/components/ai/ChatPanel";

export const metadata: Metadata = {
  title: "চ্যাট | Totthobox AI",
  robots: { index: false, follow: false },
};

export default async function AiChatSessionPage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;

  // key={uuid} দেওয়ার ফলে সাইডবার নেভিগেশনে কম্পোনেন্ট ১০০% নতুন করে লোড হবে
  return <ChatPanel key={uuid} uuid={uuid} />;
}
