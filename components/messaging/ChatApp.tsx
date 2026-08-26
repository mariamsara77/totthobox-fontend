"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, FileText, Loader2, Paperclip, Reply, Search, Send, ShieldBan, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { useChatLayout } from "@/context/ChatLayoutContext";
import MediaGallery from "@/components/MediaGallery";
import { ChatMessage, ChatUser, deleteMessage, editMessage, getBlockStatus, getChatUsers, getMessages, getUserProfileBySlug, markMessagesAsRead, searchUsers, sendMessage, toggleBlock } from "@/lib/messaging";

function Avatar({ user, size = "md" }: { user?: ChatUser | null; size?: "md" | "lg" }) {
  const src = user?.avatar || user?.avatar_url || user?.profile_photo_url || null;
  const classes = size === "lg" ? "size-10" : "size-9";
  return src ? <img src={src} alt={user?.name || ""} className={`${classes} shrink-0 rounded-full object-cover ring-1 ring-black/5`} /> : <div className={`${classes} shrink-0 rounded-full bg-zinc-400/10 flex items-center justify-center text-xs font-bold`}>{user?.name?.slice(0, 1)?.toUpperCase() || "?"}</div>;
}

function time(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat("bn-BD", { hour: "numeric", minute: "2-digit" }).format(date);
}

function lastMessage(user: ChatUser) {
  const all = [...(user.sentMessages || []), ...(user.receivedMessages || [])];
  return all.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))[0];
}

function MessageBubble({ message, own, onReply, onEdit, onDelete }: { message: ChatMessage; own: boolean; onReply: () => void; onEdit: () => void; onDelete: () => void }) {
  const media = message.media || [];
  const images = media.filter(m => m.mime_type?.startsWith("image/") && (m.original_url || m.url || m.preview_url));
  return <div className={`group flex w-full ${own ? "justify-end" : "justify-start"}`}><div className={`max-w-[min(78%,620px)] ${own ? "items-end" : "items-start"} flex flex-col gap-1`}>
    {message.parent ? <button type="button" onClick={onReply} className="max-w-full rounded-xl border-l-2 border-zinc-400/50 bg-zinc-400/10 px-3 py-1.5 text-left text-xs opacity-70"><span className="font-semibold">{message.parent.sender?.name || "রিপ্লাই"}</span><span className="ml-1 line-clamp-2">{message.parent.message || "সংযুক্তি"}</span></button> : null}
    <div className={`relative rounded-2xl px-3.5 py-2.5 shadow-sm ${own ? "rounded-br-md bg-zinc-400/50" : "rounded-bl-md border border-zinc-400/25 bg-zinc-400/10"}`}>
      {images.length ? <MediaGallery media={images.map(m => ({ url: m.original_url || m.url || m.preview_url || "", name: m.name || m.file_name || "image" }))} /> : null}
      {message.message ? <p className="whitespace-pre-wrap break-words text-sm leading-6">{message.message}</p> : null}
      {media.filter(m => !m.mime_type?.startsWith("image/")).map(m => <a key={m.id} href={m.original_url || m.url || m.preview_url || "#"} target="_blank" rel="noreferrer" className="mt-1 flex items-center gap-2 rounded-xl bg-zinc-400/10 px-3 py-2 text-xs"><FileText className="size-4" /><span className="max-w-52 truncate opacity-70">{m.name || m.file_name || "ফাইল"}</span></a>)}
      <div className="mt-1 text-[10px] opacity-50">{time(message.created_at)}{message.updated_at && message.updated_at !== message.created_at ? " · সম্পাদিত" : ""}</div>
    </div>
    <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100"><button type="button" onClick={onReply} className="rounded-xl bg-zinc-400/10 px-2 py-1 text-[11px] opacity-70 hover:bg-zinc-400/25"><Reply className="mr-1 inline size-3" />রিপ্লাই</button>{own ? <><button type="button" onClick={onEdit} className="rounded-xl bg-zinc-400/10 px-2 py-1 text-[11px] opacity-70 hover:bg-zinc-400/25">এডিট</button><button type="button" onClick={onDelete} className="rounded-xl bg-zinc-400/10 px-2 py-1 text-[11px] opacity-70 hover:bg-zinc-400/25">মুছুন</button></> : null}</div>
  </div></div>;
}

function SearchUserRow({ user, active, onMessage }: { user: ChatUser; active: boolean; onMessage: () => void }) {
  const last = lastMessage(user);
  return <div className={`group flex items-center gap-2 px-3 py-2.5 transition-colors ${active ? "bg-zinc-400/25" : "hover:bg-zinc-400/10"}`}>
    <Link href={`/users/${encodeURIComponent(user.slug)}`} className="shrink-0 rounded-full focus:outline-none  " aria-label={`${user.name}-এর প্রোফাইল`}><Avatar user={user} /></Link>
    <Link href={`/users/${encodeURIComponent(user.slug)}`} className="min-w-0 flex-1 text-left focus:outline-none"><span className="flex items-center justify-between gap-2"><span className="truncate text-sm font-semibold">{user.name}</span><span className="shrink-0 text-[10px] opacity-50">{last ? time(last.created_at) : ""}</span></span><span className="mt-0.5 block truncate text-xs opacity-50">{user.role_label || (last?.message || (last?.media?.length ? "সংযুক্তি" : "প্রোফাইল দেখুন"))}</span></Link>
    <button type="button" onClick={onMessage} className="shrink-0 rounded-xl bg-zinc-400/25 px-2.5 py-1.5 text-[11px] font-semibold hover:bg-zinc-400/50" aria-label={`${user.name}-কে মেসেজ পাঠান`}>মেসেজ</button>
  </div>;
}

export default function ChatApp({ targetSlug }: { targetSlug?: string }) {
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
  const openedTargetRef = useRef<string | null>(null);
  const searchRequestRef = useRef(0);

  useEffect(() => { void getChatUsers().then(setUsers).catch(e => toast.error(e instanceof Error ? e.message : "কথোপকথন লোড করা যায়নি")); }, []);
  useEffect(() => { if (!file) { setPreview(null); return; } const url = URL.createObjectURL(file); setPreview(url); return () => URL.revokeObjectURL(url); }, [file]);
  useEffect(() => { const value = query.trim(); const requestId = ++searchRequestRef.current; const timer = window.setTimeout(async () => { if (!value) { setPeople([]); setSearching(false); return; } setSearching(true); try { const results = await searchUsers(value); if (requestId === searchRequestRef.current) setPeople(results); } catch (error) { if (requestId === searchRequestRef.current) { setPeople([]); toast.error(error instanceof Error ? error.message : "ব্যবহারকারী খোঁজা যায়নি"); } } finally { if (requestId === searchRequestRef.current) setSearching(false); } }, 300); return () => window.clearTimeout(timer); }, [query]);

  const loadMessages = async (slug: string, requestedPage = 1, append = false) => { if (requestedPage === 1) setLoadingMessages(true); else setMoreLoading(true); try { const data = await getMessages(slug, requestedPage, 30); setMessages(current => append ? [...data.data, ...current] : data.data.slice().reverse()); setPage(requestedPage); setHasMore(Boolean(data.next_page_url || requestedPage < (data.last_page || requestedPage))); } finally { setLoadingMessages(false); setMoreLoading(false); } };
  const selectUser = async (user: ChatUser) => { if (!user.slug) { toast.error("এই ব্যবহারকারীর বৈধ slug পাওয়া যায়নি"); return; } setSelected(user); setMobileChat(true); setPage(1); setMessages([]); setReplyTo(null); setEditing(null); try { const [blockState] = await Promise.all([getBlockStatus(user.slug), loadMessages(user.slug, 1)]); setBlocked(Boolean(blockState.blocked ?? blockState.is_blocked)); } catch (e) { toast.error(e instanceof Error ? e.message : "চ্যাট লোড করা যায়নি"); } };
  useEffect(() => { if (!targetSlug || openedTargetRef.current === targetSlug) return; let cancelled = false; const openTarget = async () => { try { const fromList = users.find(user => user.slug === targetSlug); const response = fromList ? null : await getUserProfileBySlug(targetSlug); const target = fromList ?? response?.data?.profile ?? response?.profile; if (!cancelled && target?.slug) { openedTargetRef.current = targetSlug; await selectUser(target); } } catch (e) { if (!cancelled) toast.error(e instanceof Error ? e.message : "চ্যাট লোড করা যায়নি"); } }; void openTarget(); return () => { cancelled = true; }; }, [targetSlug, users]);
  useEffect(() => { if (selected) void markMessagesAsRead(selected.slug).catch(() => undefined); }, [selected, messages.length]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages.length]);

  const send = async () => { if (!selected || sending || blocked || (!draft.trim() && !file)) return; setSending(true); try { const sent = await sendMessage(selected.id, draft, file, replyTo?.id); setMessages(c => [...c, sent]); setDraft(""); setFile(null); setReplyTo(null); toast.success("মেসেজ পাঠানো হয়েছে"); } catch (e) { toast.error(e instanceof Error ? e.message : "মেসেজ পাঠানো যায়নি"); } finally { setSending(false); } };
  const remove = async (id: number) => { if (!window.confirm("এই মেসেজটি মুছে ফেলবেন?")) return; try { await deleteMessage(id); setMessages(c => c.filter(m => m.id !== id)); toast.success("মেসেজ মুছে ফেলা হয়েছে"); } catch (e) { toast.error(e instanceof Error ? e.message : "মেসেজ মুছতে পারেনি"); } };
  const update = async () => { if (!editing || !editText.trim()) return; try { const u = await editMessage(editing, editText); setMessages(c => c.map(m => m.id === u.id ? u : m)); setEditing(null); setEditText(""); toast.success("মেসেজ আপডেট হয়েছে"); } catch (e) { toast.error(e instanceof Error ? e.message : "মেসেজ আপডেট করা যায়নি"); } };
  const block = async () => { if (!selected?.slug || blockLoading) return; setBlockLoading(true); try { const r = await toggleBlock(selected.slug); const next = Boolean(r.blocked ?? r.is_blocked ?? !blocked); setBlocked(next); toast.success(next ? "ব্যবহারকারী ব্লক করা হয়েছে" : "ব্যবহারকারী আনব্লক করা হয়েছে"); } catch (e) { toast.error(e instanceof Error ? e.message : "অ্যাকশন সম্পন্ন হয়নি"); } finally { setBlockLoading(false); } };
  const currentPeople = query.trim() ? people : users;
  if (authLoading || !me) return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="size-6 animate-spin opacity-50" /></div>;

  return <section className="w-full py-0 sm:py-5"><div className="mx-auto w-full max-w-7xl px-0 sm:px-4"><div className="grid h-[calc(100svh-4rem)] min-h-0 w-full grid-cols-1 overflow-hidden border-y border-zinc-400/25 sm:h-[min(760px,calc(100svh-6rem))] sm:min-h-[620px] sm:rounded-2xl sm:border md:grid-cols-[minmax(280px,340px)_minmax(0,1fr)]">
    <aside className={`${mobileChat ? "hidden md:flex" : "flex"} min-h-0 min-w-0 flex-col border-r border-zinc-400/25`}><div className="shrink-0 border-b border-zinc-400/25 px-4 py-4"><div className="mb-3 flex items-center justify-between gap-3"><div><h1 className="text-lg font-bold tracking-tight">মেসেজ</h1><p className="mt-0.5 text-xs opacity-50">আপনার ব্যক্তিগত কথোপকথন</p></div><span className="rounded-full bg-zinc-400/10 px-2.5 py-1 text-[11px] opacity-70">{users.length} জন</span></div><label className="flex h-10 items-center gap-2 rounded-xl border border-zinc-400/25 bg-zinc-400/10 px-3 focus-within:border-zinc-400/50"><Search className="size-4 shrink-0 opacity-50" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="নাম, ইমেইল বা ব্যবহারকারী খুঁজুন..." className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:opacity-50" /></label></div><div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{searching ? <div className="flex justify-center py-10"><Loader2 className="size-5 animate-spin opacity-50" /></div> : currentPeople.length ? <div className="py-1">{currentPeople.map(u => <SearchUserRow key={u.id} user={u} active={selected?.id === u.id} onMessage={() => void selectUser(u)} />)}</div> : <div className="px-6 py-16 text-center"><Search className="mx-auto mb-3 size-6 opacity-25" /><p className="text-sm opacity-70">{query ? "কোনো ব্যবহারকারী পাওয়া যায়নি" : "কোনো কথোপকথন নেই"}</p></div>}</div></aside>
    <main className={`${mobileChat ? "flex" : "hidden md:flex"} min-h-0 min-w-0 flex-col`}>{selected ? <><header className="flex h-[68px] shrink-0 items-center gap-3 border-b border-zinc-400/25 px-3 sm:px-5"><button type="button" onClick={() => setMobileChat(false)} className="rounded-full bg-zinc-400/10 p-2 hover:bg-zinc-400/25 md:hidden"><ArrowLeft className="size-5" /></button><Link href={`/users/${encodeURIComponent(selected.slug)}`}><Avatar user={selected} size="lg" /></Link><Link href={`/users/${encodeURIComponent(selected.slug)}`} className="min-w-0 flex-1"><div className="truncate text-sm font-semibold">{selected.name}</div><div className="mt-0.5 flex items-center gap-1.5 text-xs opacity-50"><span className="size-1.5 rounded-full bg-zinc-400/50" />{selected.is_online ? "অনলাইনে আছেন" : "অফলাইন"}</div></Link><button type="button" disabled={blockLoading} onClick={() => void block()} className="rounded-full bg-zinc-400/10 p-2 opacity-70 hover:bg-zinc-400/25">{blockLoading ? <Loader2 className="size-5 animate-spin" /> : <ShieldBan className="size-5" />}</button></header><div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4 sm:px-5"><div className="mx-auto flex min-h-full max-w-3xl flex-col justify-end gap-2">{hasMore ? <button type="button" disabled={moreLoading} onClick={() => void loadMessages(selected.slug, page + 1, true)} className="mx-auto mb-2 flex shrink-0 items-center gap-2 rounded-full bg-zinc-400/10 px-4 py-2 text-xs opacity-70 hover:bg-zinc-400/25">{moreLoading ? <Loader2 className="size-3 animate-spin" /> : null}পুরোনো মেসেজ দেখুন</button> : null}{loadingMessages && !messages.length ? <div className="flex flex-1 items-center justify-center py-16"><Loader2 className="size-5 animate-spin opacity-50" /></div> : messages.length ? messages.map(m => <MessageBubble key={m.id} message={m} own={m.sender_id === me.id} onReply={() => setReplyTo(m)} onEdit={() => { setEditing(m.id); setEditText(m.message || ""); }} onDelete={() => void remove(m.id)} />) : <div className="flex flex-1 items-center justify-center py-16 text-center"><div><Send className="mx-auto mb-3 size-6 opacity-50" /><p className="text-sm font-semibold">কথোপকথন শুরু করুন</p><p className="mt-1 text-xs opacity-50">আপনার প্রথম মেসেজটি পাঠান।</p></div></div>}<div ref={bottomRef} className="h-px shrink-0" /></div></div>{preview && file ? <div className="shrink-0 border-t border-zinc-400/25 px-3 py-2"><div className="relative inline-flex max-w-full items-center gap-2 rounded-xl bg-zinc-400/10 p-2">{file.type.startsWith("image/") ? <img src={preview} alt="" className="size-12 rounded-xl object-cover" /> : <div className="flex size-12 items-center justify-center rounded-xl bg-zinc-400/10"><FileText className="size-5 opacity-50" /></div>}<span className="max-w-[180px] truncate text-xs opacity-70">{file.name}</span><button type="button" onClick={() => setFile(null)} className="absolute -right-2 -top-2 rounded-full bg-zinc-400/50 p-1"><X className="size-3" /></button></div></div> : null}{replyTo ? <div className="shrink-0 border-t border-zinc-400/25 px-3 py-2"><div className="mx-auto flex max-w-3xl items-center gap-3 rounded-xl bg-zinc-400/10 px-3 py-2"><Reply className="size-4 shrink-0 opacity-50" /><div className="min-w-0 flex-1"><p className="text-[11px] font-semibold opacity-70">{replyTo.sender?.name || "মেসেজ"} -এর রিপ্লাই</p><p className="truncate text-xs opacity-50">{replyTo.message || (replyTo.media?.length ? "ছবি/ফাইল" : "মেসেজ")}</p></div><button type="button" onClick={() => setReplyTo(null)} className="rounded-full bg-zinc-400/10 p-1.5 hover:bg-zinc-400/25"><X className="size-4" /></button></div></div> : null}{editing ? <div className="shrink-0 border-t border-zinc-400/25 px-3 py-2"><div className="mx-auto flex max-w-3xl items-center gap-2"><input value={editText} onChange={e => setEditText(e.target.value)} onKeyDown={e => { if (e.key === "Enter") void update(); }} className="h-10 min-w-0 flex-1 rounded-xl bg-zinc-400/10 px-3 text-sm outline-none ring-1 ring-zinc-400/25 " /><button type="button" onClick={() => { setEditing(null); setEditText(""); }} className="rounded-full bg-zinc-400/10 p-2 hover:bg-zinc-400/25"><X className="size-5" /></button><button type="button" onClick={() => void update()} className="rounded-xl bg-zinc-400/25 px-4 py-2 text-xs font-semibold hover:bg-zinc-400/50">আপডেট</button></div></div> : null}<form onSubmit={e => { e.preventDefault(); void send(); }} className="shrink-0 border-t border-zinc-400/25 p-3 sm:p-4"><div className="mx-auto flex max-w-3xl items-end gap-2"><input ref={fileInputRef} type="file" hidden accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip" onChange={e => setFile(e.target.files?.[0] || null)} /><button type="button" onClick={() => fileInputRef.current?.click()} disabled={blocked || sending} className="shrink-0 rounded-full bg-zinc-400/10 p-2.5 opacity-70 hover:bg-zinc-400/25 disabled:opacity-30"><Paperclip className="size-5" /></button><textarea value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void send(); } }} disabled={blocked || sending} rows={1} maxLength={2000} placeholder={blocked ? "এই ব্যবহারকারীকে ব্লক করা হয়েছে" : replyTo ? "রিপ্লাই লিখুন..." : "মেসেজ লিখুন..."} className="max-h-32 min-h-10 min-w-0 flex-1 resize-none rounded-2xl bg-zinc-400/10 px-4 py-2.5 text-sm leading-5 outline-none ring-1 ring-zinc-400/25  placeholder:opacity-50" /><button type="submit" disabled={blocked || sending || (!draft.trim() && !file)} className="shrink-0 rounded-full bg-zinc-400/50 p-2.5 hover:bg-zinc-400/75 disabled:opacity-30">{sending ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />}</button></div></form></> : <div className="flex min-h-0 flex-1 items-center justify-center px-6 text-center"><div className="max-w-sm"><Search className="mx-auto mb-4 size-7 opacity-50" /><h2 className="text-base font-semibold">একটি কথোপকথন নির্বাচন করুন</h2><p className="mt-1 text-sm opacity-50">বাম পাশ থেকে একটি কথোপকথন নির্বাচন করুন।</p></div></div>}</main>
  </div></div></section>;
}
