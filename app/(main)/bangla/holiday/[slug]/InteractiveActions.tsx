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

const actionClass =
  "inline-flex items-center gap-2 rounded-xl border border-zinc-400/25 bg-zinc-400/10 p-4 hover:bg-zinc-400/25 disabled:opacity-50";

export default function InteractiveActions({ holidayId, initialData }: Props) {
  const [reactions, setReactions] = useState(initialData.reactions);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);

  useEffect(() => {
    async function fetchUserReaction() {
      if (!isLoggedIn()) {
        setStatusLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/backend/holidays/${holidayId}/reaction-status`, {
          headers: getAuthHeaders(),
        });

        if (res.ok) {
          const data = await res.json();
          setReactions((prev) => ({
            ...prev,
            user_has_liked: data.has_like ?? data.user_has_liked ?? false,
            user_has_disliked: data.has_dislike ?? data.user_has_disliked ?? false,
          }));
        }
      } catch {
        // Keep server-provided initial state when the optional refresh fails.
      } finally {
        setStatusLoading(false);
      }
    }

    void fetchUserReaction();
  }, [holidayId]);

  const handleReact = async (type: "like" | "dislike") => {
    if (!isLoggedIn()) {
      window.location.href = "/login";
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/backend/holidays/${holidayId}/react`, {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ type }),
      });

      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }

      const json = await res.json();

      if (json.success || json.like_count !== undefined) {
        setReactions({
          like_count: json.like_count ?? json.reactions?.like_count ?? 0,
          dislike_count: json.dislike_count ?? json.reactions?.dislike_count ?? 0,
          user_has_liked: json.has_like ?? json.reactions?.user_has_liked ?? false,
          user_has_disliked: json.has_dislike ?? json.reactions?.user_has_disliked ?? false,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/bangla/holiday/${initialData.slug}`;

    if (navigator.share) {
      await navigator.share({ title: initialData.title, url });
      return;
    }

    await navigator.clipboard.writeText(url);
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => handleReact("like")}
          disabled={loading || statusLoading}
          className={`${actionClass} ${reactions.user_has_liked ? "bg-zinc-400/25" : ""}`}
          aria-pressed={reactions.user_has_liked}
        >
          <ThumbsUp className="h-4 w-4" />
          {reactions.like_count}
        </button>

        <button
          type="button"
          onClick={() => handleReact("dislike")}
          disabled={loading || statusLoading}
          className={`${actionClass} ${reactions.user_has_disliked ? "bg-zinc-400/25" : ""}`}
          aria-pressed={reactions.user_has_disliked}
        >
          <ThumbsDown className="h-4 w-4" />
          {reactions.dislike_count}
        </button>
      </div>

      <button type="button" onClick={handleShare} className={actionClass}>
        <Share2 className="h-4 w-4" />
        শেয়ার
      </button>
    </div>
  );
}
