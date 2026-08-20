import Link from "next/link";
import type { AppResource } from "@/types/app-resource";

export default function AppCard({ app }: { app: AppResource }) {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 p-4 flex gap-4">
      {app.icon ? (
        <img
          src={app.icon}
          alt={app.name}
          className="size-16 rounded-xl object-cover shrink-0"
        />
      ) : (
        <div className="size-16 rounded-xl bg-zinc-100 dark:bg-zinc-800 shrink-0" />
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href={`/software/${app.slug}`}
            className="font-semibold text-lg hover:underline"
          >
            {app.name}
          </Link>

          {app.platform && (
            <span className="text-xs px-2 py-0.5 rounded-full border">
              {app.platform}
            </span>
          )}
        </div>

        {app.description && (
          <p className="text-sm text-zinc-500 mt-1 line-clamp-2">
            {app.description}
          </p>
        )}

        <Link
          href={`/software/${app.slug}`}
          className="inline-block mt-2 text-sm text-blue-600 dark:text-blue-400"
        >
          বিস্তারিত পড়ুন →
        </Link>
      </div>
    </div>
  );
}