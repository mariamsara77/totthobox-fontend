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
import type { ChatMessage } from "./ChatPanel";
import { useAuth } from "@/context/AuthContext"; // AuthContext ইম্পোর্ট করা হয়েছে

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
  // হুক থেকে ভ্যালু নেওয়া হচ্ছে
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
    <div
      className={`flex group ${isUser ? "justify-end" : "justify-start"} ai-msg-pop`}
    >
      {!isUser && (
        <div className="flex items-start pt-3 pr-2 shrink-0">
          <div className="p-1.5 rounded-lg bg-zinc-9000/10">
            <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
          </div>
        </div>
      )}

      <div className="max-w-[90%] md:max-w-[78%] lg:max-w-[70%] relative">
        {/* Edit (user, auth only) */}
        {isUser && !isGuest && typeof msg.id === "number" && (
          <button
            type="button"
            onClick={() => {
              setNewContent(msg.content);
              setEditing(true);
            }}
            className="absolute -left-8 top-3 p-1  opacity-0 group-hover:opacity-100 rounded-md hover:bg-zinc-700 "
            title="সম্পাদনা"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
        )}

        <div
          className={`mb-4 ${
            isUser
              ? "bg-zinc-400/10 px-4 py-2.5 rounded-2xl rounded-tr-md "
              : "py-1"
          }`}
        >
          {!editing ? (
            <>
              {msg.image_path && (
                <div className="mb-2">
                  <img
                    src={msg.image_path}
                    alt="uploaded"
                    className="max-h-48 rounded-xl object-cover border border-zinc-700"
                  />
                </div>
              )}

              {isUser ? (
                <div className="relative text-sm leading-relaxed">
                  {collapsed && isLong ? (
                    <div className="flex items-center gap-2">
                      <p className="truncate max-w-[calc(100%-1.75rem)]">
                        {msg.content}
                      </p>
                      <button
                        type="button"
                        onClick={() => setCollapsed(false)}
                        className="shrink-0 p-0.5 rounded-full  hover:bg-zinc-400/25 "
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      {isLong && (
                        <div className="flex justify-end mb-1">
                          <button
                            type="button"
                            onClick={() => setCollapsed(true)}
                            className="p-0.5 rounded-full  hover:bg-zinc-400/25 "
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
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
                  <div className="flex items-center gap-1 pt-2 mt-1 border-t border-zinc-700/50 opacity-0 group-hover:opacity-100 transition">
                    <button
                      type="button"
                      onClick={copy}
                      className="flex items-center gap-2 px-2 py-1 text-xs  hover:bg-zinc-400/25/50 rounded-lg "
                    >
                      {copied ? (
                        <Check className="wx-4 py-2" />
                      ) : (
                        <Clipboard className="wx-4 py-2" />
                      )}
                      <span>{copied ? "কপি হয়েছে" : "কপি"}</span>
                    </button>
                    {isLastAi && (
                      <button
                        type="button"
                        onClick={onRegenerate}
                        className="flex items-center gap-2 px-2 py-1 text-xs  hover:bg-zinc-400/25/50 rounded-lg "
                      >
                        <RotateCcw className="wx-4 py-2" />
                        পুনরায় তৈরি
                      </button>
                    )}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex flex-col gap-2 min-w-50">
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={3}
                className="w-full text-sm bg-zinc-400/10 rounded-lg p-2 outline-none resize-none"
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
              <div className="flex justify-between items-center">
                <p className="text-xs ">Ctrl+Enter এ পাঠান</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="text-xs px-2 py-1 rounded-lg"
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
                    className="text-xs px-2 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 "
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
