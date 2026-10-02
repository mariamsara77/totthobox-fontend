const TOTAL_USERS = "113.29k";

export default function UserAnalytics() {
  return (
    <div className="flex items-center justify-center py-2">
      <div className="flex items-center gap-4 rounded-full border border-zinc-400/25 px-4 py-2">
        <span className="relative flex">
          <span className="absolute h-full w-full animate-ping rounded-full bg-zinc-700 opacity-75" />
          <span className="relative size-2 rounded-full bg-zinc-900 dark:bg-zinc-100" />
        </span>
        <p className="text-sm">
          প্ল্যাটফর্মটি ব্যবহার করেছেন{" "}
          <span className="text-base font-semibold">{TOTAL_USERS}+</span>{" "}
          জন মানুষ
        </p>
      </div>
    </div>
  );
}