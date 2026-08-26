"use client";

import { useEffect, useState } from "react";

export default function UserAnalytics() {
  const [totalUsers, setTotalUsers] = useState("113.29k");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";
        const response = await fetch(`${baseUrl}/api/analytics/user-count`, { cache: "no-store" });

        if (!response.ok) return;

        const data = await response.json();
        if (data.status === "success" && data.total_users) {
          setTotalUsers(String(data.total_users));
        }
      } catch {
        // Keep the lightweight fallback when analytics is unavailable.
      }
    };

    void fetchAnalytics();
  }, []);

  return (
    <div className="flex items-center justify-center py-2">
      <div className="flex items-center gap-3 rounded-2xl border border-zinc-400/25 bg-zinc-400/10 px-3 py-2">
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span className="absolute h-full w-full animate-ping rounded-full bg-zinc-400 opacity-50" />
          <span className="relative h-2 w-2 rounded-full bg-zinc-400" />
        </span>
        <p className="text-sm">
          প্ল্যাটফর্মটি ব্যবহার করেছেন <span className="font-medium">{totalUsers}+</span> জন মানুষ
        </p>
      </div>
    </div>
  );
}
