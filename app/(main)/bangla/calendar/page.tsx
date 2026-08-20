"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  getDay,
  isSameDay,
  addDays,
  subDays,
} from "date-fns";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CalendarDays,
  CalendarPlus,
  X,
  Info,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useSWR from "swr";

// --- Types ---
type BanglaDate = { day: number; month: string; year: number };
type Holiday = { title: string; color: string; description?: string };
type HolidaysMap = Record<string, Holiday>;

// --- Helper: Convert English numbers to Bengali ---
const bnNum = (num: number | string): string => {
  const numbers: Record<string, string> = {
    "0": "০",
    "1": "১",
    "2": "২",
    "3": "৩",
    "4": "৪",
    "5": "৫",
    "6": "৬",
    "7": "৭",
    "8": "৮",
    "9": "৯",
  };
  return num.toString().replace(/\d/g, (match) => numbers[match]);
};

// --- Helper: Hijri Date ---
const getHijriDate = (date: Date): string => {
  try {
    return new Intl.DateTimeFormat("bn-BD-u-ca-islamic", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch {
    return "";
  }
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdvancedBanglaCalendar() {
  const [todayDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date());
  const [direction, setDirection] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const touchStartX = useRef<number | null>(null);

  // --- Bangla Date Logic ---
  const getBanglaDate = (inputDate: Date): BanglaDate => {
    const day = inputDate.getDate();
    const month = inputDate.getMonth() + 1;
    const year = inputDate.getFullYear();
    const isLeapYear =
      (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    const months = [
      "বৈশাখ",
      "জ্যৈষ্ঠ",
      "আষাঢ়",
      "শ্রাবণ",
      "ভাদ্র",
      "আশ্বিন",
      "কার্তিক",
      "অগ্রহায়ণ",
      "পৌষ",
      "মাঘ",
      "ফাল্গুন",
      "চৈত্র",
    ];

    const bnYear =
      month < 4 || (month === 4 && day < 14) ? year - 594 : year - 593;
    const startDates: Record<number, number> = {
      1: 14, 2: 14, 3: 15, 4: 14, 5: 15, 6: 15,
      7: 16, 8: 16, 9: 16, 10: 16, 11: 15, 12: 15,
    };
    const monthMap: Record<number, { prev: number; curr: number }> = {
      1: { prev: 8, curr: 9 }, 2: { prev: 9, curr: 10 }, 3: { prev: 10, curr: 11 },
      4: { prev: 11, curr: 0 }, 5: { prev: 0, curr: 1 }, 6: { prev: 1, curr: 2 },
      7: { prev: 2, curr: 3 }, 8: { prev: 3, curr: 4 }, 9: { prev: 4, curr: 5 },
      10: { prev: 5, curr: 6 }, 11: { prev: 6, curr: 7 }, 12: { prev: 7, curr: 8 },
    };

    const startDate = startDates[month];
    let bnDay: number;
    let bnMonthIndex: number;

    if (day >= startDate) {
      bnDay = day - startDate + 1;
      bnMonthIndex = monthMap[month].curr;
    } else {
      const prevMonthDays = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30];
      if (isLeapYear) prevMonthDays[10] = 31;

      bnMonthIndex = monthMap[month].prev;
      bnDay = prevMonthDays[bnMonthIndex] - (startDate - day) + 1;
    }
    return { day: bnDay, month: months[bnMonthIndex], year: bnYear };
  };

  // --- Holidays ---
  const fixedHolidays: HolidaysMap = useMemo(
    () => ({
      "02-21": { title: "শহীদ দিবস", color: "rose" },
      "03-17": { title: "বঙ্গবন্ধুর জন্মদিন", color: "indigo" },
      "03-26": { title: "স্বাধীনতা দিবস", color: "emerald" },
      "04-14": { title: "পহেলা বৈশাখ", color: "orange" },
      "05-01": { title: "মে দিবস", color: "sky" },
      "12-16": { title: "বিজয় দিবস", color: "red" },
      "12-25": { title: "বড়দিন", color: "purple" },
    }),
    []
  );

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://totthobox.com";
  const { data: apiResponse } = useSWR(
    `${apiUrl}/api/holidays-calendar?year=${viewDate.getFullYear()}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  const allHolidays = useMemo(() => {
    const dbHolidays: HolidaysMap = {};
    if (apiResponse?.success && apiResponse?.data) {
      apiResponse.data.forEach((h: any) => {
        dbHolidays[h.date] = { title: h.title, color: h.color || "amber" };
      });
    }
    return { ...fixedHolidays, ...dbHolidays };
  }, [apiResponse, fixedHolidays]);

  // --- Current Month Holidays (সঠিক জায়গায়) ---
  const currentMonthHolidays = useMemo(() => {
    const month = viewDate.getMonth() + 1;
    const year = viewDate.getFullYear();

    return Object.entries(allHolidays)
      .filter(([mmdd]) => {
        const [m] = mmdd.split("-").map(Number);
        return m === month;
      })
      .map(([mmdd, holiday]) => {
        const day = parseInt(mmdd.split("-")[1]);
        const dateObj = new Date(year, month - 1, day);
        return {
          title: holiday.title,
          date: format(dateObj, "dd MMMM yyyy"),
          color: holiday.color,
        };
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [allHolidays, viewDate]);

  // --- Keyboard Navigation ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setSelectedDate((prev) => addDays(prev, 1));
      else if (e.key === "ArrowLeft") setSelectedDate((prev) => subDays(prev, 1));
      else if (e.key === "ArrowUp") setSelectedDate((prev) => subDays(prev, 7));
      else if (e.key === "ArrowDown") setSelectedDate((prev) => addDays(prev, 7));
      else if (e.key === "Enter") setShowModal(true);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Sync viewDate
  useEffect(() => {
    if (
      selectedDate.getMonth() !== viewDate.getMonth() ||
      selectedDate.getFullYear() !== viewDate.getFullYear()
    ) {
      setViewDate(selectedDate);
    }
  }, [selectedDate]);

  // --- Calendar Grid ---
  const calendarDays = useMemo(() => {
    const start = startOfMonth(viewDate);
    const end = endOfMonth(viewDate);
    const padding = getDay(start);
    const daysArray: any[] = Array(padding).fill(null);

    for (let d = 1; d <= end.getDate(); d++) {
      const current = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
      const mmdd = format(current, "MM-dd");

      daysArray.push({
        dateObj: current,
        engDay: d,
        bnObj: getBanglaDate(current),
        isToday: isSameDay(current, todayDate),
        isSelected: isSameDay(current, selectedDate),
        isWeekend: current.getDay() === 5 || current.getDay() === 6,
        holiday: allHolidays[mmdd] || null,
      });
    }
    return daysArray;
  }, [viewDate, selectedDate, todayDate, allHolidays]);

  // --- Derived ---
  const selBn = getBanglaDate(selectedDate);
  const selHijri = getHijriDate(selectedDate);
  const selMmdd = format(selectedDate, "MM-dd");
  const selHoliday = allHolidays[selMmdd];

  // --- Handlers ---
  const navigateMonth = (dir: number) => {
    setDirection(dir);
    setViewDate((prev) => (dir === 1 ? addMonths(prev, 1) : subMonths(prev, 1)));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartX.current) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 50) navigateMonth(1);
    else if (diff < -50) navigateMonth(-1);
    touchStartX.current = null;
  };

  const addToGoogleCalendar = () => {
    if (!selHoliday) return;
    const dateStr = format(selectedDate, "yyyyMMdd");
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      selHoliday.title
    )}&dates=${dateStr}/${dateStr}&details=Holiday`;
    window.open(url, "_blank");
  };

  const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { 
      duration: 0.28, 
      ease: [0.25, 0.1, 0.25, 1] as const 
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 80 : -80,
    opacity: 0,
    transition: { 
      duration: 0.28, 
      ease: [0.25, 0.1, 0.25, 1] as const 
    },
  }),
};

  return (
    <div className="max-w-xl mx-auto space-y-6 select-none relative p-4 pb-12">
      {/* Header */}
      <header className="space-y-1.5">
        <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          আজকের বাংলা তারিখ:{" "}
          <span className="text-emerald-600">
            {bnNum(selBn.day)} {selBn.month} {bnNum(selBn.year)}
          </span>
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          ইংরেজি: <strong>{format(selectedDate, "dd MMMM yyyy")}</strong> ·
          হিজরি: <strong>{selHijri}</strong>
        </p>
      </header>

      {/* Selected Date Card */}
      <section
        onClick={() => setShowModal(true)}
        className="rounded-2xl border border-zinc-400/25 bg-zinc-400/10 p-4 cursor-pointer hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 transition-all group"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-500 mb-1">বাংলা তারিখ</p>
            <p className="text-2xl font-extrabold text-emerald-600 group-hover:scale-[1.03] transition-transform origin-left">
              {bnNum(selBn.day)} {selBn.month}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-500 mb-1">ইংরেজি তারিখ</p>
            <p className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
              {format(selectedDate, "dd MMMM yyyy")}
            </p>
          </div>
        </div>

        {selHoliday && (
          <div className="mt-3 pt-3 border-t border-zinc-400/25 flex justify-between items-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 text-sm font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> {selHoliday.title}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToGoogleCalendar();
              }}
              className="text-xs flex items-center gap-1 text-zinc-500 hover:text-emerald-600 transition-colors"
            >
              <CalendarPlus className="w-3.5 h-3.5" /> গুগলে সেভ
            </button>
          </div>
        )}
      </section>
      

      {/* Month / Year Controls */}
      <section className="flex items-center justify-between rounded-2xl bg-zinc-400/10 px-2 py-1.5 shadow-sm">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
  {/* Month Dropdown */}
  <div className="relative">
    <select
      value={viewDate.getMonth()}
      onChange={(e) => {
        setDirection(0);
        setViewDate(
          new Date(viewDate.getFullYear(), parseInt(e.target.value), 1)
        );
      }}
      className="appearance-none bg-white dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 
                 text-zinc-800 dark:text-zinc-200 font-semibold text-sm
                 rounded-xl pl-4 pr-9 py-2 cursor-pointer
                 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all shadow-sm"
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <option key={i} value={i} className="text-zinc-900 dark:text-zinc-100">
          {format(new Date(2000, i, 1), "MMMM")}
        </option>
      ))}
    </select>
    {/* Custom Arrow */}
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
      <ChevronDown className="w-4 h-4 text-zinc-500" />
    </div>
  </div>

  {/* Year Dropdown */}
  <div className="relative">
    <select
      value={viewDate.getFullYear()}
      onChange={(e) => {
        setDirection(0);
        setViewDate(
          new Date(parseInt(e.target.value), viewDate.getMonth(), 1)
        );
      }}
      className="appearance-none bg-white dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 
                 text-zinc-800 dark:text-zinc-200 font-semibold text-sm
                 rounded-xl pl-4 pr-9 py-2 cursor-pointer
                 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all shadow-sm"
    >
      {Array.from({ length: 121 }).map((_, i) => {
        const y = new Date().getFullYear() - 100 + i;
        return (
          <option key={y} value={y} className="text-zinc-900 dark:text-zinc-100">
            {y}
          </option>
        );
      })}
    </select>
    {/* Custom Arrow */}
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
      <ChevronDown className="w-4 h-4 text-zinc-500" />
    </div>
  </div>
</div>
<button
      onClick={() => {
        setSelectedDate(new Date());
        setViewDate(new Date());
      }}
      className="text-xs px-3 py-1.5 rounded-xl bg-zinc-400/10 text-emerald-700 dark:text-emerald-300 font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
    >
    Today
    </button>

        <button
          onClick={() => navigateMonth(1)}
          className="p-2.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </section>

      {/* ══════════════════════════════════════
    Date Filter / Picker
══════════════════════════════════════ */}

      {/* Calendar Grid */}
      <section
        className="overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="grid grid-cols-7 mb-2">
          {["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র", "শনি"].map(
            (wd, i) => (
              <div
                key={wd}
                className={`text-center py-1.5 text-xs font-bold ${
                  i >= 5 ? "text-rose-500" : "text-zinc-500"
                }`}
              >
                {wd}
              </div>
            )
          )}
        </div>

        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div
            key={viewDate.toString()}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="grid grid-cols-7 gap-1.5 px-2"
          >
            {calendarDays.map((day, index) => {
              if (!day)
                return <div key={`empty-${index}`} className="aspect-square" />;

              const { isSelected, isToday, holiday } = day;
              let cellBg =
                "hover:bg-zinc-100 dark:hover:bg-zinc-800/80";
              if (isSelected)
                cellBg =
                  "bg-emerald-600 shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/40 scale-[1.04] z-10";
              else if (isToday)
                cellBg = "bg-emerald-50 dark:bg-emerald-900/20 ring-2 ring-emerald-500";

              return (
                <button
                  key={format(day.dateObj, "yyyy-MM-dd")}
                  onClick={() => {
                    setSelectedDate(day.dateObj);
                    setShowModal(true);
                  }}
                  className={`group relative aspect-square rounded-xl transition-all duration-200 ${cellBg}`}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <span
                      className={`text-sm font-bold ${
                        isSelected
                          ? "text-white"
                          : day.isWeekend
                          ? "text-rose-500"
                          : "text-zinc-700 dark:text-zinc-300"
                      }`}
                    >
                      {day.engDay}
                    </span>
                    <span
                      className={`text-[11px] font-medium mt-0.5 ${
                        isSelected ? "text-emerald-100" : "text-emerald-600"
                      }`}
                    >
                      {bnNum(day.bnObj.day)}
                    </span>
                    {holiday && (
                      <span className="absolute bottom-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.7)]" />
                    )}
                  </div>

                  {holiday && !isSelected && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[140px] px-2.5 py-1.5 bg-zinc-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
                      {holiday.title}
                    </div>
                  )}
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </section>
<hr className="border border-zinc-400/25"/>
      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-400/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-900/30">
                  <Calendar className="w-7 h-7 text-emerald-600" />
                </div>

                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {bnNum(selBn.day)} {selBn.month}, {bnNum(selBn.year)}
                </h3>

                <div className="text-zinc-600 dark:text-zinc-400 space-y-1 text-sm">
                  <p>
                    ইংরেজি: {format(selectedDate, "dd MMMM yyyy")} (
                    {format(selectedDate, "EEEE")})
                  </p>
                  <p>হিজরি: {selHijri}</p>
                </div>

                {selHoliday && (
                  <div className="mt-5 p-4 rounded-2xl bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/40">
                    <h4 className="font-bold text-rose-600 dark:text-rose-400 flex items-center justify-center gap-2 mb-1.5">
                      <Sparkles className="w-4 h-4" /> সরকারি ছুটি
                    </h4>
                    <p className="text-rose-800 dark:text-rose-300 font-medium">
                      {selHoliday.title}
                    </p>
                    <button
                      onClick={addToGoogleCalendar}
                      className="mt-3 w-full py-2.5 px-4 bg-white dark:bg-zinc-800 rounded-xl text-sm font-semibold text-rose-600 shadow-sm border border-rose-100 dark:border-rose-900 hover:scale-[1.02] active:scale-[0.98] transition-transform"
                    >
                      ক্যালেন্ডারে সেভ করুন
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════
          This Month's Official Holidays
      ══════════════════════════════════════ */}
      {currentMonthHolidays.length > 0 && (
        <section className="mt-2 space-y-3">
          <h2 className="flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-zinc-100">
            <CalendarDays className="w-5 h-5 text-emerald-600" />
            এই মাসের সরকারি ছুটি
          </h2>

          <div className="rounded-2xl border border-zinc-400/25 overflow-hidden bg-zinc-400/10">
            <div className="grid grid-cols-2 bg-zinc-50 dark:bg-zinc-800/70 text-sm font-semibold text-zinc-600 dark:text-zinc-400 px-4 py-3">
              <div>ছুটির নাম</div>
              <div>তারিখ</div>
            </div>

            {currentMonthHolidays.map((h, idx) => (
              <div
                key={idx}
                className="grid grid-cols-2 px-4 py-3.5 border-t border-zinc-400/25 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <div className="font-semibold text-zinc-800 dark:text-zinc-200">
                  {h.title}
                </div>
                <div className="text-zinc-600 dark:text-zinc-400">{h.date}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          Informative Content
      ══════════════════════════════════════ */}
      <section className="rounded-2xl border border-zinc-400/25 p-5 space-y-4 bg-zinc-400/10">
        <h2 className="flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-zinc-100">
          <Info className="w-5 h-5 text-emerald-600" />
          বাংলা ক্যালেন্ডার সম্পর্কে
        </h2>

        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-[15px]">
          বাংলা ক্যালেন্ডার বা বঙ্গাব্দ বাংলাদেশ ও পশ্চিমবঙ্গে ব্যবহৃত একটি সৌর
          বর্ষপঞ্জি। বাংলা সনের নতুন বছর শুরু হয় সাধারণত ১৪ এপ্রিল (পহেলা বৈশাখ)
          থেকে। বর্তমানে চলছে{" "}
          <strong className="text-emerald-600">
            {bnNum(getBanglaDate(new Date()).year)} বঙ্গাব্দ
          </strong>
          ।
        </p>

        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-[15px]">
          এই পেজে আপনি সহজেই <strong>আজকের বাংলা তারিখ</strong>, ইংরেজি তারিখের
          সাথে তুলনা, মাসভিত্তিক ক্যালেন্ডার এবং সরকারি ছুটির তালিকা দেখতে পারবেন।
          তারিখ সিলেক্ট করে যেকোনো দিনের বাংলা তারিখ জানা যায়।
        </p>

        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-[15px]">
          বাংলা মাসগুলো হলো: বৈশাখ, জ্যৈষ্ঠ, আষাঢ়, শ্রাবণ, ভাদ্র, আশ্বিন,
          কার্তিক, অগ্রহায়ণ, পৌষ, মাঘ, ফাল্গুন ও চৈত্র।
        </p>
      </section>

      {/* ══════════════════════════════════════
          FAQ Section
      ══════════════════════════════════════ */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          প্রায়শই জিজ্ঞাসিত প্রশ্ন (FAQ)
        </h2>

        <div className="space-y-2">
          {[
            {
              q: "আজকের বাংলা তারিখ কত?",
              a: (
                <>
                  আজকের বাংলা তারিখ হলো{" "}
                  <strong>
                    {bnNum(selBn.day)} {selBn.month} {bnNum(selBn.year)}
                  </strong>{" "}
                  বঙ্গাব্দ। ইংরেজি তারিখ{" "}
                  {format(selectedDate, "dd MMMM yyyy")}।
                </>
              ),
            },
            {
              q: "বাংলা সন কীভাবে হিসাব করা হয়?",
              a: "বাংলা সন সাধারণত ১৪ এপ্রিল থেকে শুরু হয়। ইংরেজি বছর থেকে ৫৯৩ বা ৫৯৪ বিয়োগ করে বাংলা সন পাওয়া যায়। এপ্রিলের ১৪ তারিখের আগে হলে ৫৯৪ এবং পরে হলে ৫৯৩ বিয়োগ করা হয়।",
            },
            {
              q: "সরকারি ছুটির তালিকা কোথায় পাব?",
              a: "এই পেজেই চলতি মাসের সকল সরকারি ছুটি দেখানো হয়। নির্দিষ্ট তারিখ সিলেক্ট করলে সেই দিনের ছুটির নামও দেখা যাবে। শহীদ দিবস, স্বাধীনতা দিবস, পহেলা বৈশাখ, বিজয় দিবসসহ প্রধান ছুটিগুলো হাইলাইট করা আছে।",
            },
            {
              q: "বাংলা মাস কয়টি ও কী কী?",
              a: "বাংলা সনে মোট ১২টি মাস আছে। সেগুলো হলো: বৈশাখ, জ্যৈষ্ঠ, আষাঢ়, শ্রাবণ, ভাদ্র, আশ্বিন, কার্তিক, অগ্রহায়ণ, পৌষ, মাঘ, ফাল্গুন এবং চৈত্র।",
            },
            {
              q: "এই ক্যালেন্ডার কি মোবাইলে কাজ করে?",
              a: "হ্যাঁ, এই বাংলা ক্যালেন্ডার সম্পূর্ণ মোবাইল-ফ্রেন্ডলি। স্মার্টফোন, ট্যাবলেট ও কম্পিউটারে একইভাবে ব্যবহার করা যায়।",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-zinc-400/25 overflow-hidden bg-zinc-400/10"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between px-4 py-3.5 text-left font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors"
              >
                <span className="pr-3">{item.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-zinc-500 shrink-0 transition-transform duration-200 ${
                    openFaq === idx ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-400/25 pt-3">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Extra note */}
      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed text-center">
        এই পেজটি নিয়মিত আপডেট করা হয় যাতে আপনি সঠিক{" "}
        <strong>আজকের বাংলা তারিখ</strong>, বাংলা ক্যালেন্ডার এবং সরকারি ছুটির
        তথ্য পান। যেকোনো তারিখ সিলেক্ট করে বাংলা ও ইংরেজি তারিখ একসাথে দেখুন।
      </p>
    </div>
  );
}