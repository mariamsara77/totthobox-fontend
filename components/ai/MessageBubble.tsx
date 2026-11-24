"use client";

import { useState } from "react";
import {
  Clipboard,
  Check,
  Pencil,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import MarkdownRenderer from "./MarkdownRenderer";
import AiImageViewer from "./AiImageViewer";
import type { ChatMessage } from "./ChatPanel";
import { useAuth } from "@/context/AuthContext";

type Props = {
  msg: ChatMessage;
  isLastAi: boolean;
  shouldAnimate: boolean;
  onRegenerate: () => void;
  onEditRegenerate: (id: number, content: string) => void;
};

export default function MessageBubble({
  msg,
  isLastAi,
  shouldAnimate,
  onRegenerate,
  onEditRegenerate,
}: Props) {
  const { isLoggedIn } = useAuth();
  const isGuest = !isLoggedIn;
  const isUser = msg.role === "user";

  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newContent, setNewContent] = useState(msg.content);
  const [collapsed, setCollapsed] = useState(isUser);
  const isLong = msg.content.length > 280;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(msg.content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      className={`ai-msg-pop group flex w-full min-w-0 items-start gap-2 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-sky-500/15 bg-sky-500/10 text-sky-600 dark:text-sky-300">
          <Sparkles aria-hidden="true" className="h-4 w-4" />
        </div>
      )}

      <div
        className={
          isUser
            ? "relative ml-auto min-w-0 max-w-[92%] sm:max-w-[86%] md:max-w-[80%]"
            : "relative min-w-0 max-w-full flex-1"
        }
      >
        {isUser && !isGuest && typeof msg.id === "number" && (
          <button
            type="button"
            onClick={() => {
              setNewContent(msg.content);
              setEditing(true);
            }}
            className="absolute -left-8 top-2 rounded-lg p-1.5 opacity-0 transition hover:bg-zinc-200 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 group-hover:opacity-100 dark:hover:bg-zinc-800"
            title="সম্পাদনা"
            aria-label="বার্তা সম্পাদনা করুন"
          >
            <Pencil aria-hidden="true" className="h-3.5 w-3.5" />
          </button>
        )}

        <div
          className={
            isUser
              ? "mb-4 min-w-0 overflow-hidden rounded-2xl rounded-tr-md border border-sky-500/15 bg-sky-500/10 px-3.5 py-3 text-zinc-900 dark:text-zinc-100 sm:px-4"
              : "mb-4 min-w-0 overflow-hidden rounded-2xl border border-zinc-200/70 bg-white/70 px-3.5 py-3 dark:border-zinc-800/70 dark:bg-zinc-900/40 sm:px-4"
          }
        >
          {!editing ? (
            <>
              {msg.image_path && (
                <div className="mb-3">
                  <AiImageViewer src={msg.image_path} alt="আপলোড করা ছবি">
                    <img
                      src={msg.image_path}
                      alt="আপলোড করা ছবি"
                      loading="lazy"
                      className="max-h-64 max-w-full rounded-xl border border-zinc-300/70 object-contain dark:border-zinc-700"
                    />
                  </AiImageViewer>
                </div>
              )}

              {isUser ? (
                <div className="min-w-0 break-words text-sm leading-relaxed">
                  {collapsed && isLong ? (
                    <div className="flex min-w-0 items-center gap-2">
                      <p className="min-w-0 truncate">{msg.content}</p>
                      <button
                        type="button"
                        onClick={() => setCollapsed(false)}
                        className="shrink-0 rounded-full p-1 transition hover:bg-sky-500/10"
                        aria-label="পুরো বার্তা দেখুন"
                      >
                        <ChevronDown aria-hidden="true" className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      {isLong && (
                        <div className="mb-1 flex justify-end">
                          <button
                            type="button"
                            onClick={() => setCollapsed(true)}
                            className="rounded-full p-1 transition hover:bg-sky-500/10"
                            aria-label="বার্তা ছোট করুন"
                          >
                            <ChevronUp aria-hidden="true" className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                      <MarkdownRenderer content={msg.content} />
                    </>
                  )}
                </div>
              ) : (
                <>
                  <MarkdownRenderer
                    content={msg.content}
                    animate={shouldAnimate}
                  />
                  <div className="mt-3 flex flex-wrap items-center gap-1 border-t border-zinc-200/70 pt-2 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100 dark:border-zinc-800/80">
                    <button
                      type="button"
                      onClick={copy}
                      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-zinc-600 transition hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      {copied ? (
                        <Check aria-hidden="true" className="h-4 w-4" />
                      ) : (
                        <Clipboard aria-hidden="true" className="h-4 w-4" />
                      )}
                      <span>{copied ? "কপি হয়েছে" : "কপি"}</span>
                    </button>
                    {isLastAi && (
                      <button
                        type="button"
                        onClick={onRegenerate}
                        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-zinc-600 transition hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-zinc-300 dark:hover:bg-zinc-800"
                      >
                        <RotateCcw aria-hidden="true" className="h-4 w-4" />
                        পুনরায় তৈরি
                      </button>
                    )}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex min-w-0 flex-col gap-2">
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={3}
                className="w-full resize-y rounded-xl border border-zinc-300 bg-white p-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-zinc-700 dark:bg-zinc-950"
                onKeyDown={(e) => {
                  if (e.key === "Escape") setEditing(false);
                  if (e.key === "Enter" && e.ctrlKey) {
                    e.preventDefault();
                    if (typeof msg.id === "number" && newContent.trim()) {
                      onEditRegenerate(msg.id, newContent.trim());
                      setEditing(false);
                    }
                  }
                }}
              />
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-zinc-500">Ctrl+Enter এ পাঠান</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="rounded-lg px-2.5 py-1.5 text-xs transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    বাতিল
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof msg.id === "number" && newContent.trim()) {
                        onEditRegenerate(msg.id, newContent.trim());
                        setEditing(false);
                      }
                    }}
                    className="rounded-lg bg-sky-600 px-2.5 py-1.5 text-xs text-white transition hover:bg-sky-700"
                  >
                    আপডেট ও পাঠান
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
