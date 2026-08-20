"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown, Share2 } from "lucide-react";

type Props = {
  holidayId: number;
  initialData: {
    reactions: {
      like_count: number;
      dislike_count: number;
      user_has_liked: boolean;
      user_has_disliked: boolean;
    };
    title: string;
    slug: string;
  };
};

export default function InteractiveActions({ holidayId, initialData }: Props) {
  const [reactions, setReactions] = useState(initialData.reactions);
  const [loading, setLoading] = useState(false);

  const handleReact = async (type: "like" | "dislike") => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || "https://totthobox.com"}/api/holidays/${holidayId}/react`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // যদি auth token থাকে
            // Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ type }),
        }
      );

      const json = await res.json();

      if (json.success) {
        setReactions(json.reactions);
      } else {
        alert(json.message || "রিয়্যাকশন দিতে লগইন করতে হবে");
      }
    } catch (err) {
      console.error(err);
      alert("কিছু সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/holidays/${initialData.slug}`;

    if (navigator.share) {
      await navigator.share({
        title: initialData.title,
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      alert("লিংক কপি করা হয়েছে!");
    }
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex gap-3">
        <button
          onClick={() => handleReact("like")}
          disabled={loading}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
            ${
              reactions.user_has_liked
                ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
        >
          <ThumbsUp className="w-4 h-4" />
          {reactions.like_count}
        </button>

        <button
          onClick={() => handleReact("dislike")}
          disabled={loading}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
            ${
              reactions.user_has_disliked
                ? "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
        >
          <ThumbsDown className="w-4 h-4" />
          {reactions.dislike_count}
        </button>
      </div>

      <button
        onClick={handleShare}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
      >
        <Share2 className="w-4 h-4" />
        শেয়ার
      </button>
    </div>
  );
}