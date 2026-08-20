"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown, Share2 } from "lucide-react";

interface Props {
  itemId: number;
  initialLike: number;
  initialDislike: number;
  hasLike: boolean;
  hasDislike: boolean;
  shareTitle: string;
}

export default function InteractiveActions({
  itemId,
  initialLike,
  initialDislike,
  hasLike,
  hasDislike,
  shareTitle,
}: Props) {
  const [likeCount, setLikeCount] = useState(initialLike);
  const [dislikeCount, setDislikeCount] = useState(initialDislike);
  const [liked, setLiked] = useState(hasLike);
  const [disliked, setDisliked] = useState(hasDislike);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const react = async (type: "like" | "dislike") => {
    setLoading(true);
    setMessage(null);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!baseUrl) {
        setMessage("API URL কনফিগার করা নেই");
        return;
      }

      const res = await fetch(`${baseUrl}/api/signs/${itemId}/react`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ type }),
      });

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
      }
    } catch (e: any) {
      setMessage(
        e.message?.includes("Failed to fetch")
          ? "সার্ভারে সংযোগ করা যাচ্ছে না।"
          : "রিয়্যাকশন ব্যর্থ হয়েছে।"
      );
    } finally {
      setLoading(false);
    }
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: shareTitle, url });
      } else {
        await navigator.clipboard.writeText(url);
        setMessage("লিংক কপি করা হয়েছে!");
        setTimeout(() => setMessage(null), 2000);
      }
    } catch {}
  };

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => react("like")}
            disabled={loading}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition disabled:opacity-50 ${
              liked
                ? "text-blue-600 bg-blue-50 dark:bg-blue-900/30"
                : "text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            <ThumbsUp className="w-4 h-4" /> {likeCount}
          </button>
          <button
            onClick={() => react("dislike")}
            disabled={loading}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition disabled:opacity-50 ${
              disliked
                ? "text-red-600 bg-red-50 dark:bg-red-900/30"
                : "text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            <ThumbsDown className="w-4 h-4" /> {dislikeCount}
          </button>
        </div>
        <button
          onClick={share}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <Share2 className="w-4 h-4" /> শেয়ার
        </button>
      </div>
      {message && (
        <p
          className={`text-xs px-3 py-2 rounded-lg ${
            message.includes("লগইন") || message.includes("ব্যর্থ") || message.includes("সংযোগ")
              ? "bg-red-50 text-red-600"
              : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}