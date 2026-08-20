import type { Metadata } from "next";
import ChatPanel from "@/components/ai/ChatPanel";

export const metadata: Metadata = {
  title: "চ্যাট | Totthobox AI",
};

export default async function AiChatSessionPage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  return <ChatPanel uuid={uuid} />;
}