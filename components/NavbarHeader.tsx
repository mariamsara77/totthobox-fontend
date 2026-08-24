"use client";

import Link from "next/link";
import { Settings } from "lucide-react";
import ProfileMenu from "./ProfileMenu";
import { useSettingsModal } from "@/context/SettingsModalContext";
import BrandIcon from "@/components/BrandIcon";

export default function Navbar() {
  // Settings Modal কন্ট্রোল করার ফাংশন
  const { openSettingsModal } = useSettingsModal();

  // Sidebar এর ফাংশন (ভবিষ্যতে লাগলে আনকমেন্ট করবেন)
  // const { setIsOpen, isCollapsed, toggleCollapsed } = useSidebar();

  return (
    <header className="z-60 w-full border-b border-zinc-400/25 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-semibold "
          >
            <BrandIcon className="w-6 h-6" />
            Totthobox
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* Settings Modal Opener Button */}
          <button
            onClick={openSettingsModal}
            className="flex items-center gap-2 p-2 hover:opacity-50"
          >
            <Settings className="h-5 w-5" />{" "}
            {/* একটি আইকন যুক্ত করা হলো সুন্দর দেখানোর জন্য */}
            <span className="hidden sm:inline-block">সেটিংস</span>
          </button>

          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
