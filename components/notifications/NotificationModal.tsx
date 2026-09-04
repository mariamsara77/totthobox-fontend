"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, Loader2, Trash2, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { getEcho } from "@/lib/echo";
import { useAuth } from "@/context/AuthContext";
import {
  clearAllNotifications,
  getNotifications,
  getUnreadCount,
  markAllNotificationsRead,
  markNotificationRead,
  type NotificationItem,
} from "@/lib/notifications";

interface Props {
  open: boolean;
  onClose: () => void;
  onCountChange?: (count: number) => void;
}

/* ───────────────── Skeleton ───────────────── */
function NotificationSkeleton() {
  return (
    <div className="space-y-1 p-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex animate-pulse gap-3 rounded-xl px-3 py-3"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="size-10 shrink-0 rounded-xl bg-zinc-400/15" />
          <div className="min-w-0 flex-1 space-y-2 pt-0.5">
            <div className="flex items-center justify-between gap-3">
              <div className="h-3.5 w-2/3 rounded-md bg-zinc-400/15" />
              <div className="h-2.5 w-8 rounded-md bg-zinc-400/10" />
            </div>
            <div className="h-3 w-full rounded-md bg-zinc-400/10" />
            <div className="h-3 w-4/5 rounded-md bg-zinc-400/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ───────────────── Empty State ───────────────── */
function EmptyState({ filter }: { filter: "all" | "unread" }) {
  return (
    <div className="flex flex-col items-center justify-center px-8 py-24 text-center">
      <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-zinc-400/10">
        <Bell className="size-7 opacity-30" strokeWidth={1.5} />
      </div>
      <p className="text-[15px] font-semibold tracking-tight">
        {filter === "unread" ? "কোনো অপঠিত নেই" : "সব পরিষ্কার!"}
      </p>
      <p className="mt-1.5 max-w-[220px] text-sm leading-relaxed opacity-50">
        {filter === "unread"
          ? "আপনার সব নোটিফিকেশন পড়া হয়ে গেছে।"
          : "এখনো কোনো নোটিফিকেশন আসেনি।"}
      </p>
    </div>
  );
}

/* ───────────────── Single Item ───────────────── */
function NotificationRow({
  item,
  onClick,
}: {
  item: NotificationItem;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 active:scale-[0.98] ${
        item.is_unread
          ? "bg-indigo-50/60 hover:bg-indigo-50 dark:bg-indigo-500/[0.07] dark:hover:bg-indigo-500/10"
          : "hover:bg-zinc-400/10"
      }`}
    >
      <div className="relative mt-0.5 shrink-0">
        {item.sender_avatar ? (
          <img
            src={item.sender_avatar}
            alt=""
            className="size-10 rounded-xl object-cover ring-1 ring-zinc-400/10 transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-10 items-center justify-center rounded-xl bg-zinc-400/15 text-sm font-bold tracking-tight">
            {item.sender_name?.charAt(0)?.toUpperCase() || "S"}
          </div>
        )}
        {item.is_online && (
          <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[13.5px] leading-snug">
            <span className="font-semibold text-zinc-900 dark:text-zinc-50">
              {item.sender_name}
            </span>{" "}
            <span className="text-zinc-600 dark:text-zinc-300">
              {item.display_title}
            </span>
          </p>
          <span className="shrink-0 pt-0.5 text-[11px] tabular-nums text-zinc-400">
            {item.time}
          </span>
        </div>

        {item.message && (
          <p className="mt-0.5 line-clamp-2 text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">
            {item.message}
          </p>
        )}
      </div>

      {item.is_unread && (
        <div className="mt-2 flex shrink-0 items-center">
          <span className="size-2 rounded-full bg-indigo-500" />
        </div>
      )}
    </button>
  );
}

/* ───────────────── Main Modal ───────────────── */
export function NotificationModal({ open, onClose, onCountChange }: Props) {
  const { user: me, isLoggedIn } = useAuth();
  const router = useRouter();

  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [entered, setEntered] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const requestIdRef = useRef(0);
  const panelRef = useRef<HTMLDivElement>(null);

  /* ── Data fetching ── */
  const loadNotifications = useCallback(
    async (pageNum = 1, append = false) => {
      if (!isLoggedIn) return;

      const reqId = ++requestIdRef.current;
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      try {
        const res = await getNotifications(filter, pageNum, 15);
        if (reqId !== requestIdRef.current) return;

        const items = res.data || [];
        setNotifications((prev) => (append ? [...prev, ...items] : items));
        setTotalCount(res.meta.total);
        setHasMore(res.meta.has_more);
        setPage(pageNum);
      } catch (e) {
        if (reqId === requestIdRef.current) {
          toast.error(
            e instanceof Error ? e.message : "নোটিফিকেশন লোড করা যায়নি",
          );
        }
      } finally {
        if (reqId === requestIdRef.current) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [filter, isLoggedIn],
  );

  const refreshUnreadCount = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const count = await getUnreadCount();
      setUnreadCount(count);
      onCountChange?.(count);
    } catch {
      /* silent */
    }
  }, [isLoggedIn, onCountChange]);

  /* ── Effects ── */
  useEffect(() => {
    if (!open || !isLoggedIn) return;
    setNotifications([]);
    setPage(1);
    setHasMore(false);
    void loadNotifications(1, false);
    void refreshUnreadCount();
  }, [open, filter, isLoggedIn, loadNotifications, refreshUnreadCount]);

  // Enter animation
  useEffect(() => {
    if (!open) {
      setEntered(false);
      setIsClosing(false);
      return;
    }
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, [open]);

  // Body scroll lock
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Infinite scroll
  useEffect(() => {
    if (!open || !hasMore || loadingMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void loadNotifications(page + 1, true);
        }
      },
      { threshold: 0.15 },
    );

    const el = loadMoreRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [open, hasMore, loadingMore, loading, page, loadNotifications]);

  // Live updates via Echo
  useEffect(() => {
    if (!me?.id || !isLoggedIn) return;
    const echo = getEcho();
    if (!echo) return;

    const channel = echo.private(`user.${me.id}`);
    const refresh = () => {
      void refreshUnreadCount();
      if (open) void loadNotifications(1, false);
    };

    channel.notification(refresh);
    channel.listen(".NotificationCreated", refresh);

    return () => {
      channel.stopListening(
        ".Illuminate\\Notifications\\Events\\BroadcastNotificationCreated",
      );
      channel.stopListening(".NotificationCreated");
    };
  }, [me?.id, isLoggedIn, open, refreshUnreadCount, loadNotifications]);

  // Escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  /* ── Smooth Close ── */
  const handleClose = () => {
    setIsClosing(true);
    setEntered(false);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 220);
  };

  /* ── Actions ── */
  const handleClick = async (item: NotificationItem) => {
    if (item.is_unread) {
      try {
        await markNotificationRead(item.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === item.id ? { ...n, is_unread: false } : n)),
        );
        setUnreadCount((c) => {
          const next = Math.max(0, c - 1);
          onCountChange?.(next);
          return next;
        });
      } catch {
        /* ignore */
      }
    }

    handleClose();

    if (!item.action_url || item.action_url === "#") return;

    let path = item.action_url;

    if (path.startsWith("http://") || path.startsWith("https://")) {
      try {
        const url = new URL(path);
        path = url.pathname + url.search + url.hash;
      } catch {
        return;
      }
    }

    router.push(path);
  };

  const handleMarkAll = async () => {
    if (markingAll || unreadCount === 0) return;
    setMarkingAll(true);
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_unread: false })));
      setUnreadCount(0);
      onCountChange?.(0);
      toast.success("সব নোটিফিকেশন পড়া হয়েছে");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "কাজটি সম্পন্ন হয়নি");
    } finally {
      setMarkingAll(false);
    }
  };

  const handleClearAll = async () => {
    if (clearing || totalCount === 0) return;
    if (!window.confirm("সব নোটিফিকেশন মুছে ফেলবেন?")) return;

    setClearing(true);
    try {
      await clearAllNotifications();
      setNotifications([]);
      setTotalCount(0);
      setUnreadCount(0);
      onCountChange?.(0);
      toast.success("সব নোটিফিকেশন মুছে ফেলা হয়েছে");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "মুছতে পারেনি");
    } finally {
      setClearing(false);
    }
  };

  if (!open && !isClosing) return null;

  return (
    <div className="fixed inset-0 z-80 flex h-screen justify-end p-3 sm:p-4">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="বন্ধ করুন"
        onClick={handleClose}
        className={`absolute inset-0 transition-all duration-300 ease-out ${
          entered ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="নোটিফিকেশন"
        className={`relative flex h-full w-full max-w-100 flex-col overflow-hidden rounded-2xl border border-zinc-400/25 shadow-2xl backdrop-blur-xl transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          entered
            ? "translate-x-0 scale-100 opacity-100"
            : "translate-x-8 scale-[0.97] opacity-0"
        }`}
      >
        {/* Header */}
        <div className="shrink-0 border-b border-zinc-400/25 px-4 pb-3 pt-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-zinc-400/10">
                <Bell className="size-[18px]" strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-[15px] font-semibold tracking-tight">
                  নোটিফিকেশন
                </h2>
                <p className="text-[12px] leading-none text-zinc-500">
                  {unreadCount > 0 ? `${unreadCount}টি অপঠিত` : "সব আপ টু ডেট"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => void handleMarkAll()}
                  disabled={markingAll}
                  title="সব পড়া হিসেবে মার্ক করুন"
                  className="flex size-8 items-center justify-center rounded-lg text-indigo-600 transition-all duration-200 hover:bg-indigo-50 active:scale-90 disabled:opacity-50 dark:hover:bg-indigo-500/10"
                >
                  {markingAll ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <CheckCheck className="size-4" />
                  )}
                </button>
              )}
              <button
                type="button"
                onClick={handleClose}
                className="flex size-8 items-center justify-center rounded-lg text-zinc-500 transition-all duration-200 hover:bg-zinc-400/10 hover:text-zinc-900 active:scale-90 dark:hover:text-zinc-100"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Filter */}
          <div className="flex rounded-xl bg-zinc-400/10 p-0.5">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`flex-1 rounded-lg py-1.5 text-[13px] font-medium transition-all duration-200 ${
                filter === "all"
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-50"
                  : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
            >
              সব
              {totalCount > 0 && (
                <span className="ml-1 tabular-nums opacity-60">
                  {totalCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setFilter("unread")}
              className={`flex-1 rounded-lg py-1.5 text-[13px] font-medium transition-all duration-200 ${
                filter === "unread"
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-50"
                  : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
            >
              অপঠিত
              {unreadCount > 0 && (
                <span className="ml-1 tabular-nums opacity-60">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* List */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {loading ? (
            <NotificationSkeleton />
          ) : notifications.length === 0 ? (
            <EmptyState filter={filter} />
          ) : (
            <div className="space-y-0.5 p-2">
              {notifications.map((item, index) => (
                <div
                  key={item.id}
                  className="animate-in fade-in slide-in-from-right-2 duration-300 fill-mode-both"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <NotificationRow
                    item={item}
                    onClick={() => void handleClick(item)}
                  />
                </div>
              ))}

              {hasMore && (
                <div ref={loadMoreRef} className="flex justify-center py-4">
                  {loadingMore && (
                    <Loader2 className="size-5 animate-spin text-zinc-400" />
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {totalCount > 0 && !loading && (
          <div className="shrink-0 border-t border-zinc-400/15 p-2">
            <button
              type="button"
              onClick={() => void handleClearAll()}
              disabled={clearing}
              className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-medium text-red-500 transition-all duration-200 hover:bg-red-50 active:scale-[0.98] disabled:opacity-50 dark:hover:bg-red-500/10"
            >
              {clearing ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Trash2 className="size-3.5" />
              )}
              সব মুছে ফেলুন
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
