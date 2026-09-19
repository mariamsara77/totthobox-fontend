// utils/banglaDate.ts

export type BanglaDate = { day: number; month: string; year: number };

export const bnNum = (num: number | string): string => {
  const numbers: Record<string, string> = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
  };
  return num.toString().replace(/\d/g, (match) => numbers[match]);
};

export const getBanglaDate = (inputDate: Date): BanglaDate => {
  const day = inputDate.getDate();
  const month = inputDate.getMonth() + 1; // 1-12
  const year = inputDate.getFullYear();
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);

  const months = ['বৈশাখ', 'জ্যৈষ্ঠ', 'আষাঢ়', 'শ্রাবণ', 'ভাদ্র', 'আশ্বিন', 'কার্তিক', 'অগ্রহায়ণ', 'পৌষ', 'মাঘ', 'ফাল্গুন', 'চৈত্র'];
  
  const bnYear = (month < 4 || (month === 4 && day < 14)) ? year - 594 : year - 593;

  const startDates: Record<number, number> = {
    1: 14, 2: 14, 3: 15, 4: 14, 5: 15, 6: 15,
    7: 16, 8: 16, 9: 16, 10: 16, 11: 15, 12: 15
  };

  const monthMap: Record<number, { prev: number, curr: number }> = {
    1: { prev: 8, curr: 9 }, 2: { prev: 9, curr: 10 }, 3: { prev: 10, curr: 11 },
    4: { prev: 11, curr: 0 }, 5: { prev: 0, curr: 1 }, 6: { prev: 1, curr: 2 },
    7: { prev: 2, curr: 3 }, 8: { prev: 3, curr: 4 }, 9: { prev: 4, curr: 5 },
    10: { prev: 5, curr: 6 }, 11: { prev: 6, curr: 7 }, 12: { prev: 7, curr: 8 }
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