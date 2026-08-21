"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ChatInput from "./ChatInput";
import MessageList from "./MessageList";

export type ChatMessage = {
  id: string | number;
  role: "user" | "model";
  content: string;
  image_path?: string | null;
  created_at?: string;
};

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

export default function ChatPanel({ uuid: initialUuid }: { uuid: string | null }) {
  const router = useRouter();
  const [uuid, setUuid] = useState<string | null>(initialUuid);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [title, setTitle] = useState("নতুন চ্যাট");
  const [isGuest, setIsGuest] = useState(true);
  const [guestRemaining, setGuestRemaining] = useState(20);
  const [isTyping, setIsTyping] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newMessageId, setNewMessageId] = useState<string | number | null>(null);

  // detect auth — আপনার auth store অনুসারে বদলান
  useEffect(() => {
    // e.g. check cookie / useAuth()
    fetch(`${API}/api/user`, { credentials: "include" })
      .then((r) => {
        setIsGuest(!r.ok);
        if (!r.ok) loadGuestUsage();
      })
      .catch(() => {
        setIsGuest(true);
        loadGuestUsage();
      });
  }, []);

  const loadGuestUsage = async () => {
    try {
      const res = await fetch(`${API}/api/ai/guest-usage`, { credentials: "include" });
      const json = await res.json();
      if (json.success) setGuestRemaining(json.data.remaining);
    } catch {}
  };

  // load session messages
  useEffect(() => {
    if (!uuid || isGuest) {
      if (!uuid) setMessages([]);
      return;
    }
    (async () => {
      try {
        const res = await fetch(`${API}/api/ai/sessions/${uuid}`, {
          credentials: "include",
          headers: { Accept: "application/json" },
        });
        if (res.status === 410) {
          router.replace("/ai/chat");
          return;
        }
        const json = await res.json();
        if (json.success) {
          setMessages(json.data.messages);
          setTitle(json.data.session.title);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [uuid, isGuest, router]);

  const ask = useCallback(
    async (question: string, imageBase64?: string | null, imageMime?: string | null) => {
      if (sending) return;
      const content = question.trim();
      if (!content && !imageBase64) return;

      if (isGuest && guestRemaining <= 0) {
        setError("আপনার বিনামূল্যে সীমা শেষ। আরও ব্যবহারের জন্য লগইন করুন।");
        return;
      }

      setSending(true);
      setError(null);
      setIsTyping(true);

      // optimistic user bubble
      const tempUserId = `tmp_${Date.now()}`;
      const userMsg: ChatMessage = {
        id: tempUserId,
        role: "user",
        content: content || "🖼️ ছবি পাঠানো হয়েছে",
        image_path: imageBase64 ? `data:${imageMime};base64,${imageBase64}` : null,
      };
      setMessages((prev) => [...prev, userMsg]);

      try {
        const history = messages.slice(-11).map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const res = await fetch(`${API}/api/ai/ask`, {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: content,
            image: imageBase64 || undefined,
            image_mime: imageMime || undefined,
            uuid: uuid || undefined,
            history: isGuest ? history : undefined,
          }),
        });

        const json = await res.json();

        if (res.status === 429 || !json.success) {
          setMessages((prev) => prev.filter((m) => m.id !== tempUserId));
          setError(json.message || "সমস্যা হয়েছে");
          if (json.guest_usage) setGuestRemaining(json.guest_usage.remaining);
          return;
        }

        const { data } = json;

        if (data.session?.is_new && data.session.uuid) {
          setUuid(data.session.uuid);
          setTitle(data.session.title);
          window.history.replaceState({}, "", `/ai/chat/${data.session.uuid}`);
        }

        setMessages((prev) => {
          const withoutTmp = prev.filter((m) => m.id !== tempUserId);
          return [
            ...withoutTmp,
            data.user_message,
            data.ai_message,
          ];
        });
        setNewMessageId(data.ai_message.id);

        if (data.guest_usage) setGuestRemaining(data.guest_usage.remaining);
      } catch (e) {
        setMessages((prev) => prev.filter((m) => m.id !== tempUserId));
        setError("উত্তর পেতে সমস্যা হচ্ছে — আবার চেষ্টা করুন।");
      } finally {
        setIsTyping(false);
        setSending(false);
      }
    },
    [sending, isGuest, guestRemaining, messages, uuid]
  );

  const regenerateLast = useCallback(async () => {
    if (sending) return;

    if (isGuest) {
      const lastUser = [...messages].reverse().find((m) => m.role === "user");
      if (!lastUser) return;
      // remove last AI if present
      setMessages((prev) => {
        const copy = [...prev];
        if (copy.length && copy[copy.length - 1].role === "model") copy.pop();
        return copy;
      });
      await ask(lastUser.content);
      return;
    }

    if (!uuid) return;
    setSending(true);
    setIsTyping(true);
    setError(null);

    // remove trailing model message optimistically
    setMessages((prev) => {
      const copy = [...prev];
      if (copy.length && copy[copy.length - 1].role === "model") copy.pop();
      return copy;
    });

    try {
      const res = await fetch(`${API}/api/ai/regenerate`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ uuid }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.message);
        return;
      }
      setMessages((prev) => [...prev, json.data.ai_message]);
      setNewMessageId(json.data.ai_message.id);
    } catch {
      setError("উত্তর পেতে সমস্যা হচ্ছে — আবার চেষ্টা করুন।");
    } finally {
      setIsTyping(false);
      setSending(false);
    }
  }, [sending, isGuest, messages, uuid, ask]);

  const editAndRegenerate = useCallback(
    async (messageId: number, newContent: string) => {
      if (isGuest || !uuid || sending) return;
      setSending(true);
      setIsTyping(true);
      setError(null);

      try {
        const res = await fetch(`${API}/api/ai/edit-regenerate`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ uuid, message_id: messageId, content: newContent }),
        });
        const json = await res.json();
        if (!json.success) {
          setError(json.message);
          return;
        }
        // reload cleaner: filter messages up to edited one, then append
        setMessages((prev) => {
          const idx = prev.findIndex((m) => m.id === messageId);
          const kept = idx >= 0 ? prev.slice(0, idx) : prev;
          return [...kept, json.data.user_message, json.data.ai_message];
        });
        setNewMessageId(json.data.ai_message.id);
      } catch {
        setError("উত্তর পেতে সমস্যা হচ্ছে — আবার চেষ্টা করুন।");
      } finally {
        setIsTyping(false);
        setSending(false);
      }
    },
    [isGuest, uuid, sending]
  );

  const inputDisabled =
    isTyping || sending || (isGuest && guestRemaining <= 0);

  return (
    <div className="flex h-[89vh] lg:h-[91vh] max-w-6xl mx-auto relative">
    
      <div className="flex-1 flex flex-col min-w-0 max-w-2xl mx-auto w-full px-3">
        {/* Header */}
        <div className="hidden lg:flex items-center justify-between h-8 mb-2 shrink-0">
          <h1 className="text-sm font-medium truncate flex items-center gap-1.5 text-zinc-700 dark:text-zinc-200">
            {isGuest ? (
              <>✨ তথ্যবক্স এআই</>
            ) : (
              <>{title}</>
            )}
          </h1>
          {isGuest && (
            <div className="flex items-center gap-3 text-xs text-zinc-400">
              <span>{guestRemaining} বার বাকি</span>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("open-auth-modal"))}
                className="px-2 py-1 rounded-lg bg-emerald-600 text-white text-xs"
              >
                লগইন করুন
              </button>
            </div>
          )}
        </div>

        <MessageList
          messages={messages}
          isTyping={isTyping}
          error={error}
          newMessageId={newMessageId}
          isGuest={isGuest}
          onRegenerate={regenerateLast}
          onEditRegenerate={editAndRegenerate}
          onRetry={regenerateLast}
        />

        <ChatInput
          disabled={inputDisabled}
          isGuest={isGuest}
          guestRemaining={guestRemaining}
          onSend={ask}
          onLogin={() => window.dispatchEvent(new CustomEvent("open-auth-modal"))}
        />
      </div>
    </div>
  );
}