"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Trash2, MessageSquare, LogIn } from "lucide-react";
import BrandIcon from "../BrandIcon";

const API =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

type Props = {
  currentUuid: string | null;
  isGuest?: boolean;
  onNavigate?: () => void;
};

export default function ChatSidebar({
  currentUuid,
  isGuest = true,
  onNavigate,
}: Props) {
  const router = useRouter();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (isGuest) {
      setLoading(false);
      setSessions([]);
      return;
    }

    try {
      const res = await fetch(`${API}/api/ai/sessions`, {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const json = await res.json();
      if (json.success) setSessions(json.data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [currentUuid, isGuest]);

  const remove = async (id: number, uuid: string) => {
    if (!confirm("এই চ্যাটটি মুছে ফেলতে চান?")) return;
    await fetch(`${API}/api/ai/sessions/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setSessions((s) => s.filter((x) => x.id !== id));
    if (currentUuid === uuid) {
      router.push("/ai/chat");
      onNavigate?.();
    }
  };

  return (
    <nav className="flex flex-col h-full p-3 gap-1 overflow-hidden">
      <div className="p-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-semibold"
        >
          <BrandIcon className="h-6 w-6 shrink-0" />
          <span className="truncate">Totthobox</span>
        </Link>
      </div>

      {/* New Chat Button */}
      <Link
        href="/ai/chat"
        onClick={onNavigate}
        className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm font-medium text-emerald-600 dark:text-emerald-400 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition"
      >
        <Plus className="w-4 h-4" />
        নতুন চ্যাট
      </Link>

      <div className="flex-1 overflow-y-auto totthobox-scrollbar space-y-0.5 mt-2">
        {/* ========== Guest View ========== */}
        {isGuest ? (
          <div className="px-2 py-6 text-center">
            <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 mb-4">
              <MessageSquare className="w-7 h-7 mx-auto mb-2 text-zinc-400" />
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                লগইন করলে আপনার সব চ্যাট এখানে সেভ হবে এবং পরে দেখতে পারবেন।
              </p>
            </div>

            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent("open-auth-modal"));
                onNavigate?.();
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition"
            >
              <LogIn className="w-4 h-4" />
              লগইন করুন
            </button>
          </div>
        ) : loading ? (
          /* ========== Loading ========== */
          <div className="px-3 py-8 text-center text-xs text-zinc-400">
            লোড হচ্ছে...
          </div>
        ) : sessions.length === 0 ? (
          /* ========== Empty (Logged in) ========== */
          <div className="px-3 py-10 text-center text-xs text-zinc-400">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
            এখনো কোনো চ্যাট নেই
          </div>
        ) : (
          /* ========== Session List ========== */
          <>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 px-3 pt-1 pb-1.5">
              আগের চ্যাট
            </p>
            {sessions.map((s) => (
              <div key={s.uuid} className="group relative">
                <Link
                  href={`/ai/chat/${s.uuid}`}
                  onClick={onNavigate}
                  className={`block w-full text-left px-3 py-2.5 pr-9 rounded-xl text-sm truncate transition ${
                    currentUuid === s.uuid
                      ? "bg-zinc-200/80 dark:bg-zinc-800 font-medium"
                      : "hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                  }`}
                >
                  {s.title || "Untitled"}
                </Link>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    remove(s.id, s.uuid);
                  }}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 text-zinc-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </nav>
  );
}
