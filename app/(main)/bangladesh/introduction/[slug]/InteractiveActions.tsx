"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ThumbsUp, ThumbsDown, Share2 } from "lucide-react";
import { getAuthHeaders, isLoggedIn } from "@/lib/auth";

type Reactions = {
  like_count: number;
  dislike_count: number;
  user_has_liked: boolean;
  user_has_disliked: boolean;
};

type Props = {
  introId: number;
  initialData: {
    reactions: Reactions;
    title: string;
    slug: string;
  };
};

export default function InteractiveActions({ introId, initialData }: Props) {
  const router = useRouter();
  const [reactions, setReactions] = useState<Reactions>({
    like_count: initialData.reactions?.like_count ?? 0,
    dislike_count: initialData.reactions?.dislike_count ?? 0,
    user_has_liked: initialData.reactions?.user_has_liked ?? false,
    user_has_disliked: initialData.reactions?.user_has_disliked ?? false,
  });
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);

  // পেজ লোডে ইউজারের আসল reaction status আনো
  useEffect(() => {
    let cancelled = false;

    async function fetchUserReaction() {
      if (!isLoggedIn()) {
        if (!cancelled) setStatusLoading(false);
        return;
      }

      try {
        const res = await fetch(
              `/api/backend/intro-bd/${introId}/reaction-status`,
          {
            headers: {
              ...getAuthHeaders(),
              Accept: "application/json",
            },
          },
        );

        if (res.ok && !cancelled) {
          const data = await res.json();
          setReactions((prev) => ({
            ...prev,
            user_has_liked:
              data.has_like ?? data.user_has_liked ?? prev.user_has_liked,
            user_has_disliked:
              data.has_dislike ??
              data.user_has_disliked ??
              prev.user_has_disliked,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch reaction status", error);
      } finally {
        if (!cancelled) setStatusLoading(false);
      }
    }

    fetchUserReaction();

    return () => {
      cancelled = true;
    };
  }, [introId]);

  // initialData বদলালে (router.refresh এর পর) state আপডেট
  useEffect(() => {
    setReactions({
      like_count: initialData.reactions?.like_count ?? 0,
      dislike_count: initialData.reactions?.dislike_count ?? 0,
      user_has_liked: initialData.reactions?.user_has_liked ?? false,
      user_has_disliked: initialData.reactions?.user_has_disliked ?? false,
    });
  }, [initialData.reactions]);

  const handleReact = async (type: "like" | "dislike") => {
    if (!isLoggedIn()) {
      alert("রিয়্যাকশন দিতে লগইন করতে হবে");
      window.location.href = "/login";
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/backend/intro-bd/${introId}/react`, {
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

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.message || "রিয়্যাকশন দিতে সমস্যা হয়েছে");
        return;
      }

      const json = await res.json();

      setReactions({
        like_count: json.like_count ?? json.reactions?.like_count ?? 0,
        dislike_count: json.dislike_count ?? json.reactions?.dislike_count ?? 0,
        user_has_liked:
          json.has_like ?? json.reactions?.user_has_liked ?? false,
        user_has_disliked:
          json.has_dislike ?? json.reactions?.user_has_disliked ?? false,
      });

      // Server Component data refresh → reload-এও count ঠিক থাকবে
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("কিছু সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/bangladesh/introduction/${initialData.slug}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: initialData.title,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert("লিংক কপি করা হয়েছে!");
      }
    } catch {
      // user cancelled share
    }
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => handleReact("like")}
          disabled={loading || statusLoading}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm   disabled:opacity-50 ${
            reactions.user_has_liked
              ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
              : "bg-zinc-400/10  hover:bg-zinc-800 hover:bg-zinc-700"
          }`}
        >
          <ThumbsUp className="w-4 h-4" />
          {reactions.like_count}
        </button>

        <button
          type="button"
          onClick={() => handleReact("dislike")}
          disabled={loading || statusLoading}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm   disabled:opacity-50 ${
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
        type="button"
        onClick={handleShare}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm  bg-zinc-400/10  hover:bg-zinc-800 hover:bg-zinc-700 "
      >
        <Share2 className="w-4 h-4" />
        শেয়ার
      </button>
    </div>
  );
}
