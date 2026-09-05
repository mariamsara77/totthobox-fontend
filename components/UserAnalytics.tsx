"use client";

import { useEffect, useState } from "react";

export default function UserAnalytics() {
  const [totalUsers, setTotalUsers] = useState<string>("113.29k");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";
        const res = await fetch(`${baseUrl}/api/analytics/user-count`, {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Network response failed");

        const data = await res.json();

        if (data.status === "success" && data.total_users) {
          setTotalUsers(data.total_users);
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
      <div className="items-center gap-4 rounded-full border border-zinc-400/25 px-4 py-2">
        <span className="relative flex">
          <span className="absolute h-full w-full animate-ping rounded-full bg-zinc-700 opacity-75"></span>
          <span className="relative rounded-full bg-zinc-9000"></span>
        </span>

        <p className="text-sm  ">
          প্ল্যাটফর্মটি ব্যবহার করেছেন{" "}
          <span className="text-base  ">{totalUsers}+</span> জন মানুষ
        </p>
      </div>
    </div>
  );
}
