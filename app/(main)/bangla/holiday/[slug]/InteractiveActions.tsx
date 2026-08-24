"use client";

import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown, Share2 } from "lucide-react";
import { getAuthHeaders, isLoggedIn } from "@/lib/auth";

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
  const [statusLoading, setStatusLoading] = useState(true);

  // পেজ রিলোড হলে ইউজারের আসল রিয়্যাকশন স্ট্যাটাস আনো
  // পেজ রিলোড হলে ইউজারের আসল রিয়্যাকশন স্ট্যাটাস আনো
  useEffect(() => {
    async function fetchUserReaction() {
      if (!isLoggedIn()) {
        setStatusLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `/api/backend/holidays/${holidayId}/reaction-status`,
          {
            headers: getAuthHeaders(),
          },
        );

        if (res.ok) {
          const data = await res.json();
          setReactions((prev) => ({
            ...prev,
            user_has_liked: data.has_like ?? data.user_has_liked ?? false,
            user_has_disliked:
              data.has_dislike ?? data.user_has_disliked ?? false,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch reaction status", error);
      } finally {
        setStatusLoading(false);
      }
    }

    fetchUserReaction();
  }, [holidayId]);

  const handleReact = async (type: "like" | "dislike") => {
    if (!isLoggedIn()) {
      alert("রিয়্যাকশন দিতে লগইন করতে হবে");
      window.location.href = "/login";
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `/api/backend/holidays/${holidayId}/react`,
        {
          method: "POST",
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ type }),
        },
      );

      if (res.status === 401) {
        alert("সেশন শেষ হয়ে গেছে। আবার লগইন করুন।");
        window.location.href = "/login";
        return;
      }

      const json = await res.json();

      if (json.success || json.like_count !== undefined) {
        setReactions({
          like_count: json.like_count ?? json.reactions?.like_count ?? 0,
          dislike_count:
            json.dislike_count ?? json.reactions?.dislike_count ?? 0,
          user_has_liked:
            json.has_like ?? json.reactions?.user_has_liked ?? false,
          user_has_disliked:
            json.has_dislike ?? json.reactions?.user_has_disliked ?? false,
        });
      } else {
        alert(json.message || "রিয়্যাকশন দিতে সমস্যা হয়েছে");
      }
    } catch (err) {
      console.error(err);
      alert("কিছু সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/bangla/holiday/${initialData.slug}`;

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
      <div className="flex gap-4">
        <button
          onClick={() => handleReact("like")}
          disabled={loading || statusLoading}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm  
            ${
              reactions.user_has_liked
                ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                : "bg-zinc-400/10  hover:bg-zinc-800 hover:bg-zinc-700"
            }`}
        >
          <ThumbsUp className="w-4 h-4" />
          {reactions.like_count}
        </button>

        <button
          onClick={() => handleReact("dislike")}
          disabled={loading || statusLoading}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm  
            ${
              reactions.user_has_disliked
                ? "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                : "bg-zinc-400/10  hover:bg-zinc-800 hover:bg-zinc-700"
            }`}
        >
          <ThumbsDown className="w-4 h-4" />
          {reactions.dislike_count}
        </button>
      </div>

      <button
        onClick={handleShare}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm  bg-zinc-400/10  hover:bg-zinc-800 hover:bg-zinc-700 "
      >
        <Share2 className="w-4 h-4" />
        শেয়ার
      </button>
    </div>
  );
}
