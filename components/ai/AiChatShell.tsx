"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import ChatSidebar from "./ChatSidebar";

const API =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

export default function AiChatShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const parts = pathname?.split("/").filter(Boolean) ?? [];
  const uuid =
    parts[0] === "ai" && parts[1] === "chat" && parts[2] ? parts[2] : null;

  const [mobileOpen, setMobileOpen] = useState(false);
  // ডেস্কটপ সাইডবারের জন্য নতুন স্টেট
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isGuest, setIsGuest] = useState(true);

  // Guest কিনা চেক
  useEffect(() => {
    fetch(`${API}/api/user`, { credentials: "include" })
      .then((r) => setIsGuest(!r.ok))
      .catch(() => setIsGuest(true));
  }, []);

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden">
      {/* Desktop Sidebar (Animated, pushes main content) */}
      <aside
        className={`hidden md:flex flex-col transition-all duration-300 ease-in-out overflow-hidden bg-zinc-50/70 dark:bg-zinc-900/50 ${
          isSidebarOpen
            ? "w-64 lg:w-72 border-r border-zinc-200 dark:border-zinc-800 opacity-100"
            : "w-0 border-r-0 opacity-0"
        }`}
      >
        {/* Inner container with fixed width prevents content squishing during animation */}
        <div className="w-64 lg:w-72 h-full flex flex-col shrink-0">
          <ChatSidebar currentUuid={uuid} isGuest={isGuest} />
        </div>
      </aside>

      {/* Mobile Sidebar (Overlay mode) */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col shadow-2xl md:hidden">
            <div className="flex items-center justify-between px-3 py-3 border-b border-zinc-200 dark:border-zinc-800">
              <span className="text-sm font-medium">চ্যাট হিস্ট্রি</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <ChatSidebar
              currentUuid={uuid}
              isGuest={isGuest}
              onNavigate={() => setMobileOpen(false)}
            />
          </aside>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col transition-all duration-300">
        {/* Header with Toggles */}
        <div className="flex items-center gap-3 px-3 py-2.5 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
          {/* Desktop Toggle Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden md:flex p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Mobile Toggle Button */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden flex p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
            তথ্যবক্স এআই
          </span>
        </div>

        {children}
      </div>
    </div>
  );
}
