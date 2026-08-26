"use client";

import { useState } from "react";
import type { PaperStyle } from "./practiceClient";

const COLOR_PRESETS = [
  "#000000",
  "#dc2626",
  "#2563eb",
  "#16a34a",
  "#ea580c",
  "#9333ea",
  "#64748b",
  "#ffffff",
];

const PAPER_STYLES: { id: PaperStyle; name: string; preview: string }[] = [
  { id: "blank", name: "Blank", preview: "bg-zinc-400/10" },
  { id: "lined", name: "Lined", preview: "bg-zinc-400/10" },
  { id: "grid", name: "Grid", preview: "bg-zinc-400/10" },
  { id: "graph", name: "Graph", preview: "bg-zinc-400/10" },
  { id: "yellow", name: "Yellow", preview: "bg-zinc-400/25" },
  { id: "parchment", name: "Parchment", preview: "bg-zinc-400/25" },
];

const CHARACTER_CATEGORIES = [
  {
    name: "English Uppercase",
    characters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
  },
  {
    name: "English Lowercase",
    characters: "abcdefghijklmnopqrstuvwxyz".split(""),
  },
  {
    name: "Numbers",
    characters: "0123456789".split(""),
  },
  {
    name: "Bangla Vowels (স্বরবর্ণ)",
    characters: "অআইঈউঊঋএঐওঔ".split(""),
  },
  {
    name: "Bangla Consonants (ব্যঞ্জনবর্ণ)",
    characters: "কখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলশষসহড়ঢ়য়".split(""),
  },
  {
    name: "Bangla Numbers",
    characters: "০১২৩৪৫৬৭৮৯".split(""),
  },
];

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
  currentColor: string;
  onColorChange: (c: string) => void;
  currentSize: number;
  onSizeChange: (s: number) => void;
  opacity: number;
  onOpacityChange: (o: number) => void;
  guideText: string;
  onGuideTextChange: (t: string) => void;
  paperStyle: PaperStyle;
  onPaperStyleChange: (s: PaperStyle) => void;
  pressureSensitivity: boolean;
  onPressureChange: (v: boolean) => void;
  smoothing: boolean;
  onSmoothingChange: (v: boolean) => void;
  guideLines: boolean;
  onGuideLinesChange: (v: boolean) => void;
}

export default function SettingsPanel({
  open,
  onClose,
  currentColor,
  onColorChange,
  currentSize,
  onSizeChange,
  opacity,
  onOpacityChange,
  guideText,
  onGuideTextChange,
  paperStyle,
  onPaperStyleChange,
  pressureSensitivity,
  onPressureChange,
  smoothing,
  onSmoothingChange,
  guideLines,
  onGuideLinesChange,
}: SettingsPanelProps) {
  const [openCategories, setOpenCategories] = useState<Record<number, boolean>>({});

  if (!open) return null;

  const toggleCategory = (index: number) => {
    setOpenCategories((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-md bg-zinc-400/10 bg-zinc-400/10 h-full overflow-y-auto shadow-2xl p-4 space-y-7">
        {/* Header */}
        <div className="flex items-center justify-between sticky top-0 bg-zinc-400/10 bg-zinc-400/10 pb-2 z-10">
          <h2 className="text-xl ">সেটিংস</h2>
          <button
            type="button"
            onClick={onClose}
            className="size-8 flex items-center justify-center rounded-xl hover:bg-zinc-400/10 hover:bg-zinc-400/10 transition text-lg"
          >
            ✕
          </button>
        </div>

        {/* Color */}
        <div className="space-y-4">
          <h3 className="text-sm ">কলমের রঙ</h3>
          <div className="flex items-center gap-4">
            <input
              type="color"
              value={currentColor}
              onChange={(e) => onColorChange(e.target.value)}
              className="size-12 rounded-xl cursor-pointer border border-zinc-400/25 dark:border-zinc-400/25"
            />
            <div className="flex flex-wrap gap-2">
              {COLOR_PRESETS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => onColorChange(c)}
                  className={`size-8 rounded-xl border-2 transition-transform ${
                    currentColor === c
                      ? "border-zinc-400/25 scale-110"
                      : "border-zinc-400/25 dark:border-zinc-400/25"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Brush Size */}
        <div className="space-y-2">
          <h3 className="text-sm ">
            ব্রাশের সাইজ:{" "}
            <span className="opacity-50 ">{currentSize}</span>px
          </h3>
          <input
            type="range"
            min={1}
            max={40}
            value={currentSize}
            onChange={(e) => onSizeChange(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-xs text-zinc-400">
            <span>চিকন</span>
            <span>মাঝারি</span>
            <span>মোটা</span>
          </div>
        </div>

        {/* Opacity */}
        <div className="space-y-2">
          <h3 className="text-sm ">
            স্বচ্ছতা:{" "}
            <span className="opacity-50 ">
              {Math.round(opacity * 100)}
            </span>
            %
          </h3>
          <input
            type="range"
            min={0.1}
            max={1}
            step={0.05}
            value={opacity}
            onChange={(e) => onOpacityChange(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>

        {/* Practice Characters */}
        <div className="space-y-4">
          <h3 className="text-sm ">প্র্যাকটিস ক্যারেক্টার</h3>
          <div className="space-y-2">
            {CHARACTER_CATEGORIES.map((cat, index) => (
              <div
                key={cat.name}
                className="border border-zinc-400/25 dark:border-zinc-400/25 rounded-xl overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleCategory(index)}
                  className="w-full flex justify-between items-center p-4 hover:bg-zinc-400/10 hover:bg-zinc-400/10 text-left transition"
                >
                  <span className="text-sm ">{cat.name}</span>
                  <span className="text-zinc-400 text-xs">
                    {openCategories[index] ? "▲" : "▼"}
                  </span>
                </button>

                {openCategories[index] && (
                  <div className="p-3 grid grid-cols-6 gap-2 border-t border-zinc-400/25 dark:border-zinc-400/25">
                    {cat.characters.map((char) => (
                      <button
                        key={char}
                        type="button"
                        onClick={() => {
                          onGuideTextChange(char);
                          onClose();
                        }}
                        className="h-10 flex items-center justify-center rounded-xl bg-zinc-400/10 hover:bg-zinc-400/10 hover:bg-zinc-400/25  text-lg transition"
                      >
                        {char}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {guideText && (
            <button
              type="button"
              onClick={() => onGuideTextChange("")}
              className="text-sm opacity-50 hover:underline"
            >
              গাইড অক্ষর সরান ({guideText})
            </button>
          )}
        </div>

        {/* Paper Style */}
        <div className="space-y-4">
          <h3 className="text-sm ">পেপারের স্টাইল</h3>
          <div className="grid grid-cols-3 gap-2.5">
            {PAPER_STYLES.map((paper) => (
              <button
                key={paper.id}
                type="button"
                onClick={() => onPaperStyleChange(paper.id)}
                className={`p-2.5 rounded-xl border-2 text-center transition ${
                  paperStyle === paper.id
                    ? "border-zinc-400/25 ring-1 ring-blue-500"
                    : "border-zinc-400/25 dark:border-zinc-400/25 hover:border-zinc-400/25"
                }`}
              >
                <div
                  className={`h-11 rounded-xl mb-1.5 border border-zinc-400/25 dark:border-zinc-400/25 ${paper.preview}`}
                />
                <span className="text-xs ">{paper.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Options */}
        <div className="space-y-4">
          <h3 className="text-sm ">অ্যাডভান্সড অপশন</h3>
          <div className="space-y-4.5">
            <label className="flex items-center gap-4 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={pressureSensitivity}
                onChange={(e) => onPressureChange(e.target.checked)}
                className="size-4.5 rounded accent-blue-600"
              />
              <span className="text-sm">প্রেসার সেনসিটিভিটি (স্টাইলাস)</span>
            </label>

            <label className="flex items-center gap-4 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={smoothing}
                onChange={(e) => onSmoothingChange(e.target.checked)}
                className="size-4.5 rounded accent-blue-600"
              />
              <span className="text-sm">লাইন স্মুদিং</span>
            </label>

            <label className="flex items-center gap-4 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={guideLines}
                onChange={(e) => onGuideLinesChange(e.target.checked)}
                className="size-4.5 rounded accent-blue-600"
              />
              <span className="text-sm">গাইড লাইন দেখান</span>
            </label>
          </div>
        </div>

        <div className="h-8" /> {/* bottom spacing */}
      </div>
    </div>
  );
}