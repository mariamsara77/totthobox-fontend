"use client";

import {
  ArrowLeft,
  Ban,
  Check,
  CheckCheck,
  ChevronDown,
  FileText,
  Image as ImageIcon,
  Loader2,
  MoreVertical,
  Paperclip,
  Phone,
  Search,
  Send,
  Smile,
  Trash2,
  UserRound,
  Video,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import {
  ChatMessage,
  ChatUser,
  editMessage,
  deleteMessage,
  formatFileSize,
  getBlockStatus,
  getChatUsers,
  getMediaUrl,
  getMessages,
  getUserProfileBySlug,
  isAudioMedia,
  isImageMedia,
  isVideoMedia,
  markMessagesAsRead,
  sendMessage,
  toggleBlock,
} from "@/lib/messaging";

interface MessagingShellProps {
  targetSlug?: string;
}

function avatarOf(user?: ChatUser | null) {
  return user?.avatar || user?.profile_photo_url || null;
}

function initials(name?: string | null) {
  return (name || "?").trim().slice(0, 1).toUpperCase();
}

function formatTime(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("bn-BD", { hour: "numeric", minute: "2-digit" }).format(date);
}

function formatListTime(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  return sameDay
    ? formatTime(value)
    : new Intl.DateTimeFormat("bn-BD", { day: "numeric", month: "short" }).format(date);
}

function normalizeMessages(payload: Awaited<ReturnType<typeof getMessages>>) {
  const items = Array.isArray(payload?.data) ? payload.data : [];
  return [...items].sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at));
}

function lastMessageForUser(messages: ChatMessage[], userId: number, currentUserId?: number) {
  const relevant = messages.filter(
    (message) =>
      (message.sender_id === userId && message.receiver_id === currentUserId) ||
      (message.sender_id === currentUserId && message.receiver_id === userId),
  );
  return relevant.at(-1) || null;
}

function Avatar({ user, size = "md" }: { user?: ChatUser | null; size?: "sm" | "md" | "lg" }) {
  const dimensions = size === "lg" ? "size-12" : size === "sm" ? "size-9" : "size-10";
  const online = user?.is_online;
  const image = avatarOf(user);

  return (
    <span className={`relative inline-flex shrink-0 ${dimensions}`}>
      <span className="flex size-full items-center justify-center overflow-hidden rounded-full bg-zinc-100 text-sm font-semibold text-zinc-700 ring-1 ring-black/5 dark:bg-zinc-800 dark:text-zinc-200 dark:ring-white/10">
        {image ? <img src={image} alt="" className="size-full object-cover" /> : initials(user?.name)}
      </span>
      {online ? <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white bg-emerald-500 dark:border-zinc-950" /> : null}
    </span>
  );
}

function MessageBubble({
  message,
  own,
  onEdit,
  onDelete,
}: {
  message: ChatMessage;
  own: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [menu, setMenu] = useState(false);
  const media = message.media || [];

  return (
    <div className={`group flex w-full ${own ? "justify-end" : "justify-start"}`}>
      <div className={`relative flex max-w-[88%] items-end gap-2 sm:max-w-[70%] ${own ? "flex-row-reverse" : ""}`}>
        <div
          className={`rounded-2xl px-3.5 py-2.5 shadow-sm ${
            own
              ? "rounded-br-md bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
              : "rounded-bl-md border border-zinc-200 bg-white text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
          }`}
        >
          {message.parent ? (
            <div className={`mb-2 rounded-xl border-l-2 px-2.5 py-1.5 text-xs ${own ? "border-white/50 bg-white/10 text-white/80" : "border-zinc-300 bg-zinc-50 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800"}`}>
              <div className="font-medium">রিপ্লাই</div>
              <div className="truncate">{message.parent.message || "সংযুক্তি"}</div>
            </div>
          ) : null}

          {message.message ? <p className="whitespace-pre-wrap break-words text-[15px] leading-6">{message.message}</p> : null}

          {media.length > 0 ? (
            <div className={`mt-2 grid gap-2 ${media.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
              {media.map((item) => {
                const url = getMediaUrl(item);
                if (!url) return null;
                if (isImageMedia(item)) {
                  return (
                    <a key={item.id} href={url} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-xl">
                      <img src={url} alt={item.name || item.file_name || "ছবি"} className="max-h-72 w-full object-cover" loading="lazy" />
                    </a>
                  );
                }
                if (isVideoMedia(item)) {
                  return <video key={item.id} src={url} controls preload="metadata" className="max-h-72 w-full rounded-xl" />;
                }
                if (isAudioMedia(item)) {
                  return <audio key={item.id} src={url} controls className="w-full" />;
                }
                return (
                  <a key={item.id} href={url} target="_blank" rel="noreferrer" className={`flex min-w-48 items-center gap-3 rounded-xl p-3 ${own ? "bg-white/10" : "bg-zinc-100 dark:bg-zinc-800"}`}>
                    <span className="rounded-lg bg-white/10 p-2"><FileText className="size-5" /></span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{item.name || item.file_name || "ফাইল"}</span>
                      <span className={`block text-xs ${own ? "text-white/60" : "text-zinc-500"}`}>{formatFileSize(item.size)}</span>
                    </span>
                  </a>
                );
              })}
            </div>
          ) : null}

          <div className={`mt-1.5 flex items-center justify-end gap-1 text-[10px] ${own ? "text-white/60 dark:text-zinc-500" : "text-zinc-400"}`}>
            <span>{formatTime(message.created_at)}</span>
            {own ? (
              Number(message.read) === 1 || Boolean(message.read_at) ? <CheckCheck className="size-3.5" /> : <Check className="size-3.5" />
            ) : null}
          </div>
        </div>

        {own ? (
          <div className="relative self-center opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
            <button type="button" onClick={() => setMenu((value) => !value)} className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200" aria-label="মেসেজ অপশন">
              <MoreVertical className="size-4" />
            </button>
            {menu ? (
              <div className="absolute right-0 top-8 z-20 w-32 overflow-hidden rounded-xl border border-zinc-200 bg-white p-1 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
                <button type="button" onClick={() => { setMenu(false); onEdit(); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800"><ChevronDown className="size-3.5" />এডিট</button>
                <button type="button" onClick={() => { setMenu(false); onDelete(); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"><Trash2 className="size-3.5" />ডিলিট</button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function MessagingShell({ targetSlug }: MessagingShellProps) {
  const { user: authUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [selected, setSelected] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sending, setSending] = useState(false);
  const [blocking, setBlocking] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [mobileChatOpen, setMobileChatOpen] = useState(Boolean(targetSlug));
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const firstLoadRef = useRef(true);

  const upsertUsers = useCallback((incoming: ChatUser[]) => {
    setUsers((current) => {
      const map = new Map(current.map((item) => [item.id, item]));
      incoming.forEach((item) => map.set(item.id, { ...map.get(item.id), ...item }));
      return [...map.values()].filter((item) => item.id !== authUser?.id);
    });
  }, [authUser?.id]);

  const loadUsers = useCallback(async () => {
    if (!authUser) return;
    try {
      const data = await getChatUsers();
      upsertUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      if (firstLoadRef.current) toast.error(error instanceof Error ? error.message : "চ্যাট লোড করা যায়নি");
    } finally {
      setLoadingUsers(false);
    }
  }, [authUser, upsertUsers]);

  useEffect(() => {
    if (!authLoading && !authUser) router.replace(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
  }, [authLoading, authUser, router]);

  useEffect(() => {
    if (!authUser) return;
    void loadUsers();
    const timer = window.setInterval(() => void loadUsers(), 8000);
    return () => window.clearInterval(timer);
  }, [authUser, loadUsers]);

  useEffect(() => {
    if (!targetSlug || !authUser) return;
    let cancelled = false;
    (async () => {
      try {
        const payload = await getUserProfileBySlug(targetSlug);
        const profile = payload?.data?.profile || payload?.profile;
        if (!profile || profile.id === authUser.id || cancelled) return;
        upsertUsers([profile]);
        setSelected(profile);
        setMobileChatOpen(true);
      } catch {
        if (!cancelled) toast.error("এই ব্যবহারকারীর তথ্য পাওয়া যায়নি");
      }
    })();
    return () => { cancelled = true; };
  }, [targetSlug, authUser, upsertUsers]);

  const selectUser = useCallback((nextUser: ChatUser) => {
    setSelected(nextUser);
    setMobileChatOpen(true);
    setMessages([]);
    setPage(1);
    setHasMore(false);
    setDraft("");
    setAttachment(null);
    setBlocked(false);
  }, []);

  const loadMessages = useCallback(async (userId: number, nextPage = 1, appendOlder = false) => {
    if (appendOlder) setLoadingMore(true); else setLoadingMessages(true);
    try {
      const payload = await getMessages(userId, nextPage, 30);
      const incoming = normalizeMessages(payload);
      setHasMore(Boolean(payload?.next_page_url) || (payload?.current_page ?? 1) < (payload?.last_page ?? 1));
      setPage(nextPage);
      setMessages((current) => {
        const map = new Map((appendOlder ? [...incoming, ...current] : incoming).map((item) => [item.id, item]));
        return [...map.values()].sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at));
      });
      if (!appendOlder) {
        await markMessagesAsRead(userId).catch(() => undefined);
        requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: "auto", block: "end" }));
      }
    } catch (error) {
      if (!appendOlder) toast.error(error instanceof Error ? error.message : "মেসেজ লোড করা যায়নি");
    } finally {
      setLoadingMessages(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    if (!selected?.id || !authUser) return;
    let cancelled = false;
    const run = async () => {
      if (cancelled) return;
      await loadMessages(selected.id, 1, false);
      getBlockStatus(selected.id)
        .then((data) => !cancelled && setBlocked(Boolean(data?.blocked ?? data?.is_blocked)))
        .catch(() => undefined);
    };
    void run();
    const timer = window.setInterval(async () => {
      if (cancelled) return;
      try {
        const payload = await getMessages(selected.id, 1, 30);
        const incoming = normalizeMessages(payload);
        setMessages((current) => {
          const previousLast = current.at(-1)?.id;
          const map = new Map([...current, ...incoming].map((item) => [item.id, item]));
          const next = [...map.values()].sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at));
          if (next.at(-1)?.id !== previousLast) {
            requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }));
          }
          return next;
        });
        await markMessagesAsRead(selected.id).catch(() => undefined);
      } catch {
        // Background sync intentionally stays silent.
      }
    }, 2500);
    return () => { cancelled = true; window.clearInterval(timer); };
  }, [selected?.id, authUser, loadMessages]);

  useEffect(() => {
    firstLoadRef.current = false;
  }, []);

  useEffect(() => {
    if (!attachment) {
      setAttachmentPreview(null);
      return;
    }
    const url = URL.createObjectURL(attachment);
    setAttachmentPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [attachment]);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    const sorted = [...users].sort((a, b) => {
      const aLast = lastMessageForUser(messages, a.id, authUser?.id)?.created_at || "";
      const bLast = lastMessageForUser(messages, b.id, authUser?.id)?.created_at || "";
      return +new Date(bLast || 0) - +new Date(aLast || 0);
    });
    if (!term) return sorted;
    return sorted.filter((item) => item.name.toLowerCase().includes(term));
  }, [users, search, messages, authUser?.id]);

  const handleSend = async () => {
    if (!selected || sending || blocked || (!draft.trim() && !attachment)) return;
    const text = draft;
    const file = attachment;
    setDraft("");
    setAttachment(null);
    setSending(true);
    try {
      const sent = await sendMessage(selected.id, text, file);
      setMessages((current) => [...current.filter((item) => item.id !== sent.id), sent].sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at)));
      requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }));
      void loadUsers();
    } catch (error) {
      setDraft(text);
      setAttachment(file);
      toast.error(error instanceof Error ? error.message : "মেসেজ পাঠানো যায়নি");
    } finally {
      setSending(false);
    }
  };

  const handleEdit = async () => {
    if (!editingId || !editDraft.trim()) return;
    try {
      const updated = await editMessage(editingId, editDraft);
      setMessages((current) => current.map((item) => item.id === updated.id ? { ...item, ...updated } : item));
      setEditingId(null);
      setEditDraft("");
      toast.success("মেসেজ আপডেট হয়েছে");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "মেসেজ আপডেট করা যায়নি");
    }
  };

  const handleDelete = async (messageId: number) => {
    if (!window.confirm("এই মেসেজটি মুছে ফেলবেন?")) return;
    try {
      await deleteMessage(messageId);
      setMessages((current) => current.filter((item) => item.id !== messageId));
      toast.success("মেসেজ মুছে ফেলা হয়েছে");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "মেসেজ মুছতে পারেনি");
    }
  };

  const handleBlock = async () => {
    if (!selected || blocking) return;
    setBlocking(true);
    try {
      const data = await toggleBlock(selected.id);
      const next = Boolean(data?.blocked ?? data?.is_blocked ?? !blocked);
      setBlocked(next);
      toast.success(next ? "ব্যবহারকারী ব্লক করা হয়েছে" : "ব্যবহারকারী আনব্লক করা হয়েছে");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "অ্যাকশন সম্পন্ন হয়নি");
    } finally {
      setBlocking(false);
    }
  };

  const emptyState = !loadingUsers && filteredUsers.length === 0;

  if (authLoading || !authUser) {
    return <div className="flex min-h-[70vh] items-center justify-center"><Loader2 className="size-6 animate-spin text-zinc-400" /></div>;
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-0 py-0 sm:px-4 sm:py-6">
      <div className="overflow-hidden border-y border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:rounded-3xl sm:border">
        <div className="grid h-[calc(100dvh-4.5rem)] min-h-[620px] grid-cols-1 md:grid-cols-[340px_minmax(0,1fr)] md:h-[min(780px,calc(100dvh-7rem))]">
          <aside className={`${mobileChatOpen ? "hidden md:flex" : "flex"} min-h-0 flex-col border-r border-zinc-200 dark:border-zinc-800`}>
            <div className="border-b border-zinc-200 px-4 pb-3 pt-4 dark:border-zinc-800">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h1 className="text-lg font-bold tracking-tight text-zinc-950 dark:text-white">মেসেজ</h1>
                  <p className="mt-0.5 text-xs text-zinc-500">আপনার কথোপকথন</p>
                </div>
                <Avatar user={authUser} size="md" />
              </div>
              <label className="mt-4 flex h-10 items-center gap-2 rounded-xl bg-zinc-100 px-3 text-zinc-500 dark:bg-zinc-900">
                <Search className="size-4" />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="চ্যাট খুঁজুন..." className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400" />
              </label>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-2">
              {loadingUsers ? (
                <div className="space-y-2 p-2">{[1, 2, 3, 4, 5].map((item) => <div key={item} className="flex animate-pulse gap-3 rounded-2xl p-3"><div className="size-10 rounded-full bg-zinc-200 dark:bg-zinc-800" /><div className="flex-1 space-y-2"><div className="h-3 w-28 rounded bg-zinc-200 dark:bg-zinc-800" /><div className="h-2 w-20 rounded bg-zinc-200 dark:bg-zinc-800" /></div></div>)}</div>
              ) : emptyState ? (
                <div className="flex h-full flex-col items-center justify-center px-8 text-center">
                  <div className="rounded-2xl bg-zinc-100 p-4 text-zinc-500 dark:bg-zinc-900"><UserRound className="size-7" /></div>
                  <h2 className="mt-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">এখনও কোনো চ্যাট নেই</h2>
                  <p className="mt-1 text-xs leading-5 text-zinc-500">কোনো ব্যবহারকারীর প্রোফাইল থেকে মেসেজ শুরু করুন।</p>
                </div>
              ) : (
                filteredUsers.map((item) => {
                  const last = lastMessageForUser(item.id, item.id, authUser.id);
                  const preview = last?.message || (last?.media?.length ? "📎 সংযুক্তি" : "");
                  return (
                    <button key={item.id} type="button" onClick={() => selectUser(item)} className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition ${selected?.id === item.id ? "bg-zinc-100 dark:bg-zinc-900" : "hover:bg-zinc-50 dark:hover:bg-zinc-900/60"}`}>
                      <Avatar user={item} />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2"><span className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">{item.name}</span><span className="shrink-0 text-[10px] text-zinc-400">{formatListTime(last?.created_at)}</span></span>
                        <span className="mt-0.5 block truncate text-xs text-zinc-500">{preview || (item.is_online ? "অনলাইনে আছেন" : "অফলাইনে")}</span>
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          <main className={`${mobileChatOpen ? "flex" : "hidden md:flex"} min-w-0 flex-col bg-zinc-50/70 dark:bg-zinc-950`}>
            {selected ? (
              <>
                <header className="flex h-16 shrink-0 items-center gap-3 border-b border-zinc-200 bg-white px-3 dark:border-zinc-800 dark:bg-zinc-950 sm:px-5">
                  <button type="button" onClick={() => { setMobileChatOpen(false); router.push("/messages"); }} className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 md:hidden" aria-label="চ্যাট তালিকায় ফিরুন"><ArrowLeft className="size-5" /></button>
                  <Avatar user={selected} size="md" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2"><h2 className="truncate text-sm font-semibold text-zinc-950 dark:text-white">{selected.name}</h2>{selected.status === "active" ? <span className="size-1.5 rounded-full bg-emerald-500" /> : null}</div>
                    <p className="text-xs text-zinc-500">{selected.is_online ? "অনলাইনে আছেন" : "অফলাইনে"}</p>
                  </div>
                  <button type="button" className="hidden rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-900 sm:block" aria-label="অডিও কল"><Phone className="size-4.5" /></button>
                  <button type="button" className="hidden rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-900 sm:block" aria-label="ভিডিও কল"><Video className="size-4.5" /></button>
                  <button type="button" onClick={handleBlock} disabled={blocking} className={`rounded-full p-2 transition ${blocked ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30" : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-900"}`} aria-label={blocked ? "আনব্লক" : "ব্লক"}>{blocking ? <Loader2 className="size-4 animate-spin" /> : <Ban className="size-4" />}</button>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-6">
                  {hasMore ? <div className="mb-4 flex justify-center"><button type="button" onClick={() => loadMessages(selected.id, page + 1, true)} disabled={loadingMore} className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-medium text-zinc-600 shadow-sm hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">{loadingMore ? "লোড হচ্ছে..." : "পুরোনো মেসেজ দেখুন"}</button></div> : null}
                  {loadingMessages ? (
                    <div className="flex h-full items-center justify-center"><Loader2 className="size-6 animate-spin text-zinc-400" /></div>
                  ) : messages.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                      <Avatar user={selected} size="lg" />
                      <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-white">{selected.name}-কে মেসেজ পাঠান</h3>
                      <p className="mt-1 max-w-sm text-xs leading-5 text-zinc-500">আপনার কথোপকথন এখানে দেখা যাবে। ছবি, ভিডিও বা ফাইলও পাঠাতে পারবেন।</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {messages.map((message) => (
                        <MessageBubble
                          key={message.id}
                          message={message}
                          own={message.sender_id === authUser.id}
                          onEdit={() => { setEditingId(message.id); setEditDraft(message.message || ""); }}
                          onDelete={() => void handleDelete(message.id)}
                        />
                      ))}
                      <div ref={bottomRef} />
                    </div>
                  )}
                </div>

                <footer className="shrink-0 border-t border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950 sm:p-4">
                  {editingId ? (
                    <div className="mb-2 flex items-center gap-2 rounded-xl bg-zinc-100 px-3 py-2 text-xs dark:bg-zinc-900">
                      <span className="flex-1 truncate">মেসেজ এডিট হচ্ছে</span>
                      <button type="button" onClick={() => setEditingId(null)} className="rounded-full p-1 text-zinc-500 hover:bg-white dark:hover:bg-zinc-800"><X className="size-4" /></button>
                    </div>
                  ) : null}

                  {attachment ? (
                    <div className="mb-2 flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-zinc-900">
                      {attachmentPreview && attachment.type.startsWith("image/") ? <img src={attachmentPreview} alt="" className="size-12 rounded-lg object-cover" /> : <span className="rounded-lg bg-white p-2 dark:bg-zinc-800"><FileText className="size-5" /></span>}
                      <span className="min-w-0 flex-1"><span className="block truncate text-xs font-medium">{attachment.name}</span><span className="text-[10px] text-zinc-500">{formatFileSize(attachment.size)}</span></span>
                      <button type="button" onClick={() => setAttachment(null)} className="rounded-full p-1.5 text-zinc-400 hover:bg-white hover:text-zinc-800 dark:hover:bg-zinc-800"><X className="size-4" /></button>
                    </div>
                  ) : null}

                  {editingId ? (
                    <div className="flex items-end gap-2">
                      <textarea value={editDraft} onChange={(event) => setEditDraft(event.target.value)} rows={1} autoFocus className="min-h-11 flex-1 resize-none rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900" />
                      <button type="button" onClick={() => void handleEdit()} disabled={!editDraft.trim()} className="grid size-11 shrink-0 place-items-center rounded-full bg-zinc-950 text-white disabled:opacity-40 dark:bg-white dark:text-zinc-950"><Check className="size-5" /></button>
                    </div>
                  ) : (
                    <div className="flex items-end gap-2">
                      <button type="button" onClick={() => fileInputRef.current?.click()} disabled={blocked || sending} className="grid size-11 shrink-0 place-items-center rounded-full text-zinc-500 hover:bg-zinc-100 disabled:opacity-40 dark:hover:bg-zinc-900" aria-label="ফাইল সংযুক্ত করুন"><Paperclip className="size-5" /></button>
                      <input ref={fileInputRef} type="file" accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip" className="hidden" onChange={(event) => setAttachment(event.target.files?.[0] || null)} />
                      <div className="relative flex min-h-11 flex-1 items-end rounded-2xl bg-zinc-100 dark:bg-zinc-900">
                        <textarea value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void handleSend(); } }} rows={1} disabled={blocked || sending} placeholder={blocked ? "এই ব্যবহারকারীকে মেসেজ পাঠানো যাবে না" : "মেসেজ লিখুন..."} className="max-h-32 min-h-11 w-full resize-none bg-transparent px-4 py-3 pr-20 text-sm leading-5 outline-none placeholder:text-zinc-400 disabled:cursor-not-allowed" />
                        <div className="absolute bottom-1.5 right-1.5 flex items-center gap-0.5">
                          <button type="button" disabled className="hidden rounded-full p-2 text-zinc-400 sm:block" aria-label="ইমোজি"><Smile className="size-4.5" /></button>
                        </div>
                      </div>
                      <button type="button" onClick={() => void handleSend()} disabled={blocked || sending || (!draft.trim() && !attachment)} className="grid size-11 shrink-0 place-items-center rounded-full bg-zinc-950 text-white shadow-sm transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-zinc-950" aria-label="মেসেজ পাঠান">{sending ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />}</button>
                    </div>
                  )}
                  <p className="mt-2 hidden text-center text-[10px] text-zinc-400 sm:block">Enter চাপলে মেসেজ পাঠাবে • Shift + Enter নতুন লাইন</p>
                </footer>
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center px-8 text-center">
                <div className="rounded-3xl bg-zinc-100 p-5 text-zinc-500 dark:bg-zinc-900"><Send className="size-8" /></div>
                <h2 className="mt-5 text-lg font-bold text-zinc-950 dark:text-white">আপনার মেসেজ</h2>
                <p className="mt-1 max-w-sm text-sm leading-6 text-zinc-500">বাম পাশ থেকে একটি কথোপকথন নির্বাচন করুন অথবা কোনো ব্যবহারকারীর প্রোফাইল থেকে নতুন মেসেজ শুরু করুন।</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  );
}
