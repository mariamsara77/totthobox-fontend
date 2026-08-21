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

  // মোবাইল এবং ডেস্কটপ উভয়ের জন্য একটিমাত্র State
  const [isOpen, setIsOpen] = useState(false);
  const [isGuest, setIsGuest] = useState(true);

  // ডেস্কটপে ডিফল্টভাবে সাইডবার ওপেন রাখার জন্য
  useEffect(() => {
    if (window.innerWidth >= 768) {
      setIsOpen(true);
    }
  }, []);

  // Guest চেক
  useEffect(() => {
    fetch(`${API}/api/user`, { credentials: "include" })
      .then((r) => setIsGuest(!r.ok))
      .catch(() => setIsGuest(true));
  }, []);

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-white dark:bg-zinc-950">
      {/* Animated Sidebar (Mobile & Desktop) */}
      <aside
        className={`shrink-0 transition-all duration-300 ease-in-out h-full overflow-hidden ${
          isOpen ? "w-[280px]" : "w-0"
        }`}
      >
        <div className="w-[280px] h-full flex flex-col border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
          {/* Mobile Sidebar Header (Optional: For better UX) */}
          <div className="md:hidden flex items-center justify-between px-3 py-2.5 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
            <span className="text-sm font-medium">চ্যাট হিস্ট্রি</span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-hidden">
            <ChatSidebar
              currentUuid={uuid}
              isGuest={isGuest}
              onNavigate={() => {
                // মোবাইলে কোনো লিঙ্কে ক্লিক করলে সাইডবার হাইড হয়ে যাবে
                if (window.innerWidth < 768) setIsOpen(false);
              }}
            />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      {/* 
        Magic happens here: 
        Mobile: 'w-full shrink-0' - এটি কন্টেন্টকে ছোট হতে দেয় না, ফলে সাইডবার ওপেন হলে এটি ডানদিকে সরে যায়।
        Desktop: 'md:w-auto md:shrink' - ডেস্কটপে এটি ফ্লেক্সিবল থাকে, ফলে সাইডবার ওপেন হলে নিজে থেকেই সাইজ এডজাস্ট করে নেয়।
      */}
      <div className="flex-1 w-full shrink-0 md:w-auto md:shrink h-full flex flex-col transition-all duration-300 relative">
        {/* Mobile Overlay - যখন সাইডবার ওপেন থাকে তখন মেইন কন্টেন্টটি ক্লিক করে বন্ধ করার জন্য */}
        {isOpen && (
          <div
            className="absolute inset-0 z-40 bg-black/10 dark:bg-black/40 backdrop-blur-[1px] md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Header */}
        <div className="flex items-center gap-3 px-3 py-2.5 border-b border-zinc-200 dark:border-zinc-800 shrink-0 bg-white dark:bg-zinc-950">
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

        {/* Chat Component rendering area */}
        <div className="flex-1 overflow-hidden relative">{children}</div>
      </div>
    </div>
  );
}
