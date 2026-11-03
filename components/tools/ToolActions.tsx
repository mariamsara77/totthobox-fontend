"use client";

import { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";

interface CopyResultButtonProps {
  textToCopy: string;
  label?: string;
  successMessage?: string;
  className?: string;
}

export function CopyResultButton({
  textToCopy,
  label = "ফলাফল কপি করুন",
  successMessage = "কপি হয়েছে!",
  className = "",
}: CopyResultButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!textToCopy) return;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all active:scale-95 ${
        copied
          ? "bg-emerald-600 text-white shadow-xs"
          : "border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 shadow-xs"
      } ${className}`}
      aria-label={copied ? successMessage : label}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-white" />
          <span>{successMessage}</span>
        </>
      ) : (
        <>
          <Copy className="w-4 h-4 opacity-70" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}

interface ShareToolButtonProps {
  title: string;
  text?: string;
  url?: string;
  className?: string;
}

export function ShareToolButton({
  title,
  text,
  url,
  className = "",
}: ShareToolButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
    const shareData = {
      title,
      text: text || `${title} - Totthobox`,
      url: shareUrl,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
      }
    }

    // Fallback: Copy link
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={handleShare}
        aria-label="শেয়ার করুন"
        title="শেয়ার বা লিংক কপি করুন"
        className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl p-2.5 border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-100/60 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all active:scale-95 ${className}`}
      >
        {copied ? (
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <Share2 className="w-4 h-4" />
        )}
      </button>

      {copied && (
        <div className="absolute right-0 top-full mt-2 z-50 whitespace-nowrap rounded-lg bg-zinc-900 dark:bg-zinc-100 px-3 py-1.5 text-xs font-medium text-white dark:text-zinc-900 shadow-xl animate-in fade-in zoom-in-95 duration-150">
          লিংক কপি হয়েছে!
        </div>
      )}
    </div>
  );
}
