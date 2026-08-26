"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, ArrowDown, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import MessageBubble from "./MessageBubble";
import type { ChatMessage } from "./ChatPanel";

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
  const chatRef = useRef<HTMLDivElement>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const scrollBottom = (smooth = true) => {
    const element = chatRef.current;
    if (!element) return;
    element.scrollTo({
      top: element.scrollHeight,
      behavior: smooth ? "smooth" : "auto",
    });
    setShowScrollBtn(false);
  };

  useEffect(() => {
    scrollBottom(true);
  }, [messages.length, isTyping, error]);

  const onScroll = () => {
    const element = chatRef.current;
    if (!element) return;
    const distance = element.scrollHeight - element.scrollTop - element.clientHeight;
    setShowScrollBtn(distance > 120);
  };

  const lastAiIndex = [...messages]
    .map((message, index) => (message.role === "model" ? index : -1))
    .filter((index) => index >= 0)
    .pop();

  return (
    <div className="relative flex-1 overflow-hidden">
      <div
        ref={chatRef}
        id="chat-container"
        onScroll={onScroll}
        className="h-full space-y-1 overflow-y-auto scroll-smooth"
      >
        {messages.length === 0 && !isTyping && (
          <div className="flex h-full select-none flex-col items-center justify-center gap-4 py-16">
            <div className="rounded-2xl bg-zinc-400/10 p-3">
              <Sparkles aria-hidden="true" className="h-6 w-6" />
            </div>
            <p className="text-sm">আমি আপনাকে কিভাবে সাহায্য করতে পারি?</p>
            <p className="text-xs opacity-50">ছবি paste করুন বা drag করে আনুন</p>
            {!isLoggedIn && (
              <p className="text-xs opacity-50">
                লগইন ছাড়াই বেশ কয়েকবার জিজ্ঞেস করা যাবে
              </p>
            )}
          </div>
        )}

        {messages.map((message, index) => (
          <MessageBubble
            key={String(message.id)}
            msg={message}
            isLastAi={index === lastAiIndex}
            shouldAnimate={String(message.id) === String(newMessageId)}
            onRegenerate={onRegenerate}
            onEditRegenerate={onEditRegenerate}
          />
        ))}

        {isTyping && (
          <div className="flex justify-start py-2 ps-2">
            <div className="flex items-center gap-4 rounded-2xl p-4">
              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-zinc-400/10" />
                <div className="relative animate-bounce rounded-xl bg-zinc-400/10 p-2">
                  <Sparkles aria-hidden="true" className="h-5 w-5" />
                </div>
              </div>
              <div>
                <span className="text-xs opacity-50">তথ্যবক্স এআই ভাবছে...</span>
                <div className="mt-0.5 flex gap-1">
                  <span className="h-1 w-1 animate-pulse rounded-full bg-zinc-400/25" />
                  <span className="h-1 w-1 animate-pulse rounded-full bg-zinc-400/25 [animation-delay:200ms]" />
                  <span className="h-1 w-1 animate-pulse rounded-full bg-zinc-400/25 [animation-delay:400ms]" />
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-start ps-1 pb-2">
            <div className="flex items-center gap-2 rounded-xl border border-zinc-400/25 bg-zinc-400/10 px-3 py-2 text-sm">
              <AlertTriangle aria-hidden="true" className="h-4 w-4 shrink-0 opacity-50" />
              <span>{error}</span>
              <button
                type="button"
                onClick={onRetry}
                className="ml-1 underline underline-offset-2 opacity-50 hover:opacity-100"
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
            className="rounded-2xl border border-zinc-400/25 bg-zinc-400/10 p-2 hover:bg-zinc-400/25"
            aria-label="নিচে যান"
          >
            <ArrowDown aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
