"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Clock,
  Globe,
  ArrowRightLeft,
  Search,
  Plus,
  X,
  Sun,
  Moon,
  Users,
  RotateCcw,
  Home,
  Check,
} from "lucide-react";
import { FavoriteButton } from "@/components/tools/QuickFavorites";
import {
  ShareToolButton,
  CopyResultButton,
} from "@/components/tools/ToolActions";

/* ------------------------------------------------------------------ */
/* Types & data                                                        */
/* ------------------------------------------------------------------ */

interface CityInfo {
  id: string;
  city: string; // Bengali
  en: string; // English (for search)
  country: string;
  timeZone: string;
  flag: string;
}

const HOME_TZ = "Asia/Dhaka";
const STORAGE_KEY = "totthobox:world-clock:v2";

const CITIES: CityInfo[] = [
  {
    id: "dhaka",
    city: "ঢাকা",
    en: "Dhaka",
    country: "বাংলাদেশ",
    timeZone: "Asia/Dhaka",
    flag: "🇧🇩",
  },
  {
    id: "london",
    city: "লন্ডন",
    en: "London",
    country: "যুক্তরাজ্য",
    timeZone: "Europe/London",
    flag: "🇬🇧",
  },
  {
    id: "newyork",
    city: "নিউইয়র্ক",
    en: "New York",
    country: "যুক্তরাষ্ট্র",
    timeZone: "America/New_York",
    flag: "🇺🇸",
  },
  {
    id: "losangeles",
    city: "লস অ্যাঞ্জেলেস",
    en: "Los Angeles",
    country: "যুক্তরাষ্ট্র",
    timeZone: "America/Los_Angeles",
    flag: "🇺🇸",
  },
  {
    id: "chicago",
    city: "শিকাগো",
    en: "Chicago",
    country: "যুক্তরাষ্ট্র",
    timeZone: "America/Chicago",
    flag: "🇺🇸",
  },
  {
    id: "toronto",
    city: "টরন্টো",
    en: "Toronto",
    country: "কানাডা",
    timeZone: "America/Toronto",
    flag: "🇨🇦",
  },
  {
    id: "dubai",
    city: "দুবাই",
    en: "Dubai",
    country: "সংযুক্ত আরব আমিরাত",
    timeZone: "Asia/Dubai",
    flag: "🇦🇪",
  },
  {
    id: "riyadh",
    city: "রিয়াদ",
    en: "Riyadh",
    country: "সৌদি আরব",
    timeZone: "Asia/Riyadh",
    flag: "🇸🇦",
  },
  {
    id: "doha",
    city: "দোহা",
    en: "Doha",
    country: "কাতার",
    timeZone: "Asia/Qatar",
    flag: "🇶🇦",
  },
  {
    id: "kuwait",
    city: "কুয়েত সিটি",
    en: "Kuwait",
    country: "কুয়েত",
    timeZone: "Asia/Kuwait",
    flag: "🇰🇼",
  },
  {
    id: "delhi",
    city: "নতুন দিল্লি",
    en: "New Delhi",
    country: "ভারত",
    timeZone: "Asia/Kolkata",
    flag: "🇮🇳",
  },
  {
    id: "karachi",
    city: "করাচি",
    en: "Karachi",
    country: "পাকিস্তান",
    timeZone: "Asia/Karachi",
    flag: "🇵🇰",
  },
  {
    id: "kualalumpur",
    city: "কুয়ালালামপুর",
    en: "Kuala Lumpur",
    country: "মালয়েশিয়া",
    timeZone: "Asia/Kuala_Lumpur",
    flag: "🇲🇾",
  },
  {
    id: "singapore",
    city: "সিঙ্গাপুর",
    en: "Singapore",
    country: "সিঙ্গাপুর",
    timeZone: "Asia/Singapore",
    flag: "🇸🇬",
  },
  {
    id: "tokyo",
    city: "টোকিও",
    en: "Tokyo",
    country: "জাপান",
    timeZone: "Asia/Tokyo",
    flag: "🇯🇵",
  },
  {
    id: "seoul",
    city: "সিউল",
    en: "Seoul",
    country: "দক্ষিণ কোরিয়া",
    timeZone: "Asia/Seoul",
    flag: "🇰🇷",
  },
  {
    id: "sydney",
    city: "সিডনি",
    en: "Sydney",
    country: "অস্ট্রেলিয়া",
    timeZone: "Australia/Sydney",
    flag: "🇦🇺",
  },
  {
    id: "berlin",
    city: "বার্লিন",
    en: "Berlin",
    country: "জার্মানি",
    timeZone: "Europe/Berlin",
    flag: "🇩🇪",
  },
  {
    id: "paris",
    city: "প্যারিস",
    en: "Paris",
    country: "ফ্রান্স",
    timeZone: "Europe/Paris",
    flag: "🇫🇷",
  },
  {
    id: "rome",
    city: "রোম",
    en: "Rome",
    country: "ইতালি",
    timeZone: "Europe/Rome",
    flag: "🇮🇹",
  },
  {
    id: "istanbul",
    city: "ইস্তাম্বুল",
    en: "Istanbul",
    country: "তুরস্ক",
    timeZone: "Europe/Istanbul",
    flag: "🇹🇷",
  },
  {
    id: "moscow",
    city: "মস্কো",
    en: "Moscow",
    country: "রাশিয়া",
    timeZone: "Europe/Moscow",
    flag: "🇷🇺",
  },
  {
    id: "cairo",
    city: "কায়রো",
    en: "Cairo",
    country: "মিসর",
    timeZone: "Africa/Cairo",
    flag: "🇪🇬",
  },
  {
    id: "beijing",
    city: "বেইজিং",
    en: "Beijing",
    country: "চীন",
    timeZone: "Asia/Shanghai",
    flag: "🇨🇳",
  },
];

const DEFAULT_IDS = [
  "dhaka",
  "london",
  "newyork",
  "dubai",
  "tokyo",
  "singapore",
];
const byId = (id: string) => CITIES.find((c) => c.id === id);
const byTz = (tz: string) => CITIES.find((c) => c.timeZone === tz);

const bnNum = new Intl.NumberFormat("bn-BD");

/* ------------------------------------------------------------------ */
/* Time helpers (timezone-correct, no external libs)                   */
/* ------------------------------------------------------------------ */

/** Offset of `tz` from UTC in minutes at the given instant. */
function getOffsetMinutes(tz: string, date: Date): number {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hourCycle: "h23",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    }).formatToParts(date);
    const m: Record<string, number> = {};
    for (const p of parts)
      if (p.type !== "literal") m[p.type] = parseInt(p.value, 10);
    const asUtc = Date.UTC(
      m.year,
      m.month - 1,
      m.day,
      m.hour % 24,
      m.minute,
      m.second,
    );
    const real = Math.floor(date.getTime() / 1000) * 1000;
    return Math.round((asUtc - real) / 60000);
  } catch {
    return 0;
  }
}

/** Convert a wall-clock date/time in `tz` into a real UTC instant. */
function zonedToUtc(dateStr: string, timeStr: string, tz: string): Date | null {
  const [y, mo, d] = dateStr.split("-").map(Number);
  const [h, mi] = timeStr.split(":").map(Number);
  if ([y, mo, d, h, mi].some((n) => Number.isNaN(n))) return null;
  const guess = Date.UTC(y, mo - 1, d, h, mi);
  const off1 = getOffsetMinutes(tz, new Date(guess));
  let utc = guess - off1 * 60000;
  const off2 = getOffsetMinutes(tz, new Date(utc));
  if (off2 !== off1) utc = guess - off2 * 60000; // DST edge
  return new Date(utc);
}

function formatUtcOffset(min: number): string {
  const sign = min >= 0 ? "+" : "-";
  const abs = Math.abs(min);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `UTC${sign}${h}${m ? `:${String(m).padStart(2, "0")}` : ""}`;
}

/** Local {y,m,d,h,min} in tz. */
function localParts(date: Date, tz: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hourCycle: "h23",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).formatToParts(date);
  const m: Record<string, number> = {};
  for (const p of parts)
    if (p.type !== "literal") m[p.type] = parseInt(p.value, 10);
  return { y: m.year, mo: m.month, d: m.day, h: m.hour % 24, mi: m.minute };
}

/** Whole-day difference between local dates of `tz` and `baseTz`. */
function dayDiff(date: Date, tz: string, baseTz: string): number {
  const a = localParts(date, tz);
  const b = localParts(date, baseTz);
  return Math.round(
    (Date.UTC(a.y, a.mo - 1, a.d) - Date.UTC(b.y, b.mo - 1, b.d)) / 86400000,
  );
}

function dayDiffLabel(diff: number): string {
  if (diff === 0) return "আজ";
  if (diff === 1) return "আগামীকাল";
  if (diff === -1) return "গতকাল";
  return diff > 0
    ? `${bnNum.format(diff)} দিন পরে`
    : `${bnNum.format(-diff)} দিন আগে`;
}

function diffLabel(min: number): string {
  if (min === 0) return "একই সময়";
  const abs = Math.abs(min);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  const text = `${h ? `${bnNum.format(h)} ঘণ্টা` : ""}${h && m ? " " : ""}${m ? `${bnNum.format(m)} মিনিট` : ""}`;
  return `${text} ${min > 0 ? "এগিয়ে" : "পিছিয়ে"}`;
}

type Slot = "work" | "edge" | "night";
function slotFor(hour: number): Slot {
  if (hour >= 9 && hour < 18) return "work";
  if ((hour >= 7 && hour < 9) || (hour >= 18 && hour < 22)) return "edge";
  return "night";
}
const SLOT_STYLE: Record<Slot, string> = {
  work: "bg-emerald-500",
  edge: "bg-amber-400",
  night: "bg-zinc-300 dark:bg-zinc-700",
};
const SLOT_LABEL: Record<Slot, string> = {
  work: "কাজের সময়",
  edge: "সকাল/সন্ধ্যা",
  night: "বিশ্রামের সময়",
};

/* ------------------------------------------------------------------ */
/* Shared styles                                                       */
/* ------------------------------------------------------------------ */

const fieldCls =
  "w-full min-h-12 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/80 px-3.5 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/40 text-zinc-900 dark:text-zinc-100";
const labelCls = "text-xs font-semibold text-zinc-500 dark:text-zinc-400";
const cardCls =
  "rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/70 shadow-xs";

type Tab = "clocks" | "converter" | "planner";

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function WorldClockClient() {
  const [now, setNow] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("clocks");
  const [hour12, setHour12] = useState(true);
  const [showSeconds, setShowSeconds] = useState(true);
  const [cityIds, setCityIds] = useState<string[]>(DEFAULT_IDS);
  const [hydrated, setHydrated] = useState(false);

  // Add-city search
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(false);

  // Converter
  const [baseDate, setBaseDate] = useState("");
  const [baseTime, setBaseTime] = useState("12:00");
  const [fromTz, setFromTz] = useState(HOME_TZ);
  const [toTz, setToTz] = useState("America/New_York");

  // Planner
  const [planHour, setPlanHour] = useState(10); // hour in Dhaka (0-23.5)

  /* ---- mount: clock, storage ---- */
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const today = new Date();
    const loc = localParts(today, HOME_TZ);
    setBaseDate(
      `${loc.y}-${String(loc.mo).padStart(2, "0")}-${String(loc.d).padStart(2, "0")}`,
    );
    setBaseTime(
      `${String(loc.h).padStart(2, "0")}:${String(loc.mi).padStart(2, "0")}`,
    );
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (Array.isArray(s.cityIds) && s.cityIds.length) {
          setCityIds(s.cityIds.filter((id: string) => byId(id)));
        }
        if (typeof s.hour12 === "boolean") setHour12(s.hour12);
        if (typeof s.showSeconds === "boolean") setShowSeconds(s.showSeconds);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ cityIds, hour12, showSeconds }),
      );
    } catch {
      /* ignore */
    }
  }, [cityIds, hour12, showSeconds, hydrated]);

  /* ---- formatters ---- */
  const formatTime = useCallback(
    (date: Date, timeZone: string, withSeconds = showSeconds) =>
      new Intl.DateTimeFormat("bn-BD", {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        ...(withSeconds ? { second: "2-digit" as const } : {}),
        hour12,
      }).format(date),
    [hour12, showSeconds],
  );

  const formatDate = (date: Date, timeZone: string) =>
    new Intl.DateTimeFormat("bn-BD", {
      timeZone,
      weekday: "short",
      day: "numeric",
      month: "short",
    }).format(date);

  /* ---- clocks tab ---- */
  const cities = useMemo(
    () => cityIds.map(byId).filter(Boolean) as CityInfo[],
    [cityIds],
  );
  const homeCity = byId("dhaka")!;
  const otherCities = cities.filter((c) => c.id !== "dhaka");

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CITIES.filter((c) => !cityIds.includes(c.id)).filter(
      (c) =>
        !q ||
        c.city.includes(query.trim()) ||
        c.en.toLowerCase().includes(q) ||
        c.country.includes(query.trim()),
    );
  }, [query, cityIds]);

  const addCity = (id: string) => {
    setCityIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setQuery("");
  };
  const removeCity = (id: string) =>
    setCityIds((prev) => prev.filter((x) => x !== id));
  const resetCities = () => setCityIds(DEFAULT_IDS);

  /* ---- converter ---- */
  const conversion = useMemo(() => {
    if (!baseDate || !baseTime) return null;
    const instant = zonedToUtc(baseDate, baseTime, fromTz);
    if (!instant) return null;
    try {
      const fmt = (tz: string) =>
        new Intl.DateTimeFormat("bn-BD", {
          timeZone: tz,
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12,
        }).format(instant);

      const timeOnly = new Intl.DateTimeFormat("bn-BD", {
        timeZone: toTz,
        hour: "2-digit",
        minute: "2-digit",
        hour12,
      }).format(instant);

      const dateOnly = new Intl.DateTimeFormat("bn-BD", {
        timeZone: toTz,
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(instant);

      const diff =
        getOffsetMinutes(toTz, instant) - getOffsetMinutes(fromTz, instant);
      const dd = dayDiff(instant, toTz, fromTz);
      const fromName = byTz(fromTz)?.city ?? fromTz;
      const toName = byTz(toTz)?.city ?? toTz;

      return {
        timeOnly,
        dateOnly,
        diff,
        dd,
        fromName,
        toName,
        original: fmt(fromTz),
        summary: `${fromName} এ ${fmt(fromTz)} = ${toName} এ ${fmt(toTz)}`,
      };
    } catch {
      return null;
    }
  }, [baseDate, baseTime, fromTz, toTz, hour12]);

  const swapTz = () => {
    setFromTz(toTz);
    setToTz(fromTz);
  };

  const setNowInConverter = () => {
    const loc = localParts(new Date(), fromTz);
    setBaseDate(
      `${loc.y}-${String(loc.mo).padStart(2, "0")}-${String(loc.d).padStart(2, "0")}`,
    );
    setBaseTime(
      `${String(loc.h).padStart(2, "0")}:${String(loc.mi).padStart(2, "0")}`,
    );
  };

  /* ---- planner ---- */
  const planInstant = useMemo(() => {
    if (!now) return null;
    const loc = localParts(now, HOME_TZ);
    const h = Math.floor(planHour);
    const m = planHour % 1 ? 30 : 0;
    const ds = `${loc.y}-${String(loc.mo).padStart(2, "0")}-${String(loc.d).padStart(2, "0")}`;
    return zonedToUtc(
      ds,
      `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
      HOME_TZ,
    );
  }, [now, planHour]);

  const planRows = useMemo(() => {
    if (!planInstant) return [];
    return cities.map((c) => {
      const p = localParts(planInstant, c.timeZone);
      return {
        city: c,
        hour: p.h,
        slot: slotFor(p.h),
        time: formatTime(planInstant, c.timeZone, false),
        day: dayDiff(planInstant, c.timeZone, HOME_TZ),
        offset: getOffsetMinutes(c.timeZone, planInstant),
      };
    });
  }, [planInstant, cities, formatTime]);

  const overlapCount = planRows.filter((r) => r.slot === "work").length;
  const bestHours = useMemo(() => {
    if (!now || cities.length < 2) return [] as number[];
    const base = localParts(now, HOME_TZ);
    const ds = `${base.y}-${String(base.mo).padStart(2, "0")}-${String(base.d).padStart(2, "0")}`;
    const res: number[] = [];
    for (let h = 0; h < 24; h++) {
      const inst = zonedToUtc(ds, `${String(h).padStart(2, "0")}:00`, HOME_TZ);
      if (!inst) continue;
      if (
        cities.every((c) => slotFor(localParts(inst, c.timeZone).h) === "work")
      )
        res.push(h);
    }
    return res;
  }, [now, cities]);

  /* ---- UI ---- */
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "clocks", label: "বিশ্ব ঘড়ি", icon: <Clock className="w-4 h-4" /> },
    {
      id: "converter",
      label: "রূপান্তর",
      icon: <ArrowRightLeft className="w-4 h-4" />,
    },
    {
      id: "planner",
      label: "মিটিং প্ল্যানার",
      icon: <Users className="w-4 h-4" />,
    },
  ];

  const homeIsDay = now
    ? slotFor(localParts(now, HOME_TZ).h) !== "night"
    : true;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-0 space-y-6 sm:space-y-8">
      {/* ---------- Header ---------- */}
      <header className="space-y-3 text-center">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            <Globe className="w-3.5 h-3.5" />
            আন্তর্জাতিক ডিজিটাল ইউটিলিটি
          </span>
          <FavoriteButton
            tool={{
              id: "world-clock",
              title: "বিশ্ব ঘড়ি ও টাইমজোন",
              path: "/international/world-clock",
              category: "গ্লোবাল তথ্য",
            }}
          />
          <ShareToolButton title="বিশ্ব ঘড়ি ও টাইমজোন কনভার্টার - Totthobox" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          বিশ্ব ঘড়ি ও টাইমজোন কনভার্টার
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
          লাইভ ঘড়ি দেখুন, যেকোনো দুই শহরের সময় রূপান্তর করুন এবং একাধিক দেশের
          সঙ্গে মিটিংয়ের সেরা সময় খুঁজে নিন।
        </p>
      </header>

      {/* ---------- Tabs ---------- */}
      <nav
        role="tablist"
        aria-label="টুল বিভাগ"
        className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-800/80"
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={activeTab === t.id}
            onClick={() => setActiveTab(t.id)}
            className={`min-h-11 px-2 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition flex items-center justify-center gap-1.5 sm:gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 ${
              activeTab === t.id
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            {t.icon}
            <span className="truncate">{t.label}</span>
          </button>
        ))}
      </nav>

      {/* ---------- Display settings ---------- */}
      {activeTab !== "converter" && (
        <div className="flex items-center justify-between gap-3 -mt-2">
          <div className="inline-flex p-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-800/80 text-xs font-semibold">
            {[
              { v: true, l: "১২ ঘণ্টা" },
              { v: false, l: "২৪ ঘণ্টা" },
            ].map((o) => (
              <button
                key={String(o.v)}
                onClick={() => setHour12(o.v)}
                aria-pressed={hour12 === o.v}
                className={`min-h-9 px-3 rounded-md transition ${
                  hour12 === o.v
                    ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-xs"
                    : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                }`}
              >
                {o.l}
              </button>
            ))}
          </div>
          {activeTab === "clocks" && (
            <label className="flex items-center gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 cursor-pointer select-none min-h-9">
              <input
                type="checkbox"
                checked={showSeconds}
                onChange={(e) => setShowSeconds(e.target.checked)}
                className="w-4 h-4 accent-emerald-600"
              />
              সেকেন্ড দেখান
            </label>
          )}
        </div>
      )}

      {/* ================= TAB 1: CLOCKS ================= */}
      {activeTab === "clocks" && (
        <section aria-label="লাইভ বিশ্ব ঘড়ি" className="space-y-4">
          {/* Home hero */}
          <article
            className="relative overflow-hidden rounded-[var(--radius-xl)] border border-zinc-200/80 bg-[var(--surface-card)] p-5 sm:p-6 shadow-[var(--shadow-xs)] dark:border-zinc-800"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className="text-3xl"
                  role="img"
                  aria-label={homeCity.country}
                >
                  {homeCity.flag}
                </span>
                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                    {homeCity.city}
                    <Home
                      className="w-3.5 h-3.5 text-zinc-400"
                      aria-label="আপনার অবস্থান"
                    />
                  </h2>
                  <p className="text-xs text-zinc-500 truncate">
                    {homeCity.country}
                  </p>
                </div>
              </div>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
                  homeIsDay
                    ? "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20"
                    : "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20"
                }`}
              >
                {homeIsDay ? (
                  <Sun className="w-3 h-3" />
                ) : (
                  <Moon className="w-3 h-3" />
                )}
                {homeIsDay ? "দিন" : "রাত"}
              </span>
            </div>

            <div className="mt-5">
              <p
                className="text-4xl sm:text-5xl font-extrabold tracking-tight tabular-nums text-zinc-900 dark:text-zinc-50 break-words"
                aria-live="off"
              >
                {now ? formatTime(now, HOME_TZ) : "--:--"}
              </p>
              <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
                {now ? formatDate(now, HOME_TZ) : "--"} ·{" "}
                {formatUtcOffset(now ? getOffsetMinutes(HOME_TZ, now) : 360)}
              </p>
            </div>
          </article>

          {/* City list */}
          {otherCities.length > 0 && (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {otherCities.map((c) => {
                const off = now ? getOffsetMinutes(c.timeZone, now) : 0;
                const homeOff = now ? getOffsetMinutes(HOME_TZ, now) : 360;
                const lp = now ? localParts(now, c.timeZone) : null;
                const slot = lp ? slotFor(lp.h) : "work";
                const isDay = lp ? lp.h >= 6 && lp.h < 18 : true;
                const dd = now ? dayDiff(now, c.timeZone, HOME_TZ) : 0;

                return (
                  <li
                    key={c.id}
                    className={`${cardCls} relative p-4 flex flex-col gap-3`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className="text-2xl"
                          role="img"
                          aria-label={c.country}
                        >
                          {c.flag}
                        </span>
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                            {c.city}
                          </h3>
                          <p className="text-xs text-zinc-500 truncate">
                            {c.country}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeCity(c.id)}
                        aria-label={`${c.city} সরান`}
                        className="shrink-0 min-h-9 min-w-9 -mr-1.5 -mt-1.5 rounded-full flex items-center justify-center text-zinc-400 hover:text-red-600 hover:bg-red-500/10 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-end justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-2xl font-extrabold tracking-tight tabular-nums text-zinc-900 dark:text-zinc-50">
                          {now ? formatTime(now, c.timeZone) : "--:--"}
                        </p>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          {now ? formatDate(now, c.timeZone) : "--"}
                          {dd !== 0 && (
                            <span className="text-zinc-600 dark:text-zinc-400">
                              {" "}
                              · {dayDiffLabel(dd)}
                            </span>
                          )}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${
                          isDay
                            ? "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20"
                            : "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20"
                        }`}
                      >
                        {isDay ? (
                          <Sun className="w-3 h-3" />
                        ) : (
                          <Moon className="w-3 h-3" />
                        )}
                        {isDay ? "দিন" : "রাত"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-zinc-100 dark:border-zinc-800/70 text-xs">
                      <span className="text-zinc-500">
                        ঢাকা থেকে {diffLabel(off - homeOff)}
                      </span>
                      <span className="inline-flex items-center gap-1.5 font-mono text-zinc-400">
                        <span
                          className={`w-2 h-2 rounded-full ${SLOT_STYLE[slot]}`}
                          aria-label={SLOT_LABEL[slot]}
                        />
                        {formatUtcOffset(off)}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Add city */}
          <div className={`${cardCls} p-4 space-y-3`}>
            {!adding ? (
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => setAdding(true)}
                  className="min-h-11 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold inline-flex items-center gap-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
                >
                  <Plus className="w-4 h-4" />
                  শহর যোগ করুন
                </button>
                <button
                  onClick={resetCities}
                  className="min-h-11 px-3 rounded-xl text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 inline-flex items-center gap-1.5 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  রিসেট
                </button>
              </div>
            ) : (
              <>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="শহর বা দেশের নাম লিখুন (বাংলা/English)"
                    className={`${fieldCls} pl-10 pr-11`}
                    aria-label="শহর খুঁজুন"
                  />
                  <button
                    onClick={() => {
                      setAdding(false);
                      setQuery("");
                    }}
                    aria-label="বন্ধ করুন"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 min-h-9 min-w-9 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <ul className="max-h-60 overflow-y-auto -mx-1 px-1 space-y-1">
                  {searchResults.length === 0 && (
                    <li className="text-sm text-zinc-500 py-3 text-center">
                      কোনো শহর পাওয়া যায়নি। অন্য নাম দিয়ে খুঁজুন।
                    </li>
                  )}
                  {searchResults.map((c) => (
                    <li key={c.id}>
                      <button
                        onClick={() => addCity(c.id)}
                        className="w-full min-h-11 px-3 rounded-xl flex items-center justify-between gap-3 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                      >
                        <span className="flex items-center gap-2.5 min-w-0">
                          <span className="text-xl">{c.flag}</span>
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                              {c.city}{" "}
                              <span className="font-normal text-zinc-500">
                                ({c.en})
                              </span>
                            </span>
                            <span className="block text-xs text-zinc-500 truncate">
                              {c.country}
                            </span>
                          </span>
                        </span>
                        <Plus className="w-4 h-4 text-emerald-600 shrink-0" />
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </section>
      )}

      {/* ================= TAB 2: CONVERTER ================= */}
      {activeTab === "converter" && (
        <section aria-label="টাইমজোন রূপান্তর" className="space-y-4">
          <div className={`${cardCls} p-4 sm:p-5 space-y-4`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="wc-date" className={labelCls}>
                  তারিখ
                </label>
                <input
                  id="wc-date"
                  type="date"
                  value={baseDate}
                  onChange={(e) => setBaseDate(e.target.value)}
                  className={fieldCls}
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="wc-time" className={labelCls}>
                  সময়
                </label>
                <input
                  id="wc-time"
                  type="time"
                  value={baseTime}
                  onChange={(e) => setBaseTime(e.target.value)}
                  className={fieldCls}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-end">
              <div className="space-y-1.5">
                <label htmlFor="wc-from" className={labelCls}>
                  যে শহরের সময় (From)
                </label>
                <select
                  id="wc-from"
                  value={fromTz}
                  onChange={(e) => setFromTz(e.target.value)}
                  className={fieldCls}
                >
                  {CITIES.map((c) => (
                    <option key={`f-${c.id}`} value={c.timeZone}>
                      {c.flag} {c.city} ({c.en})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={swapTz}
                  aria-label="টাইমজোন অদলবদল করুন"
                  title="অদলবদল"
                  className="min-h-12 min-w-12 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition flex items-center justify-center shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
                >
                  <ArrowRightLeft className="w-4 h-4 text-zinc-600 dark:text-zinc-300 rotate-90 sm:rotate-0" />
                </button>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="wc-to" className={labelCls}>
                  যে শহরে রূপান্তর (To)
                </label>
                <select
                  id="wc-to"
                  value={toTz}
                  onChange={(e) => setToTz(e.target.value)}
                  className={fieldCls}
                >
                  {CITIES.map((c) => (
                    <option key={`t-${c.id}`} value={c.timeZone}>
                      {c.flag} {c.city} ({c.en})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={setNowInConverter}
              className="min-h-10 px-3 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10 inline-flex items-center gap-1.5 transition"
            >
              <Clock className="w-3.5 h-3.5" />
              এখনকার সময় বসান
            </button>
          </div>

          {conversion ? (
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5 text-center space-y-3">
              <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                {conversion.toName} এ সময়
              </p>
              <p className="text-4xl sm:text-5xl font-extrabold tracking-tight tabular-nums text-zinc-900 dark:text-zinc-50 break-words">
                {conversion.timeOnly}
              </p>
              <p className="text-sm text-zinc-700 dark:text-zinc-300">
                {conversion.dateOnly}
                {conversion.dd !== 0 && (
                  <span className="ml-1.5 inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-400">
                    {dayDiffLabel(conversion.dd)}
                  </span>
                )}
              </p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                {conversion.fromName} থেকে {conversion.toName}{" "}
                {diffLabel(conversion.diff)}
              </p>
              <div className="flex justify-center pt-1">
                <CopyResultButton
                  textToCopy={conversion.summary}
                  label="বিবরণী কপি করুন"
                />
              </div>
            </div>
          ) : (
            <p className="text-sm text-center text-zinc-500 py-4">
              তারিখ ও সময় দিন, ফলাফল এখানে দেখাবে।
            </p>
          )}
        </section>
      )}

      {/* ================= TAB 3: MEETING PLANNER ================= */}
      {activeTab === "planner" && (
        <section aria-label="মিটিং প্ল্যানার" className="space-y-4">
          <div className={`${cardCls} p-4 sm:p-5 space-y-4`}>
            <div className="flex items-center justify-between gap-3">
              <label
                htmlFor="wc-plan"
                className="text-sm font-bold text-zinc-900 dark:text-zinc-100"
              >
                ঢাকার সময় অনুযায়ী মিটিং
              </label>
              <span className="text-sm font-extrabold tabular-nums text-emerald-700 dark:text-emerald-400">
                {planInstant
                  ? formatTime(planInstant, HOME_TZ, false)
                  : "--:--"}
              </span>
            </div>
            <input
              id="wc-plan"
              type="range"
              min={0}
              max={23.5}
              step={0.5}
              value={planHour}
              onChange={(e) => setPlanHour(parseFloat(e.target.value))}
              className="w-full h-8 accent-emerald-600 cursor-pointer"
            />

            {/* legend */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
              {(Object.keys(SLOT_LABEL) as Slot[]).map((s) => (
                <span key={s} className="inline-flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-sm ${SLOT_STYLE[s]}`} />
                  {SLOT_LABEL[s]}
                </span>
              ))}
            </div>

            {cities.length < 2 ? (
              <p className="text-sm text-zinc-500 text-center py-3">
                তুলনা করতে &quot;বিশ্ব ঘড়ি&quot; ট্যাব থেকে আরও শহর যোগ করুন।
              </p>
            ) : (
              <ul className="space-y-3">
                {planRows.map((r) => (
                  <li key={r.city.id} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <span className="flex items-center gap-2 min-w-0">
                        <span className="text-lg">{r.city.flag}</span>
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                          {r.city.city}
                        </span>
                        <span className="text-xs font-mono text-zinc-400 shrink-0">
                          {formatUtcOffset(r.offset)}
                        </span>
                      </span>
                      <span className="flex items-center gap-2 shrink-0">
                        {r.day !== 0 && (
                          <span className="text-xs text-zinc-600 dark:text-zinc-400">
                            {dayDiffLabel(r.day)}
                          </span>
                        )}
                        <span className="font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
                          {r.time}
                        </span>
                      </span>
                    </div>
                    {/* 24h bar, aligned to Dhaka timeline, with marker at chosen hour */}
                    <div className="relative">
                      <div
                        className="grid grid-cols-24 gap-px h-2.5 rounded overflow-hidden"
                        style={{
                          gridTemplateColumns: "repeat(24, minmax(0, 1fr))",
                        }}
                      >
                        {Array.from({ length: 24 }, (_, h) => {
                          const offsetHours = Math.round((r.offset - 360) / 60);
                          const local = (((h + offsetHours) % 24) + 24) % 24;
                          return (
                            <span
                              key={h}
                              className={SLOT_STYLE[slotFor(local)]}
                            />
                          );
                        })}
                      </div>
                      <span
                        aria-hidden
                        className="absolute -top-1 -bottom-1 w-0.5 bg-zinc-900 dark:bg-white rounded"
                        style={{ left: `${(planHour / 24) * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {cities.length >= 2 && (
            <div
              className={`rounded-2xl border p-4 text-sm leading-relaxed ${
                overlapCount === cities.length
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200"
                  : "border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-300"
              }`}
            >
              <p className="flex items-start gap-2 font-semibold">
                {overlapCount === cities.length && (
                  <Check className="w-4 h-4 mt-0.5 shrink-0" />
                )}
                {bnNum.format(overlapCount)}/{bnNum.format(cities.length)} শহরে
                এখন কাজের সময়।
              </p>
              <p className="mt-1 text-xs sm:text-sm">
                {bestHours.length
                  ? `সব শহরের কাজের সময় মেলে ঢাকার সময় অনুযায়ী: ${bestHours
                      .map((h) => bnNum.format(h) + ":০০")
                      .join(", ")}`
                  : "সব শহরের কাজের সময় (সকাল ৯টা–সন্ধ্যা ৬টা) একসঙ্গে মেলে না। স্লাইডার সরিয়ে সবচেয়ে কম অসুবিধার সময় বেছে নিন।"}
              </p>
            </div>
          )}
        </section>
      )}

      {/* ---------- Knowledge guide ---------- */}
      <section className="space-y-3 pt-6 border-t border-zinc-200/80 dark:border-zinc-800/80">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          আন্তর্জাতিক টাইমজোন ও সময় রূপান্তর নির্দেশিকা
        </h2>
        <div className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed space-y-3">
          <p>
            বিশ্বজুড়ে ২৪টি মূল টাইমজোন রয়েছে যা গ্রিনিচ মান সময় (GMT) বা
            সমন্বিত আন্তর্জাতিক সময় (UTC) এর ভিত্তিতে পরিমাপ করা হয়। বাংলাদেশ
            স্ট্যান্ডার্ড টাইম (BST) হলো <strong>UTC+6</strong>। এই টুলে সময়ের
            পার্থক্য প্রতিটি শহরের বর্তমান ডে-লাইট সেভিং নিয়ম ধরে
            স্বয়ংক্রিয়ভাবে হিসাব করা হয়।
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>লন্ডন:</strong> শীতকালে ৬ ঘণ্টা, গ্রীষ্মে ৫ ঘণ্টা পিছিয়ে।
            </li>
            <li>
              <strong>নিউইয়র্ক:</strong> ঢাকার চেয়ে ১০ থেকে ১১ ঘণ্টা পিছিয়ে।
            </li>
            <li>
              <strong>দুবাই:</strong> ২ ঘণ্টা পিছিয়ে (UTC+4)।
            </li>
            <li>
              <strong>টোকিও:</strong> ৩ ঘণ্টা এগিয়ে (UTC+9)।
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
