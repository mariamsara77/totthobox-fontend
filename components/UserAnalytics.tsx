const FALLBACK_TOTAL = "113.29k";

type AnalyticsResponse = {
  status?: string;
  data?: {
    total?: string | number;
  };
};

export default async function UserAnalytics() {
  let totalUsers = FALLBACK_TOTAL;

  try {
    const baseUrl = (
      process.env.NEXT_PUBLIC_API_URL || "https://admin.totthobox.com/api"
    ).replace(/\/$/, "");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);

    try {
      const res = await fetch(baseUrl + "/analytics/user-count", {
        next: {
          revalidate: 3600,
          tags: ["analytics:user-count"],
        },
        signal: controller.signal,
      });

      if (res.ok) {
        const json = (await res.json()) as AnalyticsResponse;
        if (json.status === "success" && json.data?.total) {
          totalUsers = String(json.data.total);
        }
      }
    } finally {
      clearTimeout(timeout);
    }
  } catch {
    // Preserve the existing fallback when the analytics API is unavailable.
  }

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