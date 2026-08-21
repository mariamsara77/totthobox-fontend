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
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!baseUrl) {
        setMessage("API URL কনফিগার করা নেই");
        return;
      }

      const res = await fetch(`${baseUrl}/api/islam/dowan/${itemId}/react`, {
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
          : "রিয়্যাকশন ব্যর্থ হয়েছে।"
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
    <div className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-700">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            onClick={() => react("like")}
            disabled={loading}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition disabled:opacity-50 ${
              liked
                ? "text-blue-600 bg-blue-50 dark:bg-blue-900/30"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            {likeCount}
          </button>
          <button
            onClick={() => react("dislike")}
            disabled={loading}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition disabled:opacity-50 ${
              disliked
                ? "text-red-600 bg-red-50 dark:bg-red-900/30"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            <ThumbsDown className="w-4 h-4" />
            {dislikeCount}
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={copyText}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition ${
              copied
                ? "text-emerald-600"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <Share2 className="w-4 h-4" /> শেয়ার
          </button>
        </div>
      </div>

      {message && (
        <p
          className={`text-xs px-3 py-2 rounded-lg ${
            message.includes("লগইন") ||
            message.includes("ব্যর্থ") ||
            message.includes("সংযোগ")
              ? "bg-red-50 text-red-600 dark:bg-red-900/20"
              : "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}