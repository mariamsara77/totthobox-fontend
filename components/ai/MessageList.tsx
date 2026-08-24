"use client";

import { useEffect, useRef, useState } from "react";
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
  // Auth Context থেকে ভ্যালু নেওয়া হচ্ছে
  const { isLoggedIn } = useAuth();
  const isGuest = !isLoggedIn;

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
    <div className="relative flex-1 overflow-x-auto">
      <div
        ref={chatRef}
        onScroll={onScroll}
        className="h-full overflow-y-auto space-y-1 scroll-smooth totthobox-scrollbar"
        id="chat-container"
      >
        {messages.length === 0 && !isTyping && (
          <div className="flex flex-col items-center justify-center h-full gap-4 select-none py-16">
            <div className="p-3 rounded-2xl bg-zinc-400/10">
              <Sparkles className="size-6" />
            </div>
            <p className="text-sm  ">
              আমি আপনাকে কিভাবে সাহায্য করতে পারি?
            </p>
            <p className="text-xs ">
              ছবি paste করুন বা drag করে আনুন
            </p>
            {isGuest && (
              <p className="text-xs ">
                লগইন ছাড়াই বেশ কয়েকবার জিজ্ঞেস করা যাবে
              </p>
            )}
          </div>
        )}

        {messages.map((msg, i) => (
          <MessageBubble
            key={String(msg.id)}
            msg={msg}
            isLastAi={i === lastAiIndex}
            shouldAnimate={String(msg.id) === String(newMessageId)}
            onRegenerate={onRegenerate}
            onEditRegenerate={onEditRegenerate}
          />
        ))}

        {isTyping && (
          <div className="flex justify-start py-2 ps-2">
            <div className="flex items-center gap-4 p-4 rounded-2xl ">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-zinc-9000/20 animate-ping" />
                <div className="relative bg-zinc-9000/10 p-2 rounded-lg animate-bounce">
                  <Sparkles className="w-5 h-5 " />
                </div>
              </div>
              <div>
                <span className="text-xs  ">
                  তথ্যবক্স এআই ভাবছে...
                </span>
                <div className="flex gap-1 mt-0.5">
                  <span className="w-1 h-1 bg-zinc-9000/40 rounded-full animate-pulse" />
                  <span className="w-1 h-1 bg-zinc-9000/40 rounded-full animate-pulse [animation-delay:200ms]" />
                  <span className="w-1 h-1 bg-zinc-9000/40 rounded-full animate-pulse [animation-delay:400ms]" />
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-start ps-1 pb-2">
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-950/30 px-3 py-2 rounded-xl border border-red-900/50">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
              <button
                type="button"
                onClick={onRetry}
                className="underline underline-offset-2 ml-1  hover:text-red-300 "
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
            className="p-2 rounded-full  bg-zinc-800 border border-zinc-700  hover:bg-zinc-700 "
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
