"use client";

import Link from "next/link";
import { Menu, PanelLeft, Settings } from "lucide-react";
import ProfileMenu from "./ProfileMenu";
import { useSidebar } from "@/context/SidebarContext";
import { useSettingsModal } from "@/context/SettingsModalContext";
import BrandIcon from "@/components/BrandIcon";

export default function Navbar() {
  // Settings Modal কন্ট্রোল করার ফাংশন
  const { openSettingsModal } = useSettingsModal();
  
  // Sidebar এর ফাংশন (ভবিষ্যতে লাগলে আনকমেন্ট করবেন)
  // const { setIsOpen, isCollapsed, toggleCollapsed } = useSidebar();

  return (
    <header className="z-40 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/80">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-xl font-semibold flex gap-2 items-center"
          >
              <BrandIcon className="w-6 h-6" />
            Totthobox
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* Settings Modal Opener Button */}
          <button
            onClick={openSettingsModal}
            className="flex items-center gap-2 p-2 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-lg text-sm font-medium transition-colors"
          >
            <Settings className="h-5 w-5" /> {/* একটি আইকন যুক্ত করা হলো সুন্দর দেখানোর জন্য */}
            <span className="hidden sm:inline-block">সেটিংস</span>
          </button>
          
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}