"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandIcon from "@/components/BrandIcon";
import SearchTrigger from "@/components/search/SearchTrigger";
import ProfileMenu from "./ProfileMenu";
import { useSettingsModal } from "@/context/SettingsModalContext";
import { useSidebar } from "@/context/SidebarContext";
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
  MapPin,
  Flag,
  BookOpen,
  Moon,
  ShieldAlert,
  Newspaper,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
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
  Settings,
  MessageSquare,
  Heart,
} from "lucide-react";

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

type SubItemProps = {
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  isActive: boolean;
  badge?: string | number;
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
  collapsed,
  onHover,
  onLeave,
}: SubItemProps) {
  return (
    <Link
      href={href}
      onMouseEnter={(e) => onHover?.(e, label)}
      onMouseLeave={onLeave}
      className={cn(
        "group flex min-h-9 w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors duration-150",
        isActive
          ? "bg-[var(--accent-soft)] text-[var(--accent-ink)]"
          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/70 dark:hover:text-zinc-100",
        collapsed && "justify-center px-2",
      )}
    >
      {Icon && (
        <Icon
          strokeWidth={1.75}
          className={cn(
            "size-4 shrink-0 transition-colors",
            isActive
              ? "text-[var(--accent-ink)]"
              : "text-zinc-400 group-hover:text-zinc-700 dark:text-zinc-500 dark:group-hover:text-zinc-300",
          )}
        />
      )}
      {!collapsed && <span className="flex-1 truncate text-left">{label}</span>}
      {!collapsed && badge !== undefined && (
        <span className="ml-auto rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-mono text-xs text-zinc-600 tabular-nums dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          {badge}
        </span>
      )}
    </Link>
  );
}

interface NewsSourceItem {
  key: string;
  name: string;
  total: number;
  language: string;
}

interface DynamicCategoryItem {
  id?: string | number;
  slug: string;
  name: string;
}

export default function Sidebar() {
  const { openSettingsModal } = useSettingsModal();
  const pathname = usePathname();
  const { isCollapsed, toggleCollapsed } = useSidebar();

  const [tooltip, setTooltip] = useState<{ label: string; top: number } | null>(
    null,
  );
  const [showAllModules, setShowAllModules] = useState(false);

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
      pathname.startsWith("/converter/energy"),
  );

  const activeModule = useMemo(() => {
    if (pathname.startsWith("/international")) return "international";
    if (pathname.startsWith("/tools")) return "tools";
    if (pathname.startsWith("/converter")) return "converter";
    if (pathname.startsWith("/bangla")) return "bangla";
    if (pathname.startsWith("/bangladesh")) return "bangladesh";
    if (pathname.startsWith("/islam")) return "islam";
    if (pathname.startsWith("/contact")) return "contact";
    if (pathname.startsWith("/signs")) return "signs";
    if (pathname.startsWith("/news")) return "news";
    if (pathname.startsWith("/settings")) return "settings";
    return null;
  }, [pathname]);

  useEffect(() => {
    setShowAllModules(false);
  }, [pathname]);

  const [newsSources, setNewsSources] = useState<{
    bn?: NewsSourceItem[];
    en?: NewsSourceItem[];
    other?: NewsSourceItem[];
  }>({});
  const [contactCategories, setContactCategories] = useState<
    DynamicCategoryItem[]
  >([]);
  const [signCategories, setSignCategories] = useState<DynamicCategoryItem[]>(
    [],
  );

  const API_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

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
            const normalizeSource = (
              source: Record<string, unknown>,
            ): NewsSourceItem => ({
              key: String(source?.key ?? source?.source_key ?? ""),
              name: String(
                source?.name ?? source?.source_name ?? source?.title ?? "",
              ).trim(),
              total: Number(source?.total ?? source?.count ?? 0),
              language: String(source?.language ?? "").toLowerCase(),
            });
            const normalizedList = sourceList
              .map(normalizeSource)
              .filter((source: NewsSourceItem) => source.key && source.name);
            const normalizeGroup = (items: Record<string, unknown>[]) =>
              items
                .map(normalizeSource)
                .filter((source: NewsSourceItem) => source.key && source.name);
            const groupedBn = Array.isArray(data?.bn)
              ? normalizeGroup(data.bn)
              : [];
            const groupedEn = Array.isArray(data?.en)
              ? normalizeGroup(data.en)
              : [];
            const isBn = (source: NewsSourceItem) =>
              source.language === "bn" || source.language.startsWith("bn-");
            const isEn = (source: NewsSourceItem) =>
              source.language === "en" || source.language.startsWith("en-");
            setNewsSources({
              bn: groupedBn.length ? groupedBn : normalizedList.filter(isBn),
              en: groupedEn.length ? groupedEn : normalizedList.filter(isEn),
              other: normalizedList.filter(
                (source: NewsSourceItem) => !isBn(source) && !isEn(source),
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
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          // graceful fallback
        }
      }
    };

    void fetchData();
    return () => controller.abort();
  }, [pathname, API_URL, showAllModules]);

  const collapsed = isCollapsed;

  const handleMouseEnter = (
    e: React.MouseEvent<HTMLElement>,
    label: string,
  ) => {
    if (!collapsed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ label, top: rect.top + rect.height / 2 });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  return (
    <aside
      aria-label="সাইডবার নেভিগেশন"
      className={cn(
        "hidden md:sticky md:top-0 md:flex h-dvh shrink-0 flex-col bg-[var(--surface-sunken)] shadow-[1px_0_0_var(--surface-hairline)] transition-[width] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
        collapsed ? "w-16" : "w-64",
      )}
      onMouseLeave={handleMouseLeave}
    >
      {/* Tooltip for collapsed rail */}
      {collapsed && tooltip && (
        <div
          className="pointer-events-none fixed left-18 z-60 -translate-y-1/2 whitespace-nowrap rounded-lg border border-zinc-200 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white shadow-md dark:border-zinc-700 dark:bg-zinc-100 dark:text-zinc-900"
          style={{ top: tooltip.top }}
        >
          {tooltip.label}
        </div>
      )}

      {/* Header */}
      <div
        className={cn(
          "flex h-14 shrink-0 items-center",
          collapsed ? "justify-center" : "justify-between px-4",
        )}
      >
        {!collapsed && (
          <>
            <Link
              href="/"
              className="flex items-center gap-2 text-base font-semibold text-zinc-900 dark:text-zinc-100"
            >
              <BrandIcon className="size-6 shrink-0" />
              <span className="truncate">Totthobox</span>
            </Link>

            <button
              type="button"
              onClick={toggleCollapsed}
              className="flex min-h-10 min-w-10 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              title="সাইডবার সংকুচিত করুন"
              aria-label="সাইডবার সংকুচিত করুন"
            >
              <PanelLeftClose className="size-4.5" strokeWidth={1.75} />
            </button>
          </>
        )}

        {collapsed && (
          <button
            type="button"
            aria-label="সাইডবার প্রসারিত করুন"
            className="group relative flex min-h-10 min-w-10 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
            onMouseEnter={(e) => handleMouseEnter(e, "সাইডবার প্রসারিত করুন")}
            onMouseLeave={handleMouseLeave}
            onClick={toggleCollapsed}
          >
            <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-150 group-hover:pointer-events-none group-hover:opacity-0">
              <BrandIcon className="size-6" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center text-zinc-900 opacity-0 transition-opacity duration-150 group-hover:opacity-100 dark:text-zinc-100">
              <PanelLeft className="size-4.5" strokeWidth={1.75} />
            </div>
          </button>
        )}
      </div>

      {/* Scrollable Navigation */}
      <div
        className="flex-1 space-y-3 overflow-y-auto p-3"
        onScroll={handleMouseLeave}
      >
        <SearchTrigger
          className="w-full"
          collapsed={collapsed}
          onHover={handleMouseEnter}
          onLeave={handleMouseLeave}
          showLabel={true}
        />

        {activeModule && !showAllModules ? (
          <div className="space-y-2">
            {!collapsed && (
              <div className="flex items-center justify-between px-1 pb-1.5 pt-2">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                  {activeModule === "international" && "গ্লোবাল তথ্য"}
                  {activeModule === "tools" && "টুলস ও ইউটিলিটি"}
                  {activeModule === "converter" && "কনভার্টার হাব"}
                  {activeModule === "bangla" && "ক্যালেন্ডার ও ছুটি"}
                  {activeModule === "bangladesh" && "বাংলাদেশ তথ্য"}
                  {activeModule === "islam" && "ইসলামিক জ্ঞান"}
                  {activeModule === "contact" && "জরুরি নম্বর"}
                  {activeModule === "signs" && "সংকেত ও নিয়ম"}
                  {activeModule === "news" && "সংবাদ শিরোনাম"}
                  {activeModule === "settings" && "অ্যাকাউন্ট সেটিংস"}
                </span>

                <button
                  type="button"
                  onClick={() => setShowAllModules(true)}
                  className="rounded px-1.5 py-1 text-xs font-medium text-[var(--accent-ink)] hover:underline"
                >
                  সকল বিভাগ
                </button>
              </div>
            )}

            {activeModule === "international" && (
              <div className="space-y-0.5">
                <SubItem
                  href="/international/world-clock"
                  label="বিশ্ব ঘড়ি ও টাইমজোন"
                  icon={Clock}
                  isActive={pathname === "/international/world-clock"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
                <SubItem
                  href="/international/crypto-forex"
                  label="ক্রিপ্টো ও ফরেক্স রেট"
                  icon={CircleDollarSign}
                  isActive={pathname === "/international/crypto-forex"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
                <SubItem
                  href="/international/calling-codes"
                  label="আন্তর্জাতিক ডায়ালিং কোড"
                  icon={Phone}
                  isActive={pathname === "/international/calling-codes"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
                <SubItem
                  href="/international/all-country"
                  label="বিশ্বের দেশ ও বিশ্বকোষ"
                  icon={Globe}
                  isActive={pathname === "/international/all-country"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
              </div>
            )}

            {activeModule === "tools" && (
              <div className="space-y-0.5">
                <SubItem
                  href="/tools/internet-speed-test"
                  label="ইন্টারনেট স্পিড টেস্ট"
                  icon={Gauge}
                  isActive={pathname === "/tools/internet-speed-test"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
                <SubItem
                  href="/tools/tax-vat-calculator"
                  label="আয়কর ও ভ্যাট হিসাব"
                  icon={Receipt}
                  isActive={pathname === "/tools/tax-vat-calculator"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
                <SubItem
                  href="/tools/password-generator"
                  label="পাসওয়ার্ড জেনারেটর"
                  icon={KeyRound}
                  isActive={pathname === "/tools/password-generator"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
                <SubItem
                  href="/tools/image-resizer"
                  label="ইমেজ স্টুডিও (Resizer)"
                  icon={ImageIcon}
                  isActive={pathname === "/tools/image-resizer"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
                <SubItem
                  href="/tools/age-calculator"
                  label="বয়স ক্যালকুলেটর"
                  icon={CalendarDays}
                  isActive={pathname === "/tools/age-calculator"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
                <SubItem
                  href="/tools/percentage-calculator"
                  label="পার্সেন্টেজ ক্যালকুলেটর"
                  icon={Percent}
                  isActive={pathname === "/tools/percentage-calculator"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
                <SubItem
                  href="/tools/word-and-character-counter"
                  label="ওয়ার্ড ও অক্ষর কাউন্টার"
                  icon={FileText}
                  isActive={pathname === "/tools/word-and-character-counter"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
                <SubItem
                  href="/tools/qrcode-generator"
                  label="প্রফেশনাল QR কোড"
                  icon={QrCode}
                  isActive={pathname === "/tools/qrcode-generator"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
                <SubItem
                  href="/tools/zodiac-calculator"
                  label="রাশিফল ক্যালকুলেটর"
                  icon={Compass}
                  isActive={pathname === "/tools/zodiac-calculator"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
                <SubItem
                  href="/tools/writing-practice"
                  label="শিশুশিক্ষা (Writing)"
                  icon={BookOpen}
                  isActive={pathname === "/tools/writing-practice"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
              </div>
            )}

            {activeModule === "converter" && (
              <div className="space-y-0.5">
                <SubItem
                  href="/converter/currency"
                  label="লাইভ কারেন্সি কনভার্টার"
                  icon={CircleDollarSign}
                  isActive={pathname === "/converter/currency"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
                <SubItem
                  href="/converter/number-to-word"
                  label="Number to Word"
                  icon={FileCode}
                  isActive={pathname === "/converter/number-to-word"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
                <SubItem
                  href="/converter/adarshalipi"
                  label="আদর্শলিপি কনভার্টার"
                  icon={ArrowLeftRight}
                  isActive={pathname === "/converter/adarshalipi"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
                <SubItem
                  href="/converter/image"
                  label="ইমেজ ফরম্যাট কনভার্টার"
                  icon={ImageIcon}
                  isActive={pathname === "/converter/image"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
                <SubItem
                  href="/converter/document"
                  label="ডকুমেন্ট কনভার্টার"
                  icon={FileText}
                  isActive={pathname === "/converter/document"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
                <SubItem
                  href="/converter/media"
                  label="মিডিয়া কনভার্টার"
                  icon={Volume2}
                  isActive={pathname === "/converter/media"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
                <SubItem
                  href="/converter/file-data"
                  label="ডাটা ফাইল কনভার্টার"
                  icon={FolderArchive}
                  isActive={pathname === "/converter/file-data"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      setIsExtraConvertersOpen(!isExtraConvertersOpen)
                    }
                    className={cn(
                      "flex min-h-9 w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-semibold text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100",
                      collapsed && "justify-center px-1",
                    )}
                  >
                    <span className="flex items-center gap-1.5">
                      <Layers
                        className="size-3.5 shrink-0"
                        strokeWidth={1.75}
                      />
                      {!collapsed && <span>অন্যান্য একক পরিমাপ (১০)</span>}
                    </span>
                    {!collapsed &&
                      (isExtraConvertersOpen ? (
                        <ChevronDown className="size-3.5" strokeWidth={1.75} />
                      ) : (
                        <ChevronRight className="size-3.5" strokeWidth={1.75} />
                      ))}
                  </button>

                  {isExtraConvertersOpen && (
                    <div
                      className={cn(
                        "space-y-0.5 pt-1",
                        !collapsed &&
                          "ml-3 border-l border-zinc-200 pl-2 dark:border-zinc-800",
                      )}
                    >
                      <SubItem
                        href="/converter/length"
                        label="দৈর্ঘ্য কনভার্টার"
                        icon={Ruler}
                        isActive={pathname === "/converter/length"}
                        collapsed={collapsed}
                        onHover={handleMouseEnter}
                        onLeave={handleMouseLeave}
                      />
                      <SubItem
                        href="/converter/weight"
                        label="ওজন কনভার্টার"
                        icon={Scale}
                        isActive={pathname === "/converter/weight"}
                        collapsed={collapsed}
                        onHover={handleMouseEnter}
                        onLeave={handleMouseLeave}
                      />
                      <SubItem
                        href="/converter/volume"
                        label="পরিমাণ (Volume)"
                        icon={Boxes}
                        isActive={pathname === "/converter/volume"}
                        collapsed={collapsed}
                        onHover={handleMouseEnter}
                        onLeave={handleMouseLeave}
                      />
                      <SubItem
                        href="/converter/land"
                        label="জমি ও ভূমির পরিমাপ"
                        icon={Compass}
                        isActive={pathname === "/converter/land"}
                        collapsed={collapsed}
                        onHover={handleMouseEnter}
                        onLeave={handleMouseLeave}
                      />
                      <SubItem
                        href="/converter/time"
                        label="সময় কনভার্টার"
                        icon={Clock}
                        isActive={pathname === "/converter/time"}
                        collapsed={collapsed}
                        onHover={handleMouseEnter}
                        onLeave={handleMouseLeave}
                      />
                      <SubItem
                        href="/converter/area"
                        label="এলাকা / ক্ষেত্রফল"
                        icon={Compass}
                        isActive={pathname === "/converter/area"}
                        collapsed={collapsed}
                        onHover={handleMouseEnter}
                        onLeave={handleMouseLeave}
                      />
                      <SubItem
                        href="/converter/temperature"
                        label="তাপমাত্রা কনভার্টার"
                        icon={Thermometer}
                        isActive={pathname === "/converter/temperature"}
                        collapsed={collapsed}
                        onHover={handleMouseEnter}
                        onLeave={handleMouseLeave}
                      />
                      <SubItem
                        href="/converter/speed"
                        label="গতিবেগ কনভার্টার"
                        icon={Gauge}
                        isActive={pathname === "/converter/speed"}
                        collapsed={collapsed}
                        onHover={handleMouseEnter}
                        onLeave={handleMouseLeave}
                      />
                      <SubItem
                        href="/converter/data"
                        label="ডেটা স্টোরেজ কনভার্টার"
                        icon={HardDrive}
                        isActive={pathname === "/converter/data"}
                        collapsed={collapsed}
                        onHover={handleMouseEnter}
                        onLeave={handleMouseLeave}
                      />
                      <SubItem
                        href="/converter/energy"
                        label="শক্তি/পাওয়ার কনভার্টার"
                        icon={Zap}
                        isActive={pathname === "/converter/energy"}
                        collapsed={collapsed}
                        onHover={handleMouseEnter}
                        onLeave={handleMouseLeave}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeModule === "bangla" && (
              <div className="space-y-0.5">
                <SubItem
                  href="/bangla/calendar"
                  label="বাংলা ও ইংরেজি ক্যালেন্ডার"
                  icon={CalendarDays}
                  isActive={pathname === "/bangla/calendar"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
                <SubItem
                  href="/bangla/holiday"
                  label="সরকারি ছুটির তালিকা"
                  icon={CalendarRange}
                  isActive={pathname === "/bangla/holiday"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
              </div>
            )}

            {activeModule === "bangladesh" && (
              <div className="space-y-0.5">
                <SubItem
                  href="/bangladesh/introduction"
                  label="পরিচিতি ও ভৌগোলিক তথ্য"
                  icon={Flag}
                  isActive={pathname.startsWith("/bangladesh/introduction")}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
                <SubItem
                  href="/bangladesh/tourism"
                  label="দর্শনীয় স্থান ও পর্যটন"
                  icon={MapPin}
                  isActive={pathname === "/bangladesh/tourism"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
                <SubItem
                  href="/bangladesh/history"
                  label="ইতিহাস ও স্বাধীনতা"
                  icon={BookOpen}
                  isActive={pathname === "/bangladesh/history"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
                <SubItem
                  href="/bangladesh/establishment"
                  label="ঐতিহাসিক স্থাপনা"
                  icon={Landmark}
                  isActive={pathname === "/bangladesh/establishment"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
                <SubItem
                  href="/bangladesh/public-figure"
                  label="প্রখ্যাত গুণীজন"
                  icon={User}
                  isActive={pathname === "/bangladesh/public-figure"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
              </div>
            )}

            {activeModule === "islam" && (
              <div className="space-y-0.5">
                <SubItem
                  href="/islam/basic"
                  label="ইসলামের মৌলিক বিষয়"
                  icon={BookOpen}
                  isActive={pathname === "/islam/basic"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
                <SubItem
                  href="/islam/dowan"
                  label="প্রয়োজনীয় দোয়া ও মোনাজাত"
                  icon={Heart}
                  isActive={pathname === "/islam/dowan"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
              </div>
            )}

            {activeModule === "contact" && (
              <div className="space-y-0.5">
                <SubItem
                  href="/contact/police"
                  label="বাংলাদেশ পুলিশ"
                  icon={PhoneCall}
                  isActive={pathname === "/contact/police"}
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
                      collapsed={collapsed}
                      onHover={handleMouseEnter}
                      onLeave={handleMouseLeave}
                    />
                  ))}
              </div>
            )}

            {activeModule === "signs" && (
              <div className="space-y-0.5">
                <SubItem
                  href="/signs/all"
                  label="সকল সংকেত"
                  icon={ShieldAlert}
                  isActive={pathname === "/signs/all"}
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
                    collapsed={collapsed}
                    onHover={handleMouseEnter}
                    onLeave={handleMouseLeave}
                  />
                ))}
              </div>
            )}

            {activeModule === "news" && (
              <div className="space-y-0.5">
                <SubItem
                  href="/news/headlines"
                  label="শীর্ষ সংবাদ"
                  icon={Newspaper}
                  isActive={pathname === "/news/headlines"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
                {(newsSources.bn ?? []).map((source) => (
                  <SubItem
                    key={source.key}
                    href={`/news/headlines/${encodeURIComponent(source.key)}`}
                    label={source.name}
                    badge={
                      Number.isFinite(source.total) && source.total > 0
                        ? source.total
                        : undefined
                    }
                    isActive={
                      pathname ===
                      `/news/headlines/${encodeURIComponent(source.key)}`
                    }
                    collapsed={collapsed}
                    onHover={handleMouseEnter}
                    onLeave={handleMouseLeave}
                  />
                ))}
              </div>
            )}

            {activeModule === "settings" && (
              <div className="space-y-0.5">
                <SubItem
                  href="/settings/profile"
                  label="প্রোফাইল"
                  icon={User}
                  isActive={pathname === "/settings/profile"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
                <SubItem
                  href="/settings/password"
                  label="পাসওয়ার্ড"
                  icon={Lock}
                  isActive={pathname === "/settings/password"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
                <SubItem
                  href="/settings/delete-account"
                  label="অ্যাকাউন্ট মুছুন"
                  icon={Trash2}
                  isActive={pathname === "/settings/delete-account"}
                  collapsed={collapsed}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
              </div>
            )}

            {!collapsed && (
              <div className="space-y-1 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAllModules(true)}
                  className="flex min-h-10 w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-[var(--accent-ink)] transition-colors hover:bg-[var(--accent-soft)]"
                >
                  <Grid className="size-4" strokeWidth={1.75} />
                  <span>অন্যান্য বিভাগ দেখুন</span>
                </button>
                <Link
                  href="/services"
                  className="flex min-h-10 w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-200/60 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                >
                  <Layers className="size-4" strokeWidth={1.75} />
                  <span>সকল সেবার তালিকা</span>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <nav className="space-y-0.5" aria-label="সকল বিভাগ ও মডিউল">
            {activeModule && !collapsed && (
              <div className="mb-1 flex items-center justify-between px-1 pb-1.5 pt-1">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  সকল প্রধান বিভাগ
                </span>
                <button
                  type="button"
                  onClick={() => setShowAllModules(false)}
                  className="flex items-center gap-1 text-xs font-medium text-[var(--accent-ink)] hover:underline"
                >
                  <ArrowLeft className="size-3" strokeWidth={1.75} />
                  বর্তমান মডিউল
                </button>
              </div>
            )}

            <SubItem
              href="/international/world-clock"
              label="গ্লোবাল তথ্য"
              icon={Globe}
              isActive={pathname.startsWith("/international")}
              collapsed={collapsed}
              onHover={handleMouseEnter}
              onLeave={handleMouseLeave}
            />
            <SubItem
              href="/tools/internet-speed-test"
              label="টুলস ও ইউটিলিটি"
              icon={Wrench}
              isActive={pathname.startsWith("/tools")}
              collapsed={collapsed}
              onHover={handleMouseEnter}
              onLeave={handleMouseLeave}
            />
            <SubItem
              href="/converter/currency"
              label="কনভার্টার হাব"
              icon={ArrowLeftRight}
              isActive={pathname.startsWith("/converter")}
              collapsed={collapsed}
              onHover={handleMouseEnter}
              onLeave={handleMouseLeave}
            />
            <SubItem
              href="/bangla/calendar"
              label="বাংলা ক্যালেন্ডার ও ছুটি"
              icon={Calendar}
              isActive={pathname.startsWith("/bangla")}
              collapsed={collapsed}
              onHover={handleMouseEnter}
              onLeave={handleMouseLeave}
            />
            <SubItem
              href="/bangladesh/introduction"
              label="বাংলাদেশ তথ্য"
              icon={Flag}
              isActive={pathname.startsWith("/bangladesh")}
              collapsed={collapsed}
              onHover={handleMouseEnter}
              onLeave={handleMouseLeave}
            />
            <SubItem
              href="/islam/basic"
              label="ইসলামিক জ্ঞান"
              icon={Moon}
              isActive={pathname.startsWith("/islam")}
              collapsed={collapsed}
              onHover={handleMouseEnter}
              onLeave={handleMouseLeave}
            />
            <SubItem
              href="/contact/police"
              label="জরুরি নম্বর ও সেবা"
              icon={PhoneCall}
              isActive={pathname.startsWith("/contact")}
              collapsed={collapsed}
              onHover={handleMouseEnter}
              onLeave={handleMouseLeave}
            />
            <SubItem
              href="/signs/all"
              label="সংকেত ও সচেতনতা"
              icon={ShieldAlert}
              isActive={pathname.startsWith("/signs")}
              collapsed={collapsed}
              onHover={handleMouseEnter}
              onLeave={handleMouseLeave}
            />
            <SubItem
              href="/news/headlines"
              label="সংবাদ শিরোনাম"
              icon={Newspaper}
              isActive={pathname.startsWith("/news")}
              collapsed={collapsed}
              onHover={handleMouseEnter}
              onLeave={handleMouseLeave}
            />

            <div className="mt-2 pt-2">
              <SubItem
                href="/ai/chat"
                label="Totthobox AI"
                icon={MessageSquare}
                isActive={pathname.startsWith("/ai")}
                collapsed={collapsed}
                onHover={handleMouseEnter}
                onLeave={handleMouseLeave}
              />
            </div>
          </nav>
        )}
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 shrink-0 space-y-1 bg-[var(--surface-sunken)] p-2.5 shadow-[0_-1px_0_var(--surface-hairline)]">
        <button
          type="button"
          onClick={openSettingsModal}
          onMouseEnter={(e) => handleMouseEnter(e, "থিম ও সেটিংস")}
          onMouseLeave={handleMouseLeave}
          className={cn(
            "flex min-h-10 w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-200/60 dark:text-zinc-300 dark:hover:bg-zinc-800",
            collapsed && "justify-center px-2",
          )}
          title="থিম ও সেটিংস"
          aria-label="থিম ও সেটিংস"
        >
          <Settings
            className="size-4.5 shrink-0 text-zinc-500"
            strokeWidth={1.75}
          />
          {!collapsed && (
            <span className="flex-1 truncate text-left">থিম ও সেটিংস</span>
          )}
        </button>

        <ProfileMenu
          variant="sidebar"
          collapsed={collapsed}
          onHover={handleMouseEnter}
          onLeave={handleMouseLeave}
        />
      </div>
    </aside>
  );
}
