"use client";

import { useEffect, useRef, useState } from "react";

export default function NetworkStatus() {
  const [isOffline, setIsOffline] = useState(false);
  const [visible, setVisible] = useState(false);
  const hideTimer = useRef<NodeJS.Timeout | null>(null);

  const showToast = (offline: boolean) => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
    }

    setIsOffline(offline);
    setVisible(true);

    hideTimer.current = setTimeout(() => {
      setVisible(false);
    }, 4000);
  };

  useEffect(() => {
    const handleOffline = () => showToast(true);
    const handleOnline = () => showToast(false);

    if (!navigator.onLine) {
      showToast(true);
    }

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="pwa-fixed-bottom fixed left-1/2 z-9999 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 px-0"
      role="status"
      aria-live="polite"
    >
      <div
        className={`
          flex items-center gap-3 rounded-2xl border px-4 py-3.5
          text-sm font-medium shadow-lg backdrop-blur-xl
          transition-all duration-300
          ${
            isOffline
              ? "border-zinc-300/70 bg-white/95 text-zinc-900 dark:border-zinc-700/70 dark:bg-zinc-900/95 dark:text-zinc-100"
              : "border-emerald-400/25 bg-emerald-600/95 text-white"
          }
        `}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 dark:bg-white/10">
          {isOffline ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.364 5.636a9 9 0 010 12.728M5.636 18.364a9 9 0 010-12.728M12 12h.01"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>

        <span className="min-w-0 whitespace-normal leading-5">
          {isOffline
            ? "আপনি বর্তমানে অফলাইনে আছেন। কিছু তথ্য আপডেট নাও হতে পারে।"
            : "আবার অনলাইন হয়েছেন।"}
        </span>
      </div>
    </div>
  );
}
