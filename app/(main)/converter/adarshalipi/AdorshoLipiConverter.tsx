'use client';

import { useState } from 'react';
import { Printer, Languages, Clipboard, Trash2, ArrowUpDown } from 'lucide-react';

/* ───────────────────────── EXACT ORIGINAL JS (from your Livewire) ───────────────────────── */

function convertToUnicode(sample: string): string {
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

  var input = sample;
  input = input.replace(/য়/g, "য়").replace(/ড়/g, "ড়");
  var outputText = '';
  var correctingAlpha = ['¢', '­', '®', '¯', '°', 'Ñ'];

  var i2 = '',
    i3 = '',
    i4 = '';

  for (var i = 0; i < input.length; i++) {
    if (input[i + 1] == '্') {
      for (var k = 0; k < uniJukto.length; k++) {
        if (input[i + 1] == '্' && input[i + 3] == '্' && input[i + 5] == '্') {
          if (uniJukto[k] == input[i] + input[i + 1] + input[i + 2] + input[i + 3] + input[i + 4] + input[i + 5] + input[i + 6]) {
            var temp = adorshoJukto[k];
            var temp2 = '';
            i += 6;
            if (input[i + 1] == 'ি' || input[i + 1] == 'ে' || input[i + 1] == 'ৈ' || input[i + 1] == 'ো' || input[i + 1] == 'ৌ') {
              switch (input[i + 1]) {
                case 'ি':
                  outputText += '¢';
                  break;
                case 'ে':
                  outputText += '®';
                  break;
                case 'ৈ':
                  outputText += '¯';
                  break;
                case 'ো':
                  outputText += '®';
                  temp2 = '¡';
                  break;
                case 'ৌ':
                  outputText += '®';
                  temp2 = '±';
                  break;
              }
              i++;
            }
            outputText += temp + temp2;
            break;
          }
        } else if (input[i + 1] == '্' && input[i + 3] == '্') {
          if (uniJukto[k] == input[i] + input[i + 1] + input[i + 2] + input[i + 3] + input[i + 4]) {
            var temp = adorshoJukto[k];
            var temp2 = '';
            i += 4;
            if (input[i + 1] == 'ি' || input[i + 1] == 'ে' || input[i + 1] == 'ৈ' || input[i + 1] == 'ো' || input[i + 1] == 'ৌ') {
              switch (input[i + 1]) {
                case 'ি':
                  outputText += '¢';
                  break;
                case 'ে':
                  outputText += '®';
                  break;
                case 'ৈ':
                  outputText += '¯';
                  break;
                case 'ো':
                  outputText += '®';
                  temp2 = '¡';
                  break;
                case 'ৌ':
                  outputText += '®';
                  temp2 = '±';
                  break;
              }
              i++;
            }
            outputText += temp + temp2;
            break;
          }
        } else if (input[i + 1] == '্') {
          if (uniJukto[k] == input[i] + input[i + 1] + input[i + 2]) {
            var temp = adorshoJukto[k];
            var temp2 = '';
            i += 2;
            if (input[i + 1] == 'ি' || input[i + 1] == 'ে' || input[i + 1] == 'ৈ' || input[i + 1] == 'ো' || input[i + 1] == 'ৌ') {
              switch (input[i + 1]) {
                case 'ি':
                  outputText += '¢';
                  break;
                case 'ে':
                  outputText += '®';
                  break;
                case 'ৈ':
                  outputText += '¯';
                  break;
                case 'ো':
                  outputText += '®';
                  temp2 = '¡';
                  break;
                case 'ৌ':
                  outputText += '®';
                  temp2 = '±';
                  break;
              }
              i++;
            }
            outputText += temp + temp2;
            break;
          }
        }
      }
    } else {
      for (var j = 0; j < compareData.length; j++) {
        if (input[i] == unicodeData[j]) {
          var temp = compareData[j];
          var temp2 = '';
          if (input[i + 1] == 'ি' || input[i + 1] == 'ে' || input[i + 1] == 'ৈ' || input[i + 1] == 'ো' || input[i + 1] == 'ৌ') {
            switch (input[i + 1]) {
              case 'ি':
                outputText += '¢';
                break;
              case 'ে':
                outputText += '®';
                break;
              case 'ৈ':
                outputText += '¯';
                break;
              case 'ো':
                outputText += '®';
                temp2 = '¡';
                break;
              case 'ৌ':
                outputText += '®';
                temp2 = '±';
                break;
            }
            i++;
          }
          outputText += temp + temp2;
          break;
        }
      }
    }
  }

  for (var i = 0; i < outputText.length; i++) {
    if (outputText[i] == '®') {
      i2 += '­';
    } else {
      i2 += outputText[i];
    }
  }
  // copyTo = i2;  // original had this, but not used

  return outputText;   // original returns outputText (not i2)
}

function convertToAdarshalipi(sample: string): string {
  var compareData = ['\n', ' ', '	', '!', '\"', '#', '\$', '%', '&', '\'', '\(', '\)', '\*', '\+', ',', '-', '.',
    '\/', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';', '<', '=', '>', '\?', '@', 'A', 'B',
    'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W',
    'X', 'Y', 'Z', '\[', '\\', '\]', '^', '_', '`', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k',
    'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '\{', '|', '\}', '~', '‚',
    'ƒ', '„', '…', '†', '‡', 'ˆ', '‰', 'Š', '‹', 'Œ', '‘', '’', '“', '”', '•', '–', '—', '˜', '™', 'š', '›',
    'œ', 'Ÿ', '¡', '¢', '£', '¤', '¥', '¦', '§', '¨', '©', 'ª', '«', '¬', '­', '®', '¯', '°', '±', '²', '³',
    '´', 'µ', '¶', '·', '¸', '¹', 'º', '»', '¼', '½', '¾', '¿', 'À', 'Á', 'Â', 'Ã', 'Ä', 'Å', 'Æ', 'Ç', 'È',
    'É', 'Ê', 'Ë', 'Ì', 'Ð', 'Ñ', 'Ò', 'Ó', 'Ô', 'Õ', 'Ö', '×', 'Ø', 'Ù', 'Ú', 'Û', 'Ü', 'Ý', 'Þ', 'ß', 'à',
    'á', 'â', 'ã', 'ä', 'å', 'æ', 'ç', 'è', 'é', 'ê', 'ë', 'ì', 'í', 'î', 'ï', 'ð', 'ñ', 'ò', 'ó', 'ô', 'õ',
    'ö', '÷', 'ø', 'ù', 'ú', 'û', 'ü', 'ý', 'þ'
  ];
  var unicodeData = ['\n', ' ', '	', '!', '‘', '#', '\$', '%', '&', '’', '\(', '\)', '\*', '\+', ',', '-', '.',
    '\/', '০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯', ':', ';', '<', '=', '>', '\?', '@', 'অ', 'আ',
    'ই', 'ঈ', 'উ', 'ঊ', 'ঋ', 'এ', 'ঐ', 'ও', 'ঔ', 'ক', 'খ', 'গ', 'ঘ', 'ঙ', 'চ', 'ছ', 'জ', 'ঝ', 'ঞ', 'ট', 'ঠ',
    'ড', 'ঢ', 'ণ', '\[', '\\', '\]', '×', 'e0', '÷', 'ত', 'থ', 'দ', 'ধ', 'ন', 'প', 'ফ', 'ব', 'ভ', 'ম', 'য',
    'র', 'ল', 'শ', 'ষ', 'স', 'হ', 'ক্ষ', 'ড়', 'ঢ়', 'য়', 'ৎ', 'ং', 'ঃ', 'ঁ', '।', '\{', '|', '\}', '্র',
    'ক্ক', 'ক্ট', 'ক্স', 'গু', 'গ্‌গ', 'গ্ধ', 'ঙ্ক', 'ঙ্গ', 'চ্‌ঞ', 'জ্জ', 'জ্ঝ', 'জ্ঞ', 'ঞ্চ', 'ঞ্ছ',
    'ঞ্জ', 'ঞ্ঝ', 'ট্ট', 'ড্ড', 'ণ্ঠ', 'ণ্ড', 'ত্ত', 'ত্থ', 'ত্র', 'দ্দ', 'া', 'ি', 'ী', 'ু', 'ু', 'ু', 'ূ',
    'ূ', 'ূ', 'ৃ', 'ৃ', '×', 'ে', 'ে', 'ৈ', 'ৈ', 'ৗ', '্ক', 'গ্', 'ঙ্', 'চ্', 'জ', '্ঞ', 'ণ্', '্ত', 'ত্ত',
    '্ত্র', '্দ', '্ধ', 'ন্', 'ন্', '্ন', '্ন', '×', 'প্', '্ব', '্ব', '্ব', 'ম্', '্ম', '্য', '্র', '্র',
    '্র', '্র', 'র্', 'ল্', '্ল', '্ল', 'শ্', 'ষ্', 'ষ্', 'স্', 'স্', '্‌', '্থ', 'দ্ধ', '×', 'দ্ধ্ব', '×',
    'দ্ব', 'দ্ভ', 'দ্র', 'ন্ঠ', 'ন্ড', 'ন্ধ', 'ন্ন', 'প্ত', 'প্প', 'ফ্র', 'ব্জ', 'ব্দ', 'ব্ধ', '×', 'ব্ব',
    'ভ্র', 'ম্ব', 'ম্ভ', 'ম্ভ্র', 'ল্ক', 'ল্ড', 'ল্ল', 'শু', 'শ্ত', 'ষ্ট', 'ষ্ঠ', 'স্ক', 'স্ক্র', 'স্ব',
    'হু', 'ক্ষ্ম'
  ];

  var input = sample;
  var outputText = '';
  var correctingAlpha = ['¢', '­', '®', '¯', '°', 'Ñ'];

  var i2 = '',
    i3 = '',
    i4 = '';

  for (var i = 0; i < input.length; i++) {
    if (input[i] == '­') {
      i4 += '®';
    } else {
      i4 += input[i];
    }
  }

  // original had document.getElementById, skipped in React

  for (var i = 0; i < input.length; i++) {
    if (input[i] == '¢' || input[i] == '­' || input[i] == '®' || input[i] == '¯' || input[i] == '°') {
      i2 += input[i + 1];
      i2 += input[i];
      i++;
    } else {
      i2 += input[i];
    }
  }
  input = i2;
  i2 = '';

  for (var i = 0; i < input.length; i++) {
    if (input[i + 1] == 'Ñ') {
      i2 += input[i + 1];
      i2 += input[i];
      i++;
    } else {
      i2 += input[i];
    }
  }
  input = i2;
  i2 = '';

  for (var i = 0; i < input.length; i++) {
    if ((input[i + 2] == '¢' || input[i + 2] == '­' || input[i + 2] == '®') && input[i + 1] == 'Ñ') {
      i2 += input[i + 1];
      i2 += input[i];
      i++;
    } else if ((input[i] == '­' || input[i] == '®') && input[i + 1] == 'É') {
      i2 += input[i + 1];
      i2 += input[i];
      i++;
    } else if ((input[i] == '¢' || input[i] == '­' || input[i] == '®') && input[i + 1] == 'Ô') {
      i2 += input[i + 1];
      i2 += input[i];
      i++;
    } else if ((input[i] == 'y') && input[i + 1] == '¡') {
      i2 += input[i + 1];
      i2 += input[i];
      i++;
    } else {
      i2 += input[i];
    }
  }

  input = i2;

  for (var i = 0; i < input.length; i++) {
    for (var j = 0; j < compareData.length; j++) {
      if (input[i] == compareData[j]) {
        outputText += unicodeData[j];
      }
    }
  }

  for (var i = 0; i < outputText.length; i++) {
    if (outputText[i] == '্' && (outputText[i + 1] == 'ে' || outputText[i + 1] == 'ি')) {
      i3 += outputText[i];
      i3 += outputText[i + 2];
      i3 += outputText[i + 1];
      i += 2;
    } else {
      i3 += outputText[i];
    }
  }
  outputText = i3;
  i3 = '';
  for (var i = 0; i < outputText.length; i++) {
    if (outputText[i] == '্' && (outputText[i + 1] == 'ে' || outputText[i + 1] == 'ি')) {
      i3 += outputText[i];
      i3 += outputText[i + 2];
      i3 += outputText[i + 1];
      i += 2;
    } else {
      i3 += outputText[i];
    }
  }
  outputText = i3;
  var i4 = '';
  for (var i = 0; i < outputText.length; i++) {
    if (outputText[i] + outputText[i + 1] == '্্') {
      i++;
    }
    i4 += outputText[i];
  }
 return i4
  .replace(/ত্র্ক/g, "ক্র")
  .replace(/ত্রে্‌কা/g, "ক্রো")
  .replace(/ত্ত্ক/g, "ক্ত")
  .replace(/ত্তি্ক/g, "ক্তি")
  .replace(/ত্রে্ক/g, "ক্রে")
  .replace(/অা/g, "আ");
}

/* ───────────────────────── React Component ───────────────────────── */

export default function AdorshoLipiConverter() {
  const [unicode, setUnicode] = useState('');
  const [adorsho, setAdorsho] = useState('');
  const [copyTextU, setCopyTextU] = useState('কপি ইউনিকোড');
  const [copyTextA, setCopyTextA] = useState('আদর্শলিপি কপি');

  const handleUnicodeChange = (value: string) => {
    setUnicode(value);
    setAdorsho(value ? convertToUnicode(value) : '');
  };

  const handleAdorshoChange = (value: string) => {
    setAdorsho(value);
    setUnicode(value ? convertToAdarshalipi(value) : '');
  };

  const clearAll = () => {
    setUnicode('');
    setAdorsho('');
  };

  const copy = async (text: string, type: 'u' | 'a') => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    if (type === 'u') {
      setCopyTextU('কপি হয়েছে!');
      setTimeout(() => setCopyTextU('কপি ইউনিকোড'), 2000);
    } else {
      setCopyTextA('কপি হয়েছে!');
      setTimeout(() => setCopyTextA('আদর্শলিপি কপি'), 2000);
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-4 space-y-4">
      <header className="text-center space-y-2">
        <h1 className="text-2xl tracking-tight" >
          আদর্শলিপি ⇄ ইউনিকোড কনভার্টার
        </h1>
        <p>
          রিয়েল-টাইম উভয়মুখী বাংলা লিপি রূপান্তর
        </p>
      </header>

      <section className="space-y-4">
        {/* AdorshoLipi */}
        <article className="bg-zinc-400/10 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 " >
              <Printer className="size-4 " />
              আদর্শলিপি (ANSI)
            </h3>
            <span className="  bg-zinc-400/10  px-2.5 py-1 rounded-full">
              Print Standard
            </span>
          </div>

          <textarea
            value={adorsho}
            onChange={(e) => handleAdorshoChange(e.target.value)}
            rows={6}
            placeholder="BcnÑ¢m¢f HM¡®e V¡Cf Ll¤e..."
            className="w-full resize-none p-4 rounded-xl bg-zinc-400/10 adorsholipi-exp outline-none leading-relaxed "
          />

          <div className="flex justify-end">
            <button
              onClick={() => copy(adorsho, 'a')}
              className="inline-flex items-center gap-2 px-4 py-2   bg-zinc-400/10 rounded-xl hover:bg-zinc-400/25 transition"
            >
              <Clipboard className="size-4" />
              {copyTextA}
            </button>
          </div>
        </article>

        <div className="flex justify-center text-zinc-400">
          <ArrowUpDown className="size-5" />
        </div>

        {/* Unicode */}
        <article className="bg-zinc-400/10 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 " >
              <Languages className="size-4 " />
              ইউনিকোড (Unicode)
            </h3>
            <span className="  bg-zinc-400/10  px-2.5 py-1 rounded-full">
              Web Standard
            </span>
          </div>

          <textarea
            value={unicode}
            onChange={(e) => handleUnicodeChange(e.target.value)}
            rows={6}
            placeholder="এখানে ইউনিকোড বাংলা লিখুন..."
            className="w-full resize-none p-4 rounded-xl bg-zinc-400/10 outline-none leading-relaxed "
          />

          <div className="flex justify-between items-center">
            <button
              onClick={clearAll}
              className="inline-flex items-center rounded-xl gap-2 px-3 py-2  bg-zinc-400/10 hover:bg-zinc-400/25 transition"
            >
              <Trash2 className="size-4" />
              সব মুছুন
            </button>

            <button
              onClick={() => copy(unicode, 'u')}
              className="inline-flex items-center gap-2 px-4 py-2   bg-zinc-400/10 text-white rounded-xl hover:bg-zinc-400/25 transition"
            >
              <Clipboard className="size-4" />
              {copyTextU}
            </button>
          </div>
        </article>
      </section>
<hr className='border border-zinc-400/25 my-12'/>
      {/* About + FAQ same as before */}
      <section className="">
        <h2 className="text-lg " >
          আদর্শলিপি ও ইউনিকোড কনভার্টার সম্পর্কে
        </h2>
        <div className=" leading-relaxed space-y-4">
          <p >
            <strong>আদর্শলিপি</strong> একটি ANSI ভিত্তিক বাংলা ফন্ট সিস্টেম যা দীর্ঘদিন ধরে প্রিন্টিং, অফিস ডকুমেন্ট
            এবং পুরনো সফটওয়্যারে ব্যবহৃত হয়ে আসছে। অন্যদিকে <strong>ইউনিকোড</strong> আধুনিক ওয়েব স্ট্যান্ডার্ড,
            যা সব ব্রাউজার ও ডিভাইসে সঠিকভাবে দেখায়।
          </p>
          <p >
            এই টুলটি <strong>উভয়মুখী রিয়েল-টাইম কনভার্সন</strong> সাপোর্ট করে। আপনি ইউনিকোড লিখলে স্বয়ংক্রিয়ভাবে
            আদর্শলিপিতে রূপান্তর হবে, আবার আদর্শলিপি লিখলে ইউনিকোডে চলে আসবে।
          </p>
        </div>
      </section>
    </main>
  );
}