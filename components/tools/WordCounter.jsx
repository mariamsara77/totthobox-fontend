"use client";

import { useState, useMemo, useCallback } from "react";

function getStats(text) {
  if (!text) {
    return {
      charsWithSpaces: 0,
      charsWithoutSpaces: 0,
      words: 0,
      sentences: 0,
      paragraphs: 0,
      lines: 0,
      readingTime: 0,
      speakingTime: 0,
      hasText: false,
    };
  }

  const charsWithSpaces = [...text].length; // proper Unicode length
  const charsWithoutSpaces = [...text.replace(/\s+/gu, "")].length;

  // Words: Bangla + English letters/numbers + apostrophe/hyphen
  const wordMatches = text.match(/[\p{L}\p{N}'\u2019\-]+/gu);
  const words = wordMatches ? wordMatches.length : 0;

  // Sentences: ends with . ! ? ।
  const sentenceMatches = text.match(/[^.!?।]+[.!?।]+/gu);
  let sentences = sentenceMatches ? sentenceMatches.length : 0;
  if (sentences === 0 && text.trim() !== "") sentences = 1;

  // Paragraphs: split by blank lines
  const paragraphs =
    text.trim() === ""
      ? 0
      : text
          .trim()
          .split(/\n\s*\n/u)
          .filter((p) => p.trim() !== "").length;

  // Lines
  const lines = text === "" ? 0 : (text.match(/\n/g) || []).length + 1;

  // Reading ~200 wpm, Speaking ~130 wpm
  const readingTime = words > 0 ? Math.max(1, Math.ceil(words / 200)) : 0;
  const speakingTime = words > 0 ? Math.max(1, Math.ceil(words / 130)) : 0;

  return {
    charsWithSpaces,
    charsWithoutSpaces,
    words,
    sentences,
    paragraphs,
    lines,
    readingTime,
    speakingTime,
    hasText: true,
  };
}

export default function WordCounter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => getStats(text), [text]);

  const toUpperCase = () => setText(text.toLocaleUpperCase("en-US"));
  const toLowerCase = () => setText(text.toLocaleLowerCase("en-US"));

  const toSentenceCase = useCallback(() => {
    let result = text.toLocaleLowerCase("en-US");
    // Capitalize first letter of text and after . ! ? ।
    result = result.replace(/(^|[.!?।]\s*)(\p{L})/gu, (_, p1, p2) => {
      return p1 + p2.toLocaleUpperCase("en-US");
    });
    setText(result);
  }, [text]);

  const toTitleCase = useCallback(() => {
    const result = text.replace(/\b(\p{L})(\p{L}*)/gu, (_, first, rest) => {
      return first.toLocaleUpperCase("en-US") + rest.toLocaleLowerCase("en-US");
    });
    setText(result);
  }, [text]);

  const copyText = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const resetText = () => setText("");

  const formatNum = (n) => n.toLocaleString("en-IN");

  return (
    <section className="w-full">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl   tracking-tight text-zinc-50 dark:text-white">
            ওয়ার্ড অ্যান্ড ক্যারেক্টার কাউন্টার
          </h1>
          <h2 className="text-lg ">
            শব্দ, অক্ষর, বাক্য, প্যারাগ্রাফ ও পড়ার সময় এক নজরে জানুন
          </h2>
        </div>

        <div className="space-y-4">
          {/* Input Card */}
          <div className="rounded-2xl border border-zinc-400/25 bg-zinc-400/10 bg-zinc-400/10 p-4 space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm  ">
                এখানে টেক্সট লিখুন বা পেস্ট করুন
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={8}
                placeholder="আপনার টেক্সট এখানে লিখুন..."
                className="w-full p-2 rounded-xl bg-zinc-400/10 border-none outline-none font-mono text-sm resize-y min-h-[160px]"
              />
            </div>

            {/* Case Conversion */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={toUpperCase}
                disabled={!stats.hasText}
                className="px-3 py-1.5 text-xs  rounded-xl border border-zinc-400/25 dark:border-zinc-400/25 hover:bg-zinc-400/10 hover:bg-zinc-400/10 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                UPPERCASE
              </button>
              <button
                onClick={toLowerCase}
                disabled={!stats.hasText}
                className="px-3 py-1.5 text-xs  rounded-xl border border-zinc-400/25 dark:border-zinc-400/25 hover:bg-zinc-400/10 hover:bg-zinc-400/10 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                lowercase
              </button>
              <button
                onClick={toSentenceCase}
                disabled={!stats.hasText}
                className="px-3 py-1.5 text-xs  rounded-xl border border-zinc-400/25 dark:border-zinc-400/25 hover:bg-zinc-400/10 hover:bg-zinc-400/10 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Sentence case
              </button>
              <button
                onClick={toTitleCase}
                disabled={!stats.hasText}
                className="px-3 py-1.5 text-xs  rounded-xl border border-zinc-400/25 dark:border-zinc-400/25 hover:bg-zinc-400/10 hover:bg-zinc-400/10 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Title Case
              </button>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={copyText}
                disabled={!stats.hasText}
                className="px-3 py-1.5 text-sm rounded-xl bg-zinc-400/10 hover:bg-zinc-400/10 hover:bg-zinc-400/25 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {copied ? "কপি হয়েছে!" : "কপি করুন"}
              </button>
              <button
                onClick={resetText}
                disabled={!stats.hasText}
                className="px-3 py-1.5 text-sm rounded-xl text-zinc-400 hover:text-zinc-200 dark:hover:text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                রিসেট করুন
              </button>
            </div>
          </div>

          {/* Stats */}
          {stats.hasText ? (
            <div className="p-4 sm:p-6  rounded-2xl space-y-4 border border-zinc-400/25">
              {/* Main Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-400/10 bg-zinc-400/10 rounded-xl  text-center">
                  <div className="text-xs text-zinc-400 uppercase tracking-wider">শব্দ</div>
                  <div className="text-2xl   opacity-50 dark:opacity-50 mt-1">
                    {formatNum(stats.words)}
                  </div>
                </div>
                <div className="p-4 bg-zinc-400/10 bg-zinc-400/10 rounded-xl  text-center">
                  <div className="text-xs text-zinc-400 uppercase tracking-wider">অক্ষর (স্পেসসহ)</div>
                  <div className="text-2xl   opacity-50 dark:opacity-50 mt-1">
                    {formatNum(stats.charsWithSpaces)}
                  </div>
                </div>
                <div className="p-4 bg-zinc-400/10 bg-zinc-400/10 rounded-xl  text-center">
                  <div className="text-xs text-zinc-400 uppercase tracking-wider">অক্ষর (স্পেসছাড়া)</div>
                  <div className="text-2xl   opacity-50 dark:opacity-50 mt-1">
                    {formatNum(stats.charsWithoutSpaces)}
                  </div>
                </div>
                <div className="p-4 bg-zinc-400/10 bg-zinc-400/10 rounded-xl  text-center">
                  <div className="text-xs text-zinc-400 uppercase tracking-wider">বাক্য</div>
                  <div className="text-2xl   opacity-50 dark:opacity-50 mt-1">
                    {formatNum(stats.sentences)}
                  </div>
                </div>
              </div>

              {/* Secondary Stats */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-zinc-400/25">
                <div className="p-3 bg-zinc-400/10 bg-zinc-400/10 rounded-xl  text-center">
                  <div className="text-xs text-zinc-400">প্যারাগ্রাফ</div>
                  <div className="text-lg font-bold mt-1">{formatNum(stats.paragraphs)}</div>
                </div>
                <div className="p-3 bg-zinc-400/10 bg-zinc-400/10 rounded-xl  text-center">
                  <div className="text-xs text-zinc-400">লাইন</div>
                  <div className="text-lg font-bold mt-1">{formatNum(stats.lines)}</div>
                </div>
                <div className="p-3 bg-zinc-400/10 bg-zinc-400/10 rounded-xl  text-center">
                  <div className="text-xs text-zinc-400">পড়ার সময়</div>
                  <div className="text-lg font-bold mt-1 ">
                    ≈ {stats.readingTime} মিনিট
                  </div>
                </div>
                <div className="p-3 bg-zinc-400/10 bg-zinc-400/10 rounded-xl  text-center">
                  <div className="text-xs text-zinc-400">কথার সময়</div>
                  <div className="text-lg font-bold mt-1 opacity-50 dark:opacity-50">
                    ≈ {stats.speakingTime} মিনিট
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center   rounded-2xl border border-dashed border-zinc-400/25 dark:border-zinc-400/25">
              টেক্সট লিখলেই এখানে লাইভ কাউন্ট দেখা যাবে
            </div>
          )}
        </div>

        {/* SEO / Instructions */}
        <div className="mt-16 pt-10 border-t border-zinc-400/25 space-y-4 text-sm ">
          <div>
            <h3 className="text-lg font-bold text-zinc-50 text-zinc-200 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              ওয়ার্ড অ্যান্ড ক্যারেক্টার কাউন্টার কীভাবে ব্যবহার করবেন?
            </h3>
            <p className="leading-relaxed">
              আমাদের ওয়ার্ড অ্যান্ড ক্যারেক্টার কাউন্টার দিয়ে আপনি তাৎক্ষণিকভাবে যেকোনো টেক্সটের শব্দ, অক্ষর, বাক্য,
              প্যারাগ্রাফ ও লাইনের সংখ্যা জানতে পারবেন। শুধু টেক্সটবক্সে লিখুন বা কপি-পেস্ট করুন — সব হিসাব লাইভে
              আপডেট হবে। বাংলা ও ইংরেজি উভয় ভাষাতেই নিখুঁতভাবে কাজ করে।
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-zinc-50 text-zinc-200 mb-2">কী কী হিসাব করা হয়?</h3>
            <ul className="list-disc list-inside space-y-1.5 ml-1">
              <li>
                <strong>শব্দ (Words)</strong> — বাংলা ও ইংরেজি শব্দ দুইই সঠিকভাবে গণনা করে
              </li>
              <li>
                <strong>অক্ষর (Characters)</strong> — স্পেসসহ এবং স্পেস ছাড়া আলাদা আলাদা দেখায়
              </li>
              <li>
                <strong>বাক্য (Sentences)</strong> — । ! ? চিহ্ন অনুযায়ী বাক্য গণনা
              </li>
              <li>
                <strong>প্যারাগ্রাফ ও লাইন</strong> — খালি লাইন অনুযায়ী প্যারাগ্রাফ এবং মোট লাইন
              </li>
              <li>
                <strong>পড়ার সময়</strong> — গড় ২০০ শব্দ/মিনিট হিসেবে আনুমানিক পড়ার সময়
              </li>
              <li>
                <strong>কথার সময়</strong> — গড় ১৩০ শব্দ/মিনিট হিসেবে আনুমানিক বলার সময়
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-bold text-zinc-50 text-zinc-200 mb-2">
              টেক্সট কেস কনভার্শন টুলস
            </h3>
            <ul className="list-disc list-inside space-y-1.5 ml-1">
              <li>
                <strong>UPPERCASE</strong> — সব অক্ষর বড় হাতের করে দেয়
              </li>
              <li>
                <strong>lowercase</strong> — সব অক্ষর ছোট হাতের করে দেয়
              </li>
              <li>
                <strong>Sentence case</strong> — প্রতিটি বাক্যের প্রথম অক্ষর বড় হাতের করে
              </li>
              <li>
                <strong>Title Case</strong> — প্রতিটি শব্দের প্রথম অক্ষর বড় হাতের করে
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-bold text-zinc-50 text-zinc-200 mb-2">
              কেন এই টুল ব্যবহার করবেন?
            </h3>
            <p className="leading-relaxed">
              ব্লগ লেখা, অ্যাসাইনমেন্ট, সোশ্যাল মিডিয়া পোস্ট, পরীক্ষার উত্তর বা যেকোনো লেখার ক্ষেত্রে শব্দসীমা মেনে
              চলতে এই টুল খুবই উপকারী। এছাড়া টেক্সট কেস পরিবর্তন ও এক ক্লিকে কপি করার সুবিধাও আছে। সম্পূর্ণ ফ্রি,
              কোনো রেজিস্ট্রেশন লাগে না এবং আপনার লেখা কোথাও সংরক্ষণ করা হয় না।
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
