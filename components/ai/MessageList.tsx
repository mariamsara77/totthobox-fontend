"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, AlertTriangle, Sparkles } from "lucide-react";
import MessageBubble from "./MessageBubble";
import type { ChatMessage } from "./ChatPanel";

type Props = {
  messages: ChatMessage[];
  isTyping: boolean;
  error: string | null;
  newMessageId: string | number | null;
  isGuest: boolean;
  onRegenerate: () => void;
  onEditRegenerate: (id: number, content: string) => void;
  onRetry: () => void;
};

export default function MessageList({
  messages,
  isTyping,
  error,
  newMessageId,
  isGuest,
  onRegenerate,
  onEditRegenerate,
  onRetry,
}: Props) {
  const chatRef = useRef<HTMLDivElement>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const scrollBottom = (smooth = true) => {
    const el = chatRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
    setShowScrollBtn(false);
  };

  useEffect(() => {
    scrollBottom(true);
  }, [messages, isTyping, error]);

  const onScroll = () => {
    const el = chatRef.current;
    if (!el) return;
    const dist = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBtn(dist > 120);
  };

  const lastAiIndex = [...messages]
    .map((m, i) => (m.role === "model" ? i : -1))
    .filter((i) => i >= 0)
    .pop();

  return (
    <div className="relative flex-1 min-h-0">
      <div
        ref={chatRef}
        onScroll={onScroll}
        className="h-full overflow-y-auto space-y-1 scroll-smooth totthobox-scrollbar"
        id="chat-container"
      >
        {messages.length === 0 && !isTyping && (
          <div className="flex flex-col items-center justify-center h-full gap-3 opacity-50 select-none py-16">
            <div className="p-3 rounded-2xl bg-emerald-500/10">
              <Sparkles className="w-8 h-8 text-emerald-600" />
            </div>
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
              আমি আপনাকে কিভাবে সাহায্য করতে পারি?
            </p>
            <p className="text-xs text-zinc-400">ছবি paste করুন বা drag করে আনুন</p>
            {isGuest && (
              <p className="text-xs text-zinc-400">লগইন ছাড়াই বেশ কয়েকবার জিজ্ঞেস করা যাবে</p>
            )}
          </div>
        )}

        {messages.map((msg, i) => (
          <MessageBubble
            key={String(msg.id)}
            msg={msg}
            isLastAi={i === lastAiIndex}
            isGuest={isGuest}
            shouldAnimate={String(msg.id) === String(newMessageId)}
            onRegenerate={onRegenerate}
            onEditRegenerate={onEditRegenerate}
          />
        ))}

        {isTyping && (
          <div className="flex justify-start py-2 ps-2">
            <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700/50 rounded-2xl shadow-sm">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
                <div className="relative bg-emerald-500/10 p-1.5 rounded-lg animate-bounce">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              <div>
                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                  তথ্যবক্স এআই ভাবছে...
                </span>
                <div className="flex gap-1 mt-0.5">
                  <span className="w-1 h-1 bg-emerald-500/40 rounded-full animate-pulse" />
                  <span className="w-1 h-1 bg-emerald-500/40 rounded-full animate-pulse [animation-delay:200ms]" />
                  <span className="w-1 h-1 bg-emerald-500/40 rounded-full animate-pulse [animation-delay:400ms]" />
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-start ps-1 pb-2">
            <div className="flex items-center gap-2 text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-xl">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
              <button
                type="button"
                onClick={onRetry}
                className="underline underline-offset-2 ml-1 font-medium hover:text-red-600"
              >
                আবার চেষ্টা
              </button>
            </div>
          </div>
        )}
      </div>

      {showScrollBtn && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30">
          <button
            type="button"
            onClick={() => scrollBottom(true)}
            className="p-2 rounded-full shadow-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}