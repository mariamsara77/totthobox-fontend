"use client";

import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown, Share2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type Props = {
  personId: number;
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

export default function InteractiveActions({ personId, initialData }: Props) {
  const { isLoggedIn, isLoading: authLoading } = useAuth();

  const [likeCount, setLikeCount] = useState(initialData.reactions.like_count);
  const [dislikeCount, setDislikeCount] = useState(
    initialData.reactions.dislike_count,
  );
  const [userHasLiked, setUserHasLiked] = useState(false);
  const [userHasDisliked, setUserHasDisliked] = useState(false);
  const [loading, setLoading] = useState(false);

  // লগইন থাকলে শুধুমাত্র user-এর reaction status আনা
  useEffect(() => {
    if (authLoading || !isLoggedIn) return;

    const fetchStatus = async () => {
      try {
        const res = await fetch(
          `/api/backend/people/${personId}/reaction-status`,
          {
            credentials: "include",
          },
        );

        if (res.ok) {
          const data = await res.json();
          setUserHasLiked(data.user_has_liked ?? data.has_like ?? false);
          setUserHasDisliked(
            data.user_has_disliked ?? data.has_dislike ?? false,
          );

          if (typeof data.like_count === "number")
            setLikeCount(data.like_count);
          if (typeof data.dislike_count === "number")
            setDislikeCount(data.dislike_count);
        }
      } catch (err) {
        console.error("Reaction status fetch failed", err);
      }
    };

    fetchStatus();
  }, [personId, isLoggedIn, authLoading]);

  const handleReact = async (type: "like" | "dislike") => {
    if (!isLoggedIn) {
      alert("রিয়্যাকশন দিতে লগইন করতে হবে");
      window.location.href = "/login";
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/backend/people/${personId}/react`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ type }),
      });

      if (res.status === 401) {
        alert("সেশন শেষ হয়ে গেছে। আবার লগইন করুন।");
        window.location.href = "/login";
        return;
      }

      const data = await res.json();

      if (res.ok && (data.success || data.like_count !== undefined)) {
        setLikeCount(data.like_count);
        setDislikeCount(data.dislike_count);
        setUserHasLiked(data.user_has_liked ?? data.has_like ?? false);
        setUserHasDisliked(data.user_has_disliked ?? data.has_dislike ?? false);
      } else {
        alert(data.message || "রিয়্যাকশন দিতে সমস্যা হয়েছে");
      }
    } catch (err) {
      console.error(err);
      alert("কিছু সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/bangladesh/public-figure/${initialData.slug}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: initialData.title, url });
      } catch {
        // user cancel করলে ignore
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert("লিংক কপি করা হয়েছে!");
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 pt-4 border-t border-zinc-400/25">
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => handleReact("like")}
          disabled={loading}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm disabled:opacity-50 ${
            userHasLiked
              ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
              : "bg-zinc-400/10 hover:bg-zinc-400/25"
          }`}
        >
          <ThumbsUp className="w-4 h-4" />
          {likeCount}
        </button>

        <button
          type="button"
          onClick={() => handleReact("dislike")}
          disabled={loading}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm disabled:opacity-50 ${
            userHasDisliked
              ? "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
              : "bg-zinc-400/10 hover:bg-zinc-400/25"
          }`}
        >
          <ThumbsDown className="w-4 h-4" />
          {dislikeCount}
        </button>
      </div>

      <button
        type="button"
        onClick={handleShare}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-zinc-400/10 hover:bg-zinc-400/25"
      >
        <Share2 className="w-4 h-4" />
        শেয়ার
      </button>
    </div>
  );
}
