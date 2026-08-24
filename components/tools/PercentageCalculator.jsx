"use client";

import { useState, useMemo, useEffect } from "react";

const TABS = [
  { id: "percent_of", label: "কোনো সংখ্যার %" },
  { id: "is_what_percent", label: "কত শতাংশ?" },
  { id: "percent_of_what", label: "মূল সংখ্যা" },
  { id: "increase", label: "বাড়ান" },
  { id: "decrease", label: "কমান" },
  { id: "discount", label: "ছাড় হিসাব" },
  { id: "tip", label: "টিপ হিসাব" },
  { id: "margin", label: "মুনাফা / মার্জিন" },
  { id: "difference", label: "পার্থক্য %" },
];

const FIELD_CONFIG = {
  percent_of: [
    { key: "value1", label: "মূল সংখ্যা", placeholder: "যেমন: ৫০০" },
    { key: "percent", label: "শতকরা (%)", placeholder: "যেমন: ২০" },
  ],
  is_what_percent: [
    { key: "value1", label: "ছোট সংখ্যা", placeholder: "যেমন: ২৫" },
    { key: "value2", label: "বড় সংখ্যা", placeholder: "যেমন: ১০০" },
  ],
  percent_of_what: [
    { key: "value1", label: "আপনি যা জানেন", placeholder: "যেমন: ৪০" },
    { key: "percent", label: "এটা কত শতাংশ?", placeholder: "যেমন: ২০" },
  ],
  increase: [
    { key: "value1", label: "বর্তমান মান", placeholder: "যেমন: ১০০০" },
    { key: "percent", label: "কত % বাড়াবেন?", placeholder: "যেমন: ১৫" },
  ],
  decrease: [
    { key: "value1", label: "বর্তমান মান", placeholder: "যেমন: ৮০০" },
    { key: "percent", label: "কত % কমবে?", placeholder: "যেমন: ২৫" },
  ],
  discount: [
    { key: "value1", label: "মূল দাম (৳)", placeholder: "যেমন: ২৫০০" },
    { key: "percent", label: "ছাড় কত %?", placeholder: "যেমন: ৩০" },
  ],
  tip: [
    { key: "value1", label: "বিলের পরিমাণ (৳)", placeholder: "যেমন: ১৮০০" },
    { key: "percent", label: "টিপ কত %?", placeholder: "যেমন: ১০" },
  ],
  margin: [
    { key: "value1", label: "কেনা দাম / Cost (৳)", placeholder: "যেমন: ৮০০" },
    { key: "value2", label: "বিক্রির দাম (৳)", placeholder: "যেমন: ১২০০" },
  ],
  difference: [
    { key: "value1", label: "প্রথম সংখ্যা", placeholder: "যেমন: ৮০" },
    { key: "value2", label: "দ্বিতীয় সংখ্যা", placeholder: "যেমন: ১০০" },
  ],
};

const EXAMPLES = {
  percent_of: [
    { label: "৫০০-এর ২০%", v1: "500", p: "20" },
    { label: "১০০০-এর ১৫%", v1: "1000", p: "15" },
  ],
  discount: [
    { label: "২৫০০ টাকায় ৩০% ছাড়", v1: "2500", p: "30" },
    { label: "৪৯৯৯ টাকায় ৪০% ছাড়", v1: "4999", p: "40" },
  ],
  tip: [
    { label: "১৮০০ টাকায় ১০% টিপ", v1: "1800", p: "10" },
    { label: "২৫০০ টাকায় ১৫% টিপ", v1: "2500", p: "15" },
  ],
  increase: [{ label: "৪০,০০০ + ১২%", v1: "40000", p: "12" }],
  margin: [{ label: "৮০০ → ১২০০", v1: "800", v2: "1200" }],
};

function fmt(n) {
  if (n === null || n === undefined || isNaN(n)) return "";
  const s = Number(n).toFixed(4);
  return s.replace(/\.?0+$/, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function parseNum(str) {
  if (str === null || str === undefined || str === "") return null;
  const n = parseFloat(str);
  return isNaN(n) ? null : n;
}

export default function PercentageCalculator() {
  const [tab, setTab] = useState("percent_of");
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [percent, setPercent] = useState("");
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("pct_calc_history");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setHistory(parsed.slice(0, 6));
      }
    } catch {}
  }, []);

  // Save history
  useEffect(() => {
    try {
      localStorage.setItem("pct_calc_history", JSON.stringify(history));
    } catch {}
  }, [history]);

  const result = useMemo(() => {
    const v1 = parseNum(value1);
    const v2 = parseNum(value2);
    const p = parseNum(percent);

    switch (tab) {
      case "percent_of": {
        if (v1 === null || p === null) return null;
        const r = (p / 100) * v1;
        return {
          value: fmt(r),
          suffix: "",
          badge: "ফলাফল",
          formula: `(${p} ÷ 100) × ${v1}`,
          explanation: `${v1} টাকার/সংখ্যার ${p}% মানে ${p} ভাগ ১০০-এর। তাই উত্তর = (${p} ÷ 100) × ${v1} = ${fmt(r)}`,
        };
      }
      case "is_what_percent": {
        if (v1 === null || v2 === null || v2 === 0) return null;
        const r = (v1 / v2) * 100;
        return {
          value: fmt(r),
          suffix: "%",
          badge: "শতাংশ",
          formula: `(${v1} ÷ ${v2}) × 100`,
          explanation: `${v1} হলো ${v2}-এর কত শতাংশ? হিসাব: (${v1} ÷ ${v2}) × 100 = ${fmt(r)}%`,
        };
      }
      case "percent_of_what": {
        if (v1 === null || p === null || p === 0) return null;
        const r = (v1 * 100) / p;
        return {
          value: fmt(r),
          suffix: "",
          badge: "মূল সংখ্যা",
          formula: `(${v1} × 100) ÷ ${p}`,
          explanation: `${v1} যদি কোনো সংখ্যার ${p}% হয়, তাহলে সেই মূল সংখ্যা কত? হিসাব: (${v1} × 100) ÷ ${p} = ${fmt(r)}`,
        };
      }
      case "increase": {
        if (v1 === null || p === null) return null;
        const inc = (p / 100) * v1;
        const r = v1 + inc;
        return {
          value: fmt(r),
          suffix: "",
          badge: "নতুন মান",
          formula: `${v1} + (${p}% of ${v1})`,
          explanation: `${v1}-কে ${p}% বাড়ালে নতুন মান = ${v1} + (${p} ÷ 100 × ${v1}) = ${fmt(r)}`,
          extra: { title: "কত বাড়ল", value: fmt(inc), color: "emerald" },
        };
      }
      case "decrease": {
        if (v1 === null || p === null) return null;
        const dec = (p / 100) * v1;
        const r = v1 - dec;
        return {
          value: fmt(r),
          suffix: "",
          badge: "নতুন মান",
          formula: `${v1} − (${p}% of ${v1})`,
          explanation: `${v1}-কে ${p}% কমালে নতুন মান = ${v1} − (${p} ÷ 100 × ${v1}) = ${fmt(r)}`,
          extra: { title: "কত কমল", value: fmt(dec), color: "rose" },
        };
      }
      case "discount": {
        if (v1 === null || p === null) return null;
        const off = (p / 100) * v1;
        const r = v1 - off;
        return {
          value: fmt(r),
          suffix: "",
          badge: "ছাড়ের পর দাম",
          formula: `${v1} − (${p}% of ${v1})`,
          explanation: `মূল্য ${v1} টাকায় ${p}% ছাড়। ছাড়ের পরিমাণ ${fmt(off)} টাকা। আপনি দেবেন = ${v1} − ${fmt(off)} = ${fmt(r)}`,
          extra: { title: "কত টাকা বাঁচবে", value: `${fmt(off)} ৳`, color: "rose" },
        };
      }
      case "tip": {
        if (v1 === null || p === null) return null;
        const tip = (p / 100) * v1;
        const r = v1 + tip;
        return {
          value: fmt(r),
          suffix: "",
          badge: "মোট (বিল + টিপ)",
          formula: `${v1} + (${p}% of ${v1})`,
          explanation: `বিল ${v1} টাকায় ${p}% টিপ = ${fmt(tip)} টাকা। মোট দিতে হবে = ${v1} + ${fmt(tip)} = ${fmt(r)}`,
          extra: { title: "টিপের পরিমাণ", value: `${fmt(tip)} ৳`, color: "emerald" },
        };
      }
      case "margin": {
        if (v1 === null || v2 === null || v1 === 0) return null;
        const profit = v2 - v1;
        const r = (profit / v1) * 100;
        return {
          value: fmt(r),
          suffix: "%",
          badge: "মার্জিন %",
          formula: `(${v2} − ${v1}) ÷ ${v1} × 100`,
          explanation: `ক্রয়মূল্য ${v1} টাকা, বিক্রয়মূল্য ${v2} টাকা। মুনাফা = ${fmt(profit)} টাকা। মার্জিন = (মুনাফা ÷ ক্রয়মূল্য) × 100 = ${fmt(r)}%`,
          extra: {
            title: "মুনাফা",
            value: `${fmt(profit)} ৳`,
            color: profit >= 0 ? "emerald" : "rose",
          },
        };
      }
      case "difference": {
        if (v1 === null || v2 === null) return null;
        const diff = Math.abs(v1 - v2);
        const avg = (v1 + v2) / 2;
        if (avg === 0) return null;
        const r = (diff / avg) * 100;
        return {
          value: fmt(r),
          suffix: "%",
          badge: "পার্থক্য",
          formula: `|${v1} − ${v2}| ÷ ((${v1} + ${v2}) ÷ 2) × 100`,
          explanation: `দুটি সংখ্যার শতকরা পার্থক্য = |${v1} − ${v2}| ÷ গড় × 100 = ${fmt(r)}%`,
          extra: { title: "পরম পার্থক্য", value: fmt(diff), color: "violet" },
        };
      }
      default:
        return null;
    }
  }, [tab, value1, value2, percent]);

  // Push to history when result changes
  useEffect(() => {
    if (!result || !value1) return;
    const label = result.value + result.suffix;
    setHistory((prev) => {
      if (prev[0]?.label === label) return prev;
      const now = new Date();
      const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      return [{ label, time }, ...prev].slice(0, 6);
    });
  }, [result?.value, result?.suffix]);

  const resetAll = () => {
    setValue1("");
    setValue2("");
    setPercent("");
  };

  const changeTab = (id) => {
    setTab(id);
    resetAll();
  };

  const fillExample = (ex) => {
    setValue1(ex.v1 || "");
    setValue2(ex.v2 || "");
    setPercent(ex.p || "");
  };

  const copyResult = async () => {
    if (!result) return;
    const text = result.value + result.suffix;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem("pct_calc_history");
    } catch {}
  };

  const fields = FIELD_CONFIG[tab] || [];
  const examples = EXAMPLES[tab] || [];

  const extraColor = {
    emerald: "bg-zinc-400/10 ",
    rose: "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300",
    violet: "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300",
  };

  return (
    <section className="w-full">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <span className="inline-block px-3 py-1 text-xs  rounded-full bg-lime-100 dark:bg-lime-900/40 text-lime-700 dark:text-lime-300 mb-2">
            বিনামূল্যে · রেজিস্ট্রেশন লাগবে না
          </span>
          <h1 className="text-3xl   tracking-tight text-zinc-50 dark:text-white">
            পার্সেন্টেজ ক্যালকুলেটর
          </h1>
          <p className="text-base  max-w-xl mx-auto">
            যেকোনো শতকরা হিসাব এক জায়গায়। সংখ্যা লিখুন — সাথে সাথে সূত্র ও সহজ বাংলা ব্যাখ্যাসহ উত্তর পাবেন।
          </p>
        </div>

        {/* Tabs - scrollable on mobile */}
        <div className="overflow-x-auto -mx-1 px-1 pb-1">
          <div className="flex gap-1 min-w-max">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => changeTab(t.id)}
                className={`px-3 py-2 text-xs sm:text-sm  rounded-lg whitespace-nowrap  ${
                  tab === t.id
                    ? "bg-indigo-500 text-white"
                    : "bg-zinc-400/10  hover:bg-zinc-800 hover:bg-zinc-700"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Card */}
        <div className="rounded-2xl border border-zinc-400/25 bg-zinc-950 bg-zinc-900/50 p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map((f) => (
              <div key={f.key} className="flex flex-col gap-2">
                <label className="text-sm  ">{f.label}</label>
                <input
                  type="number"
                  step="any"
                  value={f.key === "value1" ? value1 : f.key === "value2" ? value2 : percent}
                  onChange={(e) => {
                    if (f.key === "value1") setValue1(e.target.value);
                    else if (f.key === "value2") setValue2(e.target.value);
                    else setPercent(e.target.value);
                  }}
                  placeholder={f.placeholder}
                  className="w-full p-2 rounded-lg bg-zinc-400/10 border-none outline-none"
                />
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={resetAll}
              className="px-3 py-1.5 text-sm rounded-lg text-zinc-400 hover:text-zinc-200 dark:hover:text-zinc-300 hover:bg-zinc-900 hover:bg-zinc-800"
            >
              মুছে ফেলুন
            </button>
            {examples.map((ex) => (
              <button
                key={ex.label}
                onClick={() => fillExample(ex)}
                className="px-3 py-1.5 text-xs rounded-lg bg-zinc-400/10 hover:bg-zinc-800 hover:bg-zinc-700 "
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>

        {/* Result */}
        {result ? (
          <div className="rounded-2xl border border-emerald-500/30 dark:border-emerald-500/20 bg-zinc-950 bg-zinc-900/50 p-4 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-block px-2.5 py-0.5 text-xs  rounded-full bg-zinc-400/10 ">
                  {result.badge}
                </span>
                <div className="mt-2 text-3xl  font-bold tracking-tight tabular-nums text-zinc-50 dark:text-white">
                  {result.value}
                  <span className="text-zinc-300 text-2xl">{result.suffix}</span>
                </div>
              </div>
              <button
                onClick={copyResult}
                className="px-3 py-1.5 text-sm rounded-lg bg-zinc-400/10 hover:bg-zinc-800 hover:bg-zinc-700 shrink-0"
              >
                {copied ? "কপি হয়েছে!" : "কপি"}
              </button>
            </div>

            {result.extra && (
              <span
                className={`inline-block px-2.5 py-1 text-xs  rounded-full ${extraColor[result.extra.color] || extraColor.emerald}`}
              >
                {result.extra.title}: {result.extra.value}
              </span>
            )}

            <div className="border-t border-zinc-400/25 pt-4 space-y-4 text-sm">
              <div className="flex gap-4 sm:gap-4">
                <span className=" shrink-0 w-14">সূত্র</span>
                <code className="font-mono  bg-zinc-400/10 px-2 py-0.5 rounded text-xs sm:text-sm break-all">
                  {result.formula}
                </code>
              </div>
              <div className="flex gap-4 sm:gap-4">
                <span className=" shrink-0 w-14">ব্যাখ্যা</span>
                <span className=" leading-relaxed">{result.explanation}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-700 dark:border-zinc-700 /30 py-12 text-center">
            <svg
              className="mx-auto w-8 h-8 text-zinc-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <p className=" text-sm">উপরে সংখ্যা লিখুন — ফলাফল এখানে দেখাবে</p>
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm  ">সাম্প্রতিক হিসাব</h3>
              <button
                onClick={clearHistory}
                className="text-xs text-zinc-400 hover:text-zinc-200 dark:hover:text-zinc-300"
              >
                সব মুছে ফেলুন
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {history.map((h, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 px-2.5 py-1 text-xs rounded-full bg-zinc-400/10 "
                >
                  {h.label}
                  <span className="opacity-50">{h.time}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* SEO Content */}
        <div className="mt-16 pt-10 border-t border-zinc-400/25 space-y-8 text-sm ">
          <div>
            <h3 className="text-lg font-bold text-zinc-50 text-zinc-200 mb-4">কীভাবে ব্যবহার করবেন?</h3>
            <p className="leading-relaxed">
              উপরের ট্যাব থেকে আপনার প্রয়োজনীয় হিসাব বেছে নিন। ঘরে সংখ্যা লিখুন — সাথে সাথে সূত্র ও সহজ বাংলা
              ব্যাখ্যাসহ উত্তর দেখাবে। কোনো বাটন চাপতে হবে না, রেজিস্ট্রেশনও লাগবে না। ফলাফল এক ক্লিকে কপি করে নিতে
              পারবেন।
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-zinc-50 text-zinc-200 mb-4">
              ৯টি হিসাবের ধরন (সহজ ভাষায়)
            </h3>
            <ul className="list-disc list-inside space-y-1.5 ml-1">
              <li>
                <strong>কোনো সংখ্যার %</strong> — যেমন: ৫০০ টাকার ২০% কত?
              </li>
              <li>
                <strong>কত শতাংশ?</strong> — যেমন: ২৫ হলো ১০০-এর কত শতাংশ?
              </li>
              <li>
                <strong>মূল সংখ্যা বের করুন</strong> — যেমন: ৪০ টাকা যদি ২০% হয়, তাহলে মূল সংখ্যা কত?
              </li>
              <li>
                <strong>বাড়ান</strong> — বেতন বা দাম কত % বাড়লে নতুন মান কত হবে
              </li>
              <li>
                <strong>কমান</strong> — কোনো সংখ্যা কত % কমালে কত থাকবে
              </li>
              <li>
                <strong>ছাড় হিসাব</strong> — শপিংয়ে কত টাকা বাঁচবে + চূড়ান্ত দাম
              </li>
              <li>
                <strong>টিপ হিসাব</strong> — রেস্টুরেন্ট বিল + টিপ মিলিয়ে মোট কত
              </li>
              <li>
                <strong>মুনাফা / মার্জিন</strong> — কেনা ও বিক্রির দাম থেকে মুনাফার শতাংশ
              </li>
              <li>
                <strong>পার্থক্য %</strong> — দুটি সংখ্যার মধ্যে শতকরা পার্থক্য
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-zinc-50 text-zinc-200 mb-4">বাস্তব জীবনের উদাহরণ</h3>
            <ul className="list-disc list-inside space-y-1.5 ml-1">
              <li>
                <strong>শপিং:</strong> ২৫০০ টাকার পণ্যে ৩০% ছাড় → আপনি কত টাকা দেবেন?
              </li>
              <li>
                <strong>বেতন:</strong> এখন ৪০,০০০ টাকা, ১২% বাড়লে নতুন বেতন কত?
              </li>
              <li>
                <strong>পরীক্ষা:</strong> ১০০-তে ৭৫ পেলে কত পারসেন্ট?
              </li>
              <li>
                <strong>বিনিয়োগ:</strong> ৫০,০০০ টাকায় ১৮% লাভ হলে মোট কত?
              </li>
              <li>
                <strong>রেস্টুরেন্ট:</strong> ১৮০০ টাকার বিলে ১০% টিপ কত?
              </li>
              <li>
                <strong>ব্যবসা:</strong> ৮০০ টাকায় কিনে ১২০০ টাকায় বিক্রি করলে মার্জিন কত?
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-zinc-50 text-zinc-200 mb-4">মূল সূত্রগুলো মনে রাখুন</h3>
            <ul className="list-disc list-inside space-y-1 ml-1 font-mono text-xs sm:text-sm">
              <li>কোনো সংখ্যার % = (শতকরা ÷ ১০০) × মূল সংখ্যা</li>
              <li>কত শতাংশ = (ছোট সংখ্যা ÷ বড় সংখ্যা) × ১০০</li>
              <li>মূল সংখ্যা = (জানা মান × ১০০) ÷ শতকরা</li>
              <li>বাড়ানো = মূল + (মূল × শতকরা ÷ ১০০)</li>
              <li>কমানো / ছাড় = মূল − (মূল × শতকরা ÷ ১০০)</li>
              <li>মার্জিন % = (বিক্রি − কেনা) ÷ কেনা × ১০০</li>
              <li>পার্থক্য % = |A − B| ÷ ((A + B) ÷ ২) × ১০০</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-zinc-50 text-zinc-200 mb-4">সচরাচর জিজ্ঞাসা (FAQ)</h3>
            <div className="space-y-4">
              <div>
                <strong className="text-zinc-50 text-zinc-200">
                  পার্সেন্টেজ আর পারসেন্টেজ পয়েন্টের পার্থক্য কী?
                </strong>
                <p className="mt-1 ">
                  ১০% থেকে ১৫% হলে পারসেন্টেজ পয়েন্ট বেড়েছে ৫, কিন্তু আপেক্ষিক বৃদ্ধি ৫০%।
                </p>
              </div>
              <div>
                <strong className="text-zinc-50 text-zinc-200">মূল সংখ্যা বের করা কখন লাগে?</strong>
                <p className="mt-1 ">
                  যখন আপনি জানেন “৪০ টাকা হলো ২০%”, তখন মূল সংখ্যা বের করতে এই টুল ব্যবহার করুন।
                </p>
              </div>
              <div>
                <strong className="text-zinc-50 text-zinc-200">মার্জিন আর মার্কআপ কি একই?</strong>
                <p className="mt-1 ">
                  না। মার্জিন = মুনাফা ÷ বিক্রির দাম, মার্কআপ = মুনাফা ÷ কেনার দাম। এই ক্যালকুলেটরে কেনার দামের উপর
                  ভিত্তি করে (মার্কআপ স্টাইল) দেখানো হয়।
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
