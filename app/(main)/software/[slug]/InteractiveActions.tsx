"use client";

import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown, Share2 } from "lucide-react";
import { getAuthHeaders, isLoggedIn } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

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
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true);

  // পেজ লোড হওয়ার পর ইউজারের আসল রিয়্যাকশন স্ট্যাটাস আনো
  useEffect(() => {
    async function fetchUserReaction() {
      if (!isLoggedIn()) {
        setLoadingStatus(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/apps/${appId}/reaction-status`, {
          headers: getAuthHeaders(),
        });

        if (res.ok) {
          const data = await res.json();
          setLiked(data.has_like);
          setDisliked(data.has_dislike);
        }
      } catch (error) {
        console.error("Failed to fetch reaction status", error);
      } finally {
        setLoadingStatus(false);
      }
    }

    fetchUserReaction();
  }, [appId]);

  const react = async (type: "like" | "dislike") => {
    if (!isLoggedIn()) {
      alert("রিয়্যাকশন করার জন্য লগইন করতে হবে।");
      window.location.href = "/login";
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/apps/${appId}/react`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ type }),
      });

      if (res.status === 401) {
        alert("সেশন শেষ হয়ে গেছে। আবার লগইন করুন।");
        localStorage.removeItem("auth_token");
        window.location.href = "/login";
        return;
      }

      if (!res.ok) throw new Error("Failed");

      const data = await res.json();
      setLikes(data.like_count);
      setDislikes(data.dislike_count);
      setLiked(data.has_like);
      setDisliked(data.has_dislike);
    } catch (error) {
      console.error(error);
      alert("রিয়্যাকশন ব্যর্থ হয়েছে");
    }
  };

  const share = () => {
    const url = `${window.location.origin}/software/${initialData.slug}`;
    if (navigator.share) {
      navigator.share({ title: initialData.title, url });
    } else {
      navigator.clipboard.writeText(url);
      alert("লিংক কপি করা হয়েছে");
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-3">
        <button
          onClick={() => react("like")}
          disabled={loadingStatus}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            liked
              ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
          }`}
        >
          <ThumbsUp className="w-4 h-4" />
          {likes}
        </button>

        <button
          onClick={() => react("dislike")}
          disabled={loadingStatus}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            disliked
              ? "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
          }`}
        >
          <ThumbsDown className="w-4 h-4" />
          {dislikes}
        </button>
      </div>

      <button
        onClick={share}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
      >
        <Share2 className="w-4 h-4" />
        শেয়ার
      </button>
    </div>
  );
}