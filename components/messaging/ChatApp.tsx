"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, FileText, Loader2, Paperclip, Reply, Search, Send, ShieldBan, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useChatLayout } from "@/components/messaging/ChatLayoutContext";
import MediaGallery from "@/components/MediaGallery";
import {
  ChatMessage,
  ChatUser,
  deleteMessage,
  editMessage,
  getBlockStatus,
  getChatUsers,
  getMessages,
  getOnlineUsers,
  getUserProfileBySlug,
  markMessagesAsRead,
  sendMessage,
  toggleBlock,
} from "@/lib/messaging";

function Avatar({ user, size = "md" }: { user?: ChatUser | null; size?: "md" | "lg" }) {
  const src = user?.avatar || user?.avatar_url || user?.profile_photo_url || null;
  const classes = size === "lg" ? "size-10" : "size-9";
  return src ? <img src={src} alt={user?.name || ""} className={`${classes} shrink-0 rounded-full object-cover ring-1 ring-black/5`} /> : <div className={`${classes} shrink-0 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold dark:bg-emerald-950/50 dark:text-emerald-300`}>{user?.name?.slice(0, 1)?.toUpperCase() || "?"}</div>;
}

function time(value?: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat("bn-BD", { hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

function lastMessage(user: ChatUser) {
  const all = [...(user.sentMessages || []), ...(user.receivedMessages || [])];
  return all.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))[0];
}

function MessageBubble({ message, own, onReply, onEdit, onDelete }: { message: ChatMessage; own: boolean; onReply: () => void; onEdit: () => void; onDelete: () => void }) {
  const media = message.media || [];
  const images = media.filter(m => m.mime_type?.startsWith("image/") && (m.original_url || m.url || m.preview_url));
  return <div className={`group flex w-full ${own ? "justify-end" : "justify-start"}`}>
    <div className={`max-w-[min(78%,620px)] ${own ? "items-end" : "items-start"} flex flex-col gap-1`}>
      {message.parent ? <button type="button" onClick={onReply} className="max-w-full rounded-lg border-l-2 border-emerald-500 bg-zinc-100 px-3 py-1.5 text-left text-xs text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400"><span className="font-semibold text-emerald-600">{message.parent.sender?.name || "রিপ্লাই"}</span><span className="ml-1 line-clamp-2">{message.parent.message || "সংযুক্তি"}</span></button> : null}
      <div className={`relative rounded-2xl px-3.5 py-2.5 shadow-sm ${own ? "rounded-br-md bg-emerald-600 text-white" : "rounded-bl-md border border-zinc-200 bg-white text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"}`}>
        {images.length ? <MediaGallery media={images.map(m => ({ url: m.original_url || m.url || m.preview_url || "", name: m.name || m.file_name || "image" }))} /> : null}
        {message.message ? <p className="whitespace-pre-wrap break-words text-sm leading-6">{message.message}</p> : null}
        {media.filter(m => !m.mime_type?.startsWith("image/")).map(m => <a key={m.id} href={m.original_url || m.url || m.preview_url || "#"} target="_blank" rel="noreferrer" className="mt-1 flex items-center gap-2 rounded-xl bg-black/5 px-3 py-2 text-xs dark:bg-white/5"><FileText className="size-4" /><span className="max-w-52 truncate">{m.name || m.file_name || "ফাইল"}</span></a>)}
        <div className={`mt-1 text-[10px] ${own ? "text-emerald-100" : "text-zinc-400"}`}>{time(message.created_at)}{message.updated_at && message.updated_at !== message.created_at ? " · সম্পাদিত" : ""}</div>
      </div>
      <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
        <button type="button" onClick={onReply} className="rounded-lg px-2 py-1 text-[11px] text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900"><Reply className="mr-1 inline size-3" />রিপ্লাই</button>
        {own ? <><button type="button" onClick={onEdit} className="rounded-lg px-2 py-1 text-[11px] text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900">এডিট</button><button type="button" onClick={onDelete} className="rounded-lg px-2 py-1 text-[11px] text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30">মুছুন</button></> : null}
      </div>
    </div>
  </div>;
}

export default function ChatApp() {
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
  const [moreLoading, setMoreLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [blockLoading, setBlockLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { void getChatUsers().then(setUsers).catch(e => toast.error(e instanceof Error ? e.message : "কথোপকথন লোড করা যায়নি")); }, []);
  useEffect(() => { if (!file) { setPreview(null); return; } const url = URL.createObjectURL(file); setPreview(url); return () => URL.revokeObjectURL(url); }, [file]);
  useEffect(() => { const t = window.setTimeout(async () => { if (!query.trim()) { setPeople(users); return; } setSearching(true); try { const result = await fetch(`/api/users/search?search=${encodeURIComponent(query.trim())}`, { credentials: "include" }); if (!result.ok) throw new Error("ব্যবহারকারী খোঁজা যায়নি"); const json = await result.json(); setPeople(Array.isArray(json?.data) ? json.data : []); } catch { setPeople([]); } finally { setSearching(false); } }, 300); return () => window.clearTimeout(t); }, [query, users]);

  const selectUser = async (user: ChatUser) => { setSelected(user); setMobileChat(true); setPage(1); setMessages([]); setReplyTo(null); setEditing(null); try { const [blockState] = await Promise.all([getBlockStatus(user.slug), loadMessages(user.slug, 1)]); setBlocked(Boolean(blockState.blocked ?? blockState.is_blocked)); } catch (e) { toast.error(e instanceof Error ? e.message : "চ্যাট লোড করা যায়নি"); } };
  const loadMessages = async (slug: string, requestedPage = 1, append = false) => { if (requestedPage === 1) setLoadingMessages(true); else setMoreLoading(true); try { const data = await getMessages(slug, requestedPage, 30); setMessages(current => append ? [...data.data, ...current] : data.data.reverse()); setPage(requestedPage); setHasMore(Boolean(data.next_page_url || requestedPage < (data.last_page || requestedPage))); } finally { setLoadingMessages(false); setMoreLoading(false); } };
  useEffect(() => { if (selected) void markMessagesAsRead(selected.slug).catch(() => undefined); }, [selected, messages.length]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages.length]);

  const send = async () => { if (!selected || sending || blocked || (!draft.trim() && !file)) return; setSending(true); try { const sent = await sendMessage(selected.id, draft, file, replyTo?.id); setMessages(c => [...c, sent]); setDraft(""); setFile(null); setReplyTo(null); toast.success("মেসেজ পাঠানো হয়েছে"); } catch (e) { toast.error(e instanceof Error ? e.message : "মেসেজ পাঠানো যায়নি"); } finally { setSending(false); } };
  const remove = async (id: number) => { if (!window.confirm("এই মেসেজটি মুছে ফেলবেন?")) return; try { await deleteMessage(id); setMessages(c => c.filter(m => m.id !== id)); toast.success("মেসেজ মুছে ফেলা হয়েছে"); } catch (e) { toast.error(e instanceof Error ? e.message : "মেসেজ মুছতে পারেনি"); } };
  const update = async () => { if (!editing || !editText.trim()) return; try { const u = await editMessage(editing, editText); setMessages(c => c.map(m => m.id === u.id ? u : m)); setEditing(null); setEditText(""); toast.success("মেসেজ আপডেট হয়েছে"); } catch (e) { toast.error(e instanceof Error ? e.message : "মেসেজ আপডেট করা যায়নি"); } };
  const block = async () => { if (!selected?.slug || blockLoading) return; setBlockLoading(true); try { const r = await toggleBlock(selected.slug); const next = Boolean(r.blocked ?? r.is_blocked ?? !blocked); setBlocked(next); toast.success(next ? "ব্যবহারকারী ব্লক করা হয়েছে" : "ব্যবহারকারী আনব্লক করা হয়েছে"); } catch (e) { toast.error(e instanceof Error ? e.message : "অ্যাকশন সম্পন্ন হয়নি"); } finally { setBlockLoading(false); } };

  if (authLoading || !me) return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="size-6 animate-spin text-zinc-400" /></div>;
  const currentPeople = useMemo(() => people.length || query ? people : users, [people, query, users]);

  return <section className="w-full py-0 sm:py-5"><div className="mx-auto w-full max-w-7xl px-0 sm:px-4"><div className="grid h-[calc(100svh-4rem)] min-h-0 w-full grid-cols-1 overflow-hidden border-y border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 sm:h-[min(760px,calc(100svh-6rem))] sm:min-h-[620px] sm:rounded-2xl sm:border sm:shadow-sm md:grid-cols-[minmax(280px,340px)_minmax(0,1fr)]">
    <aside className={`${mobileChat ? "hidden md:flex" : "flex"} min-h-0 min-w-0 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950`}><div className="shrink-0 border-b border-zinc-200 px-4 py-4 dark:border-zinc-800"><div className="mb-3 flex items-center justify-between gap-3"><div><h1 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">মেসেজ</h1><p className="mt-0.5 text-xs text-zinc-500">আপনার ব্যক্তিগত কথোপকথন</p></div><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">{users.length} জন</span></div><label className="flex h-10 items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 transition focus-within:border-emerald-400 focus-within:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:focus-within:bg-zinc-950"><Search className="size-4 shrink-0 text-zinc-400" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="নাম, ইমেইল বা ব্যবহারকারী খুঁজুন..." className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400" /></label></div><div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{searching ? <div className="flex justify-center py-10"><Loader2 className="size-5 animate-spin text-zinc-400" /></div> : currentPeople.length ? <div className="py-1">{currentPeople.map(u => { const last = lastMessage(u); const active = selected?.id === u.id; return <button key={u.id} type="button" onClick={() => void selectUser(u)} className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${active ? "bg-emerald-50/80 dark:bg-emerald-950/20" : "hover:bg-zinc-50 dark:hover:bg-zinc-900/70"}`}><Avatar user={u} /><span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-2"><span className="truncate text-sm font-semibold text-zinc-800 dark:text-zinc-100">{u.name}</span><span className="shrink-0 text-[10px] text-zinc-400">{last ? time(last.created_at) : ""}</span></span><span className="mt-0.5 block truncate text-xs text-zinc-500 dark:text-zinc-400">{last?.message || (last?.media?.length ? "সংযুক্তি" : "নতুন কথোপকথন শুরু করুন")}</span></span></button>; })}</div> : <div className="px-6 py-16 text-center"><Search className="mx-auto mb-3 size-6 text-zinc-300" /><p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">{query ? "কোনো ব্যবহারকারী পাওয়া যায়নি" : "কোনো কথোপকথন নেই"}</p></div>}</div></aside>
    <main className={`${mobileChat ? "flex" : "hidden md:flex"} min-h-0 min-w-0 flex-col bg-zinc-50/70 dark:bg-zinc-950`}>{selected ? <><header className="flex h-[68px] shrink-0 items-center gap-3 border-b border-zinc-200 bg-white px-3 dark:border-zinc-800 dark:bg-zinc-950 sm:px-5"><button type="button" onClick={() => setMobileChat(false)} className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 md:hidden dark:hover:bg-zinc-900"><ArrowLeft className="size-5" /></button><Avatar user={selected} size="lg" /><div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold text-zinc-900 dark:text-white">{selected.name}</div><div className="mt-0.5 flex items-center gap-1.5 text-xs text-zinc-500"><span className={`size-1.5 rounded-full ${selected.is_online ? "bg-emerald-500" : "bg-zinc-300"}`} />{selected.is_online ? "অনলাইনে আছেন" : "অফলাইন"}</div></div><button type="button" disabled={blockLoading} onClick={() => void block()} className={`rounded-full p-2 transition ${blocked ? "bg-red-50 text-red-600 dark:bg-red-950/30" : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900"}`}>{blockLoading ? <Loader2 className="size-5 animate-spin" /> : <ShieldBan className="size-5" />}</button></header><div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4 sm:px-5"><div className="mx-auto flex min-h-full max-w-3xl flex-col justify-end gap-2">{hasMore ? <button type="button" disabled={moreLoading} onClick={() => void loadMessages(selected.slug, page + 1, true)} className="mx-auto mb-2 flex shrink-0 items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-medium text-zinc-600 shadow-sm hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">{moreLoading ? <Loader2 className="size-3 animate-spin" /> : null}পুরোনো মেসেজ দেখুন</button> : null}{loadingMessages && !messages.length ? <div className="flex flex-1 items-center justify-center py-16"><Loader2 className="size-5 animate-spin text-zinc-400" /></div> : messages.length ? messages.map(m => <MessageBubble key={m.id} message={m} own={m.sender_id === me.id} onReply={() => setReplyTo(m)} onEdit={() => { setEditing(m.id); setEditText(m.message || ""); }} onDelete={() => void remove(m.id)} />) : <div className="flex flex-1 items-center justify-center py-16 text-center"><div><Send className="mx-auto mb-3 size-6 text-emerald-500" /><p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">কথোপকথন শুরু করুন</p><p className="mt-1 text-xs text-zinc-400">আপনার প্রথম মেসেজটি পাঠান।</p></div></div>}<div ref={bottomRef} className="h-px shrink-0" /></div></div>{preview && file ? <div className="shrink-0 border-t border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950"><div className="relative inline-flex max-w-full items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-zinc-900">{file.type.startsWith("image/") ? <img src={preview} alt="" className="size-12 rounded-lg object-cover" /> : <div className="flex size-12 items-center justify-center rounded-lg bg-white dark:bg-zinc-800"><FileText className="size-5 text-zinc-500" /></div>}<span className="max-w-[180px] truncate text-xs font-medium text-zinc-600 dark:text-zinc-300">{file.name}</span><button type="button" onClick={() => setFile(null)} className="absolute -right-2 -top-2 rounded-full bg-zinc-900 p-1 text-white shadow"><X className="size-3" /></button></div></div> : null}{replyTo ? <div className="shrink-0 border-t border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950"><div className="mx-auto flex max-w-3xl items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/70 px-3 py-2 dark:border-emerald-900/50 dark:bg-emerald-950/20"><Reply className="size-4 shrink-0 text-emerald-600" /><div className="min-w-0 flex-1"><p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">{replyTo.sender?.name || "মেসেজ"} -এর রিপ্লাই</p><p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{replyTo.message || (replyTo.media?.length ? "ছবি/ফাইল" : "মেসেজ")}</p></div><button type="button" onClick={() => setReplyTo(null)} className="rounded-full p-1.5 text-zinc-400 hover:bg-white dark:hover:bg-zinc-900"><X className="size-4" /></button></div></div> : null}{editing ? <div className="shrink-0 border-t border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950"><div className="mx-auto flex max-w-3xl items-center gap-2"><input value={editText} onChange={e => setEditText(e.target.value)} onKeyDown={e => { if (e.key === "Enter") void update(); }} className="h-10 min-w-0 flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none focus:border-emerald-400 dark:border-zinc-800 dark:bg-zinc-900" /><button type="button" onClick={() => { setEditing(null); setEditText(""); }} className="rounded-full p-2 text-zinc-400"><X className="size-5" /></button><button type="button" onClick={() => void update()} className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white">আপডেট</button></div></div> : null}<form id="chat-composer" onSubmit={e => { e.preventDefault(); void send(); }} className="shrink-0 border-t border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950 sm:p-4"><div className="mx-auto flex max-w-3xl items-end gap-2"><input ref={fileInputRef} type="file" hidden accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip" onChange={e => setFile(e.target.files?.[0] || null)} /><button type="button" onClick={() => fileInputRef.current?.click()} disabled={blocked || sending} className="shrink-0 rounded-full p-2.5 text-zinc-500 hover:bg-zinc-100 disabled:opacity-40 dark:hover:bg-zinc-900"><Paperclip className="size-5" /></button><textarea value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void send(); } }} disabled={blocked || sending} rows={1} maxLength={2000} placeholder={blocked ? "এই ব্যবহারকারীকে ব্লক করা হয়েছে" : replyTo ? "রিপ্লাই লিখুন..." : "মেসেজ লিখুন..."} className="max-h-32 min-h-10 min-w-0 flex-1 resize-none rounded-2xl border border-transparent bg-zinc-100 px-4 py-2.5 text-sm leading-5 outline-none focus:border-emerald-300 focus:bg-white dark:bg-zinc-900 dark:focus:border-emerald-800" /><button type="submit" disabled={blocked || sending || (!draft.trim() && !file)} className="shrink-0 rounded-full bg-emerald-600 p-2.5 text-white hover:bg-emerald-700 disabled:opacity-40">{sending ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />}</button></div></form></> : <div className="flex min-h-0 flex-1 items-center justify-center px-6 text-center"><div className="max-w-sm"><Search className="mx-auto mb-4 size-7 text-emerald-500" /><h2 className="text-base font-semibold text-zinc-800 dark:text-zinc-100">একটি কথোপকথন নির্বাচন করুন</h2><p className="mt-1 text-sm text-zinc-500">বাম পাশ থেকে একটি কথোপকথন নির্বাচন করুন।</p></div></div>}</main>
  </div></div></section>;
}
