"use client";

import { useEffect, useState } from "react";

const ANALYTICS_URL = "/api/analytics/stats";

type AnalyticsData = {
  total?: unknown;
  today?: unknown;
  online?: unknown;
  pwa?: unknown;
};

type AnalyticsResponse = {
  status?: unknown;
  data?: AnalyticsData;
};

function getValidTotal(value: unknown): string | null {
  if (value === null || value === undefined) return null;

  if (typeof value === "number") {
    if (isNaN(value) || value <= 0) return null;
    return value.toLocaleString("bn-BD");
  }

  if (typeof value !== "string") return null;

  const total = value.trim();
  if (
    !total ||
    total === "0" ||
    total.toLowerCase() === "nan" ||
    total.toLowerCase() === "unknown" ||
    total.toLowerCase() === "null"
  ) {
    return null;
  }

  return total;
}

function isAnalyticsResponse(value: unknown): value is AnalyticsResponse {
  return typeof value === "object" && value !== null;
}

function checkPlausibility(data?: AnalyticsData): void {
  if (process.env.NODE_ENV === "production" || !data) return;

  const onlineStr = String(data.online ?? "").trim().toLowerCase();
  const todayStr = String(data.today ?? "").trim().toLowerCase();

  const isSuspiciousRound =
    onlineStr === "10k" ||
    onlineStr === "10000" ||
    todayStr === "10k" ||
    todayStr === "10000";

  const isOnlineExceedingToday =
    Boolean(onlineStr) &&
    Boolean(todayStr) &&
    onlineStr === todayStr &&
    onlineStr !== "0";

  if (isSuspiciousRound || isOnlineExceedingToday) {
    console.warn(
      "[Totthobox Analytics Dev Warning] Implausible stats returned from backend upstream:",
      {
        total: data.total,
        today: data.today,
        online: data.online,
        pwa: data.pwa,
        reason:
          "online >= today or round 10k offset detected. Check AnalyticsController::index on Laravel backend.",
      },
    );
  }
}

export default function UserAnalytics() {
  const [totalUsers, setTotalUsers] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadAnalytics = async () => {
      try {
        try {
          const cached = sessionStorage.getItem("tb_stats_total");
          const cachedTime = sessionStorage.getItem("tb_stats_time");
          if (cached && cachedTime && Date.now() - Number(cachedTime) < 300000) {
            setTotalUsers(cached);
            return;
          }
        } catch {
          // ignore storage errors
        }

        const response = await fetch(ANALYTICS_URL, {
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });

        if (!response.ok) return;

        const payload: unknown = await response.json();
        if (!isAnalyticsResponse(payload)) return;

        checkPlausibility(payload.data);

        const total = getValidTotal(payload.data?.total);
        if (payload.status === "success" && total) {
          setTotalUsers(total);
          try {
            sessionStorage.setItem("tb_stats_total", total);
            sessionStorage.setItem("tb_stats_time", String(Date.now()));
          } catch {
            // ignore
          }
        }
      } catch {
        // Do not render fabricated numbers if unreachable
      }
    };

    void loadAnalytics();

    return () => controller.abort();
  }, []);

  if (!totalUsers) {
    return (
      <div className="flex h-10 items-center justify-center py-2" aria-hidden="true">
        <div className="h-7 w-56 rounded-lg border border-zinc-200 bg-zinc-100/70 dark:border-zinc-800 dark:bg-zinc-900" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-1">
      <div className="flex items-center gap-2.5 rounded-lg border border-zinc-200 bg-white px-3.5 py-1.5 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
        <span
          aria-hidden="true"
          className="size-2 rounded-full bg-[var(--accent-primary)]"
        />
        <p className="text-sm tabular-nums">
          প্ল্যাটফর্মটি ব্যবহৃত হয়েছে{" "}
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            {totalUsers}+
          </span>{" "}
          বার
        </p>
      </div>
    </div>
  );
}
