"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Trash2, MessageSquare, LogIn } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api-client";
import SidebarProfileMenu from "../SidebarProfileMenu";

type Props = {
  currentUuid: string | null;
  onNavigate?: () => void;
};

export default function ChatSidebar({ currentUuid, onNavigate }: Props) {
  const router = useRouter();
  const { user, loading: authLoading, isLoggedIn } = useAuth();

  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

// ChatSidebar.tsx এ load function টা useCallback এ wrap করো
const load = useCallback(async () => {
  if (!isLoggedIn) {
    setSessions([]);
    setLoading(false);
    return;
  }

  try {
    // ↓↓↓ এখানে ?t= যোগ করুন
    const json = await apiFetch<any>(`/ai/sessions?t=${Date.now()}`, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });

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
}, [isLoggedIn]);

useEffect(() => {
  if (!authLoading) {
    load();
  }
}, [currentUuid, isLoggedIn, authLoading, load]); // ✅ load যোগ করা

useEffect(() => {
  window.addEventListener("chat:session-created", load);
  return () => window.removeEventListener("chat:session-created", load);
}, [load]);

  const remove = async (id: number, uuid: string) => {
    if (!confirm("এই চ্যাটটি মুছে ফেলতে চান?")) return;

    try {
      await apiFetch(`/ai/sessions/${id}`, {
        method: "DELETE",
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
      <nav className="flex flex-col h-full p-2 gap-2 overflow-hidden">
        <div className="p-4">
          <div className="animate-pulse rounded"></div>
        </div>
        <div className="px-3 py-8 text-center text-xs  animate-pulse">
          লোড হচ্ছে...
        </div>
      </nav>
    );
  }

  return (
    <nav className="flex flex-col h-full p-2 gap-1 overflow-hidden ">
      {/* New Chat Button */}
      <Link
        href="/ai/chat"
        onClick={onNavigate}
        className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm  rounded-xl hover:bg-zinc-400/25 "
      >
        <Plus className="w-4 h-4" />
        নতুন চ্যাট
      </Link>

      <div className="flex-1 overflow-y-auto totthobox-scrollbar space-y-0.5 mt-2">
        {/* ========== Guest View ========== */}
        {!isLoggedIn ? (
          <div className="px-2 py-6 text-center">
            <div className="p-3 rounded-2xl bg-zinc-400/10">
              <MessageSquare className="w-7 h-7 mx-auto mb-2 " />
              <p className="text-xs  leading-relaxed">
                লগইন করলে আপনার সব চ্যাট এখানে সেভ হবে এবং পরে দেখতে পারবেন।
              </p>
            </div>
          </div>
        ) : loading ? (
          /* ========== Loading Sessions ========== */
          <div className="px-3 py-8 text-center text-xs  animate-pulse">
            লোড হচ্ছে...
          </div>
        ) : sessions.length === 0 ? (
          /* ========== Empty ========== */
          <div className="px-3 py-10 text-center text-xs ">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
            এখনো কোনো চ্যাট নেই
          </div>
        ) : (
          /* ========== Session List ========== */
          <>
            <p className="text-[10px]  uppercase tracking-wider  px-3 pt-1 pb-1.5">
              আগের চ্যাট
            </p>
            {sessions.map((s) => (
              <div key={s.uuid} className="group relative">
                <Link
                  href={`/ai/chat/${s.uuid}`}
                  onClick={onNavigate}
                  className={`block w-full p-2 rounded-xl text-sm truncate  ${
                    currentUuid === s.uuid
                      ? "bg-zinc-400/10 "
                      : "hover:bg-zinc-400/10"
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
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 rounded-xl hover:bg-zinc-400/25 "
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </>
        )}
      </div>
      {/* Profile Menu */}
      <div className="">
        <SidebarProfileMenu />
      </div>
    </nav>
  );
}
