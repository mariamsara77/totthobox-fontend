"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import ChatSidebar from "./ChatSidebar";
import SidebarProfileMenu from "../SidebarProfileMenu";
import { useAuth } from "@/context/AuthContext";

export default function AiChatShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const parts = pathname?.split("/").filter(Boolean) ?? [];
  const uuid =
    parts[0] === "ai" && parts[1] === "chat" && parts[2] ? parts[2] : null;

  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, loading: authLoading } = useAuth();

  // ডেস্কটপে ডিফল্টভাবে সাইডবার ওপেন রাখা
  useEffect(() => {
    if (window.innerWidth >= 768) {
      setIsOpen(true);
    }
  }, []);

  return (
    <div className="flex h-dvh w-full overflow-hidden relative">
      {/* Sidebar Area */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 h-full overflow-hidden transition-all duration-300 ease-in-out
          md:static md:shrink-0
          ${
            isOpen
              ? "translate-x-0 w-70"
              : "-translate-x-full w-70 md:translate-x-0 md:w-0"
          }
        `}
      >
        <div className="w-70 h-full flex flex-col border-r border-zinc-400/10 bg-zinc-400/10">
          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-between px-3 py-2.5 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
            <span className="text-sm font-medium">চ্যাট হিস্ট্রি</span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat History List */}
          <div className="flex-1 overflow-hidden">
            <ChatSidebar
              currentUuid={uuid}
              onNavigate={() => {
                if (window.innerWidth < 768) setIsOpen(false);
              }}
            />
          </div>

          {/* Profile Menu */}
          <div className="shrink-0 border-t border-zinc-200 dark:border-zinc-800 p-2">
            <SidebarProfileMenu />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main
        className={`
          absolute inset-y-0 left-0 z-20 w-full h-full flex flex-col
          transition-transform duration-300 ease-in-out
          md:relative md:flex-1
          ${isOpen ? "translate-x-70 md:translate-x-0" : "translate-x-0"}
        `}
      >
        {/* Mobile Overlay */}
        {isOpen && (
          <div
            className="absolute inset-0 z-40 bg-black/10 dark:bg-black/40 backdrop-blur-[1px] md:hidden cursor-pointer"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
            তথ্যবক্স এআই
          </span>
        </div>

        {/* Chat Content */}
        <div className="flex-1 overflow-hidden relative">{children}</div>
      </main>
    </div>
  );
}
