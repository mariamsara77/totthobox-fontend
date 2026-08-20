"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown, Share2 } from "lucide-react";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://totthobox.com").replace(/\/$/, "");

type Reactions = {
  like_count: number;
  dislike_count: number;
  user_has_liked: boolean;
  user_has_disliked: boolean;
};

type Props = {
  /** API endpoint base, e.g. "intro-bd" or "holidays" */
  resource: "intro-bd" | "holidays";
  itemId: number;
  initialData: {
    reactions: Reactions;
    title: string;
    slug: string;
  };
  /** Optional share URL path prefix */
  sharePath?: string; // e.g. "/bangladesh/introduction"
};

export default function InteractiveActions({
  resource,
  itemId,
  initialData,
  sharePath = "",
}: Props) {
  const [reactions, setReactions] = useState<Reactions>(initialData.reactions);
  const [loading, setLoading] = useState(false);

  const handleReact = async (type: "like" | "dislike") => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/${resource}/${itemId}/react`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ type }),
        credentials: "include",
      });

      if (res.status === 401) {
        alert("রিয়্যাকশন করার জন্য লগইন করতে হবে।");
        return;
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("React failed:", res.status, err);
        alert("রিয়্যাকশন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
        return;
      }

      const data = await res.json();

      // Holiday + IntroBd উভয় response shape সাপোর্ট
      setReactions({
        like_count: data.like_count ?? data.reactions?.like_count ?? 0,
        dislike_count: data.dislike_count ?? data.reactions?.dislike_count ?? 0,
        user_has_liked:
          data.has_like ?? data.reactions?.user_has_liked ?? false,
        user_has_disliked:
          data.has_dislike ?? data.reactions?.user_has_disliked ?? false,
      });
    } catch (error) {
      console.error("Network error:", error);
      alert(
        "সার্ভারে সংযোগ করা যাচ্ছে না। CORS বা API URL চেক করুন।"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const url =
      typeof window !== "undefined"
        ? window.location.href
        : `${sharePath}/${initialData.slug}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: initialData.title,
          url,
        });
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert("লিংক কপি হয়েছে!");
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handleReact("like")}
          disabled={loading}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-zinc-400/25 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 ${
            reactions.user_has_liked
              ? "text-blue-600 border-blue-300 dark:border-blue-700"
              : "text-zinc-600 dark:text-zinc-400"
          }`}
        >
          <ThumbsUp className="w-4 h-4" />
          {reactions.like_count}
        </button>

        <button
          type="button"
          onClick={() => handleReact("dislike")}
          disabled={loading}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-zinc-400/25 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 ${
            reactions.user_has_disliked
              ? "text-red-600 border-red-300 dark:border-red-700"
              : "text-zinc-600 dark:text-zinc-400"
          }`}
        >
          <ThumbsDown className="w-4 h-4" />
          {reactions.dislike_count}
        </button>
      </div>

      <button
        type="button"
        onClick={handleShare}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-zinc-400/25 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
      >
        <Share2 className="w-4 h-4" />
        শেয়ার
      </button>
    </div>
  );
}