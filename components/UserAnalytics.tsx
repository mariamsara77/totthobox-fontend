"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

type AnalyticsResponse = {
  status?: string;
  total_users?: number | string;
};

export default function UserAnalytics() {
  const [totalUsers, setTotalUsers] = useState("113.29k");

  useEffect(() => {
    const controller = new AbortController();

    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/analytics/user-count`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) return;

        const data = (await response.json()) as AnalyticsResponse;
        if (data.status === "success" && data.total_users !== undefined) {
          setTotalUsers(String(data.total_users));
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    };

    void fetchAnalytics();

    return () => controller.abort();
  }, []);

  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center gap-2 rounded-xl border border-zinc-400/25 bg-zinc-400/10 p-4">
        <span className="h-2 w-2 rounded-full bg-zinc-400" aria-hidden="true" />
        <p className="text-sm">
          প্ল্যাটফর্মটি ব্যবহার করেছেন <span className="font-medium">{totalUsers}+</span> জন মানুষ
        </p>
      </div>
    </div>
  );
}
