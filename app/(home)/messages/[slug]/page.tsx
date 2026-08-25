import type { Metadata } from "next";
import MessagingShell from "@/components/messaging/MessagingShell";

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
  return <MessagingShell targetSlug={slug} />;
}
