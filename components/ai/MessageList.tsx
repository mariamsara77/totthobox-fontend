"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, AlertTriangle, Sparkles } from "lucide-react";
import MessageBubble from "./MessageBubble";
import type { ChatMessage } from "./ChatPanel";
import { useAuth } from "@/context/AuthContext";

type Props = {
  messages: ChatMessage[];
  isTyping: boolean;
  error: string | null;
  newMessageId: string | number | null;
  onRegenerate: () => void;
  onEditRegenerate: (id: number, content: string) => void;
  onRetry: () => void;
};

export default function MessageList({
  messages,
  isTyping,
  error,
  newMessageId,
  onRegenerate,
  onEditRegenerate,
  onRetry,
}: Props) {
  const { isLoggedIn } = useAuth();
  const isGuest = !isLoggedIn;

  const chatRef = useRef<HTMLDivElement>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const scrollBottom = useCallback((smooth = true) => {
    const el = chatRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: smooth && !prefersReducedMotion ? "smooth" : "auto",
    });
    setShowScrollBtn(false);
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => scrollBottom(true));
    return () => window.cancelAnimationFrame(frame);
  }, [messages, isTyping, error, scrollBottom]);

  const onScroll = useCallback(() => {
    const el = chatRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBtn(distanceFromBottom > 120);
  }, []);

  const lastAiIndex = [...messages]
    .map((message, index) => (message.role === "model" ? index : -1))
    .filter((index) => index >= 0)
    .pop();

  return (
    <div className="relative flex min-h-0 flex-1 overflow-hidden">
      <div
        ref={chatRef}
        onScroll={onScroll}
        className="totthobox-scrollbar h-full min-h-0 w-full space-y-1 overflow-x-hidden overflow-y-auto px-1 scroll-smooth sm:px-0"
        id="chat-container"
        aria-label="AI chat messages"
      >
        {messages.length === 0 && !isTyping && (
          <div className="flex h-full select-none flex-col items-center justify-center gap-3 px-4 py-16 text-center">
            <div className="rounded-2xl border border-sky-500/15 bg-sky-500/10 p-3 text-sky-600 dark:text-sky-300">
              <Sparkles aria-hidden="true" className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium">আমি আপনাকে কিভাবে সাহায্য করতে পারি?</p>
            <p className="max-w-xs text-xs text-zinc-500">
              আপনার প্রশ্ন লিখুন, অথবা ছবি যুক্ত করুন।
            </p>
            {isGuest && (
              <p className="text-xs text-zinc-500">
                লগইন ছাড়াই বেশ কয়েকবার জিজ্ঞেস করা যাবে
              </p>
            )}
          </div>
        )}

        {messages.map((msg, index) => (
          <MessageBubble
            key={String(msg.id)}
            msg={msg}
            isLastAi={index === lastAiIndex}
            shouldAnimate={String(msg.id) === String(newMessageId)}
            onRegenerate={onRegenerate}
            onEditRegenerate={onEditRegenerate}
          />
        ))}

        {isTyping && (
          <div
            className="flex w-full justify-start py-2 sm:py-3"
            role="status"
            aria-live="polite"
            aria-label="AI উত্তর তৈরি করছে"
          >
            <div className="flex max-w-[92%] items-center gap-3 rounded-2xl border border-zinc-200/70 bg-white/75 px-3.5 py-3 dark:border-zinc-800/70 dark:bg-zinc-900/50 sm:px-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-300">
                <Sparkles aria-hidden="true" className="h-4 w-4 animate-pulse" />
              </div>
              <div className="min-w-0">
                <span className="text-sm text-zinc-700 dark:text-zinc-200">
                  তথ্যবক্স এআই উত্তর তৈরি করছে…
                </span>
                <span className="mt-1 flex h-2 items-center gap-1" aria-hidden="true">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-sky-500 [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-sky-500 [animation-delay:120ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-sky-500 [animation-delay:240ms]" />
                </span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-start pb-3">
            <div
              className="flex min-w-0 max-w-full flex-wrap items-center gap-2 rounded-xl border border-red-300/70 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"
              role="alert"
            >
              <AlertTriangle aria-hidden="true" className="h-4 w-4 shrink-0" />
              <span className="min-w-0 flex-1 break-words">{error}</span>
              <button
                type="button"
                onClick={onRetry}
                className="rounded-md px-1 py-0.5 underline underline-offset-2 hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              >
                আবার চেষ্টা
              </button>
            </div>
          </div>
        )}
      </div>

      {showScrollBtn && (
        <div className="absolute bottom-4 left-1/2 z-30 -translate-x-1/2">
          <button
            type="button"
            onClick={() => scrollBottom(true)}
            className="rounded-full border border-zinc-300/80 bg-white/95 p-2.5 text-zinc-700 shadow-lg transition hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-900/95 dark:text-zinc-100 dark:hover:bg-zinc-800"
            aria-label="সর্বশেষ বার্তায় যান"
            title="সর্বশেষ বার্তায় যান"
          >
            <ArrowDown aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
