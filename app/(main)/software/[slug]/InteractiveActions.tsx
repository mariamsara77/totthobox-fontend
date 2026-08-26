"use client";

import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown, Share2 } from "lucide-react";
import { getAuthHeaders, isLoggedIn } from "@/lib/auth";

const actionClass =
  "inline-flex items-center gap-2 p-4 rounded-xl border border-zinc-400/25 bg-zinc-400/10 hover:bg-zinc-400/25 disabled:opacity-50";

export default function InteractiveActions({
  appId,
  initialData,
}: {
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
}) {
  const [likes, setLikes] = useState(initialData.reactions.like_count);
  const [dislikes, setDislikes] = useState(initialData.reactions.dislike_count);
  const [liked, setLiked] = useState(initialData.reactions.user_has_liked);
  const [disliked, setDisliked] = useState(initialData.reactions.user_has_disliked);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchUserReaction() {
      if (!isLoggedIn()) {
        if (!cancelled) setLoadingStatus(false);
        return;
      }

      try {
        const res = await fetch(`/api/backend/apps/${appId}/reaction-status`, {
          headers: { ...getAuthHeaders(), Accept: "application/json" },
        });

        if (res.ok && !cancelled) {
          const data = await res.json();
          setLiked(data.has_like ?? false);
          setDisliked(data.has_dislike ?? false);
        }
      } catch (error) {
        console.error("Failed to fetch reaction status", error);
      } finally {
        if (!cancelled) setLoadingStatus(false);
      }
    }

    fetchUserReaction();
    return () => {
      cancelled = true;
    };
  }, [appId]);

  const react = async (type: "like" | "dislike") => {
    if (!isLoggedIn()) {
      alert("রিয়্যাকশন করার জন্য লগইন করতে হবে।");
      window.location.href = "/login";
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/backend/apps/${appId}/react`, {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ type }),
      });

      if (res.status === 401) {
        alert("সেশন শেষ হয়ে গেছে। আবার লগইন করুন।");
        window.location.href = "/login";
        return;
      }

      if (!res.ok) throw new Error("Failed");

      const data = await res.json();
      setLikes(data.like_count ?? 0);
      setDislikes(data.dislike_count ?? 0);
      setLiked(data.has_like ?? false);
      setDisliked(data.has_dislike ?? false);
    } catch (error) {
      console.error(error);
      alert("রিয়্যাকশন ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const share = async () => {
    const url = `${window.location.origin}/software/${initialData.slug}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: initialData.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        alert("লিংক কপি করা হয়েছে");
      }
    } catch {
      // cancelled
    }
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => react("like")}
          disabled={loadingStatus || loading}
          className={actionClass}
        >
          <ThumbsUp className="w-4 h-4" />
          {likes}
        </button>

        <button
          type="button"
          onClick={() => react("dislike")}
          disabled={loadingStatus || loading}
          className={actionClass}
        >
          <ThumbsDown className="w-4 h-4" />
          {dislikes}
        </button>
      </div>

      <button type="button" onClick={share} className={actionClass}>
        <Share2 className="w-4 h-4" />
        শেয়ার
      </button>
    </div>
  );
}
