"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
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
import { getEcho } from "@/lib/echo";
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
    user?.avatar || user?.avatar_url || user?.profile_photo_url || undefined;
  const size = large ? "size-10" : "size-9";
  return src ? (
    <img
      src={src}
      alt={user?.name || ""}
      className={`${size} shrink-0 rounded-full object-cover`}
    />
  ) : (
    <div
      className={`${size} flex shrink-0 items-center justify-center rounded-full bg-zinc-400/15 text-sm font-bold`}
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

function findImage(message?: ChatMessage | null) {
  const media = message?.media || [];
  return media.find(
    (m) =>
      m.mime_type?.startsWith("image/") &&
      (m.original_url || m.url || m.preview_url),
  );
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
  onOpenMenu: (el: HTMLElement) => void;
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
  onOpenMenu,
}: MessageBubbleProps) {
  const media = message.media || [];
  const images = media.filter(
    (m) =>
      m.mime_type?.startsWith("image/") &&
      (m.original_url || m.url || m.preview_url),
  );

  const parent = message.parent?.id
    ? allMessages.find((m) => m.id === message.parent!.id) || message.parent
    : message.parent;

  const parentImage = findImage(parent);

  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startPos = useRef<{ x: number; y: number } | null>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [isPressing, setIsPressing] = useState(false);

  const clearLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    startPos.current = null;
    setIsPressing(false);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    // Only for touch / pen
    if (event.pointerType === "mouse") return;

    const target = event.currentTarget;
    startPos.current = { x: event.clientX, y: event.clientY };
    setIsPressing(true);

    longPressTimer.current = setTimeout(() => {
      longPressTimer.current = null;
      setIsPressing(false);

      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(12);
      }

      if (target) {
        onOpenMenu(target);
      }
    }, 480);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!startPos.current || !longPressTimer.current) return;

    const dx = Math.abs(event.clientX - startPos.current.x);
    const dy = Math.abs(event.clientY - startPos.current.y);

    // Cancel if user moves finger too much (scrolling)
    if (dx > 10 || dy > 10) {
      clearLongPress();
    }
  };

  useEffect(() => () => clearLongPress(), []);

  return (
    <div
      data-message-id={message.id}
      className={`group relative flex w-full ${own ? "justify-end" : "justify-start"} ${highlighted ? "z-10" : ""}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={clearLongPress}
      onPointerCancel={clearLongPress}
      onPointerLeave={clearLongPress}
      onContextMenu={(event) => {
        // Prevent native context menu on long-press devices
        if (window.matchMedia("(pointer: coarse)").matches) {
          event.preventDefault();
        }
      }}
    >
      <div
        ref={bubbleRef}
        className={`flex max-w-[min(80%,620px)] flex-col gap-1 transition-transform duration-150 ${
          own ? "items-end" : "items-start"
        } ${isPressing ? "scale-[0.97]" : ""}`}
      >
        {parent ? (
          <button
            type="button"
            onClick={onQuoteClick}
            className="flex max-w-full items-center gap-2 rounded-xl bg-zinc-400/15 px-3 py-1.5 text-left text-xs transition hover:bg-zinc-400/25"
            title="রিপ্লাই করা মেসেজে যান"
          >
            {parentImage ? (
              <img
                src={
                  parentImage.preview_url ||
                  parentImage.url ||
                  parentImage.original_url ||
                  undefined
                }
                alt=""
                className="size-8 shrink-0 rounded-md object-cover"
              />
            ) : null}
            <span className="min-w-0 flex-1">
              <span className="block font-semibold">
                {parent.sender?.name || "রিপ্লাই"}
              </span>
              <span className="line-clamp-1 opacity-50">
                {parent.message || (parent.media?.length ? "সংযুক্তি" : "")}
              </span>
            </span>
          </button>
        ) : null}

        <div className="relative">
          <div
            className={`rounded-2xl px-4.5 py-2 shadow-sm transition-all duration-150 ${
              own
                ? "rounded-br-md bg-zinc-400/25"
                : "rounded-bl-md bg-zinc-400/10"
            } ${
              highlighted
                ? "ring-2 ring-zinc-400/40 ring-offset-2 ring-offset-transparent"
                : ""
            } ${isPressing ? "bg-zinc-400/30" : ""}`}
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
                  className="mt-1 flex max-w-full items-center gap-2 rounded-xl bg-zinc-400/10 px-4 py-2 text-xs hover:bg-zinc-400/25"
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
        </div>

        {/* Desktop: hover actions */}
        <div className="hidden items-center gap-1 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100 md:flex">
          <button
            type="button"
            onClick={onReply}
            className="rounded-lg bg-zinc-400/10 p-2 hover:bg-zinc-400/25"
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
                className="rounded-lg bg-zinc-400/10 p-2 hover:bg-zinc-400/25"
                aria-label="এডিট"
                title="এডিট"
              >
                <Edit3 className="size-4" />
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="rounded-lg bg-zinc-400/10 p-2 hover:bg-zinc-400/25"
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
  isMobile: boolean;
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
  const [otherTyping, setOtherTyping] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messageRefs = useRef(new Map<number, HTMLDivElement>());
  const openedTargetRef = useRef<string | null>(null);
  const requestRef = useRef(0);
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressAutoScrollRef = useRef(false);
  const typingClearRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingWhisperRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isNearBottomRef = useRef(true);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    bottomRef.current?.scrollIntoView({ behavior, block: "end" });
  }, []);

  const checkNearBottom = useCallback(() => {
    const el = messagesContainerRef.current;
    if (!el) return true;
    const threshold = 120;
    return el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
  }, []);

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

  // Auto-scroll on new messages
  useEffect(() => {
    if (suppressAutoScrollRef.current) {
      suppressAutoScrollRef.current = false;
      return;
    }
    if (isNearBottomRef.current) {
      scrollToBottom("smooth");
    }
  }, [messages.length, scrollToBottom]);

  // Always scroll when typing indicator appears
  useEffect(() => {
    if (otherTyping) {
      scrollToBottom("smooth");
    }
  }, [otherTyping, scrollToBottom]);

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
      if (typingClearRef.current) clearTimeout(typingClearRef.current);
      if (typingWhisperRef.current) clearTimeout(typingWhisperRef.current);
    },
    [],
  );

  // textarea auto-height
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  }, [draft]);

  const loadMessages = async (slug: string) => {
    setLoadingMessages(true);
    try {
      const data = await getMessages(slug, 1, 30);
      setMessages(data.data.slice().reverse());
      requestAnimationFrame(() => scrollToBottom("auto"));
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
    setOtherTyping(false);
    setMessages([]);
    isNearBottomRef.current = true;
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

  // ========== LIVE CHAT (Laravel Echo) ==========
  useEffect(() => {
    if (!me?.id) return;

    const echo = getEcho();
    if (!echo) return;

    const channel = echo.private(`chat.${me.id}`);

    channel.listen(".MessageSent", (payload: any) => {
      const msg = payload.message || payload;

      if (
        selected &&
        (msg.sender_id === selected.id || msg.receiver_id === selected.id)
      ) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
        setOtherTyping(false);
        if (typingClearRef.current) clearTimeout(typingClearRef.current);
      }

      getChatUsers()
        .then(setUsers)
        .catch(() => undefined);
    });

    channel.listenForWhisper("typing", (e: any) => {
      if (!selected || e?.user_id !== selected.id) return;
      setOtherTyping(true);
      if (typingClearRef.current) clearTimeout(typingClearRef.current);
      typingClearRef.current = setTimeout(() => setOtherTyping(false), 2500);
    });

    channel.error((error: any) => {
      console.error("Echo channel error:", error);
    });

    return () => {
      channel.stopListening(".MessageSent");
      channel.stopListeningForWhisper("typing");
    };
  }, [me?.id, selected?.id]);

  // draft change → typing whisper (throttled)
  useEffect(() => {
    if (!draft.trim() || !selected || !me?.id) return;
    if (typingWhisperRef.current) return;
    const echo = getEcho();
    if (!echo) return;
    echo.private(`chat.${selected.id}`).whisper("typing", { user_id: me.id });
    typingWhisperRef.current = setTimeout(() => {
      typingWhisperRef.current = null;
    }, 1200);
  }, [draft, selected, me?.id]);

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
      isNearBottomRef.current = true;
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

  // Improved openActionMenu – detects mobile and positions accordingly
  const openActionMenu = (
    message: ChatMessage,
    own: boolean,
    el: HTMLElement | null,
  ) => {
    if (!el || typeof el.getBoundingClientRect !== "function") return;

    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    const rect = el.getBoundingClientRect();

    let x = 0;
    let y = 0;

    if (isMobile) {
      // Bottom sheet style – we don't really need x/y much
      x = 0;
      y = 0;
    } else {
      // Desktop floating menu
      const menuWidth = 184;
      const menuHeight = own ? 132 : 76;
      const gap = 8;

      x = own ? rect.right - menuWidth : rect.left;
      y = rect.top - menuHeight - gap;

      if (x < 8) x = 8;
      if (x + menuWidth > window.innerWidth - 8) {
        x = window.innerWidth - menuWidth - 8;
      }
      if (y < 8) {
        y = Math.min(rect.bottom + gap, window.innerHeight - menuHeight - 8);
      }
    }

    setActionMenu({ message, own, x, y, isMobile });
  };

  if (authLoading || !me)
    return (
      <div className="flex h-screen w-full animate-pulse">
        <div className="hidden md:flex flex-col w-85 p-4 gap-4 shrink-0 bg-zinc-400/10">
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
              <div className="h-16 w-64 bg-zinc-400/25 rounded-2xl rounded-br-none" />
            </div>
            <div className="flex items-end gap-2 max-w-[70%]">
              <div className="h-8 w-8 rounded-full bg-zinc-400/10 shrink-0" />
              <div className="h-20 w-56 bg-zinc-400/10 rounded-2xl rounded-bl-none" />
            </div>
            <div className="flex items-end gap-2 max-w-[70%] self-end">
              <div className="h-10 w-36 bg-zinc-400/25 rounded-2xl rounded-br-none" />
            </div>
          </div>
          <div className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 bg-zinc-400/10 rounded-full shrink-0" />
            <div className="h-11 flex-1 bg-zinc-400/10 rounded-xl" />
            <div className="h-10 w-10 bg-zinc-400/10 rounded-full shrink-0" />
          </div>
        </div>
      </div>
    );

  const currentPeople = query.trim() ? people : users;
  const replyImage = findImage(replyTo);

  return (
    <section className="h-full w-full">
      <div className="grid h-full overflow-hidden md:grid-cols-[minmax(280px,340px)_minmax(0,1fr)]">
        {/* Sidebar */}
        <aside
          className={`${mobileChat ? "hidden md:flex" : "flex"} h-screen flex-col bg-zinc-400/10`}
        >
          <div className="shrink-0 p-4">
            <div>
              <Link
                href="/"
                className="flex items-center gap-2 text-xl font-semibold"
              >
                <BrandIcon className="size-8" />
                Totthobox Chat
              </Link>
            </div>
            <div className="mb-3 mt-2 flex items-center justify-between">
              <small className="opacity-50">আপনার ব্যক্তিগত কথোপকথন</small>
              <small className="opacity-50">{users.length} জন</small>
            </div>
            <label className="flex h-12 px-4 items-center gap-2 rounded-full bg-zinc-400/15">
              <Search className="size-4 opacity-50" />
              <input
                value={query}
                type="search"
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ব্যবহারকারী খুঁজুন"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
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
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${
                      selected?.id === user.id
                        ? "bg-zinc-400/15"
                        : "hover:bg-zinc-400/20"
                    }`}
                  >
                    <Avatar user={user} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-semibold">
                          {user.name}
                        </span>
                        <span className="shrink-0 text-[10px] opacity-50">
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

        {/* Main Chat Area */}
        <main
          className={`${mobileChat ? "flex" : "hidden md:flex"} min-h-0 min-w-0 flex-col`}
        >
          {selected ? (
            <>
              <header className="relative flex h-15 shrink-0 items-center gap-3 px-4 bg-zinc-400/5">
                <button
                  type="button"
                  onClick={() => setMobileChat(false)}
                  className="rounded-lg p-2 md:hidden hover:bg-zinc-400/20"
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
                    {otherTyping
                      ? "লিখছেন..."
                      : selected.role_label || "ব্যক্তিগত কথোপকথন"}
                  </p>
                </div>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setMenuOpen((value) => !value)}
                    className="rounded-xl p-2 hover:bg-zinc-400/20"
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
                      <div className="absolute right-0 top-11 z-20 w-48 overflow-hidden rounded-xl bg-zinc-400/15 p-2 shadow-lg backdrop-blur-md">
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

              {/* Messages */}
              <div
                ref={messagesContainerRef}
                className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4"
                onScroll={() => {
                  isNearBottomRef.current = checkNearBottom();
                }}
              >
                <div className="flex flex-col gap-3">
                  {loadingMessages ? (
                    <div className="flex flex-1 flex-col gap-4 justify-end">
                      <div className="flex items-end gap-2 max-w-[70%]">
                        <div className="h-8 w-8 rounded-full bg-zinc-400/10 shrink-0" />
                        <div className="h-12 w-48 bg-zinc-400/10 rounded-2xl rounded-bl-none" />
                      </div>
                      <div className="flex items-end gap-2 max-w-[70%] self-end">
                        <div className="h-16 w-64 bg-zinc-400/25 rounded-2xl rounded-br-none" />
                      </div>
                      <div className="flex items-end gap-2 max-w-[70%]">
                        <div className="h-8 w-8 rounded-full bg-zinc-400/10 shrink-0" />
                        <div className="h-20 w-56 bg-zinc-400/10 rounded-2xl rounded-bl-none" />
                      </div>
                      <div className="flex items-end gap-2 max-w-[70%] self-end">
                        <div className="h-10 w-36 bg-zinc-400/25 rounded-2xl rounded-br-none" />
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
                              textareaRef.current?.focus();
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
                            onOpenMenu={(el) =>
                              openActionMenu(message, own, el)
                            }
                          />
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-16 text-center text-sm opacity-50">
                      এই কথোপকথনে এখনো কোনো মেসেজ নেই
                    </div>
                  )}

                  {/* Typing Indicator */}
                  {otherTyping ? (
                    <div className="mt-1 flex justify-start">
                      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-zinc-400/15 px-4 py-2.5">
                        <span className="size-1.5 animate-bounce rounded-full bg-zinc-400/60 [animation-delay:-0.3s]" />
                        <span className="size-1.5 animate-bounce rounded-full bg-zinc-400/60 [animation-delay:-0.15s]" />
                        <span className="size-1.5 animate-bounce rounded-full bg-zinc-400/60" />
                      </div>
                    </div>
                  ) : null}

                  <div ref={bottomRef} className="h-1 shrink-0" />
                </div>
              </div>

              {/* ========== ACTION MENU ========== */}
              {actionMenu ? (
                <>
                  {/* Backdrop */}
                  <button
                    type="button"
                    className="fixed inset-0 z-[60] cursor-default bg-black/30 backdrop-blur-[2px] animate-in fade-in duration-200"
                    aria-label="অ্যাকশন মেনু বন্ধ করুন"
                    onClick={() => setActionMenu(null)}
                  />

                  {actionMenu.isMobile ? (
                    /* ===== Mobile Bottom Sheet (Native-like) ===== */
                    <div
                      className="fixed inset-x-0 bottom-0 z-[70] animate-in slide-in-from-bottom duration-300"
                      role="menu"
                    >
                      <div className="mx-auto max-w-lg px-3 pb-safe">
                        <div className="overflow-hidden rounded-2xl bg-zinc-900/95 shadow-2xl backdrop-blur-xl dark:bg-zinc-800/95">
                          {/* Handle bar */}
                          <div className="flex justify-center pt-3 pb-1">
                            <div className="h-1 w-10 rounded-full bg-zinc-500/40" />
                          </div>

                          <div className="p-2">
                            <button
                              type="button"
                              onClick={() => {
                                setReplyTo(actionMenu.message);
                                setActionMenu(null);
                                textareaRef.current?.focus();
                              }}
                              className="flex w-full items-center gap-4 rounded-xl px-4 py-3.5 text-left text-[15px] active:bg-zinc-700/50"
                            >
                              <div className="flex size-9 items-center justify-center rounded-full bg-zinc-700/60">
                                <Reply className="size-4.5" />
                              </div>
                              <span className="font-medium">রিপ্লাই</span>
                            </button>

                            {actionMenu.own ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditing(actionMenu.message.id);
                                    setEditText(
                                      actionMenu.message.message || "",
                                    );
                                    setActionMenu(null);
                                  }}
                                  className="flex w-full items-center gap-4 rounded-xl px-4 py-3.5 text-left text-[15px] active:bg-zinc-700/50"
                                >
                                  <div className="flex size-9 items-center justify-center rounded-full bg-zinc-700/60">
                                    <Edit3 className="size-4.5" />
                                  </div>
                                  <span className="font-medium">এডিট</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    void remove(actionMenu.message.id)
                                  }
                                  className="flex w-full items-center gap-4 rounded-xl px-4 py-3.5 text-left text-[15px] text-red-400 active:bg-zinc-700/50"
                                >
                                  <div className="flex size-9 items-center justify-center rounded-full bg-red-500/20">
                                    <Trash2 className="size-4.5" />
                                  </div>
                                  <span className="font-medium">মুছুন</span>
                                </button>
                              </>
                            ) : null}
                          </div>

                          {/* Cancel button */}
                          <div className="border-t border-zinc-700/50 p-2">
                            <button
                              type="button"
                              onClick={() => setActionMenu(null)}
                              className="w-full rounded-xl py-3.5 text-center text-[15px] font-semibold text-zinc-300 active:bg-zinc-700/50"
                            >
                              বাতিল
                            </button>
                          </div>
                        </div>

                        {/* Extra safe area spacing */}
                        <div className="h-3" />
                      </div>
                    </div>
                  ) : (
                    /* ===== Desktop Floating Menu ===== */
                    <div
                      className="fixed z-[70] flex min-w-44 max-w-[calc(100vw-16px)] items-center gap-1 rounded-2xl bg-zinc-400/15 p-1.5 shadow-xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
                      style={{ left: actionMenu.x, top: actionMenu.y }}
                      role="menu"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setReplyTo(actionMenu.message);
                          setActionMenu(null);
                          textareaRef.current?.focus();
                        }}
                        className="flex flex-1 flex-col items-center gap-1 rounded-xl px-4 py-2 text-xs hover:bg-zinc-400/25"
                        aria-label="রিপ্লাই"
                      >
                        <Reply className="size-4" />
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
                            <Edit3 className="size-4" />
                            <span>এডিট</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => void remove(actionMenu.message.id)}
                            className="flex flex-1 flex-col items-center gap-1 rounded-xl px-4 py-2 text-xs opacity-80 hover:bg-zinc-400/25"
                            aria-label="মুছুন"
                          >
                            <Trash2 className="size-4" />
                            <span>মুছুন</span>
                          </button>
                        </>
                      ) : null}
                    </div>
                  )}
                </>
              ) : null}

              {/* Composer */}
              <div className="shrink-0 p-3 bg-zinc-400/5">
                {editing ? (
                  <div className="flex items-center gap-2 rounded-2xl bg-zinc-400/15 px-3 py-2">
                    <Edit3 className="size-4 shrink-0 opacity-50" />
                    <input
                      type="text"
                      value={editText}
                      autoFocus
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") void update();
                        if (e.key === "Escape") setEditing(null);
                      }}
                      className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => void update()}
                      className="shrink-0 rounded-lg bg-zinc-400/25 px-3 py-1.5 text-xs font-semibold hover:bg-zinc-400/40"
                    >
                      আপডেট
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(null);
                        setEditText("");
                      }}
                      className="shrink-0 rounded-lg p-1.5 opacity-50 hover:bg-zinc-400/25"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      void send();
                    }}
                    className="flex flex-col gap-2 rounded-2xl bg-zinc-400/15 p-2"
                  >
                    {/* Reply preview */}
                    {replyTo ? (
                      <div className="flex items-center gap-2 rounded-xl bg-zinc-400/10 px-3 py-2">
                        {replyImage ? (
                          <img
                            src={
                              replyImage.preview_url ||
                              replyImage.url ||
                              replyImage.original_url ||
                              undefined
                            }
                            alt=""
                            className="size-10 shrink-0 rounded-lg object-cover"
                          />
                        ) : (
                          <Reply className="size-4 shrink-0 opacity-50" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-semibold">
                            {replyTo.sender?.name || "রিপ্লাই"}
                          </p>
                          <p className="truncate text-xs opacity-50">
                            {replyTo.message ||
                              (replyImage
                                ? "ছবি"
                                : replyTo.media?.length
                                  ? "সংযুক্তি"
                                  : "")}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setReplyTo(null)}
                          className="shrink-0 rounded-full p-1.5 opacity-50 hover:bg-zinc-400/25"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    ) : null}

                    {/* File preview */}
                    {file ? (
                      <div className="flex items-center gap-2 rounded-xl bg-zinc-400/10 px-3 py-2">
                        {preview && file.type.startsWith("image/") ? (
                          <img
                            src={preview}
                            alt=""
                            className="size-10 shrink-0 rounded-lg object-cover"
                          />
                        ) : (
                          <FileText className="size-5 shrink-0 opacity-50" />
                        )}
                        <span className="min-w-0 flex-1 truncate text-xs opacity-80">
                          {file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => setFile(null)}
                          className="shrink-0 rounded-full p-1.5 opacity-50 hover:bg-zinc-400/25"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    ) : null}

                    {/* Input row */}
                    <div className="flex items-end gap-1">
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={blocked}
                        className="shrink-0 rounded-full p-2.5 opacity-50 hover:bg-zinc-400/25 disabled:opacity-25"
                        aria-label="সংযুক্তি"
                      >
                        <Paperclip className="size-5" />
                      </button>

                      <textarea
                        ref={textareaRef}
                        value={draft}
                        disabled={blocked}
                        rows={1}
                        maxLength={2000}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            void send();
                          }
                        }}
                        placeholder={
                          blocked
                            ? "আপনি এই ব্যবহারকারীকে ব্লক করেছেন"
                            : replyTo
                              ? "রিপ্লাই লিখুন..."
                              : "মেসেজ লিখুন..."
                        }
                        className="max-h-32 min-h-10 min-w-0 flex-1 resize-none bg-transparent px-2 py-2 text-sm leading-6 outline-none disabled:opacity-50"
                      />

                      <button
                        type="submit"
                        disabled={
                          sending || blocked || (!draft.trim() && !file)
                        }
                        className="shrink-0 rounded-full bg-zinc-400/25 p-2.5 hover:bg-zinc-400/40 disabled:opacity-25"
                        aria-label="পাঠান"
                      >
                        {sending ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Send className="size-4" />
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-sm opacity-50">
              কথোপকথন শুরু করতে তালিকা থেকে যেকোনো ব্যবহারকারী নির্বাচন করুন
            </div>
          )}
        </main>
      </div>
    </section>
  );
}
