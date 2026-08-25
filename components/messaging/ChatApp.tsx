"use client";

import {
  ArrowLeft, Check, CheckCheck, FileText, Loader2, MoreVertical, Paperclip,
  Search, Send, Trash2, X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import {
  ChatMessage, ChatUser, deleteMessage, editMessage, formatFileSize,
  getBlockStatus, getChatUsers, getMediaUrl, getMessages,
  getUserProfileBySlug, isAudioMedia, isImageMedia, isVideoMedia,
  markMessagesAsRead, sendMessage, toggleBlock,
} from "@/lib/messaging";

interface Props { targetSlug?: string }

const avatar = (u?: ChatUser | null) => u?.avatar || u?.profile_photo_url || null;
const initial = (name?: string | null) => (name || "?").trim().charAt(0).toUpperCase();
const time = (v?: string) => v ? new Intl.DateTimeFormat("bn-BD", { hour: "numeric", minute: "2-digit" }).format(new Date(v)) : "";
const ordered = (data: Awaited<ReturnType<typeof getMessages>>) => [...(data?.data || [])].sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at));
const lastMessage = (u: ChatUser) => [...(u.sentMessages || []), ...(u.receivedMessages || [])].sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at)).at(-1);

function Avatar({ user, large = false }: { user?: ChatUser | null; large?: boolean }) {
  const src = avatar(user);
  return <span className={`relative inline-flex shrink-0 ${large ? "size-12" : "size-10"}`}>
    <span className="flex size-full items-center justify-center overflow-hidden rounded-full bg-zinc-100 font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
      {src ? <img src={src} alt="" className="size-full object-cover" /> : initial(user?.name)}
    </span>
    {user?.is_online && <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white bg-emerald-500 dark:border-zinc-950" />}
  </span>;
}

function Bubble({ message, own, onEdit, onDelete }: { message: ChatMessage; own: boolean; onEdit: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  return <div className={`group flex ${own ? "justify-end" : "justify-start"}`}>
    <div className={`flex max-w-[88%] items-end gap-2 sm:max-w-[72%] ${own ? "flex-row-reverse" : ""}`}>
      <div className={`rounded-2xl px-3.5 py-2.5 shadow-sm ${own ? "rounded-br-md bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" : "rounded-bl-md border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"}`}>
        {message.parent && <div className="mb-2 rounded-lg border-l-2 border-zinc-400 bg-black/5 px-2 py-1 text-xs dark:bg-white/5"><b>রিপ্লাই</b><div className="truncate">{message.parent.message || "সংযুক্তি"}</div></div>}
        {message.message && <p className="whitespace-pre-wrap break-words text-[15px] leading-6">{message.message}</p>}
        {message.media?.map((m) => { const url = getMediaUrl(m); if (!url) return null; if (isImageMedia(m)) return <a key={m.id} href={url} target="_blank" rel="noreferrer" className="mt-2 block overflow-hidden rounded-xl"><img src={url} alt={m.name || "ছবি"} className="max-h-80 w-full object-cover" loading="lazy" /></a>; if (isVideoMedia(m)) return <video key={m.id} src={url} controls preload="metadata" className="mt-2 max-h-80 w-full rounded-xl" />; if (isAudioMedia(m)) return <audio key={m.id} src={url} controls className="mt-2 w-full" />; return <a key={m.id} href={url} target="_blank" rel="noreferrer" className="mt-2 flex items-center gap-2 rounded-xl bg-black/5 p-3 text-xs dark:bg-white/5"><FileText className="size-5" /><span className="min-w-0 truncate">{m.name || m.file_name || "ফাইল"} · {formatFileSize(m.size)}</span></a>; })}
        <div className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${own ? "text-white/60 dark:text-zinc-500" : "text-zinc-400"}`}><span>{time(message.created_at)}</span>{own && (Number(message.read) === 1 || Boolean(message.read_at) ? <CheckCheck className="size-3.5" /> : <Check className="size-3.5" />)}</div>
      </div>
      {own && <div className="relative self-center opacity-0 transition group-hover:opacity-100 focus-within:opacity-100"><button type="button" aria-label="মেসেজ অপশন" onClick={() => setOpen(v => !v)} className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"><MoreVertical className="size-4" /></button>{open && <div className="absolute right-0 top-8 z-30 w-28 rounded-xl border border-zinc-200 bg-white p-1 shadow-xl dark:border-zinc-800 dark:bg-zinc-900"><button type="button" onClick={() => { setOpen(false); onEdit(); }} className="w-full rounded-lg px-3 py-2 text-left text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800">এডিট</button><button type="button" onClick={() => { setOpen(false); onDelete(); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"><Trash2 className="size-3.5" />ডিলিট</button></div>}</div>}
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
  const bottom = useRef<HTMLDivElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const mergeUsers = useCallback((incoming: ChatUser[]) => setUsers(current => {
    const map = new Map(current.map(u => [u.id, u]));
    incoming.forEach(u => { if (u.slug) map.set(u.id, { ...map.get(u.id), ...u }); });
    return [...map.values()].filter(u => u.id !== me?.id && Boolean(u.slug));
  }), [me?.id]);

  const refreshUsers = useCallback(async () => {
    if (!me) return;
    try { const data = await getChatUsers(); mergeUsers(Array.isArray(data) ? data : []); }
    catch (e) { toast.error(e instanceof Error ? e.message : "চ্যাট লোড করা যায়নি"); }
    finally { setLoadingUsers(false); }
  }, [me, mergeUsers]);

  useEffect(() => { if (!authLoading && !me) router.replace(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`); }, [authLoading, me, router]);
  useEffect(() => { if (!me) return; void refreshUsers(); const t = window.setInterval(() => void refreshUsers(), 8000); return () => window.clearInterval(t); }, [me, refreshUsers]);

  useEffect(() => {
    if (!targetSlug || !me) return;
    let cancelled = false;
    getUserProfileBySlug(targetSlug).then(r => { const u = r.data?.profile || r.profile; if (!cancelled && u && u.id !== me.id && u.slug) { mergeUsers([u]); setSelected(u); setMobileChat(true); } }).catch(() => { if (!cancelled) toast.error("এই ব্যবহারকারীর তথ্য পাওয়া যায়নি"); });
    return () => { cancelled = true; };
  }, [targetSlug, me, mergeUsers]);

  const loadMessages = useCallback(async (slug: string, next = 1, older = false) => {
    older ? setMoreLoading(true) : setLoadingMessages(true);
    try {
      const payload = await getMessages(slug, next, 30);
      const incoming = ordered(payload);
      setHasMore(Boolean(payload.next_page_url) || (payload.current_page || 1) < (payload.last_page || 1));
      setPage(next);
      setMessages(current => {
        const all = older ? [...incoming, ...current] : incoming;
        return [...new Map(all.map(m => [m.id, m])).values()].sort((a,b) => +new Date(a.created_at) - +new Date(b.created_at));
      });
      if (!older) { await markMessagesAsRead(slug).catch(() => undefined); requestAnimationFrame(() => bottom.current?.scrollIntoView({ behavior: "auto" })); }
    } catch (e) { if (!older) toast.error(e instanceof Error ? e.message : "মেসেজ লোড করা যায়নি"); }
    finally { setLoadingMessages(false); setMoreLoading(false); }
  }, []);

  useEffect(() => {
    if (!selected?.slug || !me) return;
    let cancelled = false;
    const slug = selected.slug;
    void loadMessages(slug);
    getBlockStatus(slug).then(r => { if (!cancelled) setBlocked(Boolean(r.blocked ?? r.is_blocked)); }).catch(() => undefined);
    const t = window.setInterval(async () => {
      if (cancelled) return;
      try {
        const incoming = ordered(await getMessages(slug, 1, 30));
        setMessages(current => [...new Map([...current, ...incoming].map(m => [m.id, m])).values()].sort((a,b) => +new Date(a.created_at) - +new Date(b.created_at)));
        await markMessagesAsRead(slug).catch(() => undefined);
      } catch { /* keep current chat state */ }
    }, 2500);
    return () => { cancelled = true; window.clearInterval(t); };
  }, [selected, me, loadMessages]);

  useEffect(() => { if (!file) { setPreview(null); return; } const url = URL.createObjectURL(file); setPreview(url); return () => URL.revokeObjectURL(url); }, [file]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return [...users].sort((a,b) => +new Date(lastMessage(b)?.created_at || 0) - +new Date(lastMessage(a)?.created_at || 0)).filter(u => !term || u.name.toLowerCase().includes(term));
  }, [users, query]);

  const selectUser = (u: ChatUser) => { setSelected(u); setMobileChat(true); setMessages([]); setPage(1); setHasMore(false); setBlocked(false); router.replace(`/messages/${encodeURIComponent(u.slug)}`); };
  const back = () => { setMobileChat(false); router.push("/messages"); };

  const send = async () => {
    if (!selected || !draft.trim() && !file || sending || blocked) return;
    const text = draft; const attachment = file; setDraft(""); setFile(null); setSending(true);
    try { const sent = await sendMessage(selected.id, text, attachment); setMessages(current => [...current.filter(m => m.id !== sent.id), sent].sort((a,b) => +new Date(a.created_at) - +new Date(b.created_at))); requestAnimationFrame(() => bottom.current?.scrollIntoView({ behavior: "smooth" })); void refreshUsers(); }
    catch (e) { setDraft(text); setFile(attachment); toast.error(e instanceof Error ? e.message : "মেসেজ পাঠানো যায়নি"); }
    finally { setSending(false); }
  };

  const remove = async (id: number) => { if (!window.confirm("এই মেসেজটি মুছে ফেলবেন?")) return; try { await deleteMessage(id); setMessages(m => m.filter(x => x.id !== id)); toast.success("মেসেজ মুছে ফেলা হয়েছে"); } catch (e) { toast.error(e instanceof Error ? e.message : "মেসেজ মুছতে পারেনি"); } };
  const update = async () => { if (!editing || !editText.trim()) return; try { const u = await editMessage(editing, editText); setMessages(m => m.map(x => x.id === u.id ? { ...x, ...u } : x)); setEditing(null); setEditText(""); toast.success("মেসেজ আপডেট হয়েছে"); } catch (e) { toast.error(e instanceof Error ? e.message : "মেসেজ আপডেট করা যায়নি"); } };
  const block = async () => { if (!selected?.slug || blockLoading) return; setBlockLoading(true); try { const r = await toggleBlock(selected.slug); const next = Boolean(r.blocked ?? r.is_blocked ?? !blocked); setBlocked(next); toast.success(next ? "ব্যবহারকারী ব্লক করা হয়েছে" : "ব্যবহারকারী আনব্লক করা হয়েছে"); } catch (e) { toast.error(e instanceof Error ? e.message : "অ্যাকশন সম্পন্ন হয়নি"); } finally { setBlockLoading(false); } };

  if (authLoading || !me) return <div className="flex min-h-[70vh] items-center justify-center"><Loader2 className="size-6 animate-spin text-zinc-400" /></div>;

  return <section className="mx-auto w-full max-w-7xl px-0 py-0 sm:px-4 sm:py-6">
    <div className="grid h-[calc(100dvh-4rem)] min-h-[620px] overflow-hidden border-y border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:h-[760px] sm:rounded-2xl sm:border">
      <aside className={`${mobileChat ? "hidden md:flex" : "flex"} min-w-0 flex-col border-r border-zinc-200 dark:border-zinc-800 md:w-[330px] lg:w-[370px]`}>
        <div className="border-b border-zinc-200 p-4 dark:border-zinc-800"><div className="mb-4 flex items-center justify-between"><h1 className="text-xl font-semibold">মেসেজ</h1><span className="text-xs text-zinc-400">{users.length} জন</span></div><div className="flex items-center gap-2 rounded-xl bg-zinc-100 px-3 py-2 dark:bg-zinc-900"><Search className="size-4 text-zinc-400" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="কথোপকথন খুঁজুন..." className="w-full bg-transparent text-sm outline-none" /></div></div>
        <div className="flex-1 overflow-y-auto">{loadingUsers ? <div className="flex justify-center p-8"><Loader2 className="size-5 animate-spin text-zinc-400" /></div> : filtered.length ? filtered.map(u => <button key={u.id} type="button" onClick={() => selectUser(u)} className={`flex w-full items-center gap-3 border-b border-zinc-100 px-4 py-3 text-left transition hover:bg-zinc-50 dark:border-zinc-900 dark:hover:bg-zinc-900 ${selected?.id === u.id ? "bg-zinc-100 dark:bg-zinc-900" : ""}`}><Avatar user={u} /><span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-2"><b className="truncate text-sm">{u.name}</b><small className="shrink-0 text-[10px] text-zinc-400">{lastMessage(u) ? time(lastMessage(u)?.created_at) : ""}</small></span><span className="block truncate text-xs text-zinc-400">{lastMessage(u)?.message || (lastMessage(u)?.media?.length ? "সংযুক্তি" : "কথোপকথন শুরু করুন")}</span></span></button>) : <div className="p-8 text-center text-sm text-zinc-400">কোনো কথোপকথন নেই</div>}</div>
      </aside>

      <main className={`${mobileChat ? "flex" : "hidden md:flex"} min-w-0 flex-col`}>
        {selected ? <>
          <header className="flex h-16 shrink-0 items-center gap-3 border-b border-zinc-200 px-3 sm:px-5 dark:border-zinc-800"><button type="button" onClick={back} className="rounded-full p-2 hover:bg-zinc-100 md:hidden dark:hover:bg-zinc-900" aria-label="ফিরে যান"><ArrowLeft className="size-5" /></button><Avatar user={selected} /><div className="min-w-0 flex-1"><b className="block truncate text-sm">{selected.name}</b><span className="text-xs text-zinc-400">{selected.is_online ? "অনলাইনে আছেন" : "অফলাইন"}</span></div><button type="button" disabled={blockLoading} onClick={block} className={`rounded-full p-2 text-xs ${blocked ? "bg-red-50 text-red-600 dark:bg-red-950/30" : "hover:bg-zinc-100 dark:hover:bg-zinc-900"}`} title={blocked ? "আনব্লক" : "ব্লক"}>{blockLoading ? <Loader2 className="size-5 animate-spin" /> : <span className="text-lg">{blocked ? "✓" : "⊘"}</span>}</button></header>

          <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-5"><div className="mx-auto max-w-3xl space-y-2">{hasMore && <button type="button" disabled={moreLoading} onClick={() => loadMessages(selected.slug, page + 1, true)} className="mx-auto mb-3 flex items-center gap-2 rounded-full bg-zinc-100 px-4 py-2 text-xs dark:bg-zinc-900">{moreLoading && <Loader2 className="size-3 animate-spin" />}পুরোনো মেসেজ দেখুন</button>}{loadingMessages && !messages.length ? <div className="flex justify-center py-10"><Loader2 className="size-5 animate-spin text-zinc-400" /></div> : messages.map(m => <Bubble key={m.id} message={m} own={m.sender_id === me.id} onEdit={() => { setEditing(m.id); setEditText(m.message || ""); }} onDelete={() => remove(m.id)} />)}<div ref={bottom} /></div></div>

          {preview && <div className="border-t border-zinc-200 px-4 py-2 dark:border-zinc-800"><div className="relative inline-flex max-w-[180px] items-center gap-2 rounded-xl bg-zinc-100 p-2 dark:bg-zinc-900">{file?.type.startsWith("image/") ? <img src={preview} alt="" className="size-14 rounded-lg object-cover" /> : <FileText className="size-6" />}<span className="max-w-[100px] truncate text-xs">{file?.name}</span><button type="button" onClick={() => setFile(null)} className="absolute -right-2 -top-2 rounded-full bg-zinc-900 p-1 text-white"><X className="size-3" /></button></div></div>}
          {editing && <div className="border-t border-zinc-200 px-4 py-2 text-xs dark:border-zinc-800"><div className="mb-1 flex items-center justify-between"><span>মেসেজ এডিট হচ্ছে</span><button type="button" onClick={() => setEditing(null)}><X className="size-4" /></button></div><div className="flex gap-2"><input value={editText} onChange={e => setEditText(e.target.value)} className="min-w-0 flex-1 rounded-xl border px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900" /><button type="button" onClick={update} className="rounded-xl bg-zinc-950 px-4 text-xs text-white dark:bg-white dark:text-zinc-950">আপডেট</button></div></div>}
          <form onSubmit={e => { e.preventDefault(); void send(); }} className="flex items-end gap-2 border-t border-zinc-200 p-3 dark:border-zinc-800"><input ref={fileInput} type="file" hidden accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip" onChange={e => setFile(e.target.files?.[0] || null)} /><button type="button" onClick={() => fileInput.current?.click()} disabled={blocked || sending} className="rounded-full p-2.5 text-zinc-500 hover:bg-zinc-100 disabled:opacity-40 dark:hover:bg-zinc-900"><Paperclip className="size-5" /></button><textarea value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void send(); } }} disabled={blocked || sending} rows={1} maxLength={2000} placeholder={blocked ? "এই ব্যবহারকারীকে ব্লক করা হয়েছে" : "মেসেজ লিখুন..."} className="max-h-32 min-h-10 flex-1 resize-none rounded-2xl bg-zinc-100 px-4 py-2.5 text-sm outline-none dark:bg-zinc-900" /><button type="submit" disabled={blocked || sending || (!draft.trim() && !file)} className="rounded-full bg-zinc-950 p-2.5 text-white transition hover:scale-105 disabled:opacity-40 dark:bg-white dark:text-zinc-950">{sending ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />}</button></form>
        </> : <div className="flex flex-1 flex-col items-center justify-center p-8 text-center"><div className="mb-4 rounded-2xl bg-zinc-100 p-4 dark:bg-zinc-900"><Search className="size-7 text-zinc-400" /></div><h2 className="font-semibold">একটি কথোপকথন নির্বাচন করুন</h2><p className="mt-1 text-sm text-zinc-400">বাম পাশ থেকে একজন ব্যবহারকারী নির্বাচন করে মেসেজ শুরু করুন।</p></div>}
      </main>
    </div>
  </section>;
}
