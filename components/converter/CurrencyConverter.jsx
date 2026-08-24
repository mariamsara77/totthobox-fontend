"use client";

import { useState, useEffect, useRef } from "react";

// কারেন্সি ডাটা (আপনার পিএইচপি কোড থেকে নেওয়া)
const currencyData = {
  AED: { label: "UAE Dirham", symbol: "د.إ", code: "AED" },
  AFN: { label: "Afghan Afghani", symbol: "؋", code: "AFN" },
  ALL: { label: "Albanian Lek", symbol: "L", code: "ALL" },
  AMD: { label: "Armenian Dram", symbol: "֏", code: "AMD" },
  ANG: { label: "Netherlands Antillean Guilder", symbol: "ƒ", code: "ANG" },
  AOA: { label: "Angolan Kwanza", symbol: "Kz", code: "AOA" },
  ARS: { label: "Argentine Peso", symbol: "$", code: "ARS" },
  AUD: { label: "Australian Dollar", symbol: "$", code: "AUD" },
  AWG: { label: "Aruban Florin", symbol: "ƒ", code: "AWG" },
  AZN: { label: "Azerbaijani Manat", symbol: "₼", code: "AZN" },
  BAM: { label: "Bosnia-Herzegovina Convertible Mark", symbol: "KM", code: "BAM" },
  BBD: { label: "Barbadian Dollar", symbol: "$", code: "BBD" },
  BDT: { label: "Bangladeshi Taka", symbol: "৳", code: "BDT" },
  BGN: { label: "Bulgarian Lev", symbol: "лв", code: "BGN" },
  BHD: { label: "Bahraini Dinar", symbol: ".د.ب", code: "BHD" },
  BIF: { label: "Burundian Franc", symbol: "FBu", code: "BIF" },
  BMD: { label: "Bermudian Dollar", symbol: "$", code: "BMD" },
  BND: { label: "Brunei Dollar", symbol: "$", code: "BND" },
  BOB: { label: "Bolivian Boliviano", symbol: "Bs.", code: "BOB" },
  BRL: { label: "Brazilian Real", symbol: "R$", code: "BRL" },
  BSD: { label: "Bahamian Dollar", symbol: "$", code: "BSD" },
  BTN: { label: "Bhutanese Ngultrum", symbol: "Nu.", code: "BTN" },
  BWP: { label: "Botswanan Pula", symbol: "P", code: "BWP" },
  BYN: { label: "Belarusian Ruble", symbol: "Br", code: "BYN" },
  BZD: { label: "Belize Dollar", symbol: "BZ$", code: "BZD" },
  CAD: { label: "Canadian Dollar", symbol: "$", code: "CAD" },
  CDF: { label: "Congolese Franc", symbol: "FC", code: "CDF" },
  CHF: { label: "Swiss Franc", symbol: "CHF", code: "CHF" },
  CLP: { label: "Chilean Peso", symbol: "$", code: "CLP" },
  CNY: { label: "Chinese Yuan", symbol: "¥", code: "CNY" },
  COP: { label: "Colombian Peso", symbol: "$", code: "COP" },
  CRC: { label: "Costa Rican Colón", symbol: "₡", code: "CRC" },
  CUP: { label: "Cuban Peso", symbol: "₱", code: "CUP" },
  CVE: { label: "Cape Verdean Escudo", symbol: "Esc", code: "CVE" },
  CZK: { label: "Czech Koruna", symbol: "Kč", code: "CZK" },
  DJF: { label: "Djiboutian Franc", symbol: "Fdj", code: "DJF" },
  DKK: { label: "Danish Krone", symbol: "kr", code: "DKK" },
  DOP: { label: "Dominican Peso", symbol: "RD$", code: "DOP" },
  DZD: { label: "Algerian Dinar", symbol: "د.ج", code: "DZD" },
  EGP: { label: "Egyptian Pound", symbol: "£", code: "EGP" },
  ERN: { label: "Eritrean Nakfa", symbol: "Nfk", code: "ERN" },
  ETB: { label: "Ethiopian Birr", symbol: "Br", code: "ETB" },
  EUR: { label: "Euro", symbol: "€", code: "EUR" },
  FJD: { label: "Fiji Dollar", symbol: "$", code: "FJD" },
  FKP: { label: "Falkland Islands Pound", symbol: "£", code: "FKP" },
  GBP: { label: "British Pound", symbol: "£", code: "GBP" },
  GEL: { label: "Georgian Lari", symbol: "₾", code: "GEL" },
  GHS: { label: "Ghanaian Cedi", symbol: "₵", code: "GHS" },
  GIP: { label: "Gibraltar Pound", symbol: "£", code: "GIP" },
  GMD: { label: "Gambian Dalasi", symbol: "D", code: "GMD" },
  GNF: { label: "Guinean Franc", symbol: "FG", code: "GNF" },
  GTQ: { label: "Guatemalan Quetzal", symbol: "Q", code: "GTQ" },
  GYD: { label: "Guyanese Dollar", symbol: "$", code: "GYD" },
  HKD: { label: "Hong Kong Dollar", symbol: "$", code: "HKD" },
  HNL: { label: "Honduran Lempira", symbol: "L", code: "HNL" },
  HRK: { label: "Croatian Kuna", symbol: "kn", code: "HRK" },
  HTG: { label: "Haitian Gourde", symbol: "G", code: "HTG" },
  HUF: { label: "Hungarian Forint", symbol: "Ft", code: "HUF" },
  IDR: { label: "Indonesian Rupiah", symbol: "Rp", code: "IDR" },
  ILS: { label: "Israeli New Sheqel", symbol: "₪", code: "ILS" },
  INR: { label: "Indian Rupee", symbol: "₹", code: "INR" },
  IQD: { label: "Iraqi Dinar", symbol: "ع.د", code: "IQD" },
  IRR: { label: "Iranian Rial", symbol: "﷼", code: "IRR" },
  ISK: { label: "Icelandic Króna", symbol: "kr", code: "ISK" },
  JMD: { label: "Jamaican Dollar", symbol: "J$", code: "JMD" },
  JOD: { label: "Jordanian Dinar", symbol: "د.ا", code: "JOD" },
  JPY: { label: "Japanese Yen", symbol: "¥", code: "JPY" },
  KES: { label: "Kenyan Shilling", symbol: "KSh", code: "KES" },
  KGS: { label: "Kyrgyzstani Som", symbol: "с", code: "KGS" },
  KHR: { label: "Cambodian Riel", symbol: "៛", code: "KHR" },
  KMF: { label: "Comorian Franc", symbol: "CF", code: "KMF" },
  KPW: { label: "North Korean Won", symbol: "₩", code: "KPW" },
  KRW: { label: "South Korean Won", symbol: "₩", code: "KRW" },
  KWD: { label: "Kuwaiti Dinar", symbol: "د.ك", code: "KWD" },
  KYD: { label: "Cayman Islands Dollar", symbol: "$", code: "KYD" },
  KZT: { label: "Kazakhstani Tenge", symbol: "₸", code: "KZT" },
  LAK: { label: "Lao Kip", symbol: "₭", code: "LAK" },
  LBP: { label: "Lebanese Pound", symbol: "ل.ل", code: "LBP" },
  LKR: { label: "Sri Lankan Rupee", symbol: "₨", code: "LKR" },
  LRD: { label: "Liberian Dollar", symbol: "$", code: "LRD" },
  LSL: { label: "Lesotho Loti", symbol: "L", code: "LSL" },
  LYD: { label: "Libyan Dinar", symbol: "ل.د", code: "LYD" },
  MAD: { label: "Moroccan Dirham", symbol: "د.م.", code: "MAD" },
  MDL: { label: "Moldovan Leu", symbol: "L", code: "MDL" },
  MGA: { label: "Malagasy Ariary", symbol: "Ar", code: "MGA" },
  MKD: { label: "Macedonian Denar", symbol: "ден", code: "MKD" },
  MMK: { label: "Myanmar Kyat", symbol: "K", code: "MMK" },
  MNT: { label: "Mongolian Tugrik", symbol: "₮", code: "MNT" },
  MOP: { label: "Macanese Pataca", symbol: "P", code: "MOP" },
  MRU: { label: "Mauritanian Ouguiya", symbol: "UM", code: "MRU" },
  MUR: { label: "Mauritian Rupee", symbol: "₨", code: "MUR" },
  MVR: { label: "Maldivian Rufiyaa", symbol: "ރ", code: "MVR" },
  MWK: { label: "Malawian Kwacha", symbol: "MK", code: "MWK" },
  MXN: { label: "Mexican Peso", symbol: "$", code: "MXN" },
  MYR: { label: "Malaysian Ringgit", symbol: "RM", code: "MYR" },
  MZN: { label: "Mozambican Metical", symbol: "MT", code: "MZN" },
  NAD: { label: "Namibian Dollar", symbol: "$", code: "NAD" },
  NGN: { label: "Nigerian Naira", symbol: "₦", code: "NGN" },
  NIO: { label: "Nicaraguan Córdoba", symbol: "C$", code: "NIO" },
  NOK: { label: "Norwegian Krone", symbol: "kr", code: "NOK" },
  NPR: { label: "Nepalese Rupee", symbol: "₨", code: "NPR" },
  NZD: { label: "New Zealand Dollar", symbol: "$", code: "NZD" },
  OMR: { label: "Omani Rial", symbol: "ر.ع.", code: "OMR" },
  PAB: { label: "Panamanian Balboa", symbol: "B/.", code: "PAB" },
  PEN: { label: "Peruvian Sol", symbol: "S/.", code: "PEN" },
  PGK: { label: "Papua New Guinean Kina", symbol: "K", code: "PGK" },
  PHP: { label: "Philippine Peso", symbol: "₱", code: "PHP" },
  PKR: { label: "Pakistani Rupee", symbol: "₨", code: "PKR" },
  PLN: { label: "Polish Złoty", symbol: "zł", code: "PLN" },
  PYG: { label: "Paraguayan Guaraní", symbol: "₲", code: "PYG" },
  QAR: { label: "Qatari Riyal", symbol: "﷼", code: "QAR" },
  RON: { label: "Romanian Leu", symbol: "L", code: "RON" },
  RSD: { label: "Serbian Dinar", symbol: "дин.", code: "RSD" },
  RUB: { label: "Russian Ruble", symbol: "₽", code: "RUB" },
  RWF: { label: "Rwandan Franc", symbol: "RF", code: "RWF" },
  SAR: { label: "Saudi Riyal", symbol: "﷼", code: "SAR" },
  SBD: { label: "Solomon Islands Dollar", symbol: "$", code: "SBD" },
  SCR: { label: "Seychellois Rupee", symbol: "₨", code: "SCR" },
  SDG: { label: "Sudanese Pound", symbol: "ج.س.", code: "SDG" },
  SEK: { label: "Swedish Krona", symbol: "kr", code: "SEK" },
  SGD: { label: "Singapore Dollar", symbol: "$", code: "SGD" },
  SLL: { label: "Sierra Leonean Leone", symbol: "Le", code: "SLL" },
  SOS: { label: "Somali Shilling", symbol: "S", code: "SOS" },
  SRD: { label: "Surinamese Dollar", symbol: "$", code: "SRD" },
  SSP: { label: "South Sudanese Pound", symbol: "£", code: "SSP" },
  STN: { label: "São Tomé and Príncipe Dobra", symbol: "Db", code: "STN" },
  SYP: { label: "Syrian Pound", symbol: "£", code: "SYP" },
  SZL: { label: "Swazi Lilangeni", symbol: "E", code: "SZL" },
  THB: { label: "Thai Baht", symbol: "฿", code: "THB" },
  TJS: { label: "Tajikistani Somoni", symbol: "ЅМ", code: "TJS" },
  TMT: { label: "Turkmenistani Manat", symbol: "m", code: "TMT" },
  TND: { label: "Tunisian Dinar", symbol: "د.ت", code: "TND" },
  TOP: { label: "Tongan Paʻanga", symbol: "T$", code: "TOP" },
  TRY: { label: "Turkish Lira", symbol: "₺", code: "TRY" },
  TTD: { label: "Trinidad and Tobago Dollar", symbol: "TT$", code: "TTD" },
  TWD: { label: "New Taiwan Dollar", symbol: "NT$", code: "TWD" },
  TZS: { label: "Tanzanian Shilling", symbol: "TSh", code: "TZS" },
  UAH: { label: "Ukrainian Hryvnia", symbol: "₴", code: "UAH" },
  UGX: { label: "Ugandan Shilling", symbol: "USh", code: "UGX" },
  USD: { label: "US Dollar", symbol: "$", code: "USD" },
  UYU: { label: "Uruguayan Peso", symbol: "$U", code: "UYU" },
  UZS: { label: "Uzbekistan Som", symbol: "сум", code: "UZS" },
  VES: { label: "Venezuelan Bolívar", symbol: "Bs.", code: "VES" },
  VND: { label: "Vietnamese Dong", symbol: "₫", code: "VND" },
  VUV: { label: "Vanuatu Vatu", symbol: "Vt", code: "VUV" },
  WST: { label: "Samoan Tālā", symbol: "T", code: "WST" },
  XAF: { label: "Central African CFA Franc", symbol: "FCFA", code: "XAF" },
  XCD: { label: "East Caribbean Dollar", symbol: "$", code: "XCD" },
  XOF: { label: "West African CFA Franc", symbol: "CFA", code: "XOF" },
  XPF: { label: "CFP Franc", symbol: "₣", code: "XPF" },
  YER: { label: "Yemeni Rial", symbol: "﷼", code: "YER" },
  ZAR: { label: "South African Rand", symbol: "R", code: "ZAR" },
  ZMW: { label: "Zambian Kwacha", symbol: "ZK", code: "ZMW" },
  ZWL: { label: "Zimbabwean Dollar", symbol: "Z$", code: "ZWL" },
};

export default function CurrencyConverter() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("BDT");
  const [exchangeRate, setExchangeRate] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const [fromSearch, setFromSearch] = useState("");
  const [toSearch, setToSearch] = useState("");
  const [fromDropdownOpen, setFromDropdownOpen] = useState(false);
  const [toDropdownOpen, setToDropdownOpen] = useState(false);

  const fromRef = useRef(null);
  const toRef = useRef(null);

  // API কল করে রেট নিয়ে আসা
  useEffect(() => {
    const fetchRate = async () => {
      try {
        setErrorMessage(null);
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
        const data = await response.json();
        
        if (data && data.rates && data.rates[toCurrency]) {
          setExchangeRate(data.rates[toCurrency]);
        } else {
          throw new Error("Rate not found");
        }
      } catch (error) {
        setErrorMessage("নেটওয়ার্ক সমস্যা, আবার চেষ্টা করুন।");
        setExchangeRate(0);
      }
    };

    fetchRate();
  }, [fromCurrency, toCurrency]);

  // ড্রপডাউন বাইরে ক্লিক করলে বন্ধ করার জন্য
  useEffect(() => {
    function handleClickOutside(event) {
      if (fromRef.current && !fromRef.current.contains(event.target)) {
        setFromDropdownOpen(false);
      }
      if (toRef.current && !toRef.current.contains(event.target)) {
        setToDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const convertedAmount = amount ? (amount * exchangeRate) : 0;

  // কারেন্সি সোয়াপ করা
  const swapCurrencyUnits = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  // সার্চ ফিল্টার করা
  const getFilteredList = (query) => {
    if (!query) return Object.entries(currencyData);
    return Object.entries(currencyData).filter(
      ([code, currency]) =>
        currency.label.toLowerCase().includes(query.toLowerCase()) ||
        code.toLowerCase().includes(query.toLowerCase())
    );
  };

  const filteredFrom = getFilteredList(fromSearch);
  const filteredTo = getFilteredList(toSearch);

  // ফ্ল্যাগ URL তৈরি করার ফাংশন
  const getFlagUrl = (code) => `https://flagcdn.com/w40/${code.substring(0, 2).toLowerCase()}.png`;
  const getSmallFlagUrl = (code) => `https://flagcdn.com/w20/${code.substring(0, 2).toLowerCase()}.png`;

  return (
    <div className="space-y-8">
  {/* হেডার */}
  <header className="text-center space-y-4">
    <h1 className="text-2xl  tracking-tight">
      কারেন্সি কনভার্টার
    </h1>
    <p>
      সর্বনিম্ন পেলোড ও সুপার ফাস্ট রূপান্তর
    </p>
  </header>

  {errorMessage && (
    <div className="rounded-xl dark:bg-zinc-400/40 p-4 flex items-start gap-4">
      {errorMessage}
    </div>
  )}

  <div className="space-y-4">
    {/* From Currency Section */}
    <div className="flex items-center gap-2">
      <div className="relative w-full" ref={fromRef}>
        <button
          className="w-full flex items-center truncate justify-between rounded-xl bg-zinc-400/10 hover:bg-zinc-400/25 p-4"
          onClick={() => setFromDropdownOpen(!fromDropdownOpen)}
        >
          <div className="flex items-center">
            <img src={getFlagUrl(fromCurrency)} className="w-5 h-5 mr-3 rounded-sm" alt="flag" />
            <span>{fromCurrency}</span>
            <span className="ml-2 opacity-50">- {currencyData[fromCurrency]?.label}</span>
          </div>
          <svg className="w-5 h-5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </button>

        {fromDropdownOpen && (
          <div className="absolute z-50 mt-2 w-full rounded-xl border border-zinc-400/25 bg-zinc-400/10 overflow-hidden">
            <div className="p-2">
              <input
                type="text"
                value={fromSearch}
                onChange={(e) => setFromSearch(e.target.value)}
                placeholder="সার্চ করুন..."
                className="w-full rounded-lg bg-zinc-400/10 p-2 outline-none text-sm"
              />
            </div>
            <ul className="max-h-60 overflow-y-auto space-y-2 p-2">
              {filteredFrom.map(([code, currency]) => (
                <li
                  key={code}
                  className="cursor-pointer px-4 py-2 hover:bg-zinc-400/25 rounded-xl flex items-center"
                  onClick={() => {
                    setFromCurrency(code);
                    setFromDropdownOpen(false);
                    setFromSearch("");
                  }}
                >
                  <img src={getSmallFlagUrl(code)} className="mr-3 rounded-sm w-5 h-auto" alt={currency.label} />
                  <strong>{code}</strong>
                  <span className="ml-2 opacity-50">- {currency.label}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-2 opacity-50">{currencyData[fromCurrency]?.symbol}</span>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full rounded-xl bg-zinc-400/10 p-4 outline-none"
        />
      </div>
    </div>

    {/* Swap Button */}
    <div className="flex justify-center items-center">
      <button
        onClick={swapCurrencyUnits}
        className="p-2 rounded-full hover:bg-zinc-400/25 transition"
        title="মুদ্রা অদলবদল করুন"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path></svg>
      </button>
    </div>

    {/* To Currency Section */}
    <div className="flex items-center gap-2">
      <div className="relative w-full" ref={toRef}>
        <button
          className="w-full flex items-center truncate justify-between rounded-xl bg-zinc-400/10 hover:bg-zinc-400/25 p-4"
          onClick={() => setToDropdownOpen(!toDropdownOpen)}
        >
          <div className="flex items-center">
            <img src={getFlagUrl(toCurrency)} className="w-5 h-5 mr-3 rounded-sm" alt="flag" />
            <span>{toCurrency}</span>
            <span className="ml-2 opacity-50">- {currencyData[toCurrency]?.label}</span>
          </div>
          <svg className="w-5 h-5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </button>

        {toDropdownOpen && (
          <div className="absolute z-50 mt-2 w-full rounded-xl border border-zinc-400/25 bg-zinc-400/10 overflow-hidden">
            <div className="p-2">
              <input
                type="text"
                value={toSearch}
                onChange={(e) => setToSearch(e.target.value)}
                placeholder="সার্চ করুন..."
                className="w-full rounded-lg bg-zinc-400/10 p-2 outline-none text-sm"
              />
            </div>
            <ul className="max-h-60 overflow-y-auto space-y-2 p-2">
              {filteredTo.map(([code, currency]) => (
                <li
                  key={code}
                  className="cursor-pointer px-4 py-2 hover:bg-zinc-400/25 rounded-xl flex items-center"
                  onClick={() => {
                    setToCurrency(code);
                    setToDropdownOpen(false);
                    setToSearch("");
                  }}
                >
                  <img src={getSmallFlagUrl(code)} className="mr-3 rounded-sm w-5 h-auto" alt={currency.label} />
                  <strong>{code}</strong>
                  <span className="ml-2 opacity-50">- {currency.label}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-2 opacity-50">{currencyData[toCurrency]?.symbol}</span>
        <input
          type="number"
          value={convertedAmount.toFixed(2)}
          readOnly
          className="w-full rounded-xl bg-zinc-400/10 p-4 outline-none"
        />
      </div>
    </div>

    {/* কনভার্টেড অ্যামাউন্ট ডিসপ্লে */}
    <div className="rounded-2xl border border-zinc-400/25 bg-zinc-400/10 p-6 text-center">
      <p className="text-sm uppercase tracking-wider opacity-50 mb-2">কনভার্টেড অ্যামাউন্ট</p>
      <div className="flex justify-center items-baseline gap-4">
        <span className="text-2xl  tracking-tight">
          {convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <span className="text-sm uppercase opacity-50">{toCurrency}</span>
      </div>
      <p className="mt-4 text-sm opacity-50">
        1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
      </p>
    </div>
  </div>

  {/* বাংলা নির্দেশিকা */}
  <section className="rounded-2xl /40 p-4 space-y-4">
    <h2 className="text-xl">
      কীভাবে ব্যবহার করবেন?
    </h2>

    <div className="space-y-4 leading-relaxed">
      <div className="flex gap-4">
        <span className="shrink-0 flex size-7 items-center justify-center rounded-full bg-zinc-400/10 text-sm">১</span>
        <p><strong>উপরের বক্স</strong> থেকে যে মুদ্রা থেকে কনভার্ট করতে চান সেটি নির্বাচন করুন (ডিফল্ট: USD)।</p>
      </div>
      <div className="flex gap-4">
        <span className="shrink-0 flex size-7 items-center justify-center rounded-full bg-zinc-400/10 text-sm">২</span>
        <p>টাকার পরিমাণ লিখুন। আপনি লিখার সাথে সাথেই ফলাফল আপডেট হবে।</p>
      </div>
      <div className="flex gap-4">
        <span className="shrink-0 flex size-7 items-center justify-center rounded-full bg-zinc-400/10 text-sm">৩</span>
        <p><strong>নিচের বক্স</strong> থেকে যে মুদ্রায় কনভার্ট করতে চান সেটি নির্বাচন করুন (ডিফল্ট: BDT)।</p>
      </div>
      <div className="flex gap-4">
        <span className="shrink-0 flex size-7 items-center justify-center rounded-full bg-zinc-400/10 text-sm">৪</span>
        <p>মাঝের <strong>↑↓</strong> বাটনে ক্লিক করে দুই মুদ্রা সহজেই অদল-বদল করতে পারবেন।</p>
      </div>
      <div className="flex gap-4">
        <span className="shrink-0 flex size-7 items-center justify-center rounded-full bg-zinc-400/10 text-sm">৫</span>
        <p>নিচে বড় করে কনভার্টেড অ্যামাউন্ট ও বর্তমান এক্সচেঞ্জ রেট দেখতে পাবেন।</p>
      </div>
    </div>

    <div className="pt-4">
      <p className="text-sm">
        <strong>নোট:</strong> রেট প্রতি ১ ঘণ্টায় আপডেট হয় (API এর উপর নির্ভরশীল)। সকল তথ্য নির্ভরযোগ্য API থেকে সংগ্রহ করা হয়। কোনো ফি নেই।
      </p>
    </div>
  </section>
</div>
  );
}