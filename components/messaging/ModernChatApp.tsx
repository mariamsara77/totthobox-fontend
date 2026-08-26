"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Edit3,
  FileText,
  Loader2,
  MoreVertical,
  Paperclip,
  Reply,
  Search,
  Send,
  ShieldBan,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { useChatLayout } from "@/context/ChatLayoutContext";
import MediaGallery from "@/components/MediaGallery";
import {
  ChatMessage,
  ChatUser,
  deleteMessage,
  editMessage,
  getBlockStatus,
  getChatUsers,
  getMessages,
  getUserProfileBySlug,
  markMessagesAsRead,
  searchUsers,
  sendMessage,
  toggleBlock,
} from "@/lib/messaging";
import BrandIcon from "../BrandIcon";

function Avatar({
  user,
  large = false,
}: {
  user?: ChatUser | null;
  large?: boolean;
}) {
  const src =
    user?.avatar || user?.avatar_url || user?.profile_photo_url || null;
  const size = large ? "size-10" : "size-9";
  return src ? (
    <img
      src={src}
      alt={user?.name || ""}
      className={`${size} shrink-0 rounded-full object-cover`}
    />
  ) : (
    <div
      className={`${size} flex shrink-0 items-center justify-center rounded-full bg-zinc-400/10 text-sm font-bold`}
    >
      {user?.name?.slice(0, 1)?.toUpperCase() || "?"}
    </div>
  );
}

function formatTime(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : new Intl.DateTimeFormat("bn-BD", {
        hour: "numeric",
        minute: "2-digit",
      }).format(date);
}

function lastMessage(user: ChatUser) {
  return [...(user.sentMessages || []), ...(user.receivedMessages || [])].sort(
    (a, b) => +new Date(b.created_at) - +new Date(a.created_at),
  )[0];
}

type MessageBubbleProps = {
  message: ChatMessage;
  own: boolean;
  highlighted: boolean;
  allMessages: ChatMessage[];
  onReply: () => void;
  onQuoteClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onLongPress: (event: React.PointerEvent<HTMLDivElement>) => void;
};

function MessageBubble({
  message,
  own,
  highlighted,
  allMessages,
  onReply,
  onQuoteClick,
  onEdit,
  onDelete,
  onLongPress,
}: MessageBubbleProps) {
  const media = message.media || [];
  const images = media.filter(
    (m) =>
      m.mime_type?.startsWith("image/") &&
      (m.original_url || m.url || m.preview_url),
  );

  // parent-কে local messages থেকে full করে নাও (media সহ)
  const parent =
    message.parent?.id
      ? allMessages.find((m) => m.id === message.parent!.id) || message.parent
      : message.parent;

  const parentMedia = parent?.media || [];
  const parentImage = parentMedia.find(
    (m) =>
      m.mime_type?.startsWith("image/") &&
      (m.original_url || m.url || m.preview_url),
  );

  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") return;
    longPressTimer.current = setTimeout(() => {
      longPressTimer.current = null;
      onLongPress(event);
    }, 550);
  };

  useEffect(() => () => clearLongPress(), []);

  return (
    <div
      data-message-id={message.id}
      className={`group relative flex w-full ${own ? "justify-end" : "justify-start"} ${highlighted ? "z-10" : ""}`}
      onPointerDown={handlePointerDown}
      onPointerUp={clearLongPress}
      onPointerCancel={clearLongPress}
      onPointerLeave={clearLongPress}
      onContextMenu={(event) => {
        if (window.matchMedia("(pointer: coarse)").matches)
          event.preventDefault();
      }}
    >
      <div
        className={`flex max-w-[min(80%,620px)] flex-col gap-1 ${own ? "items-end" : "items-start"}`}
      >
        {parent ? (
          <button
            type="button"
            onClick={onQuoteClick}
            className="max-w-full rounded-xl border-l-2 border-zinc-400/50 bg-zinc-100 px-3 py-1.5 text-left text-xs transition hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 flex items-center gap-2"
            title="রিপ্লাই করা মেসেজে যান"
          >
            {parentImage ? (
              <img
                src={
                  parentImage.preview_url ||
                  parentImage.url ||
                  parentImage.original_url
                }
                alt=""
                className="size-8 shrink-0 rounded-md object-cover"
              />
            ) : null}
            <span className="min-w-0 flex-1">
              <span className="font-semibold block">
                {parent.sender?.name || "রিপ্লাই"}
              </span>
              <span className="line-clamp-1 opacity-60">
                {parent.message ||
                  (parent.media?.length ? "সংযুক্তি" : "")}
              </span>
            </span>
          </button>
        ) : null}

        <div
          className={`rounded-2xl px-4.5 py-2 shadow-sm ${own ? "rounded-br-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" : "rounded-bl-md border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"} ${highlighted ? "ring-2 ring-zinc-400 ring-offset-2 dark:ring-zinc-500 dark:ring-offset-zinc-950" : ""}`}
        >
          {images.length ? (
            <MediaGallery
              media={images.map((m) => ({
                url: m.original_url || m.url || m.preview_url || "",
                name: m.name || m.file_name || "image",
              }))}
            />
          ) : null}
          {message.message ? (
            <p className="whitespace-pre-wrap break-words text-sm leading-6">
              {message.message}
            </p>
          ) : null}
          {media
            .filter((m) => !m.mime_type?.startsWith("image/"))
            .map((m) => (
              <a
                key={m.id}
                href={m.original_url || m.url || m.preview_url || "#"}
                target="_blank"
                rel="noreferrer"
                className="mt-1 flex max-w-full items-center gap-2 rounded-xl bg-zinc-400/10 px-4 py-2 text-xs"
              >
                <FileText className="size-4 shrink-0" />
                <span className="max-w-52 truncate">
                  {m.name || m.file_name || "ফাইল"}
                </span>
              </a>
            ))}
          <div className="mt-1 text-[10px] opacity-50">
            {formatTime(message.created_at)}
            {message.updated_at && message.updated_at !== message.created_at
              ? " · সম্পাদিত"
              : ""}
          </div>
        </div>
        <div className="hidden items-center gap-1 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100 md:flex">
          <button
            type="button"
            onClick={onReply}
            className="rounded-lg bg-zinc-400/10  p-2 hover:bg-zinc-400/25"
            aria-label="রিপ্লাই"
            title="রিপ্লাই"
          >
            <Reply className="size-4" />
          </button>
          {own ? (
            <>
              <button
                type="button"
                onClick={onEdit}
                className="rounded-lg bg-zinc-400/10  p-2 hover:bg-zinc-400/25"
                aria-label="এডিট"
                title="এডিট"
              >
                <Edit3 className="size-4" />
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="rounded-lg bg-zinc-400/10  p-2 hover:bg-zinc-400/25"
                aria-label="মুছুন"
                title="মুছুন"
              >
                <Trash2 className="size-4" />
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

type ActionMenuState = {
  message: ChatMessage;
  own: boolean;
  x: number;
  y: number;
} | null;

export default function ModernChatApp({ targetSlug }: { targetSlug?: string }) {
  const { user: me, loading: authLoading } = useAuth();
  const { mobileChat, setMobileChat } = useChatLayout();
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [people, setPeople] = useState<ChatUser[]>([]);
  const [selected, setSelected] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [editing, setEditing] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [searching, setSearching] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [blockLoading, setBlockLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [actionMenu, setActionMenu] = useState<ActionMenuState>(null);
  const [highlightedMessage, setHighlightedMessage] = useState<number | null>(
    null,
  );
  const [jumping, setJumping] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageRefs = useRef(new Map<number, HTMLDivElement>());
  const openedTargetRef = useRef<string | null>(null);
  const requestRef = useRef(0);
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressAutoScrollRef = useRef(false);

  useEffect(() => {
    void getChatUsers()
      .then(setUsers)
      .catch((e) =>
        toast.error(e instanceof Error ? e.message : "কথোপকথন লোড করা যায়নি"),
      );
  }, []);
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  useEffect(() => {
    const value = query.trim();
    const id = ++requestRef.current;
    const timer = window.setTimeout(async () => {
      if (!value) {
        setPeople([]);
        setSearching(false);
        return;
      }
      setSearching(true);
      try {
        const result = await searchUsers(value);
        if (id === requestRef.current) setPeople(result);
      } catch (e) {
        if (id === requestRef.current)
          toast.error(
            e instanceof Error ? e.message : "ব্যবহারকারী খোঁজা যায়নি",
          );
      } finally {
        if (id === requestRef.current) setSearching(false);
      }
    }, 300);
    return () => window.clearTimeout(timer);
  }, [query]);
  useEffect(() => {
    if (selected) void markMessagesAsRead(selected.slug).catch(() => undefined);
  }, [selected, messages.length]);
  useEffect(() => {
    if (suppressAutoScrollRef.current) {
      suppressAutoScrollRef.current = false;
      return;
    }
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);
  useEffect(() => {
    const close = () => setActionMenu(null);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, []);
  useEffect(
    () => () => {
      if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
    },
    [],
  );

  const loadMessages = async (slug: string) => {
    setLoadingMessages(true);
    try {
      const data = await getMessages(slug, 1, 30);
      setMessages(data.data.slice().reverse());
    } finally {
      setLoadingMessages(false);
    }
  };
  const selectUser = async (user: ChatUser) => {
    if (!user.slug) {
      toast.error("এই ব্যবহারকারীর বৈধ slug পাওয়া যায়নি");
      return;
    }
    setSelected(user);
    setMobileChat(true);
    setMenuOpen(false);
    setActionMenu(null);
    setReplyTo(null);
    setEditing(null);
    setMessages([]);
    try {
      const [state] = await Promise.all([
        getBlockStatus(user.slug),
        loadMessages(user.slug),
      ]);
      setBlocked(Boolean(state.blocked ?? state.is_blocked));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "চ্যাট লোড করা যায়নি");
    }
  };
  useEffect(() => {
    if (!targetSlug || openedTargetRef.current === targetSlug) return;
    let cancelled = false;
    const open = async () => {
      try {
        const existing = users.find((u) => u.slug === targetSlug);
        const response = existing
          ? null
          : await getUserProfileBySlug(targetSlug);
        const target = existing ?? response?.data?.profile ?? response?.profile;
        if (!cancelled && target?.slug) {
          openedTargetRef.current = targetSlug;
          await selectUser(target);
        }
      } catch (e) {
        if (!cancelled)
          toast.error(e instanceof Error ? e.message : "চ্যাট লোড করা যায়নি");
      }
    };
    void open();
    return () => {
      cancelled = true;
    };
  }, [targetSlug, users]);

  const setMessageRef = (id: number, node: HTMLDivElement | null) => {
    if (node) messageRefs.current.set(id, node);
    else messageRefs.current.delete(id);
  };
  const highlightAndScroll = (id: number) => {
    const node = messageRefs.current.get(id);
    if (!node) return false;
    node.scrollIntoView({ behavior: "smooth", block: "center" });
    setHighlightedMessage(id);
    if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
    highlightTimerRef.current = setTimeout(
      () => setHighlightedMessage(null),
      1800,
    );
    return true;
  };
  const loadOlderUntil = async (targetId: number) => {
    if (!selected || jumping) return false;
    setJumping(true);
    try {
      let page = 2;
      let lastPage = 2;
      while (page <= lastPage) {
        const data = await getMessages(selected.slug, page, 30);
        lastPage = data.last_page ?? page;
        const older = data.data.slice().reverse();
        const found = older.some((message) => message.id === targetId);
        suppressAutoScrollRef.current = true;
        setMessages((current) => {
          const existingIds = new Set(current.map((message) => message.id));
          const additions = older.filter(
            (message) => !existingIds.has(message.id),
          );
          return [...additions, ...current];
        });
        if (found) return true;
        if (!data.next_page_url && page >= lastPage) break;
        page += 1;
      }
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "পুরোনো মেসেজ লোড করা যায়নি",
      );
    } finally {
      setJumping(false);
    }
    return false;
  };
  const jumpToMessage = async (messageId?: number | null) => {
    if (!messageId) return;
    setActionMenu(null);
    if (highlightAndScroll(messageId)) return;
    const found = await loadOlderUntil(messageId);
    if (!found) {
      toast.error("রিপ্লাই করা মূল মেসেজটি খুঁজে পাওয়া যায়নি");
      return;
    }
    window.setTimeout(() => highlightAndScroll(messageId), 80);
  };

  const send = async () => {
    if (!selected || sending || blocked || (!draft.trim() && !file)) return;
    setSending(true);
    try {
      const sent = await sendMessage(selected.id, draft, file, replyTo?.id);
      setMessages((current) => [...current, sent]);
      setDraft("");
      setFile(null);
      setReplyTo(null);
      toast.success("মেসেজ পাঠানো হয়েছে");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "মেসেজ পাঠানো যায়নি");
    } finally {
      setSending(false);
    }
  };
  const remove = async (id: number) => {
    if (!window.confirm("এই মেসেজটি মুছে ফেলবেন?")) return;
    try {
      await deleteMessage(id);
      setMessages((current) => current.filter((message) => message.id !== id));
      setActionMenu(null);
      toast.success("মেসেজ মুছে ফেলা হয়েছে");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "মেসেজ মুছতে পারেনি");
    }
  };
  const update = async () => {
    if (!editing || !editText.trim()) return;
    try {
      const updated = await editMessage(editing, editText);
      setMessages((current) =>
        current.map((message) =>
          message.id === updated.id ? updated : message,
        ),
      );
      setEditing(null);
      setEditText("");
      setActionMenu(null);
      toast.success("মেসেজ আপডেট হয়েছে");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "মেসেজ আপডেট করা যায়নি");
    }
  };
  const block = async () => {
    if (!selected?.slug || blockLoading) return;
    setBlockLoading(true);
    try {
      const result = await toggleBlock(selected.slug);
      const next = Boolean(result.blocked ?? result.is_blocked ?? !blocked);
      setBlocked(next);
      setMenuOpen(false);
      toast.success(
        next ? "ব্যবহারকারী ব্লক করা হয়েছে" : "ব্যবহারকারী আনব্লক করা হয়েছে",
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "অ্যাকশন সম্পন্ন হয়নি");
    } finally {
      setBlockLoading(false);
    }
  };
  const openActionMenu = (
    message: ChatMessage,
    own: boolean,
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    const menuWidth = 184;
    const menuHeight = own ? 132 : 76;
    const gap = 8;
    let x = own ? rect.right - menuWidth : rect.left;
    let y = rect.top - menuHeight - gap;
    if (x < 8) x = 8;
    if (x + menuWidth > window.innerWidth - 8)
      x = window.innerWidth - menuWidth - 8;
    if (y < 8)
      y = Math.min(rect.bottom + gap, window.innerHeight - menuHeight - 8);
    setActionMenu({ message, own, x, y });
  };

  if (authLoading || !me)
    return (
      <div className="flex h-screen w-full animate-pulse">
        <div className="hidden md:flex flex-col w-85 p-4 gap-4 shrink-0 bg-zinc-200 dark:bg-zinc-900">
          <div className="flex items-center justify-between pb-2">
            <div className="h-6 w-24 bg-zinc-400/10 rounded-md" />
            <div className="h-8 w-8 bg-zinc-400/10 rounded-full" />
          </div>
          <div className="h-10 w-full bg-zinc-400/10 rounded-lg" />
          <div className="flex flex-col gap-3 mt-2 overflow-hidden">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-xl">
                <div className="h-12 w-12 rounded-full bg-zinc-400/10 shrink-0" />
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex justify-between items-center">
                    <div className="h-4 w-28 bg-zinc-400/10 rounded" />
                    <div className="h-3 w-10 bg-zinc-400/10 rounded" />
                  </div>
                  <div className="h-3 w-40 bg-zinc-400/25 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col flex-1 h-full">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-zinc-400/10" />
              <div className="flex flex-col gap-1.5">
                <div className="h-4 w-32 bg-zinc-400/10 rounded" />
                <div className="h-3 w-16 bg-zinc-400/25 rounded" />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-8 w-8 bg-zinc-400/10 rounded-full" />
              <div className="h-8 w-8 bg-zinc-400/10 rounded-full" />
            </div>
          </div>
          <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden justify-end">
            <div className="flex items-end gap-2 max-w-[70%]">
              <div className="h-8 w-8 rounded-full bg-zinc-400/10 shrink-0" />
              <div className="h-12 w-48 bg-zinc-400/10 rounded-2xl rounded-bl-none" />
            </div>
            <div className="flex items-end gap-2 max-w-[70%] self-end">
              <div className="h-16 w-64 bg-zinc-700 rounded-2xl rounded-br-none" />
            </div>
            <div className="flex items-end gap-2 max-w-[70%]">
              <div className="h-8 w-8 rounded-full bg-zinc-400/10 shrink-0" />
              <div className="h-20 w-56 bg-zinc-400/10 rounded-2xl rounded-bl-none" />
            </div>
            <div className="flex items-end gap-2 max-w-[70%] self-end">
              <div className="h-10 w-36 bg-zinc-700 rounded-2xl rounded-br-none" />
            </div>
          </div>
          <div className="p-4 border-t border-zinc-800 flex items-center gap-3">
            <div className="h-10 w-10 bg-zinc-400/10 rounded-full shrink-0" />
            <div className="h-11 flex-1 bg-zinc-400/10 rounded-xl" />
            <div className="h-10 w-10 bg-zinc-400/10 rounded-full shrink-0" />
          </div>
        </div>
      </div>
    );
  const currentPeople = query.trim() ? people : users;

  return (
    <section className="h-full w-full">
      <div className="grid h-full overflow-hidden md:grid-cols-[minmax(280px,340px)_minmax(0,1fr)]">
        <aside
          className={`${mobileChat ? "hidden md:flex" : "flex"} h-screen flex-col bg-zinc-200 dark:bg-zinc-900`}
        >
          <div className="shrink-0 border-b border-zinc-200 p-4 dark:border-zinc-800">
            <div>
              <Link
                href="/"
                className="flex items-center gap-2 text-xl font-semibold"
              >
                <BrandIcon className="size-8" />
                Totthobox Chat
              </Link>
            </div>
            <div className="mb-3 flex items-center justify-between">
              <small className="opacity-50">আপনার ব্যক্তিগত কথোপকথন</small>
              <small className="opacity-50">{users.length} জন</small>
            </div>
            <label className="flex h-12 px-4 items-center gap-2 rounded-full bg-zinc-400/10">
              <Search className="size-4 opacity-50" />
              <input
                value={query}
                type="search"
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ব্যবহারকারী খুঁজুন"
                className="min-w-0 flex-1 text-sm outline-none"
              />
              {searching ? (
                <Loader2 className="size-4 animate-spin opacity-50" />
              ) : null}
            </label>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {currentPeople.length ? (
              currentPeople.map((user) => {
                const last = lastMessage(user);
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => void selectUser(user)}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${selected?.id === user.id ? "bg-zinc-400/10" : "hover:bg-zinc-400/25"}`}
                  >
                    <Avatar user={user} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-semibold">
                          {user.name}
                        </span>
                        <span className="shrink-0 text-[10px] opacity-40">
                          {last ? formatTime(last.created_at) : ""}
                        </span>
                      </span>
                      <span className="mt-0.5 block truncate text-xs opacity-50">
                        {user.role_label ||
                          last?.message ||
                          (last?.media?.length
                            ? "সংযুক্তি"
                            : "কথোপকথন শুরু করুন")}
                      </span>
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center text-sm opacity-50">
                {query ? "কোনো ব্যবহারকারী পাওয়া যায়নি" : "কোনো কথোপকথন নেই"}
              </div>
            )}
          </div>
        </aside>
        <main
          className={`${mobileChat ? "flex" : "hidden md:flex"} min-h-0 min-w-0 flex-col`}
        >
          {selected ? (
            <>
              <header className="relative flex h-15 shrink-0 items-center gap-3 border-b border-zinc-400/25 px-4">
                <button
                  type="button"
                  onClick={() => setMobileChat(false)}
                  className="rounded-lg p-2 md:hidden hover:bg-zinc-400/25"
                  aria-label="ফিরে যান"
                >
                  <ArrowLeft className="size-5" />
                </button>
                <Avatar user={selected} large />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {selected.name}
                  </p>
                  <p className="truncate text-xs opacity-50">
                    {selected.role_label || "ব্যক্তিগত কথোপকথন"}
                  </p>
                </div>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setMenuOpen((value) => !value)}
                    className="rounded-xl p-2 hover:bg-zinc-400/25"
                    aria-label="আরও অপশন"
                    aria-expanded={menuOpen}
                  >
                    <MoreVertical className="size-5" />
                  </button>
                  {menuOpen ? (
                    <>
                      <button
                        type="button"
                        className="fixed inset-0 z-10 cursor-default"
                        aria-label="মেনু বন্ধ করুন"
                        onClick={() => setMenuOpen(false)}
                      />
                      <div className="absolute right-0 top-11 z-20 w-48 overflow-hidden rounded-xl bg-zinc-200 dark:bg-zinc-700 p-2">
                        <Link
                          href={`/users/${encodeURIComponent(selected.slug)}`}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm hover:bg-zinc-400/25"
                        >
                          <UserRound className="size-4" />
                          প্রোফাইল দেখুন
                        </Link>
                        <button
                          type="button"
                          onClick={() => void block()}
                          disabled={blockLoading}
                          className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-left text-sm disabled:opacity-50 hover:bg-zinc-400/25"
                        >
                          <ShieldBan className="size-4" />
                          {blockLoading
                            ? "অপেক্ষা করুন..."
                            : blocked
                              ? "আনব্লক করুন"
                              : "ব্লক করুন"}
                        </button>
                      </div>
                    </>
                  ) : null}
                </div>
              </header>
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
                <div className="">
                  {loadingMessages ? (
                    <div className="flex-1 flex flex-col gap-4 overflow-hidden justify-end">
                      <div className="flex items-end gap-2 max-w-[70%]">
                        <div className="h-8 w-8 rounded-full bg-zinc-400/10 shrink-0" />
                        <div className="h-12 w-48 bg-zinc-400/10 rounded-2xl rounded-bl-none" />
                      </div>
                      <div className="flex items-end gap-2 max-w-[70%] self-end">
                        <div className="h-16 w-64 bg-zinc-700 rounded-2xl rounded-br-none" />
                      </div>
                      <div className="flex items-end gap-2 max-w-[70%]">
                        <div className="h-8 w-8 rounded-full bg-zinc-400/10 shrink-0" />
                        <div className="h-20 w-56 bg-zinc-400/10 rounded-2xl rounded-bl-none" />
                      </div>
                      <div className="flex items-end gap-2 max-w-[70%] self-end">
                        <div className="h-10 w-36 bg-zinc-700 rounded-2xl rounded-br-none" />
                      </div>
                    </div>
                  ) : messages.length ? (
                    messages.map((message) => {
                      const own =
                        message.sender_id === me.id ||
                        message.sender?.id === me.id;
                      return (
                        <div
                          key={message.id}
                          ref={(node) => setMessageRef(message.id, node)}
                        >
                          <MessageBubble
                            message={message}
                            own={own}
                            highlighted={highlightedMessage === message.id}
                            allMessages={messages}
                            onReply={() => {
                              setActionMenu(null);
                              setReplyTo(message);
                            }}
                            onQuoteClick={() =>
                              void jumpToMessage(message.parent?.id)
                            }
                            onEdit={() => {
                              setActionMenu(null);
                              setEditing(message.id);
                              setEditText(message.message || "");
                            }}
                            onDelete={() => void remove(message.id)}
                            onLongPress={(event) =>
                              openActionMenu(message, own, event)
                            }
                          />
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-16 text-center text-sm opacity-40">
                      এই কথোপকথনে এখনো কোনো মেসেজ নেই
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>
              </div>
              {actionMenu ? (
                <>
                  <button
                    type="button"
                    className="fixed inset-0 z-[60] cursor-default md:hidden"
                    aria-label="অ্যাকশন মেনু বন্ধ করুন"
                    onClick={() => setActionMenu(null)}
                  />
                  <div
                    className="fixed z-[70] flex min-w-44 max-w-[calc(100vw-16px)] items-center gap-1 rounded-2xl border border-zinc-200 bg-white/95 p-1.5 shadow-2xl backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/95 md:hidden"
                    style={{ left: actionMenu.x, top: actionMenu.y }}
                    role="menu"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setReplyTo(actionMenu.message);
                        setActionMenu(null);
                      }}
                      className="flex flex-1 flex-col items-center gap-1 rounded-xl px-4 py-2 text-xs hover:bg-zinc-400/25"
                      aria-label="রিপ্লাই"
                    >
                      <Reply className="size-5" />
                      <span>রিপ্লাই</span>
                    </button>
                    {actionMenu.own ? (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setEditing(actionMenu.message.id);
                            setEditText(actionMenu.message.message || "");
                            setActionMenu(null);
                          }}
                          className="flex flex-1 flex-col items-center gap-1 rounded-xl px-4 py-2 text-xs hover:bg-zinc-400/25"
                          aria-label="এডিট"
                        >
                          <Edit3 className="size-5" />
                          <span>এডিট</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => void remove(actionMenu.message.id)}
                          className="flex flex-1 flex-col items-center gap-1 rounded-xl px-4 py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                          aria-label="মুছুন"
                        >
                          <Trash2 className="size-5" />
                          <span>মুছুন</span>
                        </button>
                      </>
                    ) : null}
                  </div>
                </>
              ) : null}
              <div className="shrink-0 border-t border-zinc-200 p-3 dark:border-zinc-800">
                <div className="bg-zinc-400/10 rounded-2xl p-2 max-w-3xl mx-auto">
                  {blocked ? (
                    <div className="mb-2 rounded-xl bg-zinc-100 px-4 py-2 text-center text-xs opacity-70 dark:bg-zinc-900">
                      এই ব্যবহারকারীকে ব্লক করা হয়েছে। মেসেজ পাঠাতে আনব্লক
                      করুন।
                    </div>
                  ) : null}
                  {replyTo ? (
                    <div className="mb-2 flex items-center gap-2 rounded-xl bg-zinc-400/10 p-2 text-xs">
                      <Reply className="size-4 shrink-0" />
                      {(() => {
                        const media = replyTo.media || [];
                        const img = media.find(
                          (m) =>
                            m.mime_type?.startsWith("image/") &&
                            (m.original_url || m.url || m.preview_url),
                        );
                        return img ? (
                          <img
                            src={
                              img.preview_url || img.url || img.original_url
                            }
                            alt=""
                            className="size-8 shrink-0 rounded-md object-cover"
                          />
                        ) : null;
                      })()}
                      <span className="min-w-0 flex-1 truncate">
                        {replyTo.message ||
                          (replyTo.media?.length ? "সংযুক্তি" : "")}
                      </span>
                      <button
                        className="hover:bg-zinc-400/25 p-1 rounded-lg shrink-0"
                        type="button"
                        onClick={() => setReplyTo(null)}
                        aria-label="রিপ্লাই বাতিল করুন"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ) : null}
                  {editing ? (
                    <div className="mb-2 flex items-center gap-2 rounded-xl bg-zinc-100 px-4 py-2 text-xs dark:bg-zinc-900">
                      <span className="flex-1">মেসেজ এডিট হচ্ছে</span>
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(null);
                          setEditText("");
                        }}
                        aria-label="এডিট বাতিল করুন"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ) : null}
                  {preview ? (
                    <div className="mb-2 flex items-center gap-2">
                      <img
                        src={preview}
                        alt="preview"
                        className="size-14 rounded-xl object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="rounded-full bg-zinc-900 p-1 text-white"
                        aria-label="সংযুক্তি সরান"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ) : null}
                  <div className="mx-auto flex w-full items-end gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,.pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    <button
                      type="button"
                      disabled={blocked}
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-xl p-2 disabled:opacity-40 hover:bg-zinc-400/25"
                      aria-label="ফাইল সংযুক্ত করুন"
                    >
                      <Paperclip className="size-5" />
                    </button>
                    <textarea
                      value={editing ? editText : draft}
                      onInput={(e) => {
                        const target = e.currentTarget;
                        target.style.height = "auto";
                        target.style.height = `${target.scrollHeight}px`;
                      }}
                      onChange={(e) =>
                        editing
                          ? setEditText(e.target.value)
                          : setDraft(e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          editing ? void update() : void send();
                          e.currentTarget.style.height = "auto";
                        }
                      }}
                      disabled={blocked || sending}
                      rows={1}
                      placeholder={
                        editing ? "মেসেজ আপডেট করুন..." : "মেসেজ লিখুন..."
                      }
                      className="flex-1 resize-none overflow-y-auto max-h-32 min-h-7 text-sm outline-none bg-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => (editing ? void update() : void send())}
                      disabled={
                        blocked ||
                        sending ||
                        (!draft.trim() && !editText.trim() && !file)
                      }
                      className="rounded-xl bg-zinc-900 p-3 text-white disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900"
                      aria-label={editing ? "আপডেট করুন" : "মেসেজ পাঠান"}
                    >
                      {sending ? (
                        <Loader2 className="size-5 animate-spin" />
                      ) : editing ? (
                        "✓"
                      ) : (
                        <Send className="size-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center p-8 text-center">
              <div>
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-900">
                  <Send className="size-6 opacity-50" />
                </div>
                <h2 className="text-base font-semibold">
                  একটি কথোপকথন নির্বাচন করুন
                </h2>
                <p className="mt-1 text-sm opacity-50">
                  বাম পাশ থেকে একজন ব্যবহারকারী নির্বাচন করুন।
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </section>
  );
}