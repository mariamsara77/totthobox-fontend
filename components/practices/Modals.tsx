"use client";

import type { SaveFormat } from "./practiceClient";

/* -------------------------------------------------------------------------- */
/*  Clear Modal                                                               */
/* -------------------------------------------------------------------------- */
interface ClearModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ClearModal({ open, onClose, onConfirm }: ClearModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-zinc-950 bg-zinc-900 rounded-2xl p-4 max-w-sm w-full shadow-2xl space-y-4">
        <div>
          <h2 className="text-lg ">ক্যানভাস মুছে ফেলবেন?</h2>
          <p className="mt-2 text-sm ">
            সব অঙ্কন মুছে যাবে। এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।
          </p>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg hover:bg-zinc-900 hover:bg-zinc-800 transition"
          >
            বাতিল
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
          >
            মুছে ফেলুন
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Save Modal                                                                */
/* -------------------------------------------------------------------------- */
interface SaveModalProps {
  open: boolean;
  onClose: () => void;
  fileName: string;
  onFileNameChange: (v: string) => void;
  saveFormat: SaveFormat;
  onFormatChange: (v: SaveFormat) => void;
  transparentBg: boolean;
  onTransparentChange: (v: boolean) => void;
  onSave: () => void;
}

export function SaveModal({
  open,
  onClose,
  fileName,
  onFileNameChange,
  saveFormat,
  onFormatChange,
  transparentBg,
  onTransparentChange,
  onSave,
}: SaveModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-zinc-950 bg-zinc-900 rounded-2xl p-4 max-w-sm w-full shadow-2xl space-y-5">
        <h2 className="text-lg ">সংরক্ষণ অপশন</h2>

        <div>
          <label className="block text-sm  mb-1.5">ফাইলের নাম</label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => onFileNameChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-zinc-700 dark:border-zinc-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm  mb-1.5">ফরম্যাট</label>
          <select
            value={saveFormat}
            onChange={(e) => onFormatChange(e.target.value as SaveFormat)}
            className="w-full px-3 py-2 rounded-lg border border-zinc-700 dark:border-zinc-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="png">PNG (উচ্চ মান)</option>
            <option value="jpeg">JPEG (ছোট সাইজ)</option>
            <option value="webp">WebP (আধুনিক)</option>
          </select>
        </div>

        {saveFormat === "png" && (
          <label className="flex items-center gap-4 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={transparentBg}
              onChange={(e) => onTransparentChange(e.target.checked)}
              className="size-4 rounded accent-blue-600"
            />
            <span className="text-sm">স্বচ্ছ ব্যাকগ্রাউন্ড</span>
          </label>
        )}

        <div className="flex gap-2 justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg hover:bg-zinc-900 hover:bg-zinc-800 transition"
          >
            বাতিল
          </button>
          <button
            type="button"
            onClick={onSave}
            className="px-4 py-2 text-sm rounded-lg bg-zinc-700 text-white hover:bg-zinc-600 transition"
          >
            সংরক্ষণ করুন
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Help Modal                                                                */
/* -------------------------------------------------------------------------- */
interface HelpModalProps {
  open: boolean;
  onClose: () => void;
}

export function HelpModal({ open, onClose }: HelpModalProps) {
  if (!open) return null;

  const shortcuts = [
    { label: "Undo", key: "Ctrl + Z" },
    { label: "Redo", key: "Ctrl + Y" },
    { label: "Save", key: "Ctrl + S" },
    { label: "Clear", key: "Ctrl + Del" },
    { label: "টুল পরিবর্তন", key: "E" },
    { label: "সেটিংস", key: "S" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-zinc-950 bg-zinc-900 rounded-2xl p-4 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg ">সহায়তা ও শর্টকাট</h2>

        <div>
          <h3 className="text-sm  mb-4">কীবোর্ড শর্টকাট</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {shortcuts.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between p-2 rounded-lg bg-zinc-400/10"
              >
                <span className="text-sm">{item.label}</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-400/10">
                  {item.key}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm  mb-4">টিপস</h3>
          <div className="space-y-2.5 text-sm ">
            <p>• লেখার গাইড হিসেবে সেটিংস থেকে প্র্যাকটিস ক্যারেক্টার বেছে নিন।</p>
            <p>• বিভিন্ন পেপার স্টাইল দিয়ে আলাদা লেখার অভিজ্ঞতা নিন।</p>
            <p>• গাইড অক্ষরের উপর ট্রেস করতে Opacity কমিয়ে নিন।</p>
            <p>• স্টাইলাস ব্যবহার করলে Pressure Sensitivity চালু করুন।</p>
            <p>• সঠিক এলাইনমেন্টের জন্য গাইড লাইন ব্যবহার করুন।</p>
            <p>• Eraser টুলটি বড় সাইজে কাজ করে যাতে সহজে মুছা যায়।</p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg bg-zinc-700 text-white hover:bg-zinc-600 transition"
          >
            বুঝেছি!
          </button>
        </div>
      </div>
    </div>
  );
}