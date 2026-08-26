"use client";

import { useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Clipboard,
  Pencil,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import type { ChatMessage } from "./ChatPanel";
import MarkdownRenderer from "./MarkdownRenderer";

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

  const copy = () => {
    navigator.clipboard.writeText(msg.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={`group flex ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="flex shrink-0 items-start pt-3 pr-2">
          <div className="rounded-xl bg-zinc-400/10 p-1.5">
            <Sparkles aria-hidden="true" className="h-3.5 w-3.5 opacity-50" />
          </div>
        </div>
      )}

      <div className="relative max-w-[90%] md:max-w-[78%] lg:max-w-[70%]">
        {isUser && !isGuest && typeof msg.id === "number" && (
          <button
            type="button"
            onClick={() => {
              setNewContent(msg.content);
              setEditing(true);
            }}
            className="absolute top-3 -left-8 rounded-xl p-1 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-zinc-400/25"
            title="সম্পাদনা"
            aria-label="বার্তা সম্পাদনা করুন"
          >
            <Pencil aria-hidden="true" className="h-3.5 w-3.5" />
          </button>
        )}

        <div className={`mb-4 ${isUser ? "rounded-2xl rounded-tr-xl bg-zinc-400/10 px-4 py-2.5" : "py-1"}`}>
          {!editing ? (
            <>
              {msg.image_path && (
                <div className="mb-2">
                  <img
                    src={msg.image_path}
                    alt="uploaded"
                    className="max-h-48 rounded-xl border border-zinc-400/25 object-cover"
                  />
                </div>
              )}

              {isUser ? (
                <div className="relative text-sm leading-relaxed">
                  {collapsed && isLong ? (
                    <div className="flex items-center gap-2">
                      <p className="max-w-[calc(100%-1.75rem)] truncate">{msg.content}</p>
                      <button
                        type="button"
                        onClick={() => setCollapsed(false)}
                        className="shrink-0 rounded-xl p-0.5 hover:bg-zinc-400/25"
                        aria-label="বার্তা দেখুন"
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
                            className="rounded-xl p-0.5 hover:bg-zinc-400/25"
                            aria-label="বার্তা সংক্ষিপ্ত করুন"
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
                  <MarkdownRenderer content={msg.content} animate={shouldAnimate} />
                  <div className="mt-1 flex items-center gap-1 border-t border-zinc-400/25 pt-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={copy}
                      className="flex items-center gap-2 rounded-xl px-2 py-1 text-xs hover:bg-zinc-400/25"
                    >
                      {copied ? <Check aria-hidden="true" className="h-4 w-4" /> : <Clipboard aria-hidden="true" className="h-4 w-4" />}
                      <span>{copied ? "কপি হয়েছে" : "কপি"}</span>
                    </button>
                    {isLastAi && (
                      <button
                        type="button"
                        onClick={onRegenerate}
                        className="flex items-center gap-2 rounded-xl px-2 py-1 text-xs hover:bg-zinc-400/25"
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
            <div className="flex min-w-50 flex-col gap-2">
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-xl bg-zinc-400/10 p-2 text-sm outline-none"
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
              <div className="flex items-center justify-between">
                <p className="text-xs opacity-50">Ctrl+Enter এ পাঠান</p>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setEditing(false)} className="rounded-xl px-2 py-1 text-xs hover:bg-zinc-400/25">
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
                    className="rounded-xl bg-zinc-400/25 px-2 py-1 text-xs hover:bg-zinc-400/25"
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
