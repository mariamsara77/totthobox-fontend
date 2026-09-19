"use client";

import { useState, useRef, ChangeEvent, KeyboardEvent } from "react";
import { Send, Image as ImageIcon, X, LogIn } from "lucide-react";

type ChatInputProps = {
  disabled?: boolean;
  isGuest?: boolean;
  guestRemaining?: number;
  onSend: (
    question: string,
    imageBase64?: string | null,
    imageMime?: string | null,
  ) => Promise<void>;
  onLogin?: () => void;
};

export default function ChatInput({
  disabled,
  isGuest,
  guestRemaining = 0,
  onSend,
  onLogin,
}: ChatInputProps) {
  const [text, setText] = useState("");
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("ছবি সর্বোচ্চ ৫MB হতে পারবে।");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(",")[1];
      setImageBase64(base64Data);
      setImageMime(file.type);
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageBase64(null);
    setImageMime(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if ((!text.trim() && !imageBase64) || disabled) return;

    const currentText = text;
    const currentImg = imageBase64;
    const currentMime = imageMime;

    setText("");
    removeImage();

    await onSend(currentText, currentImg, currentMime);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="text-center">
      {/* গেস্ট নোটিফিকেশন বার */}
      {isGuest && (
        <div className="mb-2 flex items-center justify-between rounded-xl bg-zinc-400/10 p-2 text-xs">
          <span>
            বিনা মূল্যে বাকি আছে: <strong>{guestRemaining}</strong> টি উত্তর
          </span>
          {onLogin && (
            <button
              type="button"
              onClick={onLogin}
              className="flex items-center gap-1 text-emerald-600 hover:underline dark:text-emerald-400"
            >
              <LogIn className="w-3.5 h-3.5" />
              লগইন করুন
            </button>
          )}
        </div>
      )}

      {/* ইমেজ প্রিভিউ */}
      {imagePreview && (
        <div className="relative inline-block mb-2">
          <img
            src={imagePreview}
            alt="আপলোডের পূর্বরূপ"
            className="h-16 w-16 rounded-xl border border-zinc-400/25 object-cover"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute -top-2 -right-2 text-white rounded-full p-1 hover:bg-zinc-400/25"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ইনপুট বক্স */}
      <div className="flex items-end gap-2 rounded-2xl bg-zinc-400/10 p-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="rounded-xl p-2 text-zinc-500 transition-colors hover:bg-zinc-400/25 disabled:opacity-50 dark:text-zinc-400"
          title="ছবি যুক্ত করুন"
        >
          <ImageIcon className="w-5 h-5" />
        </button>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="কিছু লিখুন..."
          disabled={disabled}
          rows={1}
          className="flex-1 text-sm focus:outline-none resize-none max-h-32 min-h-20 py-2"
        />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={disabled || (!text.trim() && !imageBase64)}
          className="m-1 rounded-xl bg-zinc-400/10 p-2 transition-colors hover:bg-zinc-400/25 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
      <span className="text-xs text-zinc-500">
        উত্তর যাচাই করে ব্যবহার করুন।
      </span>
    </div>
  );
}
