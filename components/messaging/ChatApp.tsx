"use client";

import { ArrowLeft, Check, CheckCheck, FileText, Loader2, MoreVertical, Paperclip, Reply, Search, Send, ShieldBan, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import MediaGallery from "@/components/MediaGallery";
import {
  ChatMessage, ChatUser, deleteMessage, editMessage, formatFileSize, getBlockStatus,
  getChatUsers, getMediaUrl, getMessages, getUserProfileBySlug, isAudioMedia,
  isImageMedia, isVideoMedia, markMessagesAsRead, searchUsers, sendMessage, toggleBlock,
} from "@/lib/messaging";

interface Props { targetSlug?: string }

const avatar = (u?: ChatUser | null) => u?.avatar || u?.avatar_url || u?.profile_photo_url || null;
const initial = (name?: string | null) => (name || "?").trim().charAt(0).toUpperCase();
const time = (v?: string | null) => v ? new Intl.DateTimeFormat("bn-BD", { hour: "numeric", minute: "2-digit" }).format(new Date(v)) : "";
const ordered = (items: ChatMessage[]) => [...items].sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at));
const lastMessage = (u: ChatUser) => [...(u.sentMessages || []), ...(u.receivedMessages || [])].sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at)).at(-1);

function Avatar({ user, size = "md" }: { user?: ChatUser | null; size?: "sm" | "md" | "lg" }) {
  const source = avatar(user);
  const cls = size === "lg" ? "size-12" : size === "sm" ? "size-9" : "size-10";
  return <span className={`relative inline-flex shrink-0 ${cls}`}><span className="flex size-full items-center justify-center overflow-hidden rounded-full bg-emerald-50 font-semibold text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900/50">{source ? <img src={source} alt="" className="size-full object-cover" /> : initial(user?.name)}</span>{user?.is_online ? <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-white bg-emerald-500 dark:border-zinc-950" /> : null}</span>;
}

function MessageBubble({ message, own, onReply, onEdit, onDelete }: { message: ChatMessage; own: boolean; onReply: () => void; onEdit: () => void; onDelete: () => void }) {
  const [menu, setMenu] = useState(false);
  const imageMedia = (message.media || []).filter(isImageMedia);
  return <div className={`group flex w-full ${own ? "justify-end" : "justify-start"}`}>
    <div className={`flex max-w-[calc(100%-1rem)] items-end gap-1.5 sm:max-w-[78%] ${own ? "flex-row-reverse" : ""}`}>
      <div className={`min-w-0 rounded-2xl px-3.5 py-2.5 shadow-sm ${own ? "rounded-br-md bg-emerald-600 text-white" : "rounded-bl-md border border-zinc-200 bg-white text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"}`}>
        {message.parent ? <div className={`mb-2 max-w-full rounded-lg border-l-2 px-2.5 py-1.5 text-xs ${own ? "border-white/50 bg-white/10 text-white/80" : "border-emerald-500 bg-zinc-50 text-zinc-500 dark:bg-zinc-800"}`}><div className="font-semibold">{message.parent.sender?.name || "রিপ্লাই"}</div><div className="truncate">{message.parent.message || (message.parent.media?.length ? "ছবি/ফাইল" : "মেসেজ")}</div></div> : null}
        {message.message ? <p className="whitespace-pre-wrap break-words text-[15px] leading-6">{message.message}</p> : null}
        {imageMedia.length ? <div className="mt-2 max-w-full"><MediaGallery media={imageMedia.map((m) => ({ url: getMediaUrl(m) || "", caption: m.name || "ছবি" })).filter((m) => m.url)} /></div> : null}
        {message.media?.filter((m) => !isImageMedia(m)).map((media) => {
          const url = getMediaUrl(media); if (!url) return null;
          if (isVideoMedia(media)) return <video key={media.id} src={url} controls preload="metadata" className="mt-2 max-h-80 max-w-full rounded-xl" />;
          if (isAudioMedia(media)) return <audio key={media.id} src={url} controls className="mt-2 max-w-full" />;
          return <a key={media.id} href={url} target="_blank" rel="noreferrer" className={`mt-2 flex min-w-0 max-w-full items-center gap-2 rounded-xl p-3 text-xs ${own ? "bg-white/10" : "bg-zinc-50 dark:bg-zinc-800"}`}><FileText className="size-5 shrink-0" /><span className="min-w-0 truncate">{media.name || media.file_name || "ফাইল"}{media.size ? ` · ${formatFileSize(media.size)}` : ""}</span></a>;
        })}
        <div className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${own ? "text-white/70" : "text-zinc-400"}`}><span>{time(message.created_at)}</span>{own ? Number(message.read) === 1 || Boolean(message.read_at) ? <CheckCheck className="size-3.5" /> : <Check className="size-3.5" /> : null}</div>
      </div>
      <div className="relative self-center opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
        <button type="button" aria-label="মেসেজ অপশন" onClick={() => setMenu(v => !v)} className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"><MoreVertical className="size-4" /></button>
        {menu ? <div className="absolute bottom-7 right-0 z-40 w-32 overflow-hidden rounded-xl border border-zinc-200 bg-white p-1 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
          <button type="button" onClick={() => { setMenu(false); onReply(); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800"><Reply className="size-3.5" />রিপ্লাই</button>
          {own ? <><button type="button" onClick={() => { setMenu(false); onEdit(); }} className="w-full rounded-lg px-3 py-2 text-left text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800">এডিট</button><button type="button" onClick={() => { setMenu(false); onDelete(); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"><Trash2 className="size-3.5" />ডিলিট</button></> : null}
        </div> : null}
      </div>
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
  const [searchResults, setSearchResults] = useState<ChatUser[]>([]);
  const [searching, setSearching] = useState(false);
  const [draft, setDraft] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
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
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mergeUsers = useCallback((incoming: ChatUser[]) => setUsers(current => {
    const map = new Map(current.map(u => [u.id, u]));
    incoming.forEach(u => { if (u.slug && u.id !== me?.id) map.set(u.id, { ...map.get(u.id), ...u }); });
    return [...map.values()].filter(u => u.id !== me?.id && Boolean(u.slug));
  }), [me?.id]);

  const refreshUsers = useCallback(async () => {
    if (!me) return;
    try { mergeUsers(await getChatUsers()); } catch (e) { toast.error(e instanceof Error ? e.message : "চ্যাট লোড করা যায়নি"); } finally { setLoadingUsers(false); }
  }, [me, mergeUsers]);

  useEffect(() => { if (!authLoading && !me) router.replace(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`); }, [authLoading, me, router]);
  useEffect(() => { if (!me) return; void refreshUsers(); const t = window.setInterval(() => void refreshUsers(), 10000); return () => window.clearInterval(t); }, [me, refreshUsers]);

  useEffect(() => {
    if (!me) return;
    const q = query.trim();
    if (!q) { setSearchResults([]); setSearching(false); return; }
    if (searchTimer.current) clearTimeout(searchTimer.current);
    setSearching(true);
    searchTimer.current = setTimeout(async () => { try { setSearchResults((await searchUsers(q)).filter(u => u.id !== me.id)); } catch { setSearchResults([]); } finally { setSearching(false); } }, 300);
    return () => { if (searchTimer.current) clearTimeout(searchTimer.current); };
  }, [query, me]);

  useEffect(() => {
    if (!targetSlug || !me) return;
    let cancelled = false;
    getUserProfileBySlug(targetSlug).then(r => { const u = r.data?.profile || r.profile; if (!cancelled && u && u.id !== me.id && u.slug) { mergeUsers([u]); setSelected(u); setMobileChat(true); } }).catch(() => { if (!cancelled) toast.error("এই ব্যবহারকারীর তথ্য পাওয়া যায়নি"); });
    return () => { cancelled = true; };
  }, [targetSlug, me, mergeUsers]);

  const loadMessages = useCallback(async (slug: string, nextPage = 1, older = false) => {
    older ? setMoreLoading(true) : setLoadingMessages(true);
    try {
      const r = await getMessages(slug, nextPage, 30); const incoming = ordered(r.data || []);
      setHasMore(Boolean(r.next_page_url) || (r.current_page || 1) < (r.last_page || 1)); setPage(nextPage);
      setMessages(current => { const all = older ? [...incoming, ...current] : incoming; return ordered([...new Map(all.map(m => [m.id, m])).values()]); });
      if (!older) { await markMessagesAsRead(slug).catch(() => undefined); requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: "auto" })); }
    } catch (e) { if (!older) toast.error(e instanceof Error ? e.message : "মেসেজ লোড করা যায়নি"); }
    finally { setLoadingMessages(false); setMoreLoading(false); }
  }, []);

  useEffect(() => {
    if (!selected?.slug || !me) return;
    let cancelled = false; const slug = selected.slug; setReplyTo(null); setEditing(null); setPage(1); setMessages([]);
    void loadMessages(slug); getBlockStatus(slug).then(r => { if (!cancelled) setBlocked(Boolean(r.blocked ?? r.is_blocked)); }).catch(() => undefined);
    const timer = window.setInterval(async () => { if (cancelled) return; try { const r = await getMessages(slug, 1, 30); const incoming = ordered(r.data || []); setMessages(current => ordered([...new Map([...current, ...incoming].map(m => [m.id, m])).values()])); await markMessagesAsRead(slug).catch(() => undefined); } catch {} }, 4000);
    return () => { cancelled = true; window.clearInterval(timer); };
  }, [selected, me, loadMessages]);

  useEffect(() => { if (!file) { setPreview(null); return; } const url = URL.createObjectURL(file); setPreview(url); return () => URL.revokeObjectURL(url); }, [file]);

  const conversations = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...users].sort((a,b) => +new Date(lastMessage(b)?.created_at || 0) - +new Date(lastMessage(a)?.created_at || 0)).filter(u => !q || u.name.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
  }, [users, query]);
  const people = query.trim() ? searchResults : conversations;
  const selectUser = (u: ChatUser) => { setSelected(u); setMobileChat(true); setMessages([]); setReplyTo(null); setQuery(""); router.replace(`/messages/${encodeURIComponent(u.slug)}`); };
  const goBack = () => { setMobileChat(false); router.push("/messages"); };

  const send = async () => {
    if (!selected || (!draft.trim() && !file) || sending || blocked) return;
    const text = draft, attachment = file, parent = replyTo?.id || null; setDraft(""); setFile(null); setReplyTo(null); setSending(true);
    try { const sent = await sendMessage(selected.id, text, attachment, parent); setMessages(current => ordered([...current.filter(m => m.id !== sent.id), sent])); requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" })); void refreshUsers(); }
    catch (e) { setDraft(text); setFile(attachment); setReplyTo(replyTo); toast.error(e instanceof Error ? e.message : "মেসেজ পাঠানো যায়নি"); }
    finally { setSending(false); }
  };
  const remove = async (id: number) => { if (!window.confirm("এই মেসেজটি মুছে ফেলবেন?")) return; try { await deleteMessage(id); setMessages(c => c.filter(m => m.id !== id)); toast.success("মেসেজ মুছে ফেলা হয়েছে"); } catch (e) { toast.error(e instanceof Error ? e.message : "মেসেজ মুছতে পারেনি"); } };
  const update = async () => { if (!editing || !editText.trim()) return; try { const u = await editMessage(editing, editText); setMessages(c => c.map(m => m.id === u.id ? u : m)); setEditing(null); setEditText(""); toast.success("মেসেজ আপডেট হয়েছে"); } catch (e) { toast.error(e instanceof Error ? e.message : "মেসেজ আপডেট করা যায়নি"); } };
  const block = async () => { if (!selected?.slug || blockLoading) return; setBlockLoading(true); try { const r = await toggleBlock(selected.slug); const next = Boolean(r.blocked ?? r.is_blocked ?? !blocked); setBlocked(next); toast.success(next ? "ব্যবহারকারী ব্লক করা হয়েছে" : "ব্যবহারকারী আনব্লক করা হয়েছে"); } catch (e) { toast.error(e instanceof Error ? e.message : "অ্যাকশন সম্পন্ন হয়নি"); } finally { setBlockLoading(false); } };

  if (authLoading || !me) return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="size-6 animate-spin text-zinc-400" /></div>;

  return <section className="w-full py-0 sm:py-5"><div className="mx-auto w-full max-w-7xl px-0 sm:px-4"><div className="grid h-[calc(100svh-4rem)] min-h-0 w-full grid-cols-1 overflow-hidden border-y border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 sm:h-[min(760px,calc(100svh-6rem))] sm:min-h-[620px] sm:rounded-2xl sm:border sm:shadow-sm md:grid-cols-[minmax(280px,340px)_minmax(0,1fr)]">
    <aside className={`${mobileChat ? "hidden md:flex" : "flex"} min-h-0 min-w-0 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950`}>
      <div className="shrink-0 border-b border-zinc-200 px-4 py-4 dark:border-zinc-800"><div className="mb-3 flex items-center justify-between gap-3"><div><h1 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">মেসেজ</h1><p className="mt-0.5 text-xs text-zinc-500">আপনার ব্যক্তিগত কথোপকথন</p></div><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">{users.length} জন</span></div><label className="flex h-10 items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 transition focus-within:border-emerald-400 focus-within:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:focus-within:bg-zinc-950"><Search className="size-4 shrink-0 text-zinc-400" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="নাম, ইমেইল বা ব্যবহারকারী খুঁজুন..." className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400" /></label></div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{searching ? <div className="flex justify-center py-10"><Loader2 className="size-5 animate-spin text-zinc-400" /></div> : people.length ? <div className="py-1">{people.map(u => { const last = lastMessage(u); const active = selected?.id === u.id; return <button key={u.id} type="button" onClick={() => selectUser(u)} className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${active ? "bg-emerald-50/80 dark:bg-emerald-950/20" : "hover:bg-zinc-50 dark:hover:bg-zinc-900/70"}`}><Avatar user={u} /><span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-2"><span className="truncate text-sm font-semibold text-zinc-800 dark:text-zinc-100">{u.name}</span><span className="shrink-0 text-[10px] text-zinc-400">{last ? time(last.created_at) : ""}</span></span><span className="mt-0.5 block truncate text-xs text-zinc-500 dark:text-zinc-400">{last?.message || (last?.media?.length ? "সংযুক্তি" : "নতুন কথোপকথন শুরু করুন")}</span></span></button>; })}</div> : <div className="px-6 py-16 text-center"><Search className="mx-auto mb-3 size-6 text-zinc-300" /><p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">{query ? "কোনো ব্যবহারকারী পাওয়া যায়নি" : "কোনো কথোপকথন নেই"}</p><p className="mt-1 text-xs text-zinc-400">{query ? "অন্য নাম বা ইমেইল দিয়ে চেষ্টা করুন।" : "কোনো প্রোফাইল থেকে মেসেজ শুরু করুন।"}</p></div>}</div>
    </aside>
    <main className={`${mobileChat ? "flex" : "hidden md:flex"} min-h-0 min-w-0 flex-col bg-zinc-50/70 dark:bg-zinc-950`}>
      {selected ? <><header className="flex h-[68px] shrink-0 items-center gap-3 border-b border-zinc-200 bg-white px-3 dark:border-zinc-800 dark:bg-zinc-950 sm:px-5"><button type="button" onClick={goBack} className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 md:hidden dark:hover:bg-zinc-900"><ArrowLeft className="size-5" /></button><Avatar user={selected} size="lg" /><div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold text-zinc-900 dark:text-white">{selected.name}</div><div className="mt-0.5 flex items-center gap-1.5 text-xs text-zinc-500"><span className={`size-1.5 rounded-full ${selected.is_online ? "bg-emerald-500" : "bg-zinc-300"}`} />{selected.is_online ? "অনলাইনে আছেন" : "অফলাইন"}</div></div><button type="button" disabled={blockLoading} onClick={() => void block()} className={`rounded-full p-2 transition ${blocked ? "bg-red-50 text-red-600 dark:bg-red-950/30" : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900"}`}>{blockLoading ? <Loader2 className="size-5 animate-spin" /> : <ShieldBan className="size-5" />}</button></header>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4 sm:px-5"><div className="mx-auto flex min-h-full max-w-3xl flex-col justify-end gap-2">{hasMore ? <button type="button" disabled={moreLoading} onClick={() => void loadMessages(selected.slug, page + 1, true)} className="mx-auto mb-2 flex shrink-0 items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-medium text-zinc-600 shadow-sm hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">{moreLoading ? <Loader2 className="size-3 animate-spin" /> : null}পুরোনো মেসেজ দেখুন</button> : null}{loadingMessages && !messages.length ? <div className="flex flex-1 items-center justify-center py-16"><Loader2 className="size-5 animate-spin text-zinc-400" /></div> : messages.length ? messages.map(m => <MessageBubble key={m.id} message={m} own={m.sender_id === me.id} onReply={() => { setReplyTo(m); requestAnimationFrame(() => document.getElementById("chat-composer")?.scrollIntoView({ behavior: "smooth", block: "nearest" })); }} onEdit={() => { setEditing(m.id); setEditText(m.message || ""); }} onDelete={() => void remove(m.id)} />) : <div className="flex flex-1 items-center justify-center py-16 text-center"><div><Send className="mx-auto mb-3 size-6 text-emerald-500" /><p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">কথোপকথন শুরু করুন</p><p className="mt-1 text-xs text-zinc-400">আপনার প্রথম মেসেজটি পাঠান।</p></div></div>}<div ref={bottomRef} className="h-px shrink-0" /></div></div>
      {preview && file ? <div className="shrink-0 border-t border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950"><div className="relative inline-flex max-w-full items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-zinc-900">{file.type.startsWith("image/") ? <img src={preview} alt="" className="size-12 rounded-lg object-cover" /> : <div className="flex size-12 items-center justify-center rounded-lg bg-white dark:bg-zinc-800"><FileText className="size-5 text-zinc-500" /></div>}<span className="max-w-[180px] truncate text-xs font-medium text-zinc-600 dark:text-zinc-300">{file.name}</span><button type="button" onClick={() => setFile(null)} className="absolute -right-2 -top-2 rounded-full bg-zinc-900 p-1 text-white shadow"><X className="size-3" /></button></div></div> : null}
      {replyTo ? <div className="shrink-0 border-t border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950"><div className="mx-auto flex max-w-3xl items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/70 px-3 py-2 dark:border-emerald-900/50 dark:bg-emerald-950/20"><Reply className="size-4 shrink-0 text-emerald-600" /><div className="min-w-0 flex-1"><p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">{replyTo.sender?.name || "মেসেজ"-এর রিপ্লাই</p><p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{replyTo.message || (replyTo.media?.length ? "ছবি/ফাইল" : "মেসেজ")}</p></div><button type="button" onClick={() => setReplyTo(null)} className="rounded-full p-1.5 text-zinc-400 hover:bg-white dark:hover:bg-zinc-900"><X className="size-4" /></button></div></div> : null}
      {editing ? <div className="shrink-0 border-t border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950"><div className="mx-auto flex max-w-3xl items-center gap-2"><input value={editText} onChange={e => setEditText(e.target.value)} onKeyDown={e => { if (e.key === "Enter") void update(); }} className="h-10 min-w-0 flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none focus:border-emerald-400 dark:border-zinc-800 dark:bg-zinc-900" /><button type="button" onClick={() => { setEditing(null); setEditText(""); }} className="rounded-full p-2 text-zinc-400"><X className="size-5" /></button><button type="button" onClick={() => void update()} className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white">আপডেট</button></div></div> : null}
      <form id="chat-composer" onSubmit={e => { e.preventDefault(); void send(); }} className="shrink-0 border-t border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950 sm:p-4"><div className="mx-auto flex max-w-3xl items-end gap-2"><input ref={fileInputRef} type="file" hidden accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip" onChange={e => setFile(e.target.files?.[0] || null)} /><button type="button" onClick={() => fileInputRef.current?.click()} disabled={blocked || sending} className="shrink-0 rounded-full p-2.5 text-zinc-500 hover:bg-zinc-100 disabled:opacity-40 dark:hover:bg-zinc-900"><Paperclip className="size-5" /></button><textarea value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void send(); } }} disabled={blocked || sending} rows={1} maxLength={2000} placeholder={blocked ? "এই ব্যবহারকারীকে ব্লক করা হয়েছে" : replyTo ? "রিপ্লাই লিখুন..." : "মেসেজ লিখুন..."} className="max-h-32 min-h-10 min-w-0 flex-1 resize-none rounded-2xl border border-transparent bg-zinc-100 px-4 py-2.5 text-sm leading-5 outline-none focus:border-emerald-300 focus:bg-white dark:bg-zinc-900 dark:focus:border-emerald-800" /><button type="submit" disabled={blocked || sending || (!draft.trim() && !file)} className="shrink-0 rounded-full bg-emerald-600 p-2.5 text-white hover:bg-emerald-700 disabled:opacity-40">{sending ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />}</button></div></form></> : <div className="flex min-h-0 flex-1 items-center justify-center px-6 text-center"><div className="max-w-sm"><Search className="mx-auto mb-4 size-7 text-emerald-500" /><h2 className="text-base font-semibold text-zinc-800 dark:text-zinc-100">একটি কথোপকথন নির্বাচন করুন</h2><p className="mt-1 text-sm leading-6 text-zinc-400">বাম পাশ থেকে একজন ব্যবহারকারী নির্বাচন করে ব্যক্তিগত মেসেজ শুরু করুন।</p></div></div>}
    </main>
  </div></div></section>;
}
