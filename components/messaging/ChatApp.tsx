"use client";

import { ArrowLeft, Check, CheckCheck, FileText, Loader2, MoreVertical, Paperclip, Search, Send, ShieldBan, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { ChatMessage, ChatUser, deleteMessage, editMessage, formatFileSize, getBlockStatus, getChatUsers, getMediaUrl, getMessages, getUserProfileBySlug, isAudioMedia, isImageMedia, isVideoMedia, markMessagesAsRead, sendMessage, toggleBlock } from "@/lib/messaging";

interface Props { targetSlug?: string }

const getAvatar = (user?: ChatUser | null) => user?.avatar || user?.avatar_url || user?.profile_photo_url || null;
const getInitial = (name?: string | null) => (name || "?").trim().charAt(0).toUpperCase();
const formatTime = (value?: string | null) => value ? new Intl.DateTimeFormat("bn-BD", { hour: "numeric", minute: "2-digit" }).format(new Date(value)) : "";
const sortMessages = (messages: ChatMessage[]) => [...messages].sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at));
const getLastMessage = (user: ChatUser) => [...(user.sentMessages || []), ...(user.receivedMessages || [])].sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at)).at(-1);

function Avatar({ user, size = "md" }: { user?: ChatUser | null; size?: "sm" | "md" | "lg" }) {
  const source = getAvatar(user);
  const dimensions = size === "lg" ? "size-12" : size === "sm" ? "size-9" : "size-10";
  const indicator = size === "lg" ? "size-3" : "size-2.5";
  return <span className={`relative inline-flex shrink-0 ${dimensions}`}>
    <span className="flex size-full items-center justify-center overflow-hidden rounded-full bg-emerald-50 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900/50">
      {source ? <img src={source} alt="" className="size-full object-cover" /> : getInitial(user?.name)}
    </span>
    {user?.is_online ? <span className={`absolute bottom-0 right-0 ${indicator} rounded-full border-2 border-white bg-emerald-500 dark:border-zinc-950`} /> : null}
  </span>;
}

function MessageBubble({ message, own, onEdit, onDelete }: { message: ChatMessage; own: boolean; onEdit: () => void; onDelete: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return <div className={`group flex w-full ${own ? "justify-end" : "justify-start"}`}>
    <div className={`flex max-w-[calc(100%-1rem)] items-end gap-1.5 sm:max-w-[78%] ${own ? "flex-row-reverse" : ""}`}>
      <div className={`min-w-0 rounded-2xl px-3.5 py-2.5 shadow-sm ${own ? "rounded-br-md bg-emerald-600 text-white" : "rounded-bl-md border border-zinc-200 bg-white text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"}`}>
        {message.parent ? <div className={`mb-2 max-w-full rounded-lg border-l-2 px-2.5 py-1.5 text-xs ${own ? "border-white/50 bg-white/10 text-white/80" : "border-emerald-500 bg-zinc-50 text-zinc-500 dark:bg-zinc-800"}`}><div className="font-medium">রিপ্লাই</div><div className="truncate">{message.parent.message || "সংযুক্তি"}</div></div> : null}
        {message.message ? <p className="whitespace-pre-wrap break-words text-[15px] leading-6">{message.message}</p> : null}
        {message.media?.map((media) => {
          const url = getMediaUrl(media);
          if (!url) return null;
          if (isImageMedia(media)) return <a key={media.id} href={url} target="_blank" rel="noreferrer" className="mt-2 block max-w-full overflow-hidden rounded-xl"><img src={url} alt={media.name || "ছবি"} loading="lazy" className="max-h-80 w-full object-cover" /></a>;
          if (isVideoMedia(media)) return <video key={media.id} src={url} controls preload="metadata" className="mt-2 max-h-80 max-w-full rounded-xl" />;
          if (isAudioMedia(media)) return <audio key={media.id} src={url} controls className="mt-2 max-w-full" />;
          return <a key={media.id} href={url} target="_blank" rel="noreferrer" className={`mt-2 flex min-w-0 max-w-full items-center gap-2 rounded-xl p-3 text-xs ${own ? "bg-white/10" : "bg-zinc-50 dark:bg-zinc-800"}`}><FileText className="size-5 shrink-0" /><span className="min-w-0 truncate">{media.name || media.file_name || "ফাইল"}{media.size ? ` · ${formatFileSize(media.size)}` : ""}</span></a>;
        })}
        <div className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${own ? "text-white/70" : "text-zinc-400"}`}><span>{formatTime(message.created_at)}</span>{own ? Number(message.read) === 1 || Boolean(message.read_at) ? <CheckCheck className="size-3.5" /> : <Check className="size-3.5" /> : null}</div>
      </div>
      {own ? <div className="relative self-center opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100"><button type="button" aria-label="মেসেজ অপশন" onClick={() => setMenuOpen((value) => !value)} className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"><MoreVertical className="size-4" /></button>{menuOpen ? <div className="absolute bottom-7 right-0 z-30 w-28 overflow-hidden rounded-xl border border-zinc-200 bg-white p-1 shadow-xl dark:border-zinc-800 dark:bg-zinc-900"><button type="button" onClick={() => { setMenuOpen(false); onEdit(); }} className="w-full rounded-lg px-3 py-2 text-left text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800">এডিট</button><button type="button" onClick={() => { setMenuOpen(false); onDelete(); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"><Trash2 className="size-3.5" />ডিলিট</button></div> : null}</div> : null}
    </div>
  </div>;
}

export default function ChatApp({ targetSlug }: Props) {
  const { user: me, loading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [selected, setSelected] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [blockLoading, setBlockLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [mobileChat, setMobileChat] = useState(Boolean(targetSlug));
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mergeUsers = useCallback((incoming: ChatUser[]) => setUsers((current) => {
    const map = new Map(current.map((user) => [user.id, user]));
    incoming.forEach((user) => { if (user.slug && user.id !== me?.id) map.set(user.id, { ...map.get(user.id), ...user }); });
    return [...map.values()].filter((user) => user.id !== me?.id && Boolean(user.slug));
  }), [me?.id]);

  const refreshUsers = useCallback(async () => {
    if (!me) return;
    try { const response = await getChatUsers(); mergeUsers(Array.isArray(response) ? response : []); }
    catch (error) { toast.error(error instanceof Error ? error.message : "চ্যাট লোড করা যায়নি"); }
    finally { setLoadingUsers(false); }
  }, [me, mergeUsers]);

  useEffect(() => { if (!authLoading && !me) router.replace(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`); }, [authLoading, me, router]);
  useEffect(() => { if (!me) return; void refreshUsers(); const timer = window.setInterval(() => void refreshUsers(), 10000); return () => window.clearInterval(timer); }, [me, refreshUsers]);

  useEffect(() => {
    if (!targetSlug || !me) return;
    let cancelled = false;
    getUserProfileBySlug(targetSlug).then((response) => { const user = response.data?.profile || response.profile; if (!cancelled && user && user.id !== me.id && user.slug) { mergeUsers([user]); setSelected(user); setMobileChat(true); } }).catch(() => { if (!cancelled) toast.error("এই ব্যবহারকারীর তথ্য পাওয়া যায়নি"); });
    return () => { cancelled = true; };
  }, [targetSlug, me, mergeUsers]);

  const loadMessages = useCallback(async (slug: string, nextPage = 1, older = false) => {
    if (older) setMoreLoading(true); else setLoadingMessages(true);
    try {
      const response = await getMessages(slug, nextPage, 30);
      const incoming = sortMessages(response.data || []);
      setHasMore(Boolean(response.next_page_url) || (response.current_page || 1) < (response.last_page || 1));
      setPage(nextPage);
      setMessages((current) => {
        const merged = older ? [...incoming, ...current] : incoming;
        return [...new Map(merged.map((message) => [message.id, message])).values()].sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at));
      });
      if (!older) { await markMessagesAsRead(slug).catch(() => undefined); requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: "auto" })); }
    } catch (error) { if (!older) toast.error(error instanceof Error ? error.message : "মেসেজ লোড করা যায়নি"); }
    finally { setLoadingMessages(false); setMoreLoading(false); }
  }, []);

  useEffect(() => {
    if (!selected?.slug || !me) return;
    let cancelled = false;
    const slug = selected.slug;
    void loadMessages(slug);
    getBlockStatus(slug).then((response) => { if (!cancelled) setBlocked(Boolean(response.blocked ?? response.is_blocked)); }).catch(() => undefined);
    const timer = window.setInterval(async () => {
      if (cancelled) return;
      try {
        const response = await getMessages(slug, 1, 30);
        const incoming = sortMessages(response.data || []);
        setMessages((current) => [...new Map([...current, ...incoming].map((message) => [message.id, message])).values()].sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at)));
        await markMessagesAsRead(slug).catch(() => undefined);
      } catch { /* keep current conversation */ }
    }, 4000);
    return () => { cancelled = true; window.clearInterval(timer); };
  }, [selected, me, loadMessages]);

  useEffect(() => { if (!file) { setPreview(null); return; } const url = URL.createObjectURL(file); setPreview(url); return () => URL.revokeObjectURL(url); }, [file]);

  const conversations = useMemo(() => { const term = query.trim().toLowerCase(); return [...users].sort((a, b) => +new Date(getLastMessage(b)?.created_at || 0) - +new Date(getLastMessage(a)?.created_at || 0)).filter((user) => !term || user.name.toLowerCase().includes(term)); }, [users, query]);
  const selectUser = (user: ChatUser) => { setSelected(user); setMobileChat(true); setMessages([]); setPage(1); setHasMore(false); setBlocked(false); setEditing(null); router.replace(`/messages/${encodeURIComponent(user.slug)}`); };
  const goBack = () => { setMobileChat(false); router.push("/messages"); };

  const send = async () => {
    if (!selected || (!draft.trim() && !file) || sending || blocked) return;
    const text = draft; const attachment = file; setDraft(""); setFile(null); setSending(true);
    try { const sent = await sendMessage(selected.id, text, attachment); setMessages((current) => sortMessages([...current.filter((message) => message.id !== sent.id), sent])); requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" })); void refreshUsers(); }
    catch (error) { setDraft(text); setFile(attachment); toast.error(error instanceof Error ? error.message : "মেসেজ পাঠানো যায়নি"); }
    finally { setSending(false); }
  };

  const removeMessage = async (id: number) => { if (!window.confirm("এই মেসেজটি মুছে ফেলবেন?")) return; try { await deleteMessage(id); setMessages((current) => current.filter((message) => message.id !== id)); toast.success("মেসেজ মুছে ফেলা হয়েছে"); } catch (error) { toast.error(error instanceof Error ? error.message : "মেসেজ মুছতে পারেনি"); } };
  const updateMessage = async () => { if (!editing || !editText.trim()) return; try { const updated = await editMessage(editing, editText); setMessages((current) => current.map((message) => message.id === updated.id ? { ...message, ...updated } : message)); setEditing(null); setEditText(""); toast.success("মেসেজ আপডেট হয়েছে"); } catch (error) { toast.error(error instanceof Error ? error.message : "মেসেজ আপডেট করা যায়নি"); } };
  const changeBlockState = async () => { if (!selected?.slug || blockLoading) return; setBlockLoading(true); try { const response = await toggleBlock(selected.slug); const next = Boolean(response.blocked ?? response.is_blocked ?? !blocked); setBlocked(next); toast.success(next ? "ব্যবহারকারী ব্লক করা হয়েছে" : "ব্যবহারকারী আনব্লক করা হয়েছে"); } catch (error) { toast.error(error instanceof Error ? error.message : "অ্যাকশন সম্পন্ন হয়নি"); } finally { setBlockLoading(false); } };

  if (authLoading || !me) return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="size-6 animate-spin text-zinc-400" /></div>;

  return <section className="w-full py-0 sm:py-5"><div className="mx-auto w-full max-w-7xl px-0 sm:px-4"><div className="grid h-[calc(100svh-4rem)] min-h-0 w-full grid-cols-1 overflow-hidden border-y border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 sm:h-[min(760px,calc(100svh-6rem))] sm:min-h-[620px] sm:rounded-2xl sm:border sm:shadow-sm md:grid-cols-[minmax(280px,340px)_minmax(0,1fr)]">
    <aside className={`${mobileChat ? "hidden md:flex" : "flex"} min-h-0 min-w-0 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950`}>
      <div className="shrink-0 border-b border-zinc-200 px-4 py-4 dark:border-zinc-800"><div className="mb-3 flex items-center justify-between gap-3"><div><h1 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">মেসেজ</h1><p className="mt-0.5 text-xs text-zinc-500">আপনার ব্যক্তিগত কথোপকথন</p></div><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">{users.length} জন</span></div><label className="flex h-10 items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 transition focus-within:border-emerald-400 focus-within:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:focus-within:bg-zinc-950"><Search className="size-4 shrink-0 text-zinc-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="কথোপকথন খুঁজুন..." className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400" /></label></div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{loadingUsers ? <div className="flex justify-center py-12"><Loader2 className="size-5 animate-spin text-zinc-400" /></div> : conversations.length ? <div className="py-1">{conversations.map((user) => { const last = getLastMessage(user); const active = selected?.id === user.id; return <button key={user.id} type="button" onClick={() => selectUser(user)} className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${active ? "bg-emerald-50/80 dark:bg-emerald-950/20" : "hover:bg-zinc-50 dark:hover:bg-zinc-900/70"}`}><Avatar user={user} /><span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-2"><span className="truncate text-sm font-semibold text-zinc-800 dark:text-zinc-100">{user.name}</span><span className="shrink-0 text-[10px] text-zinc-400">{last ? formatTime(last.created_at) : ""}</span></span><span className="mt-0.5 block truncate text-xs text-zinc-500 dark:text-zinc-400">{last?.message || (last?.media?.length ? "সংযুক্তি" : "কথোপকথন শুরু করুন")}</span></span></button>; })}</div> : <div className="px-6 py-16 text-center"><div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900"><Search className="size-5 text-zinc-400" /></div><p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">কোনো কথোপকথন নেই</p><p className="mt-1 text-xs text-zinc-400">কোনো ব্যবহারকারীর প্রোফাইল থেকে মেসেজ শুরু করুন।</p></div>}</div>
    </aside>

    <main className={`${mobileChat ? "flex" : "hidden md:flex"} min-h-0 min-w-0 flex-col bg-zinc-50/70 dark:bg-zinc-950`}>
      {selected ? <><header className="flex h-[68px] shrink-0 items-center gap-3 border-b border-zinc-200 bg-white px-3 dark:border-zinc-800 dark:bg-zinc-950 sm:px-5"><button type="button" onClick={goBack} aria-label="ফিরে যান" className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 md:hidden dark:hover:bg-zinc-900"><ArrowLeft className="size-5" /></button><Avatar user={selected} size="lg" /><div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold text-zinc-900 dark:text-white">{selected.name}</div><div className="mt-0.5 flex items-center gap-1.5 text-xs text-zinc-500"><span className={`size-1.5 rounded-full ${selected.is_online ? "bg-emerald-500" : "bg-zinc-300"}`} />{selected.is_online ? "অনলাইনে আছেন" : "অফলাইন"}</div></div><button type="button" disabled={blockLoading} onClick={changeBlockState} aria-label={blocked ? "আনব্লক" : "ব্লক"} title={blocked ? "আনব্লক" : "ব্লক"} className={`rounded-full p-2 transition ${blocked ? "bg-red-50 text-red-600 dark:bg-red-950/30" : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900"}`}>{blockLoading ? <Loader2 className="size-5 animate-spin" /> : <ShieldBan className="size-5" />}</button></header>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4 sm:px-5"><div className="mx-auto flex min-h-full max-w-3xl flex-col justify-end gap-2">{hasMore ? <button type="button" disabled={moreLoading} onClick={() => loadMessages(selected.slug, page + 1, true)} className="mx-auto mb-2 flex shrink-0 items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-medium text-zinc-600 shadow-sm hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">{moreLoading ? <Loader2 className="size-3 animate-spin" /> : null}পুরোনো মেসেজ দেখুন</button> : null}{loadingMessages && !messages.length ? <div className="flex flex-1 items-center justify-center py-16"><Loader2 className="size-5 animate-spin text-zinc-400" /></div> : messages.length ? messages.map((message) => <MessageBubble key={message.id} message={message} own={message.sender_id === me.id} onEdit={() => { setEditing(message.id); setEditText(message.message || ""); }} onDelete={() => void removeMessage(message.id)} />) : <div className="flex flex-1 items-center justify-center py-16 text-center"><div><div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300"><Send className="size-5" /></div><p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">কথোপকথন শুরু করুন</p><p className="mt-1 text-xs text-zinc-400">আপনার প্রথম মেসেজটি পাঠান।</p></div></div>}<div ref={bottomRef} className="h-px shrink-0" /></div></div>

      {preview && file ? <div className="shrink-0 border-t border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950"><div className="relative inline-flex max-w-full items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-zinc-900">{file.type.startsWith("image/") ? <img src={preview} alt="" className="size-12 rounded-lg object-cover" /> : <div className="flex size-12 items-center justify-center rounded-lg bg-white dark:bg-zinc-800"><FileText className="size-5 text-zinc-500" /></div>}<span className="max-w-[180px] truncate text-xs font-medium text-zinc-600 dark:text-zinc-300">{file.name}</span><button type="button" onClick={() => setFile(null)} aria-label="সংযুক্তি সরান" className="absolute -right-2 -top-2 rounded-full bg-zinc-900 p-1 text-white shadow dark:bg-white dark:text-zinc-900"><X className="size-3" /></button></div></div> : null}

      {editing ? <div className="shrink-0 border-t border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950"><div className="mx-auto flex max-w-3xl items-center gap-2"><div className="min-w-0 flex-1"><div className="mb-1 text-[11px] font-medium text-emerald-600">মেসেজ এডিট হচ্ছে</div><input value={editText} onChange={(event) => setEditText(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void updateMessage(); }} className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none focus:border-emerald-400 dark:border-zinc-800 dark:bg-zinc-900" /></div><button type="button" onClick={() => { setEditing(null); setEditText(""); }} className="mt-5 rounded-full p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"><X className="size-5" /></button><button type="button" onClick={() => void updateMessage()} className="mt-5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700">আপডেট</button></div></div> : null}

      <form onSubmit={(event) => { event.preventDefault(); void send(); }} className="shrink-0 border-t border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950 sm:p-4"><div className="mx-auto flex max-w-3xl items-end gap-2"><input ref={fileInputRef} type="file" hidden accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip" onChange={(event) => setFile(event.target.files?.[0] || null)} /><button type="button" onClick={() => fileInputRef.current?.click()} disabled={blocked || sending} aria-label="ফাইল সংযুক্ত করুন" className="mb-0.5 shrink-0 rounded-full p-2.5 text-zinc-500 hover:bg-zinc-100 disabled:opacity-40 dark:hover:bg-zinc-900"><Paperclip className="size-5" /></button><textarea value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void send(); } }} disabled={blocked || sending} rows={1} maxLength={2000} placeholder={blocked ? "এই ব্যবহারকারীকে ব্লক করা হয়েছে" : "মেসেজ লিখুন..."} className="max-h-32 min-h-10 min-w-0 flex-1 resize-none rounded-2xl border border-transparent bg-zinc-100 px-4 py-2.5 text-sm leading-5 outline-none transition focus:border-emerald-300 focus:bg-white dark:bg-zinc-900 dark:focus:border-emerald-800 dark:focus:bg-zinc-900" /><button type="submit" disabled={blocked || sending || (!draft.trim() && !file)} aria-label="মেসেজ পাঠান" className="mb-0.5 shrink-0 rounded-full bg-emerald-600 p-2.5 text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40">{sending ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />}</button></div></form></> : <div className="flex min-h-0 flex-1 items-center justify-center px-6 text-center"><div className="max-w-sm"><div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300"><Search className="size-6" /></div><h2 className="text-base font-semibold text-zinc-800 dark:text-zinc-100">একটি কথোপকথন নির্বাচন করুন</h2><p className="mt-1 text-sm leading-6 text-zinc-400">বাম পাশ থেকে একজন ব্যবহারকারী নির্বাচন করে ব্যক্তিগত মেসেজ শুরু করুন।</p></div></div>}
    </main>
  </div></div></section>;
}
