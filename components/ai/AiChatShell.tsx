"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import ChatSidebar from "./ChatSidebar";
import { useAuth } from "@/context/AuthContext";
import BrandIcon from "../BrandIcon";
import Link from "next/link";

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
          fixed inset-y-0 left-0 z-30 h-full bg-zinc-100 bg-zinc-400/10 overflow-hidden transition-all duration-300 ease-in-out
          md:static md:shrink-0
          ${
            isOpen
              ? "translate-x-0 w-70"
              : "-translate-x-full w-70 md:translate-x-0 md:w-0"
          }
        `}
      >
        <div className="w-70 h-full flex flex-col">
          {/* Mobile Header */}
          <div className=" flex items-center justify-between px-3 py-2.5 shrink-0">
            {/* Brand */}
            <div>
              <Link
                href="/"
                className="flex items-center gap-2 text-xl font-bold"
              >
                <BrandIcon className="h-6 w-6 shrink-0" />
                <span className="truncate">Totthobox AI</span>
              </Link>
            </div>
            <div className="md:hidden flex">
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl hover:bg-zinc-400/10 "
            >
              <X className="w-5 h-5" />
            </button>
            </div>
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
            className="absolute inset-0 z-40 md:hidden cursor-pointer"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Header */}
        <div className="flex items-center gap-4 px-4 py-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl hover:bg-zinc-400/10 "
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-sm  ">তথ্যবক্স এআই</span>
        </div>

        {/* Chat Content */}
        <div className="flex-1 overflow-hidden relative">{children}</div>
      </main>
    </div>
  );
}
