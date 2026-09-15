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

  const charsWithSpaces = [...text].length;
  const charsWithoutSpaces = [...text.replace(/\s+/gu, "")].length;

  const wordMatches = text.match(/[\p{L}\p{N}'\u2019\-]+/gu);
  const words = wordMatches ? wordMatches.length : 0;

  const sentenceMatches = text.match(/[^.!?।]+[.!?।]+/gu);
  let sentences = sentenceMatches ? sentenceMatches.length : 0;
  if (sentences === 0 && text.trim() !== "") sentences = 1;

  const paragraphs =
    text.trim() === ""
      ? 0
      : text
          .trim()
          .split(/\n\s*\n/u)
          .filter((p) => p.trim() !== "").length;

  const lines = text === "" ? 0 : (text.match(/\n/g) || []).length + 1;

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

  const formatNum = (n) => n.toLocaleString("bn-BD");

  return (
    <section className="w-full space-y-8">
      {/* Header */}
      <header className="space-y-2 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          ওয়ার্ড অ্যান্ড ক্যারেক্টার কাউন্টার
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          শব্দ, অক্ষর, বাক্য, প্যারাগ্রাফ ও পড়ার সময় এক নজরে জানুন
        </p>
      </header>

      <div className="space-y-4">
        {/* Input Card */}
        <div className="rounded-2xl bg-zinc-400/10 p-4 sm:p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm text-zinc-600 dark:text-zinc-400">
              এখানে টেক্সট লিখুন বা পেস্ট করুন
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={8}
              placeholder="আপনার টেক্সট এখানে লিখুন..."
              className="min-h-[160px] w-full resize-y rounded-xl bg-zinc-400/10 p-3 font-mono text-sm outline-none"
            />
          </div>

          {/* Case Conversion */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={toUpperCase}
              disabled={!stats.hasText}
              className="px-3 py-1.5 text-xs rounded-lg bg-zinc-400/10 hover:bg-zinc-400/20 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              বড় হাতের অক্ষর
            </button>
            <button
              onClick={toLowerCase}
              disabled={!stats.hasText}
              className="px-3 py-1.5 text-xs rounded-lg bg-zinc-400/10 hover:bg-zinc-400/20 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              ছোট হাতের অক্ষর
            </button>
            <button
              onClick={toSentenceCase}
              disabled={!stats.hasText}
              className="px-3 py-1.5 text-xs rounded-lg bg-zinc-400/10 hover:bg-zinc-400/20 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              বাক্যের ধরন
            </button>
            <button
              onClick={toTitleCase}
              disabled={!stats.hasText}
              className="px-3 py-1.5 text-xs rounded-lg bg-zinc-400/10 hover:bg-zinc-400/20 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              শিরোনামের ধরন
            </button>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={copyText}
              disabled={!stats.hasText}
              className="px-4 py-2 text-sm rounded-xl bg-zinc-400/10 hover:bg-zinc-400/20 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              {copied ? "কপি হয়েছে!" : "কপি করুন"}
            </button>
            <button
              onClick={resetText}
              disabled={!stats.hasText}
              className="px-4 py-2 text-sm rounded-xl bg-zinc-400/10 hover:bg-zinc-400/20 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              রিসেট করুন
            </button>
          </div>
        </div>

        {/* Stats */}
        {stats.hasText ? (
          <div className="rounded-2xl bg-zinc-400/10 p-4 sm:p-5 space-y-4">
            {/* Main Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-zinc-400/10 text-center">
                <div className="text-xs text-zinc-500 uppercase tracking-wider">
                  শব্দ
                </div>
                <div className="text-2xl font-bold mt-1">
                  {formatNum(stats.words)}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-zinc-400/10 text-center">
                <div className="text-xs text-zinc-500 uppercase tracking-wider">
                  অক্ষর (স্পেসসহ)
                </div>
                <div className="text-2xl font-bold mt-1">
                  {formatNum(stats.charsWithSpaces)}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-zinc-400/10 text-center">
                <div className="text-xs text-zinc-500 uppercase tracking-wider">
                  অক্ষর (স্পেসছাড়া)
                </div>
                <div className="text-2xl font-bold mt-1">
                  {formatNum(stats.charsWithoutSpaces)}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-zinc-400/10 text-center">
                <div className="text-xs text-zinc-500 uppercase tracking-wider">
                  বাক্য
                </div>
                <div className="text-2xl font-bold mt-1">
                  {formatNum(stats.sentences)}
                </div>
              </div>
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-zinc-400/20">
              <div className="p-3 rounded-xl bg-zinc-400/10 text-center">
                <div className="text-xs text-zinc-500">প্যারাগ্রাফ</div>
                <div className="text-lg font-bold mt-1">
                  {formatNum(stats.paragraphs)}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-zinc-400/10 text-center">
                <div className="text-xs text-zinc-500">লাইন</div>
                <div className="text-lg font-bold mt-1">
                  {formatNum(stats.lines)}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-zinc-400/10 text-center">
                <div className="text-xs text-zinc-500">পড়ার সময়</div>
                <div className="text-lg font-bold mt-1">
                  ≈ {stats.readingTime} মিনিট
                </div>
              </div>
              <div className="p-3 rounded-xl bg-zinc-400/10 text-center">
                <div className="text-xs text-zinc-500">কথার সময়</div>
                <div className="text-lg font-bold mt-1 text-amber-600 dark:text-amber-400">
                  ≈ {stats.speakingTime} মিনিট
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-10 text-center rounded-2xl border border-dashed border-zinc-400/30 text-zinc-500">
            টেক্সট লিখলেই এখানে লাইভ কাউন্ট দেখা যাবে
          </div>
        )}
      </div>

      {/* SEO Content */}
      <section className="space-y-6 pt-8 border-t border-zinc-400/20">
        <div className="space-y-3">
          <h2 className="text-xl font-bold">
            ওয়ার্ড অ্যান্ড ক্যারেক্টার কাউন্টার কীভাবে ব্যবহার করবেন?
          </h2>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            আমাদের ওয়ার্ড অ্যান্ড ক্যারেক্টার কাউন্টার দিয়ে আপনি তাৎক্ষণিকভাবে
            যেকোনো টেক্সটের শব্দ, অক্ষর, বাক্য, প্যারাগ্রাফ ও লাইনের সংখ্যা জানতে
            পারবেন। শুধু টেক্সটবক্সে লিখুন বা কপি-পেস্ট করুন — সব হিসাব লাইভে
            আপডেট হবে। বাংলা ও ইংরেজি উভয় ভাষাতেই নিখুঁতভাবে কাজ করে।
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">কী কী হিসাব করা হয়?</h3>
          <ul className="space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400 list-disc list-inside">
            <li>
              <strong>শব্দ (Words)</strong> — বাংলা ও ইংরেজি শব্দ দুইই সঠিকভাবে
              গণনা করে
            </li>
            <li>
              <strong>অক্ষর (Characters)</strong> — স্পেসসহ এবং স্পেস ছাড়া আলাদা
              আলাদা দেখায়
            </li>
            <li>
              <strong>বাক্য (Sentences)</strong> — । ! ? চিহ্ন অনুযায়ী বাক্য গণনা
            </li>
            <li>
              <strong>প্যারাগ্রাফ ও লাইন</strong> — খালি লাইন অনুযায়ী প্যারাগ্রাফ
              এবং মোট লাইন
            </li>
            <li>
              <strong>পড়ার সময়</strong> — গড় ২০০ শব্দ/মিনিট হিসেবে আনুমানিক পড়ার
              সময়
            </li>
            <li>
              <strong>কথার সময়</strong> — গড় ১৩০ শব্দ/মিনিট হিসেবে আনুমানিক বলার
              সময়
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">টেক্সট কেস কনভার্শন টুলস</h3>
          <ul className="space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400 list-disc list-inside">
            <li>
              <strong>বড় হাতের অক্ষর</strong> — সব অক্ষর বড় হাতের করে দেয়
            </li>
            <li>
              <strong>ছোট হাতের অক্ষর</strong> — সব অক্ষর ছোট হাতের করে দেয়
            </li>
            <li>
              <strong>বাক্যের ধরন</strong> — প্রতিটি বাক্যের প্রথম অক্ষর বড় হাতের
              করে
            </li>
            <li>
              <strong>শিরোনামের ধরন</strong> — প্রতিটি শব্দের প্রথম অক্ষর বড় হাতের
              করে
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">কেন এই টুল ব্যবহার করবেন?</h3>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            ব্লগ লেখা, অ্যাসাইনমেন্ট, সোশ্যাল মিডিয়া পোস্ট, পরীক্ষার উত্তর বা
            যেকোনো লেখার ক্ষেত্রে শব্দসীমা মেনে চলতে এই টুল খুবই উপকারী। এছাড়া
            টেক্সট কেস পরিবর্তন ও এক ক্লিকে কপি করার সুবিধাও আছে। সম্পূর্ণ ফ্রি,
            কোনো রেজিস্ট্রেশন লাগে না এবং আপনার লেখা কোথাও সংরক্ষণ করা হয় না।
          </p>
        </div>
      </section>
    </section>
  );
}