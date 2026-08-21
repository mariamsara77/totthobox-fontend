"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ChatSidebar({
  currentUuid,
}: {
  currentUuid: string | null;
}) {
  const router = useRouter();
  const [sessions, setSessions] = useState<any[]>([]);

  const load = async () => {
    try {
      const res = await fetch(`${API}/api/ai/sessions`, {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) return;
      const json = await res.json();
      if (json.success) setSessions(json.data);
    } catch {}
  };

  useEffect(() => {
    load();
  }, [currentUuid]);

  const remove = async (id: number, uuid: string) => {
    if (!confirm("এই প্রশ্নটি মুছে ফেলতে চাও?")) return;
    await fetch(`${API}/api/ai/sessions/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setSessions((s) => s.filter((x) => x.id !== id));
    if (currentUuid === uuid) router.push("/ai/chat");
  };

  return (
    <nav className="p-2 space-y-1 overflow-y-auto h-full totthobox-scrollbar">
      <Link
        href="/ai/chat"
        className="flex items-center gap-2 w-full px-3 py-2 text-xs text-emerald-600 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
      >
        <Plus className="w-4 h-4" /> নতুন প্রশ্ন শুরু করো
      </Link>

      {sessions.length > 0 && (
        <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 px-2 pt-2">
          আগের প্রশ্নগুলো
        </p>
      )}

      {sessions.map((s) => (
        <div key={s.uuid} className="group relative">
          <Link
            href={`/ai/chat/${s.uuid}`}
            className={`block w-full text-left px-3 py-2 pr-8 rounded-xl text-sm truncate ${
              currentUuid === s.uuid
                ? "bg-zinc-100 dark:bg-zinc-800"
                : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            }`}
          >
            {s.title}
          </Link>
          <button
            type="button"
            onClick={() => remove(s.id, s.uuid)}
            className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-red-500"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}

      {sessions.length === 0 && (
        <div className="py-8 text-center text-xs text-zinc-400 opacity-60">
          📚
          <br />
          এখনো কোনো প্রশ্ন করোনি।
        </div>
      )}
    </nav>
  );
}