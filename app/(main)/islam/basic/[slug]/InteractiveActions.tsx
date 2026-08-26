"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown, Share2 } from "lucide-react";

interface Props {
  itemId: number; // ← slug না, id
  initialLike: number;
  initialDislike: number;
  hasLike: boolean;
  hasDislike: boolean;
}

export default function InteractiveActions({
  itemId,
  initialLike,
  initialDislike,
  hasLike,
  hasDislike,
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
      const res = await fetch(`/api/backend/islam/basic/${itemId}/react`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include", // Sanctum cookie
        body: JSON.stringify({ type }),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        const text = await res.text();
        console.error("Non-JSON:", text.slice(0, 200));
        throw new Error("Server JSON দেয়নি");
      }

      const json = await res.json();

      // Livewire-এর মতো: লগইন না থাকলে
      if (res.status === 401) {
        setMessage(json.message || "রিয়্যাকশন করার জন্য লগইন করতে হবে।");
        // এখানে আপনার auth modal খুলুন
        // window.dispatchEvent(new CustomEvent("open-auth-modal"));
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
      console.error("React error:", e);
      setMessage(
        e.message?.includes("Failed to fetch")
          ? "সার্ভারে সংযোগ করা যাচ্ছে না। CORS চেক করুন।"
          : "রিয়্যাকশন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।",
      );
    } finally {
      setLoading(false);
    }
  };

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: document.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setMessage("লিংক কপি করা হয়েছে!");
        setTimeout(() => setMessage(null), 2000);
      }
    } catch {
      // user cancelled
    }
  };

  return (
    <div className="space-y-4 pt-4 border-t border-zinc-400/25 dark:border-zinc-400/25">
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-4">
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

        <button
          onClick={share}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm  hover:bg-zinc-400/10 hover:bg-zinc-400/10"
        >
          <Share2 className="w-4 h-4" />
          শেয়ার
        </button>
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
