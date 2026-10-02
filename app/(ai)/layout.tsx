import type { Metadata } from "next";
import "./ai-chat.css";
import AiChatShell from "@/components/ai/AiChatShell";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AiLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-page site-page-ai">
      <AiChatShell>{children}</AiChatShell>
    </div>
  );
}
