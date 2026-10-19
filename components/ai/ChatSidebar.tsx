"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Trash2, MessageSquare } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api-client";
import { getVisitorId } from "@/lib/visitor";
import ProfileMenu from "../ProfileMenu";

type ChatSession = {
  id?: number | string;
  uuid: string;
  title?: string | null;
};

type Props = {
  currentUuid: string | null;
  onNavigate?: () => void;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeSessionArray(candidates: unknown[]): ChatSession[] {
  return candidates
    .filter(isRecord)
    .filter(
      (session) => typeof session.uuid === "string" && session.uuid.length > 0,
    )
    .map((session) => ({
      ...(typeof session.id === "number" || typeof session.id === "string"
        ? { id: session.id }
        : {}),
      uuid: session.uuid as string,
      title: typeof session.title === "string" ? session.title : null,
    }));
}

function parseSessions(payload: unknown): ChatSession[] {
  if (Array.isArray(payload)) {
    return normalizeSessionArray(payload);
  }

  if (!isRecord(payload) || payload.success === false) {
    return [];
  }

  const data = payload.data;
  const nestedSessions =
    isRecord(data) && Array.isArray(data.sessions) ? data.sessions : undefined;
  const candidates = Array.isArray(data)
    ? data
    : nestedSessions ?? (Array.isArray(payload.sessions) ? payload.sessions : []);

  return normalizeSessionArray(candidates);
}

export default function ChatSidebar({ currentUuid, onNavigate }: Props) {
  const router = useRouter();
  const { loading: authLoading, isLoggedIn } = useAuth();

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);

  // ChatSidebar.tsx এ load function টা useCallback এ wrap করো
  const load = useCallback(async () => {
    try {
      const visitorId = getVisitorId();
      const json = await apiFetch<unknown>(
        `/ai/sessions?t=${Date.now()}&visitor_id=${encodeURIComponent(visitorId)}`,
        {
          cache: "no-store",
          headers: {
            "X-Visitor-Id": visitorId,
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        },
      );

      setSessions(parseSessions(json));
    } catch (error) {
      console.error("Fetch Session Error:", error);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading) {
      load();
    }
  }, [currentUuid, isLoggedIn, authLoading, load]); // ✅ load যোগ করা

  useEffect(() => {
    window.addEventListener("chat:session-created", load);
    return () => window.removeEventListener("chat:session-created", load);
  }, [load]);

  const remove = async (session: ChatSession) => {
    const sessionId =
      typeof session.id === "number"
        ? session.id
        : typeof session.id === "string" && /^\\d+$/.test(session.id)
          ? Number(session.id)
          : Number.NaN;

    if (!Number.isSafeInteger(sessionId) || sessionId <= 0) {
      console.error("Cannot delete chat session without a numeric backend ID.");
      return;
    }

    if (!confirm("এই চ্যাটটি মুছে ফেলতে চান?")) return;

    try {
      const visitorId = getVisitorId();
      await apiFetch(
        `/ai/sessions/${sessionId}?visitor_id=${encodeURIComponent(visitorId)}`,
        {
          method: "DELETE",
          headers: { "X-Visitor-Id": visitorId },
        },
      );

      setSessions((prev) => prev.filter((item) => item.uuid !== session.uuid));

      if (currentUuid === session.uuid) {
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
        {loading ? (
          /* ========== Loading Sessions ========== */
          <div className="px-3 py-8 text-center text-xs  animate-pulse">
            লোড হচ্ছে...
          </div>
        ) : sessions.length === 0 ? (
          !isLoggedIn ? (
            /* ========== Guest View ========== */
            <div className="px-2 py-6 text-center">
              <div className="p-3 rounded-2xl bg-zinc-400/10">
                <MessageSquare className="w-7 h-7 mx-auto mb-2 " />
                <p className="text-xs  leading-relaxed">
                  এই ব্রাউজারের guest chat এখানে দেখা যাবে।
                </p>
              </div>
            </div>
          ) : (
            /* ========== Empty ========== */
            <div className="px-3 py-10 text-center text-xs ">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
              এখনো কোনো চ্যাট নেই
            </div>
          )
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
                    remove(s);
                  }}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-zinc-400/25 "
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </>
        )}
      </div>
      {/* Profile Menu */}
      {/* Profile Menu */}
      <div className="">
        <ProfileMenu variant="sidebar" />
      </div>
    </nav>
  );
}
