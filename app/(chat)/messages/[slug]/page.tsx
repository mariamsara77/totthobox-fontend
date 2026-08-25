import type { Metadata } from "next";
import ChatApp from "@/components/messaging/ChatApp";

export const metadata: Metadata = {
  title: "চ্যাট",
  description: "Totthobox-এ ব্যক্তিগত কথোপকথন।",
};

export default async function DirectMessagePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ChatApp targetSlug={slug} />;
}
