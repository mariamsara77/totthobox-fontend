"use client";

import { useEffect, useState } from "react";

function scheduleIdle(callback: () => void) {
  const requestIdle = (
    window as Window & {
      requestIdleCallback?: (
        callback: IdleRequestCallback,
        options?: IdleRequestOptions,
      ) => number;
    }
  ).requestIdleCallback;

  if (requestIdle) return requestIdle(callback, { timeout: 3500 });
  return window.setTimeout(callback, 1200);
}

function cancelIdle(handle: number) {
  const cancelIdle = (
    window as Window & {
      cancelIdleCallback?: (handle: number) => void;
    }
  ).cancelIdleCallback;

  if (cancelIdle) cancelIdle(handle);
  else window.clearTimeout(handle);
}

export default function UserAnalytics() {
  const [totalUsers, setTotalUsers] = useState<string>("113.29k");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;

    const fetchAnalytics = async () => {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || "https://admin.totthobox.com/api";

        const res = await fetch(baseUrl + "/analytics/user-count", {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Network response failed");

        const json = await res.json();

        if (!cancelled && json.status === "success" && json.data?.total) {
          setTotalUsers(json.data.total);
        }
      } catch {
        // The existing visual fallback remains available when the API is unavailable.
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const handle = scheduleIdle(() => {
      void fetchAnalytics();
    });

    return () => {
      cancelled = true;
      cancelIdle(handle);
    };
  }, []);

  return (
    <div className="flex items-center justify-center py-2">
      <div className="flex items-center gap-4 rounded-full border border-zinc-400/25 px-4 py-2">
        <span className="relative flex">
          <span className="absolute h-full w-full animate-ping rounded-full bg-zinc-700 opacity-75" />
          <span className="relative rounded-full bg-zinc-900" />
        </span>
        <p className="text-sm">
          প্ল্যাটফর্মটি ব্যবহার করেছেন{" "}
          <span className="text-base font-semibold">
            {loading ? "..." : totalUsers + "+"}
          </span>{" "}
          জন মানুষ
        </p>
      </div>
    </div>
  );
}
