"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { Variants } from "framer-motion";
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, getDay, 
  isSameDay, parseISO, addDays, subDays 
} from "date-fns";
import { 
  Calendar, Clock, ChevronLeft, ChevronRight, Sparkles, 
  CalendarDays, CalendarPlus, X 
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
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
  };
  return num.toString().replace(/\d/g, (match) => numbers[match]);
};

// --- Helper: Hijri Date (Using Native Intl API) ---
const getHijriDate = (date: Date): string => {
  try {
    return new Intl.DateTimeFormat('bn-BD-u-ca-islamic', {
      day: 'numeric', month: 'long', year: 'numeric'
    }).format(date);
  } catch (e) {
    return ""; // Fallback if browser doesn't support
  }
};

// --- API Fetcher for SWR ---
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdvancedBanglaCalendar() {
  const [todayDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [direction, setDirection] = useState(0); // For animation direction
  const [showModal, setShowModal] = useState(false);

  // --- Touch Swipe States ---
  const touchStartX = useRef<number | null>(null);
  
  // --- Bengali Date Logic ---
  const getBanglaDate = (inputDate: Date): BanglaDate => {
    const day = inputDate.getDate();
    const month = inputDate.getMonth() + 1; 
    const year = inputDate.getFullYear();
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    const months = ['বৈশাখ', 'জ্যৈষ্ঠ', 'আষাঢ়', 'শ্রাবণ', 'ভাদ্র', 'আশ্বিন', 'কার্তিক', 'অগ্রহায়ণ', 'পৌষ', 'মাঘ', 'ফাল্গুন', 'চৈত্র'];
    
    const bnYear = (month < 4 || (month === 4 && day < 14)) ? year - 594 : year - 593;
    const startDates: Record<number, number> = { 1: 14, 2: 14, 3: 15, 4: 14, 5: 15, 6: 15, 7: 16, 8: 16, 9: 16, 10: 16, 11: 15, 12: 15 };
    const monthMap: Record<number, { prev: number, curr: number }> = {
      1: { prev: 8, curr: 9 }, 2: { prev: 9, curr: 10 }, 3: { prev: 10, curr: 11 },
      4: { prev: 11, curr: 0 }, 5: { prev: 0, curr: 1 }, 6: { prev: 1, curr: 2 },
      7: { prev: 2, curr: 3 }, 8: { prev: 3, curr: 4 }, 9: { prev: 4, curr: 5 },
      10: { prev: 5, curr: 6 }, 11: { prev: 6, curr: 7 }, 12: { prev: 7, curr: 8 }
    };

    const startDate = startDates[month];
    let bnDay, bnMonthIndex;

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

  // --- Holidays Data (SWR Caching) ---
  const fixedHolidays: HolidaysMap = useMemo(() => ({
    '02-21': { title: 'শহীদ দিবস', color: 'rose' },
    '03-17': { title: 'বঙ্গবন্ধুর জন্মদিন', color: 'indigo' },
    '03-26': { title: 'স্বাধীনতা দিবস', color: 'emerald' },
    '04-14': { title: 'পহেলা বৈশাখ', color: 'orange' },
    '05-01': { title: 'মে দিবস', color: 'sky' },
    '12-16': { title: 'বিজয় দিবস', color: 'red' },
    '12-25': { title: 'বড়দিন', color: 'purple' },
  }), []);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://totthobox.com';
  const { data: apiResponse } = useSWR(
    `${apiUrl}/api/holidays?year=${viewDate.getFullYear()}`,
    fetcher,
    { revalidateOnFocus: false } // Prevent unnecessary refetches
  );

  const allHolidays = useMemo(() => {
    const dbHolidays: HolidaysMap = {};
    if (apiResponse?.success && apiResponse?.data) {
      apiResponse.data.forEach((h: any) => {
        dbHolidays[h.date] = { title: h.title, color: h.color || 'amber' };
      });
    }
    return { ...fixedHolidays, ...dbHolidays };
  }, [apiResponse, fixedHolidays]);

  // --- Keyboard Navigation ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setSelectedDate(prev => addDays(prev, 1));
      else if (e.key === 'ArrowLeft') setSelectedDate(prev => subDays(prev, 1));
      else if (e.key === 'ArrowUp') setSelectedDate(prev => subDays(prev, 7));
      else if (e.key === 'ArrowDown') setSelectedDate(prev => addDays(prev, 7));
      else if (e.key === 'Enter') setShowModal(true);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- Sync ViewDate with SelectedDate when using Keyboard ---
  useEffect(() => {
    if (selectedDate.getMonth() !== viewDate.getMonth() || selectedDate.getFullYear() !== viewDate.getFullYear()) {
      setViewDate(selectedDate);
    }
  }, [selectedDate]);

  // --- Calendar Grid Generation ---
  const calendarDays = useMemo(() => {
    const start = startOfMonth(viewDate);
    const end = endOfMonth(viewDate);
    const padding = getDay(start); 
    const daysArray = Array(padding).fill(null);

    for (let d = 1; d <= end.getDate(); d++) {
      const current = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
      const mmdd = format(current, 'MM-dd');
      
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

  // --- Derived State Data ---
  const selBn = getBanglaDate(selectedDate);
  const selHijri = getHijriDate(selectedDate);
  const selMmdd = format(selectedDate, 'MM-dd');
  const selHoliday = allHolidays[selMmdd];
  const startMonthBn = getBanglaDate(startOfMonth(viewDate));
  
  // --- Handlers ---
  const navigateMonth = (dir: number) => {
    setDirection(dir);
    setViewDate(prev => dir === 1 ? addMonths(prev, 1) : subMonths(prev, 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartX.current) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 50) navigateMonth(1); // Swipe Left -> Next
    else if (diff < -50) navigateMonth(-1); // Swipe Right -> Prev
    touchStartX.current = null;
  };

  const addToGoogleCalendar = () => {
    if (!selHoliday) return;
    const dateStr = format(selectedDate, 'yyyyMMdd');
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(selHoliday.title)}&dates=${dateStr}/${dateStr}&details=Holiday`;
    window.open(url, '_blank');
  };

  // --- Animation Variants ---
const slideVariants: Variants = {
  enter: (direction: number) => ({ 
    x: direction > 0 ? 100 : -100, 
    opacity: 0 
  }),
  center: { 
    x: 0, 
    opacity: 1, 
    transition: { duration: 0.3, ease: "easeInOut" } 
  },
  exit: (direction: number) => ({ 
    x: direction < 0 ? 100 : -100, 
    opacity: 0, 
    transition: { duration: 0.3, ease: "easeInOut" } 
  })
};

  return (
    <div className="max-w-md mx-auto space-y-4 select-none relative">
      
      {/* --- Header Section --- */}
      <header className="space-y-2">
        <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          আজকের বাংলা তারিখ:{" "}
          <span className="text-emerald-600">{bnNum(selBn.day)} {selBn.month} {bnNum(selBn.year)}</span>
        </h1>
        <p className="text-base text-zinc-600 dark:text-zinc-400">
          ইংরেজি: <strong>{format(selectedDate, 'dd MMMM yyyy')}</strong> | হিজরি: <strong>{selHijri}</strong>
        </p>
      </header>

      {/* --- Selected Date Detail Card (Clickable to open modal) --- */}
      <section 
        onClick={() => setShowModal(true)}
        className="rounded-2xl border border-zinc-400/25 p-4 cursor-pointer hover:shadow-md transition-shadow group"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-500 mb-1">বাংলা তারিখ</p>
            <p className="text-2xl font-extrabold text-emerald-600 group-hover:scale-105 transition-transform origin-left">
              {bnNum(selBn.day)} {selBn.month}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-zinc-500 mb-1">ইংরেজি তারিখ</p>
            <p className="text-xl font-bold text-zinc-800 dark:text-zinc-200">
              {format(selectedDate, 'dd MMMM yyyy')}
            </p>
          </div>
        </div>
        {selHoliday && (
          <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-sm font-bold">
              <Sparkles className="w-4 h-4" /> {selHoliday.title}
            </span>
            <button 
              onClick={(e) => { e.stopPropagation(); addToGoogleCalendar(); }}
              className="text-xs flex items-center gap-1 text-zinc-500 hover:text-emerald-600 transition-colors"
            >
              <CalendarPlus className="w-4 h-4" /> গুগলে সেভ করুন
            </button>
          </div>
        )}
      </section>

      {/* --- Calendar Controls (Dropdowns + Nav) --- */}
      <section className="flex items-center justify-between rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 shadow-sm">
        <button onClick={() => navigateMonth(-1)} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="flex gap-2">
          {/* Month Dropdown */}
          <select 
            value={viewDate.getMonth()} 
            onChange={(e) => { setDirection(0); setViewDate(new Date(viewDate.getFullYear(), parseInt(e.target.value), 1)); }}
            className="bg-transparent font-bold text-zinc-800 dark:text-zinc-200 focus:outline-none cursor-pointer appearance-none text-center"
          >
            {Array.from({length: 12}).map((_, i) => (
              <option key={i} value={i} className="text-zinc-900">{format(new Date(2000, i, 1), 'MMMM')}</option>
            ))}
          </select>
          {/* Year Dropdown */}
          <select 
            value={viewDate.getFullYear()} 
            onChange={(e) => { setDirection(0); setViewDate(new Date(parseInt(e.target.value), viewDate.getMonth(), 1)); }}
            className="bg-transparent font-bold text-zinc-800 dark:text-zinc-200 focus:outline-none cursor-pointer appearance-none"
          >
            {Array.from({length: 21}).map((_, i) => {
              const y = new Date().getFullYear() - 10 + i;
              return <option key={y} value={y} className="text-zinc-900">{y}</option>;
            })}
          </select>
        </div>

        <button onClick={() => navigateMonth(1)} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </section>

      {/* --- Animated Calendar Grid --- */}
      <section 
        className="overflow-hidden p-2" 
        onTouchStart={handleTouchStart} 
        onTouchEnd={handleTouchEnd}
      >
        <div className="grid grid-cols-7 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((wd, i) => (
            <div key={wd} className={`text-center py-1 text-xs font-bold ${i >= 5 ? 'text-rose-500' : 'text-zinc-500'}`}>
              {wd}
            </div>
          ))}
        </div>

        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div
            key={viewDate.toString()}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="grid grid-cols-7 gap-1"
          >
            {calendarDays.map((day, index) => {
              if (!day) return <div key={`empty-${index}`} className="aspect-square" />;

              const { isSelected, isToday, holiday } = day;
              let cellBg = 'hover:bg-zinc-100 dark:hover:bg-zinc-800';
              if (isSelected) cellBg = 'bg-emerald-600 shadow-lg shadow-emerald-200/60 scale-[1.05] z-10';
              else if (isToday) cellBg = 'bg-emerald-50 ring-2 ring-emerald-500';

              return (
                <button
                  key={format(day.dateObj, 'yyyy-MM-dd')}
                  onClick={() => { setSelectedDate(day.dateObj); setShowModal(true); }}
                  className={`group relative aspect-square rounded-xl transition-all duration-200 ${cellBg}`}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <span className={`text-sm font-black ${isSelected ? 'text-white' : (day.isWeekend ? 'text-rose-500' : 'text-zinc-700 dark:text-zinc-300')}`}>
                      {day.engDay}
                    </span>
                    <span className={`text-[11px] font-bold mt-0.5 ${isSelected ? 'text-emerald-100' : 'text-emerald-600'}`}>
                      {bnNum(day.bnObj.day)}
                    </span>
                    {holiday && <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_4px_rgba(244,63,94,0.8)]" />}
                  </div>

                  {/* Tooltip on Hover */}
                  {holiday && !isSelected && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-zinc-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                      {holiday.title}
                    </div>
                  )}
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* --- Detail Modal --- */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-zinc-900 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative"
            >
              <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
              
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-900/30 mb-2">
                  <Calendar className="w-8 h-8 text-emerald-600" />
                </div>
                
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {bnNum(selBn.day)} {selBn.month}, {bnNum(selBn.year)}
                </h3>
                
                <div className="text-zinc-600 dark:text-zinc-400 space-y-1 text-sm">
                  <p>ইংরেজি: {format(selectedDate, 'dd MMMM yyyy')} ({format(selectedDate, 'EEEE')})</p>
                  <p>হিজরি: {selHijri}</p>
                </div>

                {selHoliday && (
                  <div className="mt-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/50">
                    <h4 className="font-bold text-rose-600 flex items-center justify-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4" /> সরকারি ছুটি
                    </h4>
                    <p className="text-rose-800 dark:text-rose-300 font-medium">{selHoliday.title}</p>
                    <button 
                      onClick={addToGoogleCalendar}
                      className="mt-3 w-full py-2 px-4 bg-white dark:bg-zinc-800 rounded-xl text-sm font-semibold text-rose-600 shadow-sm border border-rose-100 dark:border-rose-900 hover:scale-[1.02] transition-transform"
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

      {/* --- Informative Content --- */}
      <section className="bg-zinc-50 dark:bg-zinc-900/50 p-5 rounded-2xl space-y-3">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">বাংলা ক্যালেন্ডার সম্পর্কে</h2>
        <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
          বাংলা ক্যালেন্ডার বা বঙ্গাব্দ বাংলাদেশ ও পশ্চিমবঙ্গে ব্যবহৃত একটি সৌর বর্ষপঞ্জি।
          বাংলা সনের নতুন বছর শুরু হয় সাধারণত ১৪ এপ্রিল (পহেলা বৈশাখ) থেকে। বর্তমানে চলছে <strong>{bnNum(startMonthBn.year)} বঙ্গাব্দ</strong>।
        </p>
        <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
          এই পেজে আপনি সহজেই <strong>আজকের বাংলা তারিখ</strong>, ইংরেজি তারিখের সাথে তুলনা, মাসভিত্তিক ক্যালেন্ডার এবং সরকারি ছুটির তালিকা দেখতে পারবেন।
        </p>
      </section>

      {/* --- FAQ Section --- */}
      <section className="space-y-4 pt-4">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">প্রায়শই জিজ্ঞাসিত প্রশ্ন (FAQ)</h2>
        
        <details className="group bg-zinc-50 dark:bg-zinc-900/50 rounded-xl [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-4 text-zinc-900 dark:text-zinc-100 font-medium">
            আজকের বাংলা তারিখ কত?
            <span className="shrink-0 transition duration-300 group-open:-rotate-180">
              <ChevronRight className="w-5 h-5 rotate-90" />
            </span>
          </summary>
          <div className="px-4 pb-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            আজকের বাংলা তারিখ হলো <strong>{bnNum(selBn.day)} {selBn.month} {bnNum(selBn.year)}</strong> বঙ্গাব্দ। 
            ইংরেজি তারিখ {format(selectedDate, 'dd MMMM yyyy')}।
          </div>
        </details>

        <details className="group bg-zinc-50 dark:bg-zinc-900/50 rounded-xl [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-4 text-zinc-900 dark:text-zinc-100 font-medium">
            বাংলা সন কীভাবে হিসাব করা হয়?
            <span className="shrink-0 transition duration-300 group-open:-rotate-180">
              <ChevronRight className="w-5 h-5 rotate-90" />
            </span>
          </summary>
          <div className="px-4 pb-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            বাংলা সন সাধারণত ১৪ এপ্রিল থেকে শুরু হয়। ইংরেজি বছর থেকে ৫৯৩ বা ৫৯৪ বিয়োগ করে বাংলা সন পাওয়া যায়। এপ্রিলের ১৪ তারিখের আগে হলে ৫৯৪ এবং পরে হলে ৫৯৩ বিয়োগ করা হয়।
          </div>
        </details>
      </section>

    </div>
  );
}