'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Hash, Banknote, Languages, Printer, Clipboard, TableCellsMerge, ChevronDown } from 'lucide-react';

/* ───────────────────────── Number → Word Utilities ───────────────────────── */

const ones = [
  '', 'এক', 'দুই', 'তিন', 'চার', 'পাঁচ', 'ছয়', 'সাত', 'আট', 'নয়',
  'দশ', 'এগারো', 'বারো', 'তেরো', 'চৌদ্দ', 'পনেরো', 'ষোল', 'সতেরো', 'আঠারো', 'উনিশ'
];
const tens = [
  '', '', 'বিশ', 'ত্রিশ', 'চল্লিশ', 'পঞ্চাশ', 'ষাট', 'সত্তর', 'আশি', 'নব্বই'
];
const specials: Record<number, string> = {
  20: 'বিশ', 21: 'একুশ', 22: 'বাইশ', 23: 'তেইশ', 24: 'চব্বিশ', 25: 'পঁচিশ',
  26: 'ছাব্বিশ', 27: 'সাতাশ', 28: 'আঠাশ', 29: 'উনত্রিশ',
  30: 'ত্রিশ', 31: 'একত্রিশ', 32: 'বত্রিশ', 33: 'তেত্রিশ', 34: 'চৌত্রিশ', 35: 'পঁয়ত্রিশ',
  36: 'ছত্রিশ', 37: 'সাঁইত্রিশ', 38: 'আটত্রিশ', 39: 'উনচল্লিশ',
  40: 'চল্লিশ', 41: 'একচল্লিশ', 42: 'বিয়াল্লিশ', 43: 'তেতাল্লিশ', 44: 'চুয়াল্লিশ', 45: 'পঁয়তাল্লিশ',
  46: 'ছেচল্লিশ', 47: 'সাতচল্লিশ', 48: 'আটচল্লিশ', 49: 'উনপঞ্চাশ',
  50: 'পঞ্চাশ', 51: 'একান্ন', 52: 'বাহান্ন', 53: 'তিপ্পান্ন', 54: 'চুয়ান্ন', 55: 'পঞ্চান্ন',
  56: 'ছাপ্পান্ন', 57: 'সাতান্ন', 58: 'আটান্ন', 59: 'উনষাট',
  60: 'ষাট', 61: 'একষট্টি', 62: 'বাষট্টি', 63: 'তেষট্টি', 64: 'চৌষট্টি', 65: 'পঁয়ষট্টি',
  66: 'ছেষট্টি', 67: 'সাতষট্টি', 68: 'আটষট্টি', 69: 'উনসত্তর',
  70: 'সত্তর', 71: 'একাত্তর', 72: 'বাহাত্তর', 73: 'তিয়াত্তর', 74: 'চুয়াত্তর', 75: 'পঁচাত্তর',
  76: 'ছিয়াত্তর', 77: 'সাতাত্তর', 78: 'আটাত্তর', 79: 'উনআশি',
  80: 'আশি', 81: 'একাশি', 82: 'বিরাশি', 83: 'তিরাশি', 84: 'চুরাশি', 85: 'পঁচাশি',
  86: 'ছিয়াশি', 87: 'সাতাশি', 88: 'আটাশি', 89: 'উননব্বই',
  90: 'নব্বই', 91: 'একানব্বই', 92: 'বিরানব্বই', 93: 'তিরানব্বই', 94: 'চুরানব্বই', 95: 'পঁচানব্বই',
  96: 'ছিয়ানব্বই', 97: 'সাতানব্বই', 98: 'আটানব্বই', 99: 'নিরানব্বই'
};

function convertLessThanHundred(n: number): string {
  if (n === 0) return '';
  if (n < 20) return ones[n];
  if (specials[n]) return specials[n];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return tens[t] + (o ? ones[o] : '');
}

function toBanglaWords(num: number): string {
  if (num === 0) return 'শূন্য';
  if (num < 0) return 'ঋণাত্মক ' + toBanglaWords(Math.abs(num));

  let result = '';
  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  const hundred = Math.floor(num / 100);
  const rest = num % 100;

  if (crore) result += toBanglaWords(crore) + ' কোটি ';
  if (lakh) result += toBanglaWords(lakh) + ' লক্ষ ';
  if (thousand) result += toBanglaWords(thousand) + ' হাজার ';
  if (hundred) result += ones[hundred] + ' শত ';
  if (rest) result += convertLessThanHundred(rest);

  return result.trim().replace(/\s+/g, ' ');
}

/* English (Bangladesh / Indian style) */
const enOnes = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen'
];
const enTens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function convertEnLessThanHundred(n: number): string {
  if (n < 20) return enOnes[n];
  return enTens[Math.floor(n / 10)] + (n % 10 ? '-' + enOnes[n % 10] : '');
}

function toEnglishWords(num: number): string {
  if (num === 0) return 'Zero';
  if (num < 0) return 'Negative ' + toEnglishWords(Math.abs(num));

  let result = '';
  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  const hundred = Math.floor(num / 100);
  const rest = num % 100;

  if (crore) result += toEnglishWords(crore) + ' Crore ';
  if (lakh) result += toEnglishWords(lakh) + ' Lakh ';
  if (thousand) result += toEnglishWords(thousand) + ' Thousand ';
  if (hundred) result += enOnes[hundred] + ' Hundred ';
  if (rest) result += convertEnLessThanHundred(rest);

  return result.trim().replace(/\s+/g, ' ');
}

function digitByDigitEnglish(n: number): string {
  const map: Record<string, string> = {
    '0': 'zero', '1': 'one', '2': 'two', '3': 'three', '4': 'four',
    '5': 'five', '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine'
  };
  return String(n).split('').map(d => map[d]).join(' ');
}

/* ───────────────────────── AdorshoLipi Converter (ported) ───────────────────────── */

// ========== EXACT SAME convertToUnicode from your Livewire code ==========
function convertToUnicode(sample: string): string {
  if (!sample) return "";

  var compareData = ['\n', ' ', '	', '!', '\"', '#', '\$', '%', '&', '\'', '\(', '\)', '\*', '\+', ',', '-', '.',
    '\/', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';', '<', '=', '>', '\?', '@', 'A', 'B',
    'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W',
    'X', 'Y', 'Z', '\[', '\\', '\]', '^', '_', '`', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k',
    'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '\{', '|', '\}', '~', '‚',
    'ƒ', '„', '…', '†', '‡', 'ˆ', '‰', 'Š', '‹', 'Œ', '‘', '’', '“', '”', '•', '–', '—', '˜', '™', 'š', '›',
    'œ', 'Ÿ', '¡', '¢', '£', '¤', '¥', '¦', '§', '¨', '©', 'ª', '«', '¬', '®', '®', '¯', '°', '±', '²', '³',
    '´', 'µ', '¶', '·', '¸', '¹', 'º', '»', '¼', '½', '¾', '¿', 'À', 'Á', 'Â', 'Ã', 'Ä', 'Å', 'Æ', 'Ç', 'È',
    'É', 'Ê', 'Ë', 'Ì', 'Ð', 'Ñ', 'Ò', 'Ó', 'Ô', 'Õ', 'Ö', '×', 'Ø', 'Ù', 'Ú', 'Û', 'Ü', 'Ý', 'Þ', 'ß', 'à',
    'á', 'â', 'ã', 'ä', 'å', 'æ', 'ç', 'è', 'é', 'ê', 'ë', 'ì', 'í', 'î', 'ï', 'ð', 'ñ', 'ò', 'ó', 'ô', 'õ',
    'ö', '÷', 'ø', 'ù', 'ú', 'û', 'ü', 'ý', 'þ', '®¡', '®±'
  ];

  var unicodeData = ['\n', ' ', '	', '!', '\"', '#', '\$', '%', '&', '\'', '\(', '\)', '\*', '\+', ',', '-', '.',
    '\/', '০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯', ':', ';', '<', '=', '>', '\?', '@', 'অ', 'আ',
    'ই', 'ঈ', 'উ', 'ঊ', 'ঋ', 'এ', 'ঐ', 'ও', 'ঔ', 'ক', 'খ', 'গ', 'ঘ', 'ঙ', 'চ', 'ছ', 'জ', 'ঝ', 'ঞ', 'ট', 'ঠ',
    'ড', 'ঢ', 'ণ', '\[', '\\', '\]', '×', 'e0', '÷', 'ত', 'থ', 'দ', 'ধ', 'ন', 'প', 'ফ', 'ব', 'ভ', 'ম', 'য',
    'র', 'ল', 'শ', 'ষ', 'স', 'হ', 'ক্ষ', 'ড়', 'ঢ়', 'য়', 'ৎ', 'ং', 'ঃ', 'ঁ', '।', '\{', '|', '\}', '~',
    'ক্ক', 'ক্ট', 'ক্স', 'গু', 'গ্‌গ', 'গ্ধ', 'ঙ্ক', 'ঙ্গ', 'চ্‌ঞ', 'জ্জ', 'জ্ঝ', 'জ্ঞ', 'ঞ্চ', 'ঞ্ছ',
    'ঞ্জ', 'ঞ্ঝ', 'ট্ট', 'ড্ড', 'ণ্ঠ', 'ণ্ড', 'ত্ত', 'ত্থ', 'ত্র', 'দ্দ', 'া', 'ি', 'ী', 'ু', 'ু', 'ু', 'ূ',
    'ূ', 'ূ', 'ৃ', 'ৃ', '×', 'ে', 'ে', 'ৈ', 'ৈ', 'ৗ', '্‌ক', 'গ্‌', 'ঙ্‌', 'চ্‌', 'জ', '্‌ঞ', 'ণ্‌', '্‌ত',
    '্‌ত্ত', '্‌ত্র', '্‌দ', '্‌ধ', 'ন্', 'ঙ্‌', '্‌ন', '্‌ন', '×', 'প্‌', '্ব', '্‌ব', '্‌ব', 'ম্', '্‌ম',
    '্য', '্র', '্র', '্র', '~', 'র্', 'ল্‌', '্‌ল', '্ল', 'শ্‌', 'ষ্‌', 'ষ্‌', 'স্‌', 'স্‌', '্‌', '্‌থ',
    'দ্ধ', '×', 'দ্ধ্ব', '×', 'দ্ব', 'দ্ভ', 'দ্র', 'ন্ঠ', 'ন্ড', 'ন্ধ', 'ন্ন', 'ন্ধ', 'প্প', 'ফ্র', 'ব্জ',
    'ব্দ', 'ব্ধ', '×', 'ব্ব', 'ভ্র', 'ম্ব', 'ম্ভ', 'ম্ভ্র', 'ল্ক', 'ল্ড', 'ল্ল', 'শু', 'শ্ত', 'ষ্ট', 'ষ্ঠ',
    'স্ক', 'স্ক্র', 'স্ব', 'হু', 'ক্ষ্ম', 'ো', 'ৌ'
  ];

  var uniJukto = ["এ্য", "অ্য", "ক্ক", "ক্ট", "ক্ট্র", "ক্ত", "ক্ত্র", "ক্ন", "ক্ব", "ক্ম", "ক্য", "ক্র", "ক্ল",
    "ক্ষ", "ক্ষ্ণ", "ক্ষ্ব", "ক্ষ্ম", "ক্ষ্ম্য", "ক্ষ্য", "ক্স", "খ্য", "খ্র", "গ্ণ", "গ্ধ", "গ্ধ্য",
    "গ্ধ্র", "গ্ন", "গ্ন্য", "গ্ব", "গ্ম", "গ্য", "গ্র", "গ্র্য", "গ্ল", "ঘ্ন", "ঘ্য", "ঘ্র", "ঙ্ক",
    "ঙ্ক্ত", "ঙ্ক্য", "ঙ্ক্ষ", "ঙ্খ", "ঙ্খ্য", "ঙ্গ", "ঙ্গ্য", "ঙ্ঘ", "ঙ্ঘ্য", "ঙ্ঘ্র", "ঙ্ম", "চ্চ", "চ্ছ",
    "চ্ছ্ব", "চ্ছ্র", "চ্ঞ", "চ্ব", "চ্য", "জ্জ", "জ্জ্ব", "জ্ঝ", "জ্ঞ", "জ্ব", "জ্য", "জ্র", "ঞ্চ", "ঞ্ছ",
    "ঞ্জ", "ঞ্ঝ", "ট্ট", "ট্ব", "ট্ম", "ট্য", "ট্র", "ড্ড", "ড্ব", "ড্য", "ড্র", "ঢ্য", "ঢ্র", "ণ্ট", "ণ্ঠ",
    "ণ্ঠ্য", "ণ্ড", "ণ্ড্য", "ণ্ড্র", "ণ্ঢ", "ণ্ণ", "ণ্ব", "ণ্ম", "ণ্য", "ত্ত", "ত্ত্ব", "ত্ত্য", "ত্থ",
    "ত্ন", "ত্ব", "ত্ম", "ত্ম্য", "ত্য", "ত্র", "ত্র্য", "থ্ব", "থ্য", "থ্র", "দ্গ", "দ্ঘ", "দ্দ", "দ্দ্ব",
    "দ্ধ", "দ্ব", "দ্ভ", "দ্ভ্র", "দ্ম", "দ্য", "দ্র", "দ্র্য", "ধ্ন", "ধ্ব", "ধ্ম", "ধ্য", "ধ্র", "র্ধ্ব",
    "ন্ট", "ন্ট্র", "ন্ঠ", "ন্ড", "ন্ড্র", "ন্ত", "ন্ত্ব", "ন্ত্য", "ন্ত্র", "ন্ত্র্য", "ন্থ", "ন্থ্র",
    "ন্দ", "ন্দ্য", "ন্দ্ব", "ন্দ্র", "ন্ধ", "ন্ধ্য", "ন্ধ্র", "ন্ন", "ন্ব", "ন্ম", "ন্য", "প্ট", "প্ত",
    "প্ন", "প্প", "প্য", "প্র", "প্র্য", "প্ল", "প্স", "ফ্র", "ফ্ল", "ব্জ", "ব্দ", "ব্ধ", "ব্ব", "ব্য",
    "ব্র", "ব্ল", "ভ্ব", "ভ্য", "ভ্র", "ম্ন", "ম্প", "ম্প্র", "ম্ফ", "ম্ব", "ম্ব্র", "ম্ভ", "ম্ভ্র", "ম্ম",
    "ম্য", "ম্র", "ম্ল", "য্য", "র্ক", "র্ক্য", "র্গ্য", "র্ঘ্য", "র্চ্য", "র্জ্য", "র্জ্ঞ", "র্ণ্য",
    "র্ত্য", "র্থ্য", "র্ব্য", "র্ম্য", "র্শ্য", "র্ষ্য", "র্হ্য", "র্খ", "র্গ", "র্গ্র", "র্ঘ", "র্চ",
    "র্ছ", "র্জ", "র্ঝ", "র্ট", "র্ড", "র্ণ", "র্ত", "র্ত্ম", "র্ত্র", "র্ৎ", "র্থ", "র্দ", "র্দ্ব",
    "র্দ্র", "র্ধ", "র্ধ্ব", "র্ন", "র্প", "র্ফ", "র্ব", "র্ভ", "র্ম", "র্য", "র্ল", "র্শ", "র্শ্ব", "র্ষ",
    "র্স", "র্হ", "র্হ্য", "র্ঢ্য", "ল্ক", "ল্ক্য", "ল্গ", "ল্ট", "ল্ড", "ল্প", "ল্ফ", "ল্ব", "ল্ভ", "ল্ম",
    "ল্য", "ল্ল", "শ্চ", "শ্ছ", "শ্ন", "শ্ব", "শ্ম", "শ্য", "শ্র", "শ্ল", "ষ্ক", "ষ্ক্র", "ষ্ট", "ষ্ট্য",
    "ষ্ট্র", "ষ্ঠ", "ষ্ঠ্য", "ষ্ণ", "ষ্প", "ষ্প্র", "ষ্ফ", "ষ্ব", "ষ্ম", "ষ্য", "স্ক", "স্ক্র", "স্খ",
    "স্ট", "স্ট্র", "স্ত", "স্ত্ব", "স্ত্য", "স্ত্র", "স্থ", "স্থ্য", "স্ন", "স্প", "স্প্র", "স্প্ল", "স্ফ",
    "স্ব", "স্ম", "স্য", "স্র", "স্ল", "হ্ণ", "হ্ন", "হ্ব", "হ্ম", "হ্য", "হ্র", "হ্ল", "ড়্গ", "স্ন্য",
    "র্জ্জ", "র্গ", "ভ্ল"
  ];

  var adorshoJukto = ["HÉ", "AÉ", "‚", "ƒ", "ƒÊ", "š²", "šÊ²", "LÁ", "LÅ", "LÈ", "LÉ", "œ²", "LÓ", "r", "rÁ",
    "rÅ", "rÈ", "rÈÉ", "rÉ", "„", "MÉ", "MË", "NÀ", "‡", "‡É", "‡Ê", "NÀ", "NÀÉ", "NÄ", "NÈ", "NÉ", "NË",
    "NËÉ", "NÔ", "OÀ", "OÉ", "OË", "ˆ", "ˆa", "ˆÉ", "´r", "´M", "´MÉ", "‰", "‰É", "´O", "´OÉ", "´OÊ", "´j",
    "µQ", "µR", "µRÆ", "µRÊ", "Š", "QÄ", "QÉ", "‹", "‹Æ", "Œ", "‘", "SÅ", "SÉ", "SÊ", "’", "“", "”", "•",
    "–", "VÄ", "VÈ", "VÉ", "VÊ", "—", "Xh", "XÉ", "XÊ", "YÉ", "YÊ", "¸V", "˜", "˜É", "™", "™É", "™Ê", "¸Y",
    "ZZ", "ZÄ", "ZÈ", "ZÉ", "š", "šÆ", "šÉ", "›", "aÁ", "aÅ", "aÈ", "aÈÉ", "aÉ", "œ", "œÉ", "bÄ", "bÉ",
    "bË", "cN", "cO", "Ÿ", "ŸÅ", "Ü", "à", "á", "áÊ", "cÈ", "cÉ", "â", "âÉ", "dÀ", "dÄ", "dÈ", "dÉ", "dË",
    "dÄÑ", "¾V", "¾VÌ", "ã", "ä", "äÊ", "¿¹", "¿¹Æ", "¿¹É", "¿»", "¿»É", "¿Û", "¿ÛÊ", "¾c", "¾cÉ", "¾à",
    "¾cÐ", "å", "åÉ", "åÌ", "æ", "eÄ", "¾j", "eÉ", "ÃV", "ç", "fÀ", "è", "fÉ", "fÐ", "fÐÉ", "fÔ", "Ãp", "é",
    "gÓ", "ê", "ë", "ì", "î", "hÉ", "hÐ", "hÔ", "ih", "iÉ", "ï", "jÀ", "Çf", "ÇfÐ", "Çg", "ð", "ðÊ", "ñ",
    "ò", "Çj", "jÉ", "jË", "jÔ", "kÉ", "LÑ", "LÑÉ", "NÑÉ", "OÑÉ", "QÑÉ", "SÑÉ", "‘Ñ", "ZÑÉ", "aÑÉ", "bÑÉ",
    "hÑÉ", "jÑÉ", "nÑÉ", "oÑÉ", "qÑÉ", "MÑ", "NÑ", "NÑÉ", "OÑ", "QÑ", "RÑ", "SÑ", "TÑ", "VÑ", "XÑ", "ZÑ",
    "aÑ", "aÈÑ", "œÑ", "vÑ", "bÑ", "cÑ", "àÑ", "âÑ", "dÑ", "dÄÑ", "eÑ", "fÑ", "gÑ", "hÑ", "iÑ", "jÑ", "kÑ",
    "mÑ", "nÑ", "nÄÑ", "oÑ", "pÑ", "qÑ", "qÑÉ", "YÑÉ", "ó", "óÉ", "ÒN", "ÒV", "ô", "Òf", "Òg", "mÄ", "mi",
    "mÈ", "mÉ", "õ", "ÕQ", "ÕR", "nÀ", "nÄ", "nÈ", "nÉ", "nÐ", "nÔ", "×L", "×œ²", "ø", "øÉ", "øÌ", "ù",
    "ùÉ", "o·", "Öf", "ÖfÐ", "Ög", "×h", "oÈ", "oÉ", "ú", "û", "ØM", "ØV", "ØVÌ", "Ù¹", "ÙaÅ", "Ù¹É", "Ù»",
    "ÙÛ", "ÙÛÉ", "pÀ", "Øf", "ØfÊ", "ØfÔ", "Øg", "ü", "pÈ", "pÉ", "pË", "pÔ", "qÁ", "q²", "qÆ", "þ", "qÉ",
    "qÊ", "qÔ", "sN", "pÀÉ", "‹Ñ", "NÑ", "iÔ"
  ];

  let input = sample;
  input = input.replace(/য়/g, "য়").replace(/ড়/g, "ড়");
  var outputText = '';
  var correctingAlpha = ['¢', '­', '®', '¯', '°', 'Ñ'];

  var i2 = '', i3 = '', i4 = '';

  for (let i = 0; i < input.length; i++) {
    if (input[i + 1] == '্') {
      for (let k = 0; k < uniJukto.length; k++) {
        if (input[i + 1] == '্' && input[i + 3] == '্' && input[i + 5] == '্') {
          if (uniJukto[k] == input[i] + input[i + 1] + input[i + 2] + input[i + 3] + input[i + 4] + input[i + 5] + input[i + 6]) {
            var temp = adorshoJukto[k];
            let temp2 = '';
            i += 6;
            if (input[i + 1] == 'ি' || input[i + 1] == 'ে' || input[i + 1] == 'ৈ' || input[i + 1] == 'ো' || input[i + 1] == 'ৌ') {
              switch (input[i + 1]) {
                case 'ি': outputText += '¢'; break;
                case 'ে': outputText += '®'; break;
                case 'ৈ': outputText += '¯'; break;
                case 'ো': outputText += '®'; temp2 = '¡'; break;
                case 'ৌ': outputText += '®'; temp2 = '±'; break;
              }
              i++;
            }
            outputText += temp + temp2;
            break;
          }
        } else if (input[i + 1] == '্' && input[i + 3] == '্') {
          if (uniJukto[k] == input[i] + input[i + 1] + input[i + 2] + input[i + 3] + input[i + 4]) {
            var temp = adorshoJukto[k];
            let temp2 = '';
            i += 4;
            if (input[i + 1] == 'ি' || input[i + 1] == 'ে' || input[i + 1] == 'ৈ' || input[i + 1] == 'ো' || input[i + 1] == 'ৌ') {
              switch (input[i + 1]) {
                case 'ি': outputText += '¢'; break;
                case 'ে': outputText += '®'; break;
                case 'ৈ': outputText += '¯'; break;
                case 'ো': outputText += '®'; temp2 = '¡'; break;
                case 'ৌ': outputText += '®'; temp2 = '±'; break;
              }
              i++;
            }
            outputText += temp + temp2;
            break;
          }
        } else if (input[i + 1] == '্') {
          if (uniJukto[k] == input[i] + input[i + 1] + input[i + 2]) {
            var temp = adorshoJukto[k];
            let temp2 = '';
            i += 2;
            if (input[i + 1] == 'ি' || input[i + 1] == 'ে' || input[i + 1] == 'ৈ' || input[i + 1] == 'ো' || input[i + 1] == 'ৌ') {
              switch (input[i + 1]) {
                case 'ি': outputText += '¢'; break;
                case 'ে': outputText += '®'; break;
                case 'ৈ': outputText += '¯'; break;
                case 'ো': outputText += '®'; temp2 = '¡'; break;
                case 'ৌ': outputText += '®'; temp2 = '±'; break;
              }
              i++;
            }
            outputText += temp + temp2;
            break;
          }
        }
      }
    } else {
      for (let j = 0; j < compareData.length; j++) {
        if (input[i] == unicodeData[j]) {
          var temp = compareData[j];
          let temp2 = '';
          if (input[i + 1] == 'ি' || input[i + 1] == 'ে' || input[i + 1] == 'ৈ' || input[i + 1] == 'ো' || input[i + 1] == 'ৌ') {
            switch (input[i + 1]) {
              case 'ি': outputText += '¢'; break;
              case 'ে': outputText += '®'; break;
              case 'ৈ': outputText += '¯'; break;
              case 'ো': outputText += '®'; temp2 = '¡'; break;
              case 'ৌ': outputText += '®'; temp2 = '±'; break;
            }
            i++;
          }
          outputText += temp + temp2;
          break;
        }
      }
    }
  }

  for (let i = 0; i < outputText.length; i++) {
    if (outputText[i] == '®') {
      i2 += '­';
    } else {
      i2 += outputText[i];
    }
  }

  return outputText;
}

/* ───────────────────────── Main Component ───────────────────────── */

export default function NumberToWordConverter() {
  const [number, setNumber] = useState<string>('');
  const [currencyBn, setCurrencyBn] = useState('');
  const [currencyEn, setCurrencyEn] = useState('');
  const [bnUnicode, setBnUnicode] = useState('');
  const [enWords, setEnWords] = useState('');
  const [hasResult, setHasResult] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [refOpen, setRefOpen] = useState(false);

  const adarshaRef = useRef<HTMLParagraphElement>(null);
  const currencyAdarshaRef = useRef<HTMLParagraphElement>(null);

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1600);
  };

  const processNumber = useCallback((val: string) => {
    if (!val || val.trim() === '') {
      setHasResult(false);
      setCurrencyBn('');
      setCurrencyEn('');
      setBnUnicode('');
      setEnWords('');
      return;
    }

    const num = parseFloat(val);
    if (isNaN(num) || num < 0 || num > 99999999.99) {
      setHasResult(false);
      return;
    }

    const parts = String(num).split('.');
    const integerPart = parseInt(parts[0], 10);
    let decimalPart = 0;
    if (parts[1]) {
      decimalPart = parseInt(parts[1].padEnd(2, '0').slice(0, 2), 10);
    }

    // Currency Bangla
    let cBn = '';
    if (integerPart > 0) cBn = toBanglaWords(integerPart) + ' টাকা';
    if (decimalPart > 0) {
      cBn += (cBn ? ' এবং ' : '') + toBanglaWords(decimalPart) + ' পয়সা';
    }
    if (!cBn) cBn = 'শূন্য টাকা';
    setCurrencyBn(cBn);

    // Currency English
    let cEn = '';
    if (integerPart > 0) cEn = toEnglishWords(integerPart) + ' Taka';
    if (decimalPart > 0) {
      cEn += (cEn ? ' and ' : '') + toEnglishWords(decimalPart) + ' Paisa';
    }
    if (!cEn) cEn = 'Zero Taka';
    setCurrencyEn(cEn);

    // Unicode Bangla
    let bn = toBanglaWords(integerPart);
    if (decimalPart > 0) bn += ' দশমিক ' + toBanglaWords(decimalPart);
    setBnUnicode(bn);

    // English
    let en = toEnglishWords(integerPart);
    if (decimalPart > 0) en += ' point ' + digitByDigitEnglish(decimalPart);
    setEnWords(en);

    setHasResult(true);
  }, []);

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => processNumber(number), 350);
    return () => clearTimeout(t);
  }, [number, processNumber]);

  // Update AdorshoLipi displays
  // useEffect-এ
useEffect(() => {
  if (adarshaRef.current && bnUnicode) {
    adarshaRef.current.innerText = convertToUnicode(bnUnicode);
  }
  if (currencyAdarshaRef.current && currencyBn) {
    currencyAdarshaRef.current.innerText = convertToUnicode(currencyBn);
  }
}, [bnUnicode, currencyBn]);

  return (
    <main className="max-w-2xl mx-auto space-y-6 p-4">
      {/* Header */}
      <header className="text-center space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight " lang="bn">
          সংখ্যা → শব্দ রূপান্তরকারী
        </h1>
        <p className="text-base " lang="bn">
          দশমিক সহ · টাকা-পয়সা · বাংলা ও ইংরেজি
        </p>
      </header>

      {/* Input */}
      <section>
        <div className="bg-zinc-400/10  rounded-xl p-5 shadow-sm space-y-3">
          <label className="block text-sm font-medium " lang="bn">
            সংখ্যা লিখুন
          </label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-zinc-500" />
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              max="99999999.99"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="যেমন: 12500.50 অথবা ১২৫০০.৫০"
              className="w-full pl-10 pr-4 py-3 rounded-lg  bg-zinc-400/10  placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:border-transparent"
              lang="en"
            />
          </div>
          <p className="text-xs text-zinc-600" lang="bn">
            দশমিক সহ ০.০০ থেকে ৯,৯৯,৯৯,৯৯.৯৯ পর্যন্ত সমর্থিত
          </p>
        </div>
      </section>

      {/* Results */}
      {hasResult && (
        <section className="space-y-4" aria-live="polite">
          {/* 1. Currency */}
          <article className="bg-zinc-400/10 rounded-xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Banknote className="size-5 text-amber-600" />
                <h3 className="text-base font-semibold " lang="bn">মুদ্রা রূপান্তর</h3>
              </div>
              <span className="text-xs font-medium bg-amber-400/50  px-2.5 py-1 rounded-full" lang="bn">
                টাকা ও পয়সা
              </span>
            </div>

            <div className="space-y-3">
              {/* Bangla Unicode Currency */}
              <div className="bg-zinc-400/10 rounded-lg p-4 space-y-2">
                <p className="text-sm text-zinc-600 dark:text-zinc-400" lang="bn">বাংলা (ইউনিকোড)</p>
                <p className="text-2xl font-medium text-amber-700" lang="bn">{currencyBn}</p>
                <button
                  onClick={() => copyText(currencyBn, 'cBn')}
                  className="inline-flex items-center gap-1.5 text-xs  "
                >
                  <Clipboard className="size-3.5" />
                  {copied === 'cBn' ? 'কপি হয়েছে!' : 'কপি'}
                </button>
              </div>

              {/* AdorshoLipi Currency */}
              <div className="bg-zinc-400/10 rounded-lg p-4 space-y-2">
                <p className="text-sm text-zinc-600 dark:text-zinc-400" lang="bn">টাকা-পয়সা (আদর্শলিপি আউটপুট)</p>
                <p ref={currencyAdarshaRef} className="text-2xl font-medium text-orange-600 adorsholipi-exp" />
                <button
                  onClick={() => {
                    const t = currencyAdarshaRef.current?.innerText || '';
                    copyText(t, 'cAd');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs  "
                >
                  <Clipboard className="size-3.5" />
                  {copied === 'cAd' ? 'কপি হয়েছে!' : 'আদর্শলিপি কপি'}
                </button>
              </div>

              {/* English Currency */}
              <div className="bg-zinc-400/10 rounded-lg p-4 space-y-2">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">English</p>
                <p className="text-2xl font-medium text-amber-700">{currencyEn}</p>
                <button
                  onClick={() => copyText(currencyEn, 'cEn')}
                  className="inline-flex items-center gap-1.5 text-xs  "
                >
                  <Clipboard className="size-3.5" />
                  {copied === 'cEn' ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </article>

          {/* 2. Unicode Bangla */}
          <article className="bg-zinc-400/10  rounded-xl p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Languages className="size-4 text-zinc-500" />
                <h3 className="font-medium " lang="bn">ইউনিকোড বাংলা</h3>
              </div>
              <span className="text-xs font-medium bg-green-100 text-green-800 px-2.5 py-1 rounded-full" lang="bn">
                বাংলা
              </span>
            </div>
            <p className="text-3xl sm:text-4xl font-medium text-green-700 leading-snug" lang="bn">
              {bnUnicode}
            </p>
            <div className="border-t border-zinc-200 pt-3">
              <button
                onClick={() => copyText(bnUnicode, 'bn')}
                className="inline-flex items-center gap-1.5 text-xs  "
              >
                <Clipboard className="size-3.5" />
                {copied === 'bn' ? 'কপি হয়েছে!' : 'কপি করুন'}
              </button>
            </div>
          </article>

          {/* 3. AdorshoLipi */}
          <article className="bg-zinc-400/10  rounded-xl p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Printer className="size-4 text-zinc-500" />
                <h3 className="font-medium " lang="bn">আদর্শলিপি আউটপুট (প্রিন্টিং-এর জন্য)</h3>
              </div>
              <span className="text-xs font-medium bg-orange-100 text-orange-800 px-2.5 py-1 rounded-full">
                ANSI / AdorshoLipi
              </span>
            </div>
            <p ref={adarshaRef} className="text-xl text-orange-600 leading-snug adorsholipi-exp" />
            <div className="border-t border-zinc-200 pt-3">
              <button
                onClick={() => {
                  const t = adarshaRef.current?.innerText || '';
                  copyText(t, 'ad');
                }}
                className="inline-flex items-center gap-1.5 text-xs  "
              >
                <Clipboard className="size-3.5" />
                {copied === 'ad' ? 'কপি হয়েছে!' : 'আদর্শলিপি কপি'}
              </button>
            </div>
          </article>

          {/* 4. English */}
          <article className="bg-zinc-400/10  rounded-xl p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Languages className="size-4 text-zinc-500" />
                <h3 className="font-medium " lang="bn">ইংরেজি</h3>
              </div>
              <span className="text-xs font-medium bg-sky-100 text-sky-800 px-2.5 py-1 rounded-full">
                English
              </span>
            </div>
            <p className="text-3xl sm:text-4xl font-medium text-sky-700 leading-snug">{enWords}</p>
            <div className="border-t border-zinc-200 pt-3">
              <button
                onClick={() => copyText(enWords, 'en')}
                className="inline-flex items-center gap-1.5 text-xs  "
              >
                <Clipboard className="size-3.5" />
                {copied === 'en' ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </article>
        </section>
      )}

      {/* Reference Table */}
      <section>
        <div className="bg-zinc-400/10  rounded-xl overflow-hidden shadow-sm">
          <button
            onClick={() => setRefOpen(!refOpen)}
            className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium  hover:bg-zinc-400/10 transition"
          >
            <span className="flex items-center gap-2" lang="bn">
              <TableCellsMerge className="size-4 text-zinc-600" />
              {refOpen ? 'রেফারেন্স লুকান' : 'রেফারেন্স দেখুন'}
            </span>
            <ChevronDown className={`size-4 text-zinc-600 transition ${refOpen ? 'rotate-180' : ''}`} />
          </button>

          {refOpen && (
            <div className="border-t border-zinc-200 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-zinc-400/10 ">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium" lang="bn">সংখ্যা</th>
                    <th className="px-4 py-3 text-left font-medium" lang="bn">টাকা-পয়সা</th>
                    <th className="px-4 py-3 text-left font-medium">English</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-400/25">
                  {[
                    ['০.৫০', 'পঞ্চাশ পয়সা', 'Fifty Paisa'],
                    ['১', 'এক টাকা', 'One Taka'],
                    ['১০.৭৫', 'দশ টাকা ও পঁচাত্তর পয়সা', 'Ten Taka and Seventy-Five Paisa'],
                    ['১০০', 'এক শত টাকা', 'One Hundred Taka'],
                    ['১,০০০.৫০', 'এক হাজার টাকা ও পঞ্চাশ পয়সা', 'One Thousand Taka and Fifty Paisa'],
                  ].map(([n, bn, en], i) => (
                    <tr key={i} className="hover:bg-zinc-400/10">
                      <td className="px-4 py-3 font-mono ">{n}</td>
                      <td className="px-4 py-3 " lang="bn">{bn}</td>
                      <td className="px-4 py-3 ">{en}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* About */}
      <section className="rounded-2xl  p-5 space-y-3">
        <h2 className="text-lg font-bold " lang="bn">
          সংখ্যা থেকে শব্দ রূপান্তরকারী সম্পর্কে
        </h2>
        <div className="text-sm leading-relaxed  space-y-3">
          <p lang="bn">
            এই অনলাইন টুলটি যেকোনো সংখ্যাকে সহজেই <strong>বাংলা ও ইংরেজি শব্দে</strong> রূপান্তর করে।
            দশমিকসহ টাকা-পয়সা ফরম্যাটেও রূপান্তর করা যায়। ইউনিকোড বাংলা এবং আদর্শলিপি (ANSI) উভয় ফরম্যাট সমর্থিত,
            যা প্রিন্টিং ও অফিসিয়াল কাজে ব্যবহার করা যায়।
          </p>
          <p lang="bn">
            বাংলাদেশের স্ট্যান্ডার্ড অনুযায়ী ১ টাকা = ১০০ পয়সা ধরে হিসাব করা হয়।
            সর্বোচ্চ ৯,৯৯,৯৯,৯৯.৯৯ পর্যন্ত সংখ্যা সাপোর্ট করে।
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold " lang="bn">প্রায়শই জিজ্ঞাসিত প্রশ্ন</h2>

        {[
          {
            q: 'কীভাবে সংখ্যা থেকে শব্দে রূপান্তর করব?',
            a: 'উপরের ইনপুট বক্সে সংখ্যা লিখুন (যেমন: 1250.50)। স্বয়ংক্রিয়ভাবে বাংলা, ইংরেজি এবং টাকা-পয়সা ফরম্যাটে ফলাফল দেখাবে।',
          },
          {
            q: 'আদর্শলিপি কী এবং কেন প্রয়োজন?',
            a: 'আদর্শলিপি একটি ANSI ফন্ট ভিত্তিক বাংলা লেখা পদ্ধতি। অনেক পুরনো সফটওয়্যার ও প্রিন্টারে ইউনিকোড সাপোর্ট না থাকলে আদর্শলিপি ফরম্যাট ব্যবহার করা হয়। এই টুলে এক ক্লিকেই আদর্শলিপি আউটপুট পাওয়া যায়।',
          },
          {
            q: 'দশমিক সংখ্যা সাপোর্ট করে কি?',
            a: 'হ্যাঁ, দশমিকসহ সংখ্যা সম্পূর্ণ সাপোর্ট করে। টাকা ও পয়সা আলাদাভাবে দেখানো হয় এবং সাধারণ সংখ্যায় “দশমিক” শব্দসহ রূপান্তর করা হয়।',
          },
          {
            q: 'সর্বোচ্চ কত বড় সংখ্যা রূপান্তর করা যায়?',
            a: 'এই টুলটি ০ থেকে ৯,৯৯,৯৯,৯৯.৯৯ পর্যন্ত সংখ্যা সাপোর্ট করে। এর বেশি সংখ্যা দিলে ভ্যালিডেশন এরর দেখাবে।',
          },
        ].map((item, i) => (
          <details
            key={i}
            className="group rounded-xl  overflow-hidden bg-zinc-400/10"
          >
            <summary className="flex items-center justify-between cursor-pointer px-4 py-3.5 font-medium  hover:bg-zinc-400/10 transition list-none">
              <span lang="bn">{item.q}</span>
              <ChevronDown className="size-4 text-zinc-500 group-open:rotate-180 transition" />
            </summary>
            <hr className='border-zinc-400/25'/>
            <div className="p-4 text-sm  leading-relaxed" lang="bn">
              {item.a}
            </div>
          </details>
        ))}
      </section>

      <p className="text-center text-xs text-zinc-500" lang="bn">
        বাংলাদেশের স্ট্যান্ডার্ড: টাকা ও পয়সা (১ টাকা = ১০০ পয়সা)
      </p>
    </main>
  );
}