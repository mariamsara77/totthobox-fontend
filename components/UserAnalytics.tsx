"use client";

import { useEffect, useState } from "react";

const ANALYTICS_URL = "https://admin.totthobox.com/api/analytics/user-count";

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
  const [totalUsers, setTotalUsers] = useState<string | null>(null);

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
        // Do not render fabricated numbers if the endpoint is unreachable
      }
    };

    void loadAnalytics();

    return () => controller.abort();
  }, []);

  return (
    <div className="flex items-center justify-center py-2">
      <div className="flex items-center gap-3 rounded-full border border-zinc-400/25 px-4 py-2 text-zinc-700 dark:text-zinc-300">
        <span className="relative flex">
          <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
          <span className="relative size-2 rounded-full bg-emerald-500" />
        </span>
        <p className="text-sm">
          {totalUsers ? (
            <>
              প্ল্যাটফর্মটি সক্রিয়ভাবে ব্যবহৃত হয়েছে{" "}
              <span className="text-base font-semibold">{totalUsers}+</span> বার
            </>
          ) : (
            <span>দৈনন্দিন তথ্য ও হিসাবের নির্ভরযোগ্য উন্মুক্ত পোর্টাল</span>
          )}
        </p>
      </div>
    </div>
  );
}
