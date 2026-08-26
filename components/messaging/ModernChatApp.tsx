"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, FileText, Loader2, MoreVertical, Paperclip, Reply, Search, Send, ShieldBan, UserRound, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { useChatLayout } from "@/context/ChatLayoutContext";
import MediaGallery from "@/components/MediaGallery";
import { ChatMessage, ChatUser, deleteMessage, editMessage, getBlockStatus, getChatUsers, getMessages, getUserProfileBySlug, markMessagesAsRead, searchUsers, sendMessage, toggleBlock } from "@/lib/messaging";

function Avatar({ user, large = false }: { user?: ChatUser | null; large?: boolean }) {
  const src = user?.avatar || user?.avatar_url || user?.profile_photo_url || null;
  const size = large ? "size-10" : "size-9";
  return src ? <img src={src} alt={user?.name || ""} className={`${size} shrink-0 rounded-full object-cover ring-1 ring-black/10`} /> : <div className={`${size} shrink-0 rounded-full bg-zinc-200 bg-zinc-400/10 flex items-center justify-center text-sm font-bold`}>{user?.name?.slice(0, 1)?.toUpperCase() || "?"}</div>;
}

function formatTime(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat("bn-BD", { hour: "numeric", minute: "2-digit" }).format(date);
}

function lastMessage(user: ChatUser) {
  return [...(user.sentMessages || []), ...(user.receivedMessages || [])].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))[0];
}

function MessageBubble({ message, own, onReply, onEdit, onDelete }: { message: ChatMessage; own: boolean; onReply: () => void; onEdit: () => void; onDelete: () => void }) {
  const media = message.media || [];
  const images = media.filter(m => m.mime_type?.startsWith("image/") && (m.original_url || m.url || m.preview_url));
  return <div className={`group flex w-full ${own ? "justify-end" : "justify-start"}`}><div className={`flex max-w-[min(80%,620px)] flex-col gap-1 ${own ? "items-end" : "items-start"}`}>
    {message.parent ? <button type="button" onClick={onReply} className="max-w-full rounded-xl border-l-2 border-zinc-400/50 bg-zinc-100 px-3 py-1.5 text-left text-xs bg-zinc-400/10"><span className="font-semibold">{message.parent.sender?.name || "রিপ্লাই"}</span><span className="ml-1 line-clamp-2 opacity-60">{message.parent.message || "সংযুক্তি"}</span></button> : null}
    <div className={`rounded-2xl px-3.5 py-2.5 shadow-sm ${own ? "rounded-br-md bg-zinc-400/10 text-white dark:bg-zinc-100 dark:text-zinc-900" : "rounded-bl-md border border-zinc-200 bg-white dark:border-zinc-400/25 bg-zinc-400/10"}`}>
      {images.length ? <MediaGallery media={images.map(m => ({ url: m.original_url || m.url || m.preview_url || "", name: m.name || m.file_name || "image" }))} /> : null}
      {message.message ? <p className="whitespace-pre-wrap break-words text-sm leading-6">{message.message}</p> : null}
      {media.filter(m => !m.mime_type?.startsWith("image/")).map(m => <a key={m.id} href={m.original_url || m.url || m.preview_url || "#"} target="_blank" rel="noreferrer" className="mt-1 flex items-center gap-2 rounded-xl bg-zinc-400/10 px-3 py-2 text-xs"><FileText className="size-4" /><span className="max-w-52 truncate">{m.name || m.file_name || "ফাইল"}</span></a>)}
      <div className="mt-1 text-[10px] opacity-50">{formatTime(message.created_at)}{message.updated_at && message.updated_at !== message.created_at ? " · সম্পাদিত" : ""}</div>
    </div>
    <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100"><button type="button" onClick={onReply} className="rounded-xl bg-zinc-100 px-2 py-1 text-[11px] bg-zinc-400/10"><Reply className="mr-1 inline size-3" />রিপ্লাই</button>{own ? <><button type="button" onClick={onEdit} className="rounded-xl bg-zinc-100 px-2 py-1 text-[11px] bg-zinc-400/10">এডিট</button><button type="button" onClick={onDelete} className="rounded-xl bg-zinc-100 px-2 py-1 text-[11px] bg-zinc-400/10">মুছুন</button></> : null}</div>
  </div></div>;
}

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
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const openedTargetRef = useRef<string | null>(null);
  const requestRef = useRef(0);

  useEffect(() => { void getChatUsers().then(setUsers).catch(e => toast.error(e instanceof Error ? e.message : "কথোপকথন লোড করা যায়নি")); }, []);
  useEffect(() => { if (!file) { setPreview(null); return; } const url = URL.createObjectURL(file); setPreview(url); return () => URL.revokeObjectURL(url); }, [file]);
  useEffect(() => { const value = query.trim(); const id = ++requestRef.current; const timer = window.setTimeout(async () => { if (!value) { setPeople([]); setSearching(false); return; } setSearching(true); try { const result = await searchUsers(value); if (id === requestRef.current) setPeople(result); } catch (e) { if (id === requestRef.current) toast.error(e instanceof Error ? e.message : "ব্যবহারকারী খোঁজা যায়নি"); } finally { if (id === requestRef.current) setSearching(false); } }, 300); return () => window.clearTimeout(timer); }, [query]);

  const loadMessages = async (slug: string) => { setLoadingMessages(true); try { const data = await getMessages(slug, 1, 30); setMessages(data.data.slice().reverse()); } finally { setLoadingMessages(false); } };
  const selectUser = async (user: ChatUser) => { if (!user.slug) return toast.error("এই ব্যবহারকারীর বৈধ slug পাওয়া যায়নি"); setSelected(user); setMobileChat(true); setMenuOpen(false); setReplyTo(null); setEditing(null); setMessages([]); try { const [state] = await Promise.all([getBlockStatus(user.slug), loadMessages(user.slug)]); setBlocked(Boolean(state.blocked ?? state.is_blocked)); } catch (e) { toast.error(e instanceof Error ? e.message : "চ্যাট লোড করা যায়নি"); } };
  useEffect(() => { if (!targetSlug || openedTargetRef.current === targetSlug) return; let cancelled = false; const open = async () => { try { const existing = users.find(u => u.slug === targetSlug); const response = existing ? null : await getUserProfileBySlug(targetSlug); const target = existing ?? response?.data?.profile ?? response?.profile; if (!cancelled && target?.slug) { openedTargetRef.current = targetSlug; await selectUser(target); } } catch (e) { if (!cancelled) toast.error(e instanceof Error ? e.message : "চ্যাট লোড করা যায়নি"); } }; void open(); return () => { cancelled = true; }; }, [targetSlug, users]);
  useEffect(() => { if (selected) void markMessagesAsRead(selected.slug).catch(() => undefined); }, [selected, messages.length]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages.length]);

  const send = async () => { if (!selected || sending || blocked || (!draft.trim() && !file)) return; setSending(true); try { const sent = await sendMessage(selected.id, draft, file, replyTo?.id); setMessages(c => [...c, sent]); setDraft(""); setFile(null); setReplyTo(null); toast.success("মেসেজ পাঠানো হয়েছে"); } catch (e) { toast.error(e instanceof Error ? e.message : "মেসেজ পাঠানো যায়নি"); } finally { setSending(false); } };
  const remove = async (id: number) => { if (!window.confirm("এই মেসেজটি মুছে ফেলবেন?")) return; try { await deleteMessage(id); setMessages(c => c.filter(m => m.id !== id)); toast.success("মেসেজ মুছে ফেলা হয়েছে"); } catch (e) { toast.error(e instanceof Error ? e.message : "মেসেজ মুছতে পারেনি"); } };
  const update = async () => { if (!editing || !editText.trim()) return; try { const updated = await editMessage(editing, editText); setMessages(c => c.map(m => m.id === updated.id ? updated : m)); setEditing(null); setEditText(""); toast.success("মেসেজ আপডেট হয়েছে"); } catch (e) { toast.error(e instanceof Error ? e.message : "মেসেজ আপডেট করা যায়নি"); } };
  const block = async () => { if (!selected?.slug || blockLoading) return; setBlockLoading(true); try { const result = await toggleBlock(selected.slug); const next = Boolean(result.blocked ?? result.is_blocked ?? !blocked); setBlocked(next); setMenuOpen(false); toast.success(next ? "ব্যবহারকারী ব্লক করা হয়েছে" : "ব্যবহারকারী আনব্লক করা হয়েছে"); } catch (e) { toast.error(e instanceof Error ? e.message : "অ্যাকশন সম্পন্ন হয়নি"); } finally { setBlockLoading(false); } };

  if (authLoading || !me) return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="size-6 animate-spin opacity-50" /></div>;
  const currentPeople = query.trim() ? people : users;

  return <section className="w-full py-0 sm:py-5"><div className="mx-auto w-full max-w-7xl px-0 sm:px-4"><div className="grid h-[calc(100svh-4rem)] min-h-0 overflow-hidden border-y border-zinc-200 bg-white dark:border-zinc-400/25 bg-zinc-400/10 sm:h-[min(760px,calc(100svh-6rem))] sm:min-h-[620px] sm:rounded-2xl sm:border md:grid-cols-[minmax(280px,340px)_minmax(0,1fr)]">
    <aside className={`${mobileChat ? "hidden md:flex" : "flex"} min-h-0 flex-col border-r border-zinc-200 dark:border-zinc-400/25`}>
      <div className="shrink-0 border-b border-zinc-200 p-4 dark:border-zinc-400/25"><div className="mb-3 flex items-center justify-between"><div><h1 className="text-lg font-bold">মেসেজ</h1><p className="mt-0.5 text-xs opacity-50">আপনার ব্যক্তিগত কথোপকথন</p></div><span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] bg-zinc-400/10">{users.length} জন</span></div><label className="flex h-10 items-center gap-2 rounded-xl bg-zinc-100 px-3 bg-zinc-400/10"><Search className="size-4 opacity-50" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="ব্যবহারকারী খুঁজুন" className="min-w-0 flex-1 bg-transparent text-sm outline-none" />{searching ? <Loader2 className="size-4 animate-spin opacity-50" /> : null}</label></div>
      <div className="min-h-0 flex-1 overflow-y-auto">{currentPeople.length ? currentPeople.map(user => { const last = lastMessage(user); return <button key={user.id} type="button" onClick={() => void selectUser(user)} className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${selected?.id === user.id ? "bg-zinc-100 bg-zinc-400/10" : "hover:bg-zinc-50 dark:hover:bg-zinc-400/10"}`}><Avatar user={user} /><span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-2"><span className="truncate text-sm font-semibold">{user.name}</span><span className="shrink-0 text-[10px] opacity-40">{last ? formatTime(last.created_at) : ""}</span></span><span className="mt-0.5 block truncate text-xs opacity-50">{user.role_label || last?.message || (last?.media?.length ? "সংযুক্তি" : "কথোপকথন শুরু করুন")}</span></span></button>; }) : <div className="p-8 text-center text-sm opacity-50">{query ? "কোনো ব্যবহারকারী পাওয়া যায়নি" : "কোনো কথোপকথন নেই"}</div>}</div>
    </aside>

    <main className={`${mobileChat ? "flex" : "hidden md:flex"} min-w-0 flex-col`}>
      {selected ? <>
        <header className="relative flex h-16 shrink-0 items-center gap-3 border-b border-zinc-200 px-4 dark:border-zinc-400/25"><button type="button" onClick={() => setMobileChat(false)} className="rounded-xl p-2 hover:bg-zinc-100 md:hidden dark:hover:bg-zinc-400/10" aria-label="ফিরে যান"><ArrowLeft className="size-5" /></button><Avatar user={selected} large /><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{selected.name}</p><p className="truncate text-xs opacity-50">{selected.role_label || "ব্যক্তিগত কথোপকথন"}</p></div><div className="relative"><button type="button" onClick={() => setMenuOpen(v => !v)} className="rounded-xl p-2 hover:bg-zinc-100 dark:hover:bg-zinc-400/10" aria-label="আরও অপশন" aria-expanded={menuOpen}><MoreVertical className="size-5" /></button>{menuOpen ? <><button type="button" className="fixed inset-0 z-10 cursor-default" aria-label="মেনু বন্ধ করুন" onClick={() => setMenuOpen(false)} /><div className="absolute right-0 top-11 z-20 w-48 overflow-hidden rounded-xl border border-zinc-200 bg-white p-1 shadow-xl dark:border-zinc-400/25 bg-zinc-400/10"><Link href={`/users/${encodeURIComponent(selected.slug)}`} onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-400/10"><UserRound className="size-4" />প্রোফাইল দেখুন</Link><button type="button" onClick={() => void block()} disabled={blockLoading} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm hover:bg-zinc-100 disabled:opacity-50 dark:hover:bg-zinc-400/10"><ShieldBan className="size-4" />{blockLoading ? "অপেক্ষা করুন..." : blocked ? "আনব্লক করুন" : "ব্লক করুন"}</button></div></> : null}</div></header>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5"><div className="mx-auto flex max-w-3xl flex-col gap-3">{loadingMessages ? <div className="flex justify-center py-10"><Loader2 className="size-6 animate-spin opacity-40" /></div> : messages.length ? messages.map(message => <MessageBubble key={message.id} message={message} own={message.sender_id === me.id || message.sender?.id === me.id} onReply={() => setReplyTo(message)} onEdit={() => { setEditing(message.id); setEditText(message.message || ""); }} onDelete={() => void remove(message.id)} />) : <div className="py-16 text-center text-sm opacity-40">এই কথোপকথনে এখনো কোনো মেসেজ নেই</div>}<div ref={bottomRef} /></div></div>
        <div className="shrink-0 border-t border-zinc-200 p-3 dark:border-zinc-400/25">{blocked ? <div className="mb-2 rounded-xl bg-zinc-100 px-3 py-2 text-center text-xs opacity-70 bg-zinc-400/10">এই ব্যবহারকারীকে ব্লক করা হয়েছে। মেসেজ পাঠাতে আনব্লক করুন।</div> : null}{replyTo ? <div className="mb-2 flex items-center gap-2 rounded-xl bg-zinc-100 px-3 py-2 text-xs bg-zinc-400/10"><Reply className="size-4" /><span className="min-w-0 flex-1 truncate">{replyTo.message || "সংযুক্তি"}</span><button type="button" onClick={() => setReplyTo(null)}><X className="size-4" /></button></div> : null}{editing ? <div className="mb-2 flex items-center gap-2 rounded-xl bg-zinc-100 px-3 py-2 text-xs bg-zinc-400/10"><span className="flex-1">মেসেজ এডিট হচ্ছে</span><button type="button" onClick={() => { setEditing(null); setEditText(""); }}><X className="size-4" /></button></div> : null}{preview ? <div className="mb-2 flex items-center gap-2"><img src={preview} alt="preview" className="size-14 rounded-xl object-cover" /><button type="button" onClick={() => setFile(null)} className="rounded-full bg-zinc-400/10 p-1 text-white"><X className="size-3" /></button></div> : null}<div className="mx-auto flex max-w-3xl items-end gap-2"><input ref={fileInputRef} type="file" accept="image/*,.pdf,.doc,.docx" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} /><button type="button" disabled={blocked} onClick={() => fileInputRef.current?.click()} className="rounded-xl p-2.5 hover:bg-zinc-100 disabled:opacity-40 dark:hover:bg-zinc-400/10" aria-label="ফাইল সংযুক্ত করুন"><Paperclip className="size-5" /></button><textarea value={editing ? editText : draft} onChange={e => editing ? setEditText(e.target.value) : setDraft(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (editing) void update(); else void send(); } }} disabled={blocked || sending} rows={1} placeholder={editing ? "মেসেজ আপডেট করুন..." : "মেসেজ লিখুন..."} className="max-h-32 min-h-11 flex-1 resize-none rounded-xl bg-zinc-100 px-4 py-3 text-sm outline-none   bg-zinc-400/10 dark:" /><button type="button" onClick={() => editing ? void update() : void send()} disabled={blocked || sending || (!draft.trim() && !editText.trim() && !file)} className="rounded-xl bg-zinc-400/10 p-3 text-white disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900" aria-label={editing ? "আপডেট করুন" : "মেসেজ পাঠান"}>{sending ? <Loader2 className="size-5 animate-spin" /> : editing ? "✓" : <Send className="size-5" />}</button></div></div>
      </> : <div className="flex flex-1 items-center justify-center p-8 text-center"><div><div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-zinc-100 bg-zinc-400/10"><Send className="size-6 opacity-50" /></div><h2 className="text-base font-semibold">একটি কথোপকথন নির্বাচন করুন</h2><p className="mt-1 text-sm opacity-50">বাম পাশ থেকে একজন ব্যবহারকারী নির্বাচন করুন।</p></div></div>}
    </main>
  </div></div></section>;
}
