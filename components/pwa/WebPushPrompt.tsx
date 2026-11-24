"use client";

import { useState } from "react";
import { BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useWebPush } from "@/hooks/useWebPush";

export default function WebPushPrompt() {
  const { isSupported, permission, subscription, loading, subscribeToPush } =
    useWebPush();
  const [dismissed, setDismissed] = useState(false);

  // If already subscribed, not supported, or dismissed, don't show
  if (!isSupported || subscription || permission === "denied" || dismissed) {
    return null;
  }

  const handleSubscribe = async () => {
    const success = await subscribeToPush();
    if (!success) {
      setDismissed(true);
    }
  };

  return (
    <div
      role="region"
      aria-label="নোটিফিকেশন অনুমতি"
      className="fixed bottom-4 left-4 z-40 max-w-sm rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 p-3.5 shadow-xl backdrop-blur-md flex items-center justify-between gap-3 text-zinc-900 dark:text-zinc-100 animate-in fade-in slide-in-from-bottom-2 duration-300"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="size-8 rounded-xl bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
          <BellIcon className="size-4 stroke-2" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold truncate">জরুরি নোটিফিকেশন পান</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
            গুরুত্বপূর্ণ সরকারি ছুটি ও জরুরি ঘোষণা
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={handleSubscribe}
          disabled={loading}
          className="rounded-lg bg-primary-600 hover:bg-primary-700 text-white px-2.5 py-1 text-xs font-semibold transition-colors shadow-xs disabled:opacity-50"
        >
          {loading ? "যুক্ত হচ্ছে..." : "চালু করুন"}
        </button>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="বন্ধ করুন"
          className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
        >
          <XMarkIcon className="size-4" />
        </button>
      </div>
    </div>
  );
}
