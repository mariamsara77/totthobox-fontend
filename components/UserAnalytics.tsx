"use client";

import { useEffect, useState } from "react";

const FALLBACK_TOTAL_USERS = "113.29k";
const ANALYTICS_URL =
  "https://admin.totthobox.com/api/analytics/user-count";

type AnalyticsResponse = {
  status?: unknown;
  data?: {
    total?: unknown;
  };
};

function getValidTotal(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const total = value.trim();
  return total ? total : null;
}

function isAnalyticsResponse(value: unknown): value is AnalyticsResponse {
  return typeof value === "object" && value !== null;
}

export default function UserAnalytics() {
  const [totalUsers, setTotalUsers] = useState(FALLBACK_TOTAL_USERS);

  useEffect(() => {
    const controller = new AbortController();

    const loadAnalytics = async () => {
      try {
        const response = await fetch(ANALYTICS_URL, {
          headers: { Accept: "application/json" },
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) return;

        const payload: unknown = await response.json();
        if (!isAnalyticsResponse(payload)) return;

        const total = getValidTotal(payload.data?.total);
        if (payload.status === "success" && total) {
          setTotalUsers(total);
        }
      } catch {
        // Keep the existing fallback when the public analytics endpoint is unavailable.
      }
    };

    void loadAnalytics();

    return () => controller.abort();
  }, []);

  return (
    <div className="flex items-center justify-center py-2">
      <div className="flex items-center gap-4 rounded-full border border-zinc-400/25 px-4 py-2">
        <span className="relative flex">
          <span className="absolute h-full w-full animate-ping rounded-full bg-zinc-700 opacity-75" />
          <span className="relative size-2 rounded-full bg-zinc-900 dark:bg-zinc-100" />
        </span>
        <p className="text-sm">
          প্ল্যাটফর্মটি ব্যবহার করেছেন{" "}
          <span className="text-base font-semibold">{totalUsers}+</span>{" "}
          জন মানুষ
        </p>
      </div>
    </div>
  );
}
