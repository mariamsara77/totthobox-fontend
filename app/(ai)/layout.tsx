import AiChatShell from "@/components/ai/AiChatShell";

export default function AiLayout({ children }: { children: React.ReactNode }) {
  return <AiChatShell>{children}</AiChatShell>;
}
