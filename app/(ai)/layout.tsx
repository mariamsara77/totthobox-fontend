import type { Metadata } from "next";
import "./ai-chat.css";
import AiChatShell from "@/components/ai/AiChatShell";

export default function AiLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <AiChatShell>{children}</AiChatShell>
    </div>
  );
}