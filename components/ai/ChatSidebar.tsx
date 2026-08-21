"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Trash2, MessageSquare, LogIn } from "lucide-react";
import BrandIcon from "../BrandIcon";
import { useAuth } from "@/context/AuthContext";
import { getToken } from "@/lib/auth";

const API =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

type Props = {
  currentUuid: string | null;
  onNavigate?: () => void;
};

export default function ChatSidebar({ currentUuid, onNavigate }: Props) {
  const router = useRouter();
  const { user, loading: authLoading, isLoggedIn } = useAuth();

  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    // লগইন না থাকলে কিছুই লোড করব না
    if (!isLoggedIn) {
      setSessions([]);
      setLoading(false);
      return;
    }

    const token = getToken();
    if (!token) {
      setSessions([]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API}/api/ai/sessions`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        console.error("API Error Status:", res.status);
        setSessions([]);
        return;
      }

      const json = await res.json();

      // Laravel response structure অনুযায়ী handle করো
      if (json.success && Array.isArray(json.data)) {
        setSessions(json.data);
      } else if (Array.isArray(json)) {
        setSessions(json);
      } else if (json.data && Array.isArray(json.data)) {
        setSessions(json.data);
      } else {
        setSessions([]);
      }
    } catch (error) {
      console.error("Fetch Session Error:", error);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auth loading শেষ হলে তবেই session লোড করব
    if (!authLoading) {
      load();
    }
  }, [currentUuid, isLoggedIn, authLoading]);

  const remove = async (id: number, uuid: string) => {
    if (!confirm("এই চ্যাটটি মুছে ফেলতে চান?")) return;

    const token = getToken();
    if (!token) return;

    try {
      await fetch(`${API}/api/ai/sessions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      setSessions((prev) => prev.filter((x) => x.id !== id));

      if (currentUuid === uuid) {
        router.push("/ai/chat");
        onNavigate?.();
      }
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  // Auth এখনো লোড হচ্ছে
  if (authLoading) {
    return (
      <nav className="flex flex-col h-full p-3 gap-1 overflow-hidden bg-zinc-900 text-zinc-200">
        <div className="p-4">
          <div className="h-6 w-32 bg-zinc-800 animate-pulse rounded"></div>
        </div>
        <div className="px-3 py-8 text-center text-xs text-zinc-400 animate-pulse">
          লোড হচ্ছে...
        </div>
      </nav>
    );
  }

  return (
    <nav className="flex flex-col h-full p-3 gap-1 overflow-hidden bg-zinc-900 text-zinc-200">
      {/* Brand */}
      <div className="p-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-semibold text-zinc-100"
        >
          <BrandIcon className="h-6 w-6 shrink-0" />
          <span className="truncate">Totthobox</span>
        </Link>
      </div>

      {/* New Chat Button */}
      <Link
        href="/ai/chat"
        onClick={onNavigate}
        className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm font-medium text-emerald-400 rounded-xl hover:bg-emerald-900/40 transition-colors"
      >
        <Plus className="w-4 h-4" />
        নতুন চ্যাট
      </Link>

      <div className="flex-1 overflow-y-auto totthobox-scrollbar space-y-0.5 mt-2">
        {/* ========== Guest View ========== */}
        {!isLoggedIn ? (
          <div className="px-2 py-6 text-center">
            <div className="p-3 rounded-2xl bg-zinc-800/60 mb-4 border border-zinc-700/50">
              <MessageSquare className="w-7 h-7 mx-auto mb-2 text-zinc-400" />
              <p className="text-xs text-zinc-400 leading-relaxed">
                লগইন করলে আপনার সব চ্যাট এখানে সেভ হবে এবং পরে দেখতে পারবেন।
              </p>
            </div>

            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent("open-auth-modal"));
                onNavigate?.();
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              লগইন করুন
            </button>
          </div>
        ) : loading ? (
          /* ========== Loading Sessions ========== */
          <div className="px-3 py-8 text-center text-xs text-zinc-400 animate-pulse">
            লোড হচ্ছে...
          </div>
        ) : sessions.length === 0 ? (
          /* ========== Empty ========== */
          <div className="px-3 py-10 text-center text-xs text-zinc-400">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
            এখনো কোনো চ্যাট নেই
          </div>
        ) : (
          /* ========== Session List ========== */
          <>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 px-3 pt-1 pb-1.5">
              আগের চ্যাট
            </p>
            {sessions.map((s) => (
              <div key={s.uuid} className="group relative">
                <Link
                  href={`/ai/chat/${s.uuid}`}
                  onClick={onNavigate}
                  className={`block w-full text-left px-3 py-2.5 pr-9 rounded-xl text-sm truncate transition-colors ${
                    currentUuid === s.uuid
                      ? "bg-zinc-800 font-medium text-zinc-100"
                      : "text-zinc-300 hover:bg-zinc-800/60"
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
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 text-zinc-400 hover:text-red-400 rounded-lg hover:bg-red-950/30 transition-colors"
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
