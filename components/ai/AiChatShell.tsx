"use client";

import { usePathname } from "next/navigation";
import ChatSidebar from "./ChatSidebar";

export default function AiChatShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // /ai/chat বা /ai/chat/[uuid]
  const parts = pathname?.split("/").filter(Boolean) ?? [];
  const uuid = parts[0] === "ai" && parts[1] === "chat" && parts[2] ? parts[2] : null;

  // Guest হলে sidebar লুকাতে চাইলে auth check যোগ করুন
  // const { user } = useAuth();
  // const showSidebar = !!user;

  const showSidebar = true; // লগইন চেক পরে বসান

  return (
    <div className="flex h-[89vh] lg:h-[91vh] max-w-6xl mx-auto w-full">
      {showSidebar && (
        <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <ChatSidebar currentUuid={uuid} />
        </aside>
      )}
      <div className="flex-1 min-w-0 flex flex-col">{children}</div>
    </div>
  );
}