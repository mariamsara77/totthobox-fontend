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

  const [isOpen, setIsOpen] = useState(false);
  const [isGuest, setIsGuest] = useState(true);

  // ডেস্কটপে ডিফল্টভাবে সাইডবার ওপেন রাখা
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
    <div className="flex h-[100dvh] w-full overflow-hidden bg-white dark:bg-zinc-950 relative">
      {/* Sidebar Area */}
      {/* 
        মোবাইলে এটি 'fixed' থাকবে এবং স্ক্রিনের বামে হাইড হবে (-translate-x-full)।
        ডেস্কটপে এটি 'static' ফ্লেক্স আইটেম হিসেবে থাকবে।
      */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 h-full overflow-hidden transition-all duration-300 ease-in-out
          md:static md:shrink-0
          ${
            isOpen
              ? "translate-x-0 w-[280px]"
              : "-translate-x-full w-[280px] md:translate-x-0 md:w-0"
          }
        `}
      >
        {/* ইনার কন্টেইনারের সাইজ ফিক্সড, তাই সাইডবারের ভেতরের কন্টেন্ট কখনো ভাঙবে না */}
        <div className="w-[280px] h-full flex flex-col border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
          <div className="md:hidden flex items-center justify-between px-3 py-2.5 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
            <span className="text-sm font-medium">চ্যাট হিস্ট্রি</span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            <ChatSidebar
              currentUuid={uuid}
              isGuest={isGuest}
              onNavigate={() => {
                if (window.innerWidth < 768) setIsOpen(false);
              }}
            />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      {/* 
        মোবাইলে এটি 'absolute' এবং ফুল স্ক্রিন (w-full)। সাইডবার ওপেন হলে এটি ২৮০ পিক্সেল ডানদিকে সরে যাবে (translate-x-[280px])। 
        ফলে ভেতরের কোনো টেক্সট বা লেআউট সংকুচিত হবে না, স্ক্রিনের ডানদিকের কিছুটা অংশ ডিসপ্লের বাইরে চলে যাবে।
        ডেস্কটপে এটি সাধারণ 'flex-1' কন্টেইনার হিসেবে কাজ করবে।
      */}
      <main
        className={`
          absolute inset-y-0 left-0 z-20 w-full h-full flex flex-col bg-white dark:bg-zinc-950
          transition-transform duration-300 ease-in-out
          md:relative md:flex-1
          ${isOpen ? "translate-x-[280px] md:translate-x-0" : "translate-x-0"}
        `}
      >
        {/* Mobile Overlay - যখন সাইডবার ওপেন থাকে, মেইন কন্টেন্টের ওপর ক্লিক করলে বন্ধ হওয়ার জন্য */}
        {isOpen && (
          <div
            className="absolute inset-0 z-40 bg-black/10 dark:bg-black/40 backdrop-blur-[1px] md:hidden cursor-pointer"
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

        {/* Chat Content */}
        <div className="flex-1 overflow-hidden relative">{children}</div>
      </main>
    </div>
  );
}
