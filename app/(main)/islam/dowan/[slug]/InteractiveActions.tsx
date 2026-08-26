"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown, Share2, Copy, Check } from "lucide-react";

interface Props {
  itemId: number;
  initialLike: number;
  initialDislike: number;
  hasLike: boolean;
  hasDislike: boolean;
  shareableText: string;
  shareTitle: string;
}

export default function InteractiveActions({
  itemId,
  initialLike,
  initialDislike,
  hasLike,
  hasDislike,
  shareableText,
  shareTitle,
}: Props) {
  const [likeCount, setLikeCount] = useState(initialLike);
  const [dislikeCount, setDislikeCount] = useState(initialDislike);
  const [liked, setLiked] = useState(hasLike);
  const [disliked, setDisliked] = useState(hasDislike);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const react = async (type: "like" | "dislike") => {
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/backend/islam/dowan/${itemId}/react`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ type }),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        throw new Error("Server JSON দেয়নি");
      }

      const json = await res.json();

      if (res.status === 401) {
        setMessage(json.message || "রিয়্যাকশন করার জন্য লগইন করতে হবে।");
        return;
      }

      if (json.success) {
        setLikeCount(json.data.like_count);
        setDislikeCount(json.data.dislike_count);
        setLiked(json.data.has_like);
        setDisliked(json.data.has_dislike);
        setMessage(json.message);
        setTimeout(() => setMessage(null), 2500);
      } else {
        setMessage(json.message || "কিছু একটা ভুল হয়েছে");
      }
    } catch (e: any) {
      console.error(e);
      setMessage(
        e.message?.includes("Failed to fetch")
          ? "সার্ভারে সংযোগ করা যাচ্ছে না। CORS চেক করুন।"
          : "রিয়্যাকশন ব্যর্থ হয়েছে।",
      );
    } finally {
      setLoading(false);
    }
  };

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(shareableText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setMessage("কপি করা যায়নি");
    }
  };

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: shareTitle, text: shareableText, url });
      } else {
        await navigator.clipboard.writeText(url);
        setMessage("লিংক কপি করা হয়েছে!");
        setTimeout(() => setMessage(null), 2000);
      }
    } catch {
      // cancelled
    }
  };

  return (
    <div className="space-y-4 pt-4 border-t border-zinc-400/25 dark:border-zinc-400/25">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => react("like")}
            disabled={loading}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm transition disabled:opacity-50 ${
              liked
                ? "opacity-50 bg-zinc-400/25 dark:bg-zinc-400/25"
                : " hover:bg-zinc-400/10 hover:bg-zinc-400/10"
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            {likeCount}
          </button>
          <button
            onClick={() => react("dislike")}
            disabled={loading}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm transition disabled:opacity-50 ${
              disliked
                ? "opacity-50 bg-zinc-400/25 dark:bg-zinc-400/25"
                : " hover:bg-zinc-400/10 hover:bg-zinc-400/10"
            }`}
          >
            <ThumbsDown className="w-4 h-4" />
            {dislikeCount}
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={copyText}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm transition ${
              copied ? "text-zinc-300" : " hover:bg-zinc-400/10 hover:bg-zinc-400/10"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" /> কপি হয়েছে
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> কপি
              </>
            )}
          </button>
          <button
            onClick={share}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm  hover:bg-zinc-400/10 hover:bg-zinc-400/10"
          >
            <Share2 className="w-4 h-4" /> শেয়ার
          </button>
        </div>
      </div>

      {message && (
        <p
          className={`text-xs px-3 py-2 rounded-xl ${
            message.includes("লগইন") ||
            message.includes("ব্যর্থ") ||
            message.includes("সংযোগ")
              ? "bg-zinc-400/25 opacity-50 dark:bg-zinc-400/25"
              : "bg-zinc-400/10 text-zinc-200 dark:bg-emerald-900/20"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
