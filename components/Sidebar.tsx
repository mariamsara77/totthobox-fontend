"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandIcon from "@/components/BrandIcon";
import { 
  FaCalendar, 
  FaCalendarMinus, 
  FaRulerCombined, 
  FaWeightHanging, 
  FaFlask, 
  FaMap, 
  FaRegClock, 
  FaVectorSquare, 
  FaTemperatureHigh, 
  FaTachometerAlt, 
  FaDatabase, 
  FaBolt 
} from "react-icons/fa";
import { TfiExchangeVertical } from "react-icons/tfi";
import { GoNumber } from "react-icons/go";
import { useSettingsModal } from "@/context/SettingsModalContext";
import { RiImageEditFill } from "react-icons/ri";
import { MdEditDocument, MdCurrencyExchange } from "react-icons/md";
import { GrMultimedia } from "react-icons/gr";
import { FaFileImport } from "react-icons/fa6";

import {
  Settings,
  Flag,
  Map as LucideMap,
  BookOpen,
  X,
  PanelLeftClose,
  PanelLeft,
  ChevronDown,
  ChevronRight,
  Layers
} from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

type SidebarItemProps = {
  href?: string;
  onClick?: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isActive?: boolean;
  collapsed?: boolean;
  onHover?: (e: React.MouseEvent<HTMLElement>, label: string) => void;
  onLeave?: () => void;
};

function SidebarItem({
  href,
  onClick,
  icon: Icon,
  label,
  isActive,
  collapsed,
  onHover,
  onLeave,
}: SidebarItemProps) {
  const content = (
    <>
      <Icon
        className={cn(
          "h-5 w-5 shrink-0 transition-colors duration-200",
          isActive
            ? "text-black dark:text-white"
            : "text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-200"
        )}
      />
      {!collapsed && <span className="truncate">{label}</span>}
    </>
  );

  const className = cn(
    "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 text-left",
    isActive
      ? "bg-zinc-400/10 text-black dark:text-white"
      : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800",
    collapsed && "justify-center px-2"
  );

  if (href) {
    return (
      <Link
        href={href}
        onMouseEnter={(e) => onHover?.(e, label)}
        onMouseLeave={onLeave}
        className={className}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={(e) => onHover?.(e, label)}
      onMouseLeave={onLeave}
      className={className}
    >
      {content}
    </button>
  );
}

export default function Sidebar() {
  const { openSettingsModal } = useSettingsModal();
  const pathname = usePathname();
  const { isOpen, setIsOpen, isCollapsed, toggleCollapsed } = useSidebar();

  // States
  const [tooltip, setTooltip] = useState<{ label: string; top: number } | null>(null);
  const [isExtraConvertersOpen, setIsExtraConvertersOpen] = useState(false); // Collapsible state

  // Mobile scroll lock
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const collapsed = isCollapsed; // desktop only

  // Tooltip position handler
  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>, label: string) => {
    if (!collapsed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ label, top: rect.top + rect.height / 2 });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 flex h-screen flex-col border-r border-zinc-200 bg-white transition-all duration-300 ease-in-out dark:border-zinc-800 dark:bg-zinc-900",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:sticky md:top-0 md:translate-x-0",
          collapsed ? "md:w-16" : "md:w-64",
          "w-64"
        )}
        onMouseLeave={handleMouseLeave}
      >
        {/* Global Tooltip */}
        {collapsed && tooltip && (
          <div
            className="fixed left-18 z-60 -translate-y-1/2 whitespace-nowrap rounded-md bg-zinc-900 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg dark:bg-zinc-100 dark:text-zinc-900"
            style={{ top: tooltip.top }}
          >
            {tooltip.label}
          </div>
        )}

        {/* Header */}
        <div
          className={cn(
            "flex h-16 items-center",
            collapsed ? "justify-center" : "justify-between px-4"
          )}
        >
          {!collapsed && (
            <>
              <Link
                href="/"
                className="flex items-center gap-2 text-xl font-semibold"
              >
                <BrandIcon className="h-6 w-6 shrink-0" />
                <span className="truncate">Totthobox</span>
              </Link>

              <button
                onClick={toggleCollapsed}
                className="hidden rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 md:flex dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                title="Collapse sidebar"
              >
                <PanelLeftClose className="h-5 w-5" />
              </button>
            </>
          )}

          {collapsed && (
            <div
              className="group relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
              onMouseEnter={(e) => handleMouseEnter(e, "Expand Sidebar")}
              onMouseLeave={handleMouseLeave}
              onClick={toggleCollapsed}
            >
              <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 group-hover:opacity-0 group-hover:pointer-events-none">
                <BrandIcon className="h-6 w-6" />
              </div>

              <div className="absolute inset-0 flex items-center justify-center text-zinc-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:text-zinc-200">
                <PanelLeft className="h-5 w-5" />
              </div>
            </div>
          )}

          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 text-zinc-500 hover:bg-rose-50 hover:text-rose-500 md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <div
          className="custom-scrollbar flex-1 overflow-y-auto p-3"
          onScroll={handleMouseLeave}
        >
          <div className="space-y-6">
            {/* Calendar & Holidays */}
            {pathname.startsWith("/bangla") && (
              <div className="space-y-1">
                {!collapsed && (
                  <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    ক্যালেন্ডার ও ছুটির তালিকা
                  </h3>
                )}
                <SidebarItem
                  href="/bangla/calendar"
                  icon={FaCalendar}
                  label="ক্যালেন্ডার"
                  isActive={pathname === "/bangla/calendar"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
                <SidebarItem
                  href="/bangla/holiday"
                  icon={FaCalendarMinus}
                  label="ছুটির তালিকা"
                  isActive={pathname === "/bangla/holiday"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
              </div>
            )}

            {/* Converter */}
            {pathname.startsWith("/converter") && (
              <div className="space-y-1">
                {!collapsed && (
                  <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    কনভার্টার
                  </h3>
                )}
                <SidebarItem
                  href="/converter/number-to-word"
                  icon={GoNumber}
                  label="Number to Word"
                  isActive={pathname === "/converter/number-to-word"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
                <SidebarItem
                  href="/converter/adarshalipi"
                  icon={TfiExchangeVertical}
                  label="Adorsholipi Conveter"
                  isActive={pathname === "/converter/adarshalipi"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
                <SidebarItem
                  href="/converter/image"
                  icon={RiImageEditFill}
                  label="Image Converter"
                  isActive={pathname === "/converter/image"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
                <SidebarItem
                  href="/converter/document"
                  icon={MdEditDocument}
                  label="Documents Converter"
                  isActive={pathname === "/converter/document"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
                <SidebarItem
                  href="/converter/media"
                  icon={GrMultimedia}
                  label="Media COnveter(Audio/Video)"
                  isActive={pathname === "/converter/media"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
                <SidebarItem
                  href="/converter/file-data"
                  icon={FaFileImport}
                  label="Deta File Converter (CSV/JSON/XML)"
                  isActive={pathname === "/converter/file-data"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
                <SidebarItem
                  href="/converter/currency"
                  icon={MdCurrencyExchange}
                  label="মুদ্রা কনভার্টার"
                  isActive={pathname === "/converter/currency"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />

                {/* Collapsible Section for Measurement Converters */}
                <button
                  type="button"
                  onClick={() => setIsExtraConvertersOpen(!isExtraConvertersOpen)}
                  onMouseEnter={(e) => collapsed && handleMouseEnter(e, "পরিমাপ কনভার্টার")}
                  onMouseLeave={handleMouseLeave}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 text-left",
                    "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800",
                    collapsed && "justify-center px-2"
                  )}
                >
                  <Layers className="h-5 w-5 shrink-0 text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-200" />
                  {!collapsed && (
                    <div className="flex flex-1 items-center justify-between">
                      <span className="truncate">অন্যান্য কনভার্টার</span>
                      {isExtraConvertersOpen ? (
                        <ChevronDown className="h-4 w-4 text-zinc-400" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-zinc-400" />
                      )}
                    </div>
                  )}
                </button>

                {/* Collapsible Content */}
                {isExtraConvertersOpen && (
                  <div className={cn("mt-1 space-y-1 overflow-hidden transition-all", !collapsed && "pl-4 border-l border-zinc-200 ml-4 dark:border-zinc-700")}>
                    <SidebarItem
                      href="/converter/length"
                      icon={FaRulerCombined}
                      label="দৈর্ঘ্য কনভার্টার"
                      isActive={pathname === "/converter/length"}
                      collapsed={collapsed}
                      onHover={handleMouseEnter}
                      onLeave={handleMouseLeave}
                    />
                    <SidebarItem
                      href="/converter/weight"
                      icon={FaWeightHanging}
                      label="ওজন কনভার্টার"
                      isActive={pathname === "/converter/weight"}
                      collapsed={collapsed}
                      onHover={handleMouseEnter}
                      onLeave={handleMouseLeave}
                    />
                    <SidebarItem
                      href="/converter/volume"
                      icon={FaFlask}
                      label="পরিমাণ কনভার্টার"
                      isActive={pathname === "/converter/volume"}
                      collapsed={collapsed}
                      onHover={handleMouseEnter}
                      onLeave={handleMouseLeave}
                    />
                    <SidebarItem
                      href="/converter/land"
                      icon={FaMap}
                      label="জমি কনভার্টার"
                      isActive={pathname === "/converter/land"}
                      collapsed={collapsed}
                      onHover={handleMouseEnter}
                      onLeave={handleMouseLeave}
                    />
                    <SidebarItem
                      href="/converter/time"
                      icon={FaRegClock}
                      label="সময় কনভার্টার"
                      isActive={pathname === "/converter/time"}
                      collapsed={collapsed}
                      onHover={handleMouseEnter}
                      onLeave={handleMouseLeave}
                    />
                    <SidebarItem
                      href="/converter/area"
                      icon={FaVectorSquare}
                      label="এলাকা কনভার্টার"
                      isActive={pathname === "/converter/area"}
                      collapsed={collapsed}
                      onHover={handleMouseEnter}
                      onLeave={handleMouseLeave}
                    />
                    <SidebarItem
                      href="/converter/temperature"
                      icon={FaTemperatureHigh}
                      label="তাপমাত্রা কনভার্টার"
                      isActive={pathname === "/converter/temperature"}
                      collapsed={collapsed}
                      onHover={handleMouseEnter}
                      onLeave={handleMouseLeave}
                    />
                    <SidebarItem
                      href="/converter/speed"
                      icon={FaTachometerAlt}
                      label="গতিবেগ কনভার্টার"
                      isActive={pathname === "/converter/speed"}
                      collapsed={collapsed}
                      onHover={handleMouseEnter}
                      onLeave={handleMouseLeave}
                    />
                    <SidebarItem
                      href="/converter/data"
                      icon={FaDatabase}
                      label="ডেটা স্টোরেজ কনভার্টার"
                      isActive={pathname === "/converter/data"}
                      collapsed={collapsed}
                      onHover={handleMouseEnter}
                      onLeave={handleMouseLeave}
                    />
                    <SidebarItem
                      href="/converter/energy"
                      icon={FaBolt}
                      label="শক্তি/পাওয়ার কনভার্টার"
                      isActive={pathname === "/converter/energy"}
                      collapsed={collapsed}
                      onHover={handleMouseEnter}
                      onLeave={handleMouseLeave}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Bangladesh */}
            {pathname.startsWith("/bangladesh") && (
              <div className="space-y-1">
                {!collapsed && (
                  <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    বাংলাদেশ
                  </h3>
                )}
                <SidebarItem
                  href="/bangladesh/introduction"
                  icon={Flag}
                  label="পরিচিতি"
                  isActive={pathname === "/bangladesh/introduction"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
                <SidebarItem
                  href="/bangladesh/tourism"
                  icon={LucideMap}
                  label="পর্যটন"
                  isActive={pathname === "/bangladesh/tourism"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
                <SidebarItem
                  href="/bangladesh/history"
                  icon={BookOpen}
                  label="ইতিহাস"
                  isActive={pathname === "/bangladesh/history"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
              </div>
            )}

            {/* Calendar & Holidays */}
            {pathname.startsWith("/tools") && (
              <div className="space-y-1">
                {!collapsed && (
                  <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    ক্যালেন্ডার ও ছুটির তালিকা
                  </h3>
                )}
                <SidebarItem
                  href="/tools/image-resizer"
                  icon={FaCalendar}
                  label="Image Resizer"
                  isActive={pathname === "/tools/image-resizer"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
                <SidebarItem
                  href="/tools/age-calculator"
                  icon={FaCalendarMinus}
                  label="Age Calculator"
                  isActive={pathname === "/tools/age-calculator"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
                <SidebarItem
                  href="/tools/word-and-character-counter"
                  icon={FaCalendarMinus}
                  label="Word & Character Counter"
                  isActive={pathname === "/tools/word-and-character-counter"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
                 <SidebarItem
                  href="/tools/zodiac-calculator"
                  icon={FaCalendarMinus}
                  label="Zodiac(রাশি) Calculator"
                  isActive={pathname === "/tools/zodiac-calculator"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
                 <SidebarItem
                  href="/tools/percentage-calculator"
                  icon={FaCalendarMinus}
                  label="Percentage(%) Calculator"
                  isActive={pathname === "/tools/percentage-calculator"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
                 <SidebarItem
                  href="/tools/qrcode-generator"
                  icon={FaCalendarMinus}
                  label="QR Code Generator"
                  isActive={pathname === "/tools/qrcode-generator"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer Settings Item */}
        <div className="border-t border-zinc-200 p-3 dark:border-zinc-800">
          <SidebarItem
            onClick={openSettingsModal}
            icon={Settings}
            label="সেটিংস"
            collapsed={collapsed}
            onHover={handleMouseEnter}
            onLeave={handleMouseLeave}
          />
        </div>
      </aside>
    </>
  );
}