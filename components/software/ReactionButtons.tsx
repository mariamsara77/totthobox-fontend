"use client";

import { useState } from "react";
import { reactToApp } from "@/lib/app-resource";

interface Props {
  slug: string;
  likeCount: number;
  dislikeCount: number;
  userLiked?: boolean;
  userDisliked?: boolean;
}

export default function ReactionButtons({
  slug,
  likeCount: initialLike,
  dislikeCount: initialDislike,
  userLiked: initialLiked = false,
  userDisliked: initialDisliked = false,
}: Props) {
  const [likeCount, setLikeCount] = useState(initialLike);
  const [dislikeCount, setDislikeCount] = useState(initialDislike);
  const [userLiked, setUserLiked] = useState(initialLiked);
  const [userDisliked, setUserDisliked] = useState(initialDisliked);

  const handleReact = async (type: "like" | "dislike") => {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      alert("রিয়্যাকশন করতে লগইন করুন");
      return;
    }

    try {
      const data = await reactToApp(slug, type, token);
      setLikeCount(data.like_count);
      setDislikeCount(data.dislike_count);
      setUserLiked(data.user_liked);
      setUserDisliked(data.user_disliked);
    } catch {
      alert("রিয়্যাকশন করতে সমস্যা হয়েছে");
    }
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={() => handleReact("like")}
        className={`px-3 py-1.5 rounded-lg text-sm border transition ${
          userLiked
            ? "text-blue-600 border-blue-600"
            : "border-zinc-300 dark:border-zinc-600"
        }`}
      >
        👍 {likeCount}
      </button>

      <button
        onClick={() => handleReact("dislike")}
        className={`px-3 py-1.5 rounded-lg text-sm border transition ${
          userDisliked
            ? "text-red-600 border-red-600"
            : "border-zinc-300 dark:border-zinc-600"
        }`}
      >
        👎 {dislikeCount}
      </button>
    </div>
  );
}