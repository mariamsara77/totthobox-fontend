"use client";

import { useRef, useState, useCallback } from "react";
import { ImagePlus, Send, X } from "lucide-react";

type Props = {
  disabled: boolean;
  isGuest: boolean;
  guestRemaining: number;
  onSend: (q: string, b64?: string | null, mime?: string | null) => void;
  onLogin: () => void;
};

export default function ChatInput({
  disabled,
  isGuest,
  guestRemaining,
  onSend,
  onLogin,
}: Props) {
  const [question, setQuestion] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [b64, setB64] = useState<string | null>(null);
  const [mime, setMime] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const loadFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 8 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const [header, data] = dataUrl.split(",");
      const m = header.match(/data:(.*?);/);
      setPreview(dataUrl);
      setB64(data);
      setMime(m?.[1] || "image/jpeg");
    };
    reader.readAsDataURL(file);
  };

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const f = item.getAsFile();
        if (f) loadFile(f);
        break;
      }
    }
  }, []);

  const submit = () => {
    if (disabled) return;
    if (!question.trim() && !b64) return;
    onSend(question, b64, mime);
    setQuestion("");
    setPreview(null);
    setB64(null);
    setMime(null);
    if (taRef.current) taRef.current.style.height = "auto";
  };

  return (
    <div className="shrink-0 pt-2 pb-2" onPaste={handlePaste}>
      {isGuest && (
        <div className="mb-3 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
          <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
            <span>ফ্রি লিমিট বাকি</span>
            <span>
              {guestRemaining} / 20
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all"
              style={{ width: `${(guestRemaining / 20) * 100}%` }}
            />
          </div>
          {guestRemaining <= 0 && (
            <p className="mt-2 text-xs text-red-500">
              লিমিট শেষ।{" "}
              <button onClick={onLogin} className="underline font-medium">
                লগইন করুন
              </button>
            </p>
          )}
        </div>
      )}

      <div
        className={`relative rounded-3xl shadow-md bg-zinc-50 dark:bg-zinc-800 transition ${
          dragging ? "ring-2 ring-emerald-500/50" : ""
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const f = e.dataTransfer.files?.[0];
          if (f) loadFile(f);
        }}
      >
        {preview && (
          <div className="px-4 pt-3">
            <div className="relative inline-block">
              <img src={preview} alt="" className="h-20 rounded-xl object-cover border" />
              <button
                type="button"
                onClick={() => {
                  setPreview(null);
                  setB64(null);
                  setMime(null);
                }}
                className="absolute -top-2 -right-2 bg-zinc-800 text-white rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        <textarea
          ref={taRef}
          value={question}
          disabled={disabled}
          onChange={(e) => {
            setQuestion(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = Math.min(e.target.scrollHeight, 208) + "px";
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="একটি বার্তা টাইপ করুন... (Shift+Enter এ নতুন লাইন)"
          rows={1}
          className="w-full bg-transparent px-4 py-3 text-sm resize-none outline-none disabled:opacity-60 max-h-52"
        />

        <div className="flex justify-between items-center px-2 pb-2">
          <label className="cursor-pointer flex items-center gap-1.5 text-zinc-400 hover:text-zinc-600 px-2 py-1.5 rounded-xl text-xs">
            <ImagePlus className="w-4 h-4" />
            <span className="hidden sm:inline">ছবি</span>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) loadFile(f);
              }}
            />
          </label>

          <button
            type="button"
            disabled={disabled || (!question.trim() && !b64)}
            onClick={submit}
            className="p-2 rounded-xl bg-emerald-600 text-white disabled:opacity-40 disabled:bg-zinc-300"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="mt-1.5 text-center text-xs text-zinc-400">
        তথ্যবক্স এআই ভুল করতে পারে — গুরুত্বপূর্ণ তথ্য যাচাই করুন
      </p>
    </div>
  );
}