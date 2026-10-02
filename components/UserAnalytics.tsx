"use client";

import { useEffect, useState } from "react";

export default function UserAnalytics() {
  const [totalUsers, setTotalUsers] = useState<string>("113.29k");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // AboutUsClient-এর মতো একই Env Variable এবং Base URL ব্যবহার করা হয়েছে
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || "https://admin.totthobox.com/api";

        const res = await fetch(`${baseUrl}/analytics/user-count`, {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Network response failed");

        const json = await res.json();

        // json.data.total চেক করে স্টেট আপডেট
        if (json.status === "success" && json.data?.total) {
          setTotalUsers(json.data.total);
        }
      } catch (error) {
        console.warn("Analytics Fetch Error (Using fallback):", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="flex items-center justify-center py-2">
      <div className="flex items-center gap-3 rounded-2xl border border-[var(--brand-border)] bg-white/62 px-4 py-2.5 shadow-[0_10px_24px_rgb(8_60_55_/_0.05)] backdrop-blur-xl dark:bg-white/[0.035]">
        <span className="relative flex">
          <span className="absolute h-full w-full animate-ping rounded-full bg-[var(--brand-highlight)] opacity-45"></span>
          <span className="relative size-2 rounded-full bg-[var(--brand-primary)]"></span>
        </span>

        <p className="text-sm">
          প্ল্যাটফর্মটি ব্যবহার করেছেন{" "}
          <span className="min-w-18 text-base font-black tabular-nums">
            {loading ? "..." : `${totalUsers}+`}
          </span>{" "}
          জন মানুষ
        </p>
      </div>
    </div>
  );
}
