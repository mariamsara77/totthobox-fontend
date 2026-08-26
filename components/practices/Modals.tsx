"use client";

import type { SaveFormat } from "./practiceClient";

const modalClass = "relative bg-zinc-400/10 border border-zinc-400/25 rounded-2xl p-4 w-full space-y-4";
const inputClass = "w-full p-4 bg-zinc-400/10 border border-zinc-400/25 rounded-xl outline-none";
const buttonClass = "px-4 py-2 rounded-xl border border-zinc-400/25 bg-zinc-400/10 hover:bg-zinc-400/25";

interface ClearModalProps { open: boolean; onClose: () => void; onConfirm: () => void; }

export function ClearModal({ open, onClose, onConfirm }: ClearModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-400/25" onClick={onClose} />
      <div className={`${modalClass} max-w-sm`}>
        <div className="space-y-2">
          <h2 className="text-lg">ক্যানভাস মুছে ফেলবেন?</h2>
          <p className="opacity-50">সব অঙ্কন মুছে যাবে। এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।</p>
        </div>
        <div className="flex gap-2 justify-end">
          <button type="button" onClick={onClose} className={buttonClass}>বাতিল</button>
          <button type="button" onClick={onConfirm} className={buttonClass}>মুছে ফেলুন</button>
        </div>
      </div>
    </div>
  );
}

interface SaveModalProps {
  open: boolean; onClose: () => void; fileName: string; onFileNameChange: (v: string) => void;
  saveFormat: SaveFormat; onFormatChange: (v: SaveFormat) => void; transparentBg: boolean;
  onTransparentChange: (v: boolean) => void; onSave: () => void;
}

export function SaveModal({ open, onClose, fileName, onFileNameChange, saveFormat, onFormatChange, transparentBg, onTransparentChange, onSave }: SaveModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-400/25" onClick={onClose} />
      <div className={`${modalClass} max-w-sm`}>
        <h2 className="text-lg">সংরক্ষণ অপশন</h2>
        <div className="space-y-2">
          <label className="opacity-50">ফাইলের নাম</label>
          <input type="text" value={fileName} onChange={(e) => onFileNameChange(e.target.value)} className={inputClass} />
        </div>
        <div className="space-y-2">
          <label className="opacity-50">ফরম্যাট</label>
          <select value={saveFormat} onChange={(e) => onFormatChange(e.target.value as SaveFormat)} className={inputClass}>
            <option value="png">PNG (উচ্চ মান)</option>
            <option value="jpeg">JPEG (ছোট সাইজ)</option>
            <option value="webp">WebP (আধুনিক)</option>
          </select>
        </div>
        {saveFormat === "png" && (
          <label className="flex items-center gap-4 select-none">
            <input type="checkbox" checked={transparentBg} onChange={(e) => onTransparentChange(e.target.checked)} className="size-4" />
            <span>স্বচ্ছ ব্যাকগ্রাউন্ড</span>
          </label>
        )}
        <div className="flex gap-2 justify-end">
          <button type="button" onClick={onClose} className={buttonClass}>বাতিল</button>
          <button type="button" onClick={onSave} className={buttonClass}>সংরক্ষণ করুন</button>
        </div>
      </div>
    </div>
  );
}

interface HelpModalProps { open: boolean; onClose: () => void; }

export function HelpModal({ open, onClose }: HelpModalProps) {
  if (!open) return null;
  const shortcuts = [
    { label: "Undo", key: "Ctrl + Z" }, { label: "Redo", key: "Ctrl + Y" },
    { label: "Save", key: "Ctrl + S" }, { label: "Clear", key: "Ctrl + Del" },
    { label: "টুল পরিবর্তন", key: "E" }, { label: "সেটিংস", key: "S" },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-400/25" onClick={onClose} />
      <div className={`${modalClass} max-w-lg max-h-[90vh] overflow-y-auto`}>
        <h2 className="text-lg">সহায়তা ও শর্টকাট</h2>
        <div className="space-y-2">
          <h3 className="opacity-50">কীবোর্ড শর্টকাট</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {shortcuts.map((item) => (
              <div key={item.label} className="flex items-center justify-between p-4 rounded-xl border border-zinc-400/25 bg-zinc-400/10">
                <span>{item.label}</span><span className="opacity-50">{item.key}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-2 opacity-50">
          <h3>টিপস</h3>
          <div className="space-y-2">
            <p>• লেখার গাইড হিসেবে সেটিংস থেকে প্র্যাকটিস ক্যারেক্টার বেছে নিন।</p>
            <p>• বিভিন্ন পেপার স্টাইল দিয়ে আলাদা লেখার অভিজ্ঞতা নিন।</p>
            <p>• গাইড অক্ষরের উপর ট্রেস করতে Opacity কমিয়ে নিন।</p>
            <p>• স্টাইলাস ব্যবহার করলে Pressure Sensitivity চালু করুন।</p>
            <p>• সঠিক এলাইনমেন্টের জন্য গাইড লাইন ব্যবহার করুন।</p>
            <p>• Eraser টুলটি বড় সাইজে কাজ করে যাতে সহজে মুছা যায়।</p>
          </div>
        </div>
        <div className="flex justify-end">
          <button type="button" onClick={onClose} className={buttonClass}>বুঝেছি!</button>
        </div>
      </div>
    </div>
  );
}
