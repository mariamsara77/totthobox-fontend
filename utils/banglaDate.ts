// utils/banglaDate.ts
// Official Bangla Academy Reformed Calendar (2019 Revision)

export type BanglaDate = {
  day: number;
  month: string;
  year: number;
  season?: string;
  monthIndex?: number;
};

export const bnNum = (num: number | string): string => {
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

export const BANGLA_MONTHS = [
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

export const BANGLA_SEASONS = [
  "গ্রীষ্ম",
  "বর্ষা",
  "শরৎ",
  "হেমন্ত",
  "শীত",
  "বসন্ত",
];

export const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

/**
 * Converts a Gregorian Date to Official Bangladeshi Bengali National Calendar Date (Bangla Academy 2019 Reform)
 * - Boishakh to Ashwin (first 6 months): 31 days
 * - Kartik to Magh (next 4 months): 30 days
 * - Falgun: 29 days (30 days in Gregorian leap year)
 * - Chaitra: 30 days
 * - Bengali New Year (1 Boishakh) is permanently April 14
 */
export const getBanglaDate = (inputDate: Date): BanglaDate => {
  const d = inputDate.getDate();
  const m = inputDate.getMonth() + 1; // 1-12
  const y = inputDate.getFullYear();
  const leap = isLeapYear(y);

  // Exact starting Gregorian day for each month according to Bangla Academy 2019
  const startDates: Record<number, number> = {
    1: 15,  // Jan 15 -> Magh (Index 9)
    2: 14,  // Feb 14 -> Falgun (Index 10)
    3: 15,  // Mar 15 -> Chaitra (Index 11)
    4: 14,  // Apr 14 -> Boishakh (Index 0)
    5: 15,  // May 15 -> Joishtho (Index 1)
    6: 15,  // Jun 15 -> Ashar (Index 2)
    7: 16,  // Jul 16 -> Srabon (Index 3)
    8: 16,  // Aug 16 -> Bhadra (Index 4)
    9: 16,  // Sep 16 -> Ashwin (Index 5)
    10: 17, // Oct 17 -> Kartik (Index 6)
    11: 16, // Nov 16 -> Ogrohayon (Index 7)
    12: 16, // Dec 16 -> Poush (Index 8)
  };

  const monthMap: Record<number, { prev: number; curr: number }> = {
    1: { prev: 8, curr: 9 },   // Poush -> Magh
    2: { prev: 9, curr: 10 },  // Magh -> Falgun
    3: { prev: 10, curr: 11 }, // Falgun -> Chaitra
    4: { prev: 11, curr: 0 },  // Chaitra -> Boishakh
    5: { prev: 0, curr: 1 },   // Boishakh -> Joishtho
    6: { prev: 1, curr: 2 },   // Joishtho -> Ashar
    7: { prev: 2, curr: 3 },   // Ashar -> Srabon
    8: { prev: 3, curr: 4 },   // Srabon -> Bhadra
    9: { prev: 4, curr: 5 },   // Bhadra -> Ashwin
    10: { prev: 5, curr: 6 },  // Ashwin -> Kartik
    11: { prev: 6, curr: 7 },  // Kartik -> Ogrohayon
    12: { prev: 7, curr: 8 },  // Ogrohayon -> Poush
  };

  // Length of Bengali months (Boishakh = index 0 ... Chaitra = index 11)
  const bnMonthDays = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, leap ? 30 : 29, 30];

  const bnYear = m < 4 || (m === 4 && d < 14) ? y - 594 : y - 593;
  const startDate = startDates[m];
  let bnDay: number;
  let bnMonthIndex: number;

  if (d >= startDate) {
    bnDay = d - startDate + 1;
    bnMonthIndex = monthMap[m].curr;
  } else {
    bnMonthIndex = monthMap[m].prev;
    const prevDays = bnMonthDays[bnMonthIndex];
    bnDay = prevDays - (startDate - d) + 1;
  }

  const season = BANGLA_SEASONS[Math.floor(bnMonthIndex / 2)];

  return {
    day: bnDay,
    month: BANGLA_MONTHS[bnMonthIndex],
    year: bnYear,
    season,
    monthIndex: bnMonthIndex,
  };
};
