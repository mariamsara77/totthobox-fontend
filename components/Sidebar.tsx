"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandIcon from "@/components/BrandIcon";
import SearchTrigger from "@/components/search/SearchTrigger";
import ProfileMenu from "./ProfileMenu";
import { useSettingsModal } from "@/context/SettingsModalContext";
import { useSidebar } from "@/context/SidebarContext";
import { IoSettings } from "react-icons/io5";

import {
  Globe,
  Clock,
  CircleDollarSign,
  Phone,
  PhoneCall,
  Wrench,
  Gauge,
  Receipt,
  KeyRound,
  Calendar,
  CalendarDays,
  CalendarRange,
  ArrowLeftRight,
  Sparkles,
  MapPin,
  Flag,
  BookOpen,
  Moon,
  Laptop,
  Cpu,
  ShieldAlert,
  Newspaper,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  X,
  Layers,
  FileText,
  Percent,
  QrCode,
  ImageIcon,
  Compass,
  Scale,
  Ruler,
  Thermometer,
  Zap,
  HardDrive,
  Landmark,
  User,
  Lock,
  Trash2,
  Boxes,
  FileCode,
  FolderArchive,
  Volume2,
  ArrowLeft,
  Grid,
} from "lucide-react";

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

type SubItemProps = {
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  badge?: string | number;
  onClick?: () => void;
  collapsed?: boolean;
  onHover?: (e: React.MouseEvent<HTMLElement>, label: string) => void;
  onLeave?: () => void;
};

function SubItem({
  href,
  label,
  icon: Icon,
  isActive,
  badge,
  onClick,
  collapsed,
  onHover,
  onLeave,
}: SubItemProps) {
  const content = (
    <>
      {Icon && (
        <Icon
          className={cn(
            "h-4 w-4 shrink-0 transition-colors",
            isActive
              ? "text-zinc-900 dark:text-zinc-50"
              : "text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300"
          )}
        />
      )}
      {!collapsed && <span className="truncate flex-1 text-left">{label}</span>}
      {!collapsed && badge !== undefined && (
        <span className="ml-auto rounded-full bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 text-[11px] font-normal text-zinc-700 dark:text-zinc-300">
          {badge}
        </span>
      )}
    </>
  );

  const className = cn(
    "group flex w-full min-h-[40px] items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs sm:text-sm font-medium transition-all duration-150",
    isActive
      ? "bg-zinc-200/90 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 font-semibold shadow-2xs"
      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-100",
    collapsed && "justify-center px-2"
  );

  return (
    <Link
      href={href}
      onClick={onClick}
      onMouseEnter={(e) => onHover?.(e, label)}
      onMouseLeave={onLeave}
      className={className}
    >
      {content}
    </Link>
  );
}

export default function Sidebar() {
  const { openSettingsModal } = useSettingsModal();
  const pathname = usePathname();
  const { isOpen, setIsOpen, isCollapsed, toggleCollapsed } = useSidebar();

  const [tooltip, setTooltip] = useState<{ label: string; top: number } | null>(null);
  const [showAllModules, setShowAllModules] = useState(false);

  // Nested Extra Converters Collapsible
  const [isExtraConvertersOpen, setIsExtraConvertersOpen] = useState(
    pathname.startsWith("/converter/length") ||
      pathname.startsWith("/converter/weight") ||
      pathname.startsWith("/converter/volume") ||
      pathname.startsWith("/converter/land") ||
      pathname.startsWith("/converter/time") ||
      pathname.startsWith("/converter/area") ||
      pathname.startsWith("/converter/temperature") ||
      pathname.startsWith("/converter/speed") ||
      pathname.startsWith("/converter/data") ||
      pathname.startsWith("/converter/energy")
  );

  // Determine the active module from current route
  const activeModule = useMemo(() => {
    if (pathname.startsWith("/international")) return "international";
    if (pathname.startsWith("/tools")) return "tools";
    if (pathname.startsWith("/converter")) return "converter";
    if (pathname.startsWith("/bangla")) return "bangla";
    if (pathname.startsWith("/bangladesh")) return "bangladesh";
    if (pathname.startsWith("/islam")) return "islam";
    if (pathname.startsWith("/software")) return "software";
    if (pathname.startsWith("/contact")) return "contact";
    if (pathname.startsWith("/signs")) return "signs";
    if (pathname.startsWith("/news")) return "news";
    if (pathname.startsWith("/settings")) return "settings";
    return null;
  }, [pathname]);

  // When pathname changes to a new section, collapse the manual "showAll" override
  useEffect(() => {
    setShowAllModules(false);
  }, [pathname]);

  // Dynamic Data States
  const [newsSources, setNewsSources] = useState<{
    bn?: any[];
    en?: any[];
    other?: any[];
  }>({});
  const [contactCategories, setContactCategories] = useState<any[]>([]);
  const [signCategories, setSignCategories] = useState<any[]>([]);
  const [softwarePlatforms, setSoftwarePlatforms] = useState<string[]>([]);

  const API_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

  // Mobile scroll lock
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setIsOpen]);

  // Fetch dynamic categories when on or viewing the relevant module
  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        if (pathname.startsWith("/news") || showAllModules) {
          const res = await fetch(`${API_URL}/api/sidebar/news-sources`, {
            signal: controller.signal,
          });
          if (res.ok) {
            const payload = await res.json();
            const data = payload?.data ?? payload;
            const sourceList = Array.isArray(data)
              ? data
              : Array.isArray(data?.sources)
                ? data.sources
                : [];
            const normalizeSource = (source: any) => ({
              ...source,
              key: String(source?.key ?? source?.source_key ?? ""),
              name: String(
                source?.name ?? source?.source_name ?? source?.title ?? ""
              ).trim(),
              total: Number(source?.total ?? source?.count ?? 0),
              language: String(source?.language ?? "").toLowerCase(),
            });
            const normalizedList = sourceList
              .map(normalizeSource)
              .filter((source: any) => source.key && source.name);
            const normalizeGroup = (items: any[]) =>
              items
                .map(normalizeSource)
                .filter((source: any) => source.key && source.name);
            const groupedBn = Array.isArray(data?.bn)
              ? normalizeGroup(data.bn)
              : [];
            const groupedEn = Array.isArray(data?.en)
              ? normalizeGroup(data.en)
              : [];
            const isBn = (source: any) =>
              source.language === "bn" || source.language.startsWith("bn-");
            const isEn = (source: any) =>
              source.language === "en" || source.language.startsWith("en-");
            setNewsSources({
              bn: groupedBn.length ? groupedBn : normalizedList.filter(isBn),
              en: groupedEn.length ? groupedEn : normalizedList.filter(isEn),
              other: normalizedList.filter(
                (source: any) => !isBn(source) && !isEn(source)
              ),
            });
          }
        }

        if (pathname.startsWith("/contact") || showAllModules) {
          const res = await fetch(`${API_URL}/api/sidebar/contact-categories`, {
            signal: controller.signal,
          });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) setContactCategories(data);
          }
        }

        if (pathname.startsWith("/signs") || showAllModules) {
          const res = await fetch(`${API_URL}/api/sidebar/sign-categories`, {
            signal: controller.signal,
          });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) setSignCategories(data);
          }
        }

        if (pathname.startsWith("/software") || showAllModules) {
          const res = await fetch(`${API_URL}/api/sidebar/software-platforms`, {
            signal: controller.signal,
          });
          if (res.ok) {
            const data = await res.json();
            setSoftwarePlatforms(Array.isArray(data) ? data : []);
          }
        }
      } catch (error: any) {
        if (error.name !== "AbortError") {
          // graceful fallback
        }
      }
    };

    fetchData();
    return () => controller.abort();
  }, [pathname, API_URL, showAllModules]);

  const collapsed = isCollapsed;

  const handleMouseEnter = (
    e: React.MouseEvent<HTMLElement>,
    label: string
  ) => {
    if (!collapsed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ label, top: rect.top + rect.height / 2 });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  const closeMobile = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-90 bg-black/50 dark:bg-black/70 backdrop-blur-xs md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "pwa-safe-top fixed top-0 left-0 z-100 flex h-dvh flex-col bg-white dark:bg-zinc-900 md:bg-white/95 md:dark:bg-zinc-900/95 backdrop-blur-xl border-r border-zinc-200/80 dark:border-zinc-800/80 transition-all duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:sticky md:top-0 md:translate-x-0",
          collapsed ? "md:w-16" : "md:w-64",
          "w-64"
        )}
        onMouseLeave={handleMouseLeave}
      >
        {/* Global Tooltip for collapsed rail */}
        {collapsed && tooltip && (
          <div
            className="fixed left-18 z-60 -translate-y-1/2 whitespace-nowrap rounded-xl bg-zinc-900 dark:bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-white dark:text-zinc-900 shadow-xl pointer-events-none"
            style={{ top: tooltip.top }}
          >
            {tooltip.label}
          </div>
        )}

        {/* Header */}
        <div
          className={cn(
            "flex h-16 items-center shrink-0 border-b border-zinc-200/60 dark:border-zinc-800/60",
            collapsed ? "justify-center" : "justify-between px-4"
          )}
        >
          {!collapsed && (
            <>
              <Link
                href="/"
                onClick={closeMobile}
                className="flex items-center gap-2.5 text-lg font-bold text-zinc-900 dark:text-zinc-100"
              >
                <BrandIcon className="h-6 w-6 shrink-0" />
                <span className="truncate">Totthobox</span>
              </Link>

              <button
                type="button"
                onClick={toggleCollapsed}
                className="hidden min-h-[44px] min-w-[44px] items-center justify-center rounded-xl p-2 md:flex text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                title="সাইডবার সংকুচিত করুন"
                aria-label="Collapse sidebar"
              >
                <PanelLeftClose className="h-5 w-5" />
              </button>
            </>
          )}

          {collapsed && (
            <button
              type="button"
              aria-label="সাইডবার প্রসারিত করুন"
              className="group relative flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              onMouseEnter={(e) => handleMouseEnter(e, "Expand Sidebar")}
              onMouseLeave={handleMouseLeave}
              onClick={toggleCollapsed}
            >
              <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 group-hover:opacity-0 group-hover:pointer-events-none">
                <BrandIcon className="h-6 w-6" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100 text-zinc-900 dark:text-zinc-100">
                <PanelLeft className="h-5 w-5" />
              </div>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="সাইডবার বন্ধ করুন"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl p-2.5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors md:hidden"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-y-auto p-2 space-y-3" onScroll={handleMouseLeave}>
          {/* Quick Search */}
          <SearchTrigger
            className="w-full"
            collapsed={collapsed}
            onHover={handleMouseEnter}
            onLeave={handleMouseLeave}
            showLabel={true}
          />

          {/* ========================================================================= */}
          {/* CONTEXT-AWARE FILTERED SIDEBAR: Displays only the active section's items  */}
          {/* ========================================================================= */}
          {activeModule && !showAllModules ? (
            <div className="space-y-2">
              {/* Context Module Header Bar */}
              {!collapsed && (
                <div className="flex items-center justify-between px-2 pt-1 pb-2 border-b border-zinc-200/80 dark:border-zinc-800/80">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                    {activeModule === "international" && <Globe className="w-3.5 h-3.5 text-sky-500" />}
                    {activeModule === "tools" && <Wrench className="w-3.5 h-3.5 text-emerald-500" />}
                    {activeModule === "converter" && <ArrowLeftRight className="w-3.5 h-3.5 text-blue-500" />}
                    {activeModule === "bangla" && <Calendar className="w-3.5 h-3.5 text-amber-500" />}
                    {activeModule === "bangladesh" && <Flag className="w-3.5 h-3.5 text-teal-500" />}
                    {activeModule === "islam" && <Moon className="w-3.5 h-3.5 text-emerald-600" />}
                    {activeModule === "software" && <Cpu className="w-3.5 h-3.5 text-indigo-500" />}
                    {activeModule === "contact" && <PhoneCall className="w-3.5 h-3.5 text-rose-500" />}
                    {activeModule === "signs" && <ShieldAlert className="w-3.5 h-3.5 text-orange-500" />}
                    {activeModule === "news" && <Newspaper className="w-3.5 h-3.5 text-purple-500" />}
                    {activeModule === "settings" && <IoSettings className="w-3.5 h-3.5 text-zinc-500" />}
                    <span>
                      {activeModule === "international" && "গ্লোবাল তথ্য / International"}
                      {activeModule === "tools" && "টুলস ও ইউটিলিটি"}
                      {activeModule === "converter" && "কনভার্টার হাব"}
                      {activeModule === "bangla" && "ক্যালেন্ডার ও ছুটি"}
                      {activeModule === "bangladesh" && "বাংলাদেশ তথ্য"}
                      {activeModule === "islam" && "ইসলামিক জ্ঞান"}
                      {activeModule === "software" && "সফটওয়্যার ডিরেক্টরি"}
                      {activeModule === "contact" && "জরুরী নাম্বার"}
                      {activeModule === "signs" && "সংকেত ও নিয়ম"}
                      {activeModule === "news" && "সংবাদ শিরোনাম"}
                      {activeModule === "settings" && "সেটিংস"}
                    </span>
                  </span>

                  <button
                    type="button"
                    onClick={() => setShowAllModules(true)}
                    className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
                  >
                    সকল বিভাগ
                  </button>
                </div>
              )}

              {/* Module 1: INTERNATIONAL */}
              {activeModule === "international" && (
                <div className="space-y-1">
                  <SubItem
                    href="/international/world-clock"
                    label="বিশ্ব ঘড়ি ও টাইমজোন"
                    icon={Clock}
                    isActive={pathname === "/international/world-clock"}
                    onClick={closeMobile}
                    collapsed={collapsed}
                    onHover={handleMouseEnter}
                    onLeave={handleMouseLeave}
                  />
                  <SubItem
                    href="/international/crypto-forex"
                    label="ক্রিপ্টো ও ফরেক্স রেট"
                    icon={CircleDollarSign}
                    isActive={pathname === "/international/crypto-forex"}
                    onClick={closeMobile}
                    collapsed={collapsed}
                    onHover={handleMouseEnter}
                    onLeave={handleMouseLeave}
                  />
                  <SubItem
                    href="/international/calling-codes"
                    label="আন্তর্জাতিক ডায়ালিং কোড"
                    icon={Phone}
                    isActive={pathname === "/international/calling-codes"}
                    onClick={closeMobile}
                    collapsed={collapsed}
                    onHover={handleMouseEnter}
                    onLeave={handleMouseLeave}
                  />
                  <SubItem
                    href="/international/all-country"
                    label="বিশ্বের দেশ ও বিশ্বকোষ"
                    icon={Globe}
                    isActive={pathname === "/international/all-country"}
                    onClick={closeMobile}
                    collapsed={collapsed}
                    onHover={handleMouseEnter}
                    onLeave={handleMouseLeave}
                  />
                </div>
              )}

              {/* Module 2: TOOLS */}
              {activeModule === "tools" && (
                <div className="space-y-1">
                  <SubItem
                    href="/tools/internet-speed-test"
                    label="ইন্টারনেট স্পিড টেস্ট"
                    icon={Gauge}
                    isActive={pathname === "/tools/internet-speed-test"}
                    onClick={closeMobile}
                    collapsed={collapsed}
                    onHover={handleMouseEnter}
                    onLeave={handleMouseLeave}
                  />
                  <SubItem
                    href="/tools/tax-vat-calculator"
                    label="আয়কর ও ভ্যাট হিসাব"
                    icon={Receipt}
                    isActive={pathname === "/tools/tax-vat-calculator"}
                    onClick={closeMobile}
                    collapsed={collapsed}
                    onHover={handleMouseEnter}
                    onLeave={handleMouseLeave}
                  />
                  <SubItem
                    href="/tools/password-generator"
                    label="পাসওয়ার্ড জেনারেটর"
                    icon={KeyRound}
                    isActive={pathname === "/tools/password-generator"}
                    onClick={closeMobile}
                    collapsed={collapsed}
                    onHover={handleMouseEnter}
                    onLeave={handleMouseLeave}
                  />
                  <SubItem
                    href="/tools/image-resizer"
                    label="ইমেজ স্টুডিও (Resizer)"
                    icon={ImageIcon}
                    isActive={pathname === "/tools/image-resizer"}
                    onClick={closeMobile}
                    collapsed={collapsed}
                    onHover={handleMouseEnter}
                    onLeave={handleMouseLeave}
                  />
                  <SubItem
                    href="/tools/age-calculator"
                    label="স্মার্ট এজ ক্যালকুলেটর"
                    icon={CalendarDays}
                    isActive={pathname === "/tools/age-calculator"}
                    onClick={closeMobile}
                    collapsed={collapsed}
                    onHover={handleMouseEnter}
                    onLeave={handleMouseLeave}
                  />
                  <SubItem
                    href="/tools/percentage-calculator"
                    label="পার্সেন্টেজ ক্যালকুলেটর"
                    icon={Percent}
                    isActive={pathname === "/tools/percentage-calculator"}
                    onClick={closeMobile}
                    collapsed={collapsed}
                    onHover={handleMouseEnter}
                    onLeave={handleMouseLeave}
                  />
                  <SubItem
                    href="/tools/word-and-character-counter"
                    label="ওয়ার্ড ও অক্ষর কাউন্টার"
                    icon={FileText}
                    isActive={pathname === "/tools/word-and-character-counter"}
                    onClick={closeMobile}
                    collapsed={collapsed}
                    onHover={handleMouseEnter}
                    onLeave={handleMouseLeave}
                  />
                  <SubItem
                    href="/tools/qrcode-generator"
                    label="প্রফেশনাল QR কোড"
                    icon={QrCode}
                    isActive={pathname === "/tools/qrcode-generator"}
                    onClick={closeMobile}
                    collapsed={collapsed}
                    onHover={handleMouseEnter}
                    onLeave={handleMouseLeave}
                  />
                  <SubItem
                    href="/tools/zodiac-calculator"
                    label="রাশিফল ক্যালকুলেটর"
                    icon={Sparkles}
                    isActive={pathname === "/tools/zodiac-calculator"}
                    onClick={closeMobile}
                    collapsed={collapsed}
                    onHover={handleMouseEnter}
                    onLeave={handleMouseLeave}
                  />
                  <SubItem
                    href="/tools/writing-practice"
                    label="শিশুশিক্ষা (Writing)"
                    icon={BookOpen}
                    isActive={pathname === "/tools/writing-practice"}
                    onClick={closeMobile}
                    collapsed={collapsed}
                    onHover={handleMouseEnter}
                    onLeave={handleMouseLeave}
                  />
                </div>
              )}

              {/* Module 3: CONVERTER */}
              {activeModule === "converter" && (
                <div className="space-y-1">
                  <SubItem
                    href="/converter/currency"
                    label="লাইভ কারেন্সি কনভার্টার"
                    icon={CircleDollarSign}
                    isActive={pathname === "/converter/currency"}
                    onClick={closeMobile}
                    collapsed={collapsed}
                    onHover={handleMouseEnter}
                    onLeave={handleMouseLeave}
                  />
                  <SubItem
                    href="/converter/number-to-word"
                    label="Number to Word"
                    icon={FileCode}
                    isActive={pathname === "/converter/number-to-word"}
                    onClick={closeMobile}
                    collapsed={collapsed}
                    onHover={handleMouseEnter}
                    onLeave={handleMouseLeave}
                  />
                  <SubItem
                    href="/converter/adarshalipi"
                    label="আদর্শলিপি কনভার্টার"
                    icon={ArrowLeftRight}
                    isActive={pathname === "/converter/adarshalipi"}
                    onClick={closeMobile}
                    collapsed={collapsed}
                    onHover={handleMouseEnter}
                    onLeave={handleMouseLeave}
                  />
                  <SubItem
                    href="/converter/image"
                    label="ইমেজ ফরম্যাট কনভার্টার"
                    icon={ImageIcon}
                    isActive={pathname === "/converter/image"}
                    onClick={closeMobile}
                    collapsed={collapsed}
                    onHover={handleMouseEnter}
                    onLeave={handleMouseLeave}
                  />
                  <SubItem
                    href="/converter/document"
                    label="ডকুমেন্ট কনভার্টার"
                    icon={FileText}
                    isActive={pathname === "/converter/document"}
                    onClick={closeMobile}
                    collapsed={collapsed}
                    onHover={handleMouseEnter}
                    onLeave={handleMouseLeave}
                  />
                  <SubItem
                    href="/converter/media"
                    label="মিডিয়া কনভার্টার (Audio/Video)"
                    icon={Volume2}
                    isActive={pathname === "/converter/media"}
                    onClick={closeMobile}
                    collapsed={collapsed}
                    onHover={handleMouseEnter}
                    onLeave={handleMouseLeave}
                  />
                  <SubItem
                    href="/converter/file-data"
                    label="ডাটা ফাইল কনভার্টার"
                    icon={FolderArchive}
                    isActive={pathname === "/converter/file-data"}
                    onClick={closeMobile}
                    collapsed={collapsed}
                    onHover={handleMouseEnter}
                    onLeave={handleMouseLeave}
                  />

                  {/* Extra Measurement Units Collapsible */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setIsExtraConvertersOpen(!isExtraConvertersOpen)}
                      className={cn(
                        "flex w-full min-h-[38px] items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors",
                        collapsed && "justify-center px-1"
                      )}
                    >
                      <span className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 shrink-0" />
                        {!collapsed && <span>অন্যান্য একক পরিমাপ ({10})</span>}
                      </span>
                      {!collapsed && (
                        isExtraConvertersOpen ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )
                      )}
                    </button>

                    {isExtraConvertersOpen && (
                      <div className={cn("space-y-0.5 pt-1", !collapsed && "ml-3 pl-2 border-l border-zinc-200 dark:border-zinc-800")}>
                        <SubItem
                          href="/converter/length"
                          label="দৈর্ঘ্য কনভার্টার"
                          icon={Ruler}
                          isActive={pathname === "/converter/length"}
                          onClick={closeMobile}
                          collapsed={collapsed}
                          onHover={handleMouseEnter}
                          onLeave={handleMouseLeave}
                        />
                        <SubItem
                          href="/converter/weight"
                          label="ওজন কনভার্টার"
                          icon={Scale}
                          isActive={pathname === "/converter/weight"}
                          onClick={closeMobile}
                          collapsed={collapsed}
                          onHover={handleMouseEnter}
                          onLeave={handleMouseLeave}
                        />
                        <SubItem
                          href="/converter/volume"
                          label="পরিমাণ (Volume)"
                          icon={Boxes}
                          isActive={pathname === "/converter/volume"}
                          onClick={closeMobile}
                          collapsed={collapsed}
                          onHover={handleMouseEnter}
                          onLeave={handleMouseLeave}
                        />
                        <SubItem
                          href="/converter/land"
                          label="জমি ও ভূমির পরিমাপ"
                          icon={Compass}
                          isActive={pathname === "/converter/land"}
                          onClick={closeMobile}
                          collapsed={collapsed}
                          onHover={handleMouseEnter}
                          onLeave={handleMouseLeave}
                        />
                        <SubItem
                          href="/converter/time"
                          label="সময় কনভার্টার"
                          icon={Clock}
                          isActive={pathname === "/converter/time"}
                          onClick={closeMobile}
                          collapsed={collapsed}
                          onHover={handleMouseEnter}
                          onLeave={handleMouseLeave}
                        />
                        <SubItem
                          href="/converter/area"
                          label="এলাকা / ক্ষেত্রফল"
                          icon={Compass}
                          isActive={pathname === "/converter/area"}
                          onClick={closeMobile}
                          collapsed={collapsed}
                          onHover={handleMouseEnter}
                          onLeave={handleMouseLeave}
                        />
                        <SubItem
                          href="/converter/temperature"
                          label="তাপমাত্রা কনভার্টার"
                          icon={Thermometer}
                          isActive={pathname === "/converter/temperature"}
                          onClick={closeMobile}
                          collapsed={collapsed}
                          onHover={handleMouseEnter}
                          onLeave={handleMouseLeave}
                        />
                        <SubItem
                          href="/converter/speed"
                          label="গতিবেগ কনভার্টার"
                          icon={Gauge}
                          isActive={pathname === "/converter/speed"}
                          onClick={closeMobile}
                          collapsed={collapsed}
                          onHover={handleMouseEnter}
                          onLeave={handleMouseLeave}
                        />
                        <SubItem
                          href="/converter/data"
                          label="ডেটা স্টোরেজ কনভার্টার"
                          icon={HardDrive}
                          isActive={pathname === "/converter/data"}
                          onClick={closeMobile}
                          collapsed={collapsed}
                          onHover={handleMouseEnter}
                          onLeave={handleMouseLeave}
                        />
                        <SubItem
                          href="/converter/energy"
                          label="শক্তি/পাওয়ার কনভার্টার"
                          icon={Zap}
                          isActive={pathname === "/converter/energy"}
                          onClick={closeMobile}
                          collapsed={collapsed}
                          onHover={handleMouseEnter}
                          onLeave={handleMouseLeave}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Module 4: BANGLA */}
              {activeModule === "bangla" && (
                <div className="space-y-1">
                  <SubItem
                    href="/bangla/calendar"
                    label="বাংলা ও ইংরেজি ক্যালেন্ডার"
                    icon={CalendarDays}
                    isActive={pathname === "/bangla/calendar"}
                    onClick={closeMobile}
                    collapsed={collapsed}
                    onHover={handleMouseEnter}
                    onLeave={handleMouseLeave}
                  />
                  <SubItem
                    href="/bangla/holiday"
                    label="সরকারি ছুটির তালিকা"
                    icon={CalendarRange}
                    isActive={pathname === "/bangla/holiday"}
                    onClick={closeMobile}
                    collapsed={collapsed}
                    onHover={handleMouseEnter}
                    onLeave={handleMouseLeave}
                  />
                </div>
              )}

              {/* Module 5: BANGLADESH */}
              {activeModule === "bangladesh" && (
                <div className="space-y-1">
                  <SubItem
                    href="/bangladesh/introduction"
                    label="পরিচিতি ও ভৌগোলিক তথ্য"
                    icon={Flag}
                    isActive={pathname.startsWith("/bangladesh/introduction")}
                    onClick={closeMobile}
                    collapsed={collapsed}
                    onHover={handleMouseEnter}
                    onLeave={handleMouseLeave}
                  />
                  <SubItem
                    href="/bangladesh/tourism"
                    label="দর্শনীয় স্থান ও পর্যটন"
                    icon={MapPin}
                    isActive={pathname === "/bangladesh/tourism"}
                    onClick={closeMobile}
                    collapsed={collapsed}
                    onHover={handleMouseEnter}
                    onLeave={handleMouseLeave}
                  />
                  <SubItem
                    href="/bangladesh/history"
                    label="ইতিহাস ও স্বাধীনতা"
                    icon={BookOpen}
                    isActive={pathname === "/bangladesh/history"}
                    onClick={closeMobile}
                    collapsed={collapsed}
                    onHover={handleMouseEnter}
                    onLeave={handleMouseLeave}
                  />
                  <SubItem
                    href="/bangladesh/establishment"
                    label="ঐতিহাসিক স্থাপনা"
                    icon={Landmark}
                    isActive={pathname === "/bangladesh/establishment"}
                    onClick={closeMobile}
                    collapsed={collapsed}
                    onHover={handleMouseEnter}
                    onLeave={handleMouseLeave}
                  />
                  <SubItem
                    href="/bangladesh/public-figure"
                    label="প্রখ্যাত গুণীজন"
                    icon={User}
                    isActive={pathname === "/bangladesh/public-figure"}
                    onClick={closeMobile}
                    collapsed={collapsed}
                    onHover={handleMouseEnter}
                    onLeave={handleMouseLeave}
                  />
                </div>
              )}

              {/* Module 6: ISLAM */}
              {activeModule === "islam" && (
                <div className="space-y-1">
                  <SubItem
                    href="/islam/basic"
                    label="ইসলামের মৌলিক বিষয়"
                    icon={BookOpen}
                    isActive={pathname === "/islam/basic"}
                    onClick={closeMobile}
                    collapsed={collapsed}
                    onHover={handleMouseEnter}
                    onLeave={handleMouseLeave}
                  />
                  <SubItem
                    href="/islam/dowan"
                    label="প্রয়োজনীয় দোয়া ও মোনাজাত"
                    icon={Sparkles}
                    isActive={pathname === "/islam/dowan"}
                    onClick={closeMobile}
                    collapsed={collapsed}
                    onHover={handleMouseEnter}
                    onLeave={handleMouseLeave}
                  />
                </div>
              )}

              {/* Module 7: SOFTWARE */}
              {activeModule === "software" && (
                <div className="space-y-1">
                  <SubItem
                    href="/software/all"
                    label="সব সফটওয়্যার"
                    icon={Laptop}
                    isActive={pathname === "/software/all"}
                    onClick={closeMobile}
                    collapsed={collapsed}
                    onHover={handleMouseEnter}
                    onLeave={handleMouseLeave}
                  />
                  {softwarePlatforms.map((platform) => (
                    <SubItem
                      key={platform}
                      href={`/software/all/${encodeURIComponent(platform)}`}
                      label={platform}
                      icon={Cpu}
                      isActive={pathname === `/software/all/${platform}`}
                      onClick={closeMobile}
                      collapsed={collapsed}
                      onHover={handleMouseEnter}
                      onLeave={handleMouseLeave}
                    />
                  ))}
                </div>
              )}

              {/* Module 8: CONTACT */}
              {activeModule === "contact" && (
                <div className="space-y-1">
                  <SubItem
                    href="/contact/police"
                    label="বাংলাদেশ পুলিশ"
                    icon={PhoneCall}
                    isActive={pathname === "/contact/police"}
                    onClick={closeMobile}
                    collapsed={collapsed}
                    onHover={handleMouseEnter}
                    onLeave={handleMouseLeave}
                  />
                  {contactCategories
                    .filter((cat) => cat.slug !== "police")
                    .map((cat) => (
                      <SubItem
                        key={cat.slug || cat.id}
                        href={`/contact/${cat.slug}`}
                        label={cat.name}
                        icon={Phone}
                        isActive={pathname === `/contact/${cat.slug}`}
                        onClick={closeMobile}
                        collapsed={collapsed}
                        onHover={handleMouseEnter}
                        onLeave={handleMouseLeave}
                      />
                    ))}
                </div>
              )}

              {/* Module 9: SIGNS */}
              {activeModule === "signs" && (
                <div className="space-y-1">
                  <SubItem
                    href="/signs/all"
                    label="সকল সংকেত"
                    icon={ShieldAlert}
                    isActive={pathname === "/signs/all"}
                    onClick={closeMobile}
                    collapsed={collapsed}
                    onHover={handleMouseEnter}
                    onLeave={handleMouseLeave}
                  />
                  {signCategories.map((cat) => (
                    <SubItem
                      key={cat.slug || cat.id}
                      href={`/signs/${cat.slug}`}
                      label={cat.name}
                      icon={ShieldAlert}
                      isActive={pathname.includes(cat.slug)}
                      onClick={closeMobile}
                      collapsed={collapsed}
                      onHover={handleMouseEnter}
                      onLeave={handleMouseLeave}
                    />
                  ))}
                </div>
              )}

              {/* Module 10: NEWS */}
              {activeModule === "news" && (
                <div className="space-y-1">
                  <SubItem
                    href="/news/headlines"
                    label="শীর্ষ সংবাদ"
                    icon={Newspaper}
                    isActive={pathname === "/news/headlines"}
                    onClick={closeMobile}
                    collapsed={collapsed}
                    onHover={handleMouseEnter}
                    onLeave={handleMouseLeave}
                  />
                  {(newsSources.bn ?? []).map((source: any) => (
                    <SubItem
                      key={source.key}
                      href={`/news/headlines/${encodeURIComponent(source.key)}`}
                      label={source.name}
                      badge={Number.isFinite(source.total) && source.total > 0 ? source.total : undefined}
                      isActive={pathname === `/news/headlines/${encodeURIComponent(source.key)}`}
                      onClick={closeMobile}
                      collapsed={collapsed}
                      onHover={handleMouseEnter}
                      onLeave={handleMouseLeave}
                    />
                  ))}
                </div>
              )}

              {/* Module 11: SETTINGS */}
              {activeModule === "settings" && (
                <div className="space-y-1">
                  <SubItem
                    href="/settings/profile"
                    label="প্রোফাইল"
                    icon={User}
                    isActive={pathname === "/settings/profile"}
                    onClick={closeMobile}
                    collapsed={collapsed}
                    onHover={handleMouseEnter}
                    onLeave={handleMouseLeave}
                  />
                  <SubItem
                    href="/settings/password"
                    label="পাসওয়ার্ড"
                    icon={Lock}
                    isActive={pathname === "/settings/password"}
                    onClick={closeMobile}
                    collapsed={collapsed}
                    onHover={handleMouseEnter}
                    onLeave={handleMouseLeave}
                  />
                  <SubItem
                    href="/settings/delete-account"
                    label="অ্যাকাউন্ট মুছুন"
                    icon={Trash2}
                    isActive={pathname === "/settings/delete-account"}
                    onClick={closeMobile}
                    collapsed={collapsed}
                    onHover={handleMouseEnter}
                    onLeave={handleMouseLeave}
                  />
                </div>
              )}

              {/* Quick Navigation to All Services */}
              {!collapsed && (
                <div className="pt-3 border-t border-zinc-200/60 dark:border-zinc-800/60 space-y-1">
                  <button
                    type="button"
                    onClick={() => setShowAllModules(true)}
                    className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-colors"
                  >
                    <Grid className="w-3.5 h-3.5" />
                    <span>অন্যান্য বিভাগ দেখুন</span>
                  </button>
                  <Link
                    href="/services"
                    onClick={closeMobile}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 rounded-xl transition-colors"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>সকল সেবার তালিকা</span>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            /* ========================================================================= */
            /* GLOBAL DIRECTORY: Shown when not in a module or when toggled "সকল বিভাগ"   */
            /* ========================================================================= */
            <nav className="space-y-1" aria-label="সকল বিভাগ ও মডিউল">
              {activeModule && !collapsed && (
                <div className="px-2 pb-2 mb-1 border-b border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">সকল প্রধান বিভাগ</span>
                  <button
                    type="button"
                    onClick={() => setShowAllModules(false)}
                    className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    বর্তমান মডিউল
                  </button>
                </div>
              )}

              <SubItem
                href="/international/world-clock"
                label="গ্লোবাল তথ্য / International"
                icon={Globe}
                isActive={pathname.startsWith("/international")}
                onClick={closeMobile}
                collapsed={collapsed}
                onHover={handleMouseEnter}
                onLeave={handleMouseLeave}
              />
              <SubItem
                href="/tools/internet-speed-test"
                label="টুলস ও ইউটিলিটি"
                icon={Wrench}
                isActive={pathname.startsWith("/tools")}
                onClick={closeMobile}
                collapsed={collapsed}
                onHover={handleMouseEnter}
                onLeave={handleMouseLeave}
              />
              <SubItem
                href="/converter/currency"
                label="কনভার্টার হাব"
                icon={ArrowLeftRight}
                isActive={pathname.startsWith("/converter")}
                onClick={closeMobile}
                collapsed={collapsed}
                onHover={handleMouseEnter}
                onLeave={handleMouseLeave}
              />
              <SubItem
                href="/bangla/calendar"
                label="বাংলা ক্যালেন্ডার ও ছুটি"
                icon={Calendar}
                isActive={pathname.startsWith("/bangla")}
                onClick={closeMobile}
                collapsed={collapsed}
                onHover={handleMouseEnter}
                onLeave={handleMouseLeave}
              />
              <SubItem
                href="/bangladesh/introduction"
                label="বাংলাদেশ তথ্য"
                icon={Flag}
                isActive={pathname.startsWith("/bangladesh")}
                onClick={closeMobile}
                collapsed={collapsed}
                onHover={handleMouseEnter}
                onLeave={handleMouseLeave}
              />
              <SubItem
                href="/islam/basic"
                label="ইসলামিক জ্ঞান"
                icon={Moon}
                isActive={pathname.startsWith("/islam")}
                onClick={closeMobile}
                collapsed={collapsed}
                onHover={handleMouseEnter}
                onLeave={handleMouseLeave}
              />
              <SubItem
                href="/software/all"
                label="সফটওয়্যার ডিরেক্টরি"
                icon={Cpu}
                isActive={pathname.startsWith("/software")}
                onClick={closeMobile}
                collapsed={collapsed}
                onHover={handleMouseEnter}
                onLeave={handleMouseLeave}
              />
              <SubItem
                href="/contact/police"
                label="জরুরী নাম্বার ও সেবা"
                icon={PhoneCall}
                isActive={pathname.startsWith("/contact")}
                onClick={closeMobile}
                collapsed={collapsed}
                onHover={handleMouseEnter}
                onLeave={handleMouseLeave}
              />
              <SubItem
                href="/signs/all"
                label="সংকেত ও সচেতনতা"
                icon={ShieldAlert}
                isActive={pathname.startsWith("/signs")}
                onClick={closeMobile}
                collapsed={collapsed}
                onHover={handleMouseEnter}
                onLeave={handleMouseLeave}
              />
              <SubItem
                href="/news/headlines"
                label="সংবাদ শিরোনাম"
                icon={Newspaper}
                isActive={pathname.startsWith("/news")}
                onClick={closeMobile}
                collapsed={collapsed}
                onHover={handleMouseEnter}
                onLeave={handleMouseLeave}
              />

              <div className="pt-1.5 border-t border-zinc-200/60 dark:border-zinc-800/60">
                <SubItem
                  href="/ai/chat"
                  label="Totthobox AI"
                  icon={Sparkles}
                  isActive={pathname.startsWith("/ai")}
                  onClick={closeMobile}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
              </div>
            </nav>
          )}
        </div>

        {/* Footer: Settings & Profile */}
        <div className="shrink-0 space-y-1.5 border-t border-zinc-200/60 dark:border-zinc-800/60 p-2.5 bg-zinc-50/50 dark:bg-zinc-900/50">
          <button
            type="button"
            onClick={openSettingsModal}
            onMouseEnter={(e) => handleMouseEnter(e, "সেটিংস")}
            onMouseLeave={handleMouseLeave}
            className={cn(
              "flex w-full min-h-[44px] items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors",
              collapsed && "justify-center px-2"
            )}
            title="সেটিংস"
            aria-label="সেটিংস"
          >
            <IoSettings className="h-5 w-5 shrink-0 text-zinc-500" />
            {!collapsed && <span className="truncate flex-1 text-left">সেটিংস</span>}
          </button>

          <ProfileMenu
            variant="sidebar"
            collapsed={collapsed}
            onHover={handleMouseEnter}
            onLeave={handleMouseLeave}
          />
        </div>
      </aside>
    </>
  );
}
