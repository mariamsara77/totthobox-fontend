"use client";

import { useEffect, useState } from "react";
import { ThumbsUp, ThumbsDown, Share2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useAuthModal } from "@/context/AuthModalContext";

type Props = {
  appId: number;
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

export default function InteractiveActions({ appId, initialData }: Props) {
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const { requireAuth } = useAuthModal();

  const [likeCount, setLikeCount] = useState(initialData.reactions.like_count);

  const [dislikeCount, setDislikeCount] = useState(
    initialData.reactions.dislike_count,
  );

  const [userHasLiked, setUserHasLiked] = useState(
    initialData.reactions.user_has_liked,
  );

  const [userHasDisliked, setUserHasDisliked] = useState(
    initialData.reactions.user_has_disliked,
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authLoading || !isLoggedIn) {
      return;
    }

    let cancelled = false;

    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/backend/apps/${appId}/reaction-status`, {
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        });

        if (!res.ok || cancelled) {
          return;
        }

        const data = await res.json();

        setUserHasLiked(data.user_has_liked ?? data.has_like ?? false);

        setUserHasDisliked(data.user_has_disliked ?? data.has_dislike ?? false);

        if (typeof data.like_count === "number") {
          setLikeCount(data.like_count);
        }

        if (typeof data.dislike_count === "number") {
          setDislikeCount(data.dislike_count);
        }
      } catch (error) {
        console.error("Reaction status fetch failed:", error);
      }
    };

    fetchStatus();

    return () => {
      cancelled = true;
    };
  }, [appId, isLoggedIn, authLoading]);

  const handleReact = async (type: "like" | "dislike") => {
    if (!requireAuth(() => handleReact(type), "রিয়্যাকশন দিতে লগইন করুন।")) {
      return;
    }

    if (loading) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/backend/apps/${appId}/react`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ type }),
      });

      if (res.status === 401) {
        setLoading(false);
        requireAuth(() => handleReact(type), "সেশন শেষ হয়েছে। আবার লগইন করুন।");
        return;
      }

      const data = await res.json();

      if (res.ok && (data.success || data.like_count !== undefined)) {
        setLikeCount(data.like_count ?? 0);
        setDislikeCount(data.dislike_count ?? 0);

        setUserHasLiked(data.user_has_liked ?? data.has_like ?? false);

        setUserHasDisliked(data.user_has_disliked ?? data.has_dislike ?? false);

        return;
      }

      alert(data.message || "রিয়্যাকশন দিতে সমস্যা হয়েছে।");
    } catch (error) {
      console.error("Reaction error:", error);
      alert("কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/software/${initialData.slug}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: initialData.title,
          url,
        });
      } catch {
        // User cancelled sharing.
      }

      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      alert("লিংক কপি করা হয়েছে।");
    } catch (error) {
      console.error("Copy failed:", error);
      alert("লিংক কপি করা সম্ভব হয়নি।");
    }
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handleReact("like")}
          disabled={loading}
          aria-label="Like"
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm disabled:opacity-50 ${
            userHasLiked
              ? "bg-zinc-400/25"
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
          aria-label="Dislike"
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm disabled:opacity-50 ${
            userHasDisliked
              ? "bg-zinc-400/25"
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
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm bg-zinc-400/10 hover:bg-zinc-400/25"
      >
        <Share2 className="w-4 h-4" />
        শেয়ার
      </button>
    </div>
  );
}
