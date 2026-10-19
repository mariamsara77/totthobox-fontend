"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ChatInput from "./ChatInput";
import MessageList from "./MessageList";
import { useAuth } from "@/context/AuthContext";
import { useAuthModal } from "@/context/AuthModalContext";
import { getVisitorId } from "@/lib/visitor";

export type ChatMessage = {
  id: string | number;
  role: "user" | "model";
  content: string;
  image_path?: string | null;
  created_at?: string;
};

type GuestUsage = {
  used?: number;
  limit?: number;
  remaining?: number;
};

function getGuestRemaining(usage?: GuestUsage): number | null {
  if (typeof usage?.remaining === "number") {
    return Math.max(0, usage.remaining);
  }

  if (typeof usage?.used === "number" && typeof usage?.limit === "number") {
    return Math.max(0, usage.limit - usage.used);
  }

  return null;
}

type AskResponse = {
  success?: boolean;
  message?: string;
  guest_usage?: GuestUsage;
  data?: {
    session?: { is_new?: boolean; uuid?: string; title?: string };
    user_message?: ChatMessage;
    ai_message?: ChatMessage;
    guest_usage?: GuestUsage;
  };
};

export default function ChatPanel({
  uuid: initialUuid,
}: {
  uuid: string | null;
}) {
  const router = useRouter();

  const { isLoggedIn, loading: authLoading } = useAuth();
  const { openLoginModal } = useAuthModal();
  const isGuest = !isLoggedIn;

  const [uuid, setUuid] = useState<string | null>(initialUuid);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [title, setTitle] = useState("নতুন চ্যাট");
  const [guestRemaining, setGuestRemaining] = useState(20);
  const [isTyping, setIsTyping] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newMessageId, setNewMessageId] = useState<string | number | null>(
    null,
  );

  // 🛠️ ফিক্স ১: সব API Request-এর জন্য Authorization Header তৈরি করার ফাংশন
  const getHeaders = useCallback((isPost = false) => {
    const headers: Record<string, string> = {
      Accept: "application/json",
      "X-Visitor-Id": getVisitorId(),
    };

    if (isPost) {
      headers["Content-Type"] = "application/json";
    }

    return headers;
  }, []);

  // ১. URL/Props থেকে initialUuid পরিবর্তন হলে uuid স্টেট আপডেট করা
  useEffect(() => {
    setUuid(initialUuid);
  }, [initialUuid]);

  const loadGuestUsage = useCallback(async () => {
    try {
      const res = await fetch("/api/backend/ai/guest-usage", {
        credentials: "include",
        headers: getHeaders(),
        cache: "no-store",
      });
      const json = (await res.json().catch(() => null)) as {
        success?: boolean;
        data?: GuestUsage;
      } | null;

      const remaining = getGuestRemaining(json?.data);
      if (res.ok && json?.success && remaining !== null) {
        setGuestRemaining(remaining);
      }
    } catch {
      // Usage lookup is best-effort; keep the last known remaining count.
    }
  }, [getHeaders]);

  useEffect(() => {
    if (isGuest && !authLoading) {
      void loadGuestUsage();
    }
  }, [isGuest, authLoading, loadGuestUsage]);

  // ২. Session Load Effect (Fixes Old Chat Fetching)
  useEffect(() => {
    if (authLoading) return;

    if (!uuid) {
      setMessages([]);
      setTitle("নতুন চ্যাট");
      return;
    }

    let isMounted = true;

    (async () => {
      try {
        const visitorId = getVisitorId();
        const res = await fetch(
          `/api/backend/ai/sessions/${uuid}?visitor_id=${encodeURIComponent(visitorId)}`,
          {
            credentials: "include",
            headers: getHeaders(),
            cache: "no-store", // ← এটা যোগ করুন
          },
        );

        if (res.status === 410) {
          router.replace("/ai/chat");
          return;
        }

        const json = await res.json();
        if (json.success && isMounted) {
          setMessages(json.data.messages);
          setTitle(json.data.session.title);
        }
      } catch (e) {
        console.error("Session load error:", e);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [uuid, authLoading, router, getHeaders]);

  const ask = useCallback(
    async (
      question: string,
      imageBase64?: string | null,
      imageMime?: string | null,
    ) => {
      if (sending) return;
      const content = question.trim();
      if (!content && !imageBase64) return;

      if (isGuest && guestRemaining <= 0) {
        setError("আপনার বিনামূল্যে সীমা শেষ। আরও ব্যবহারের জন্য লগইন করুন।");
        openLoginModal({
          reason: "ফ্রি ব্যবহারের সীমা শেষ হয়েছে। আরও ব্যবহার করতে লগইন করুন।",
        });
        return;
      }

      setSending(true);
      setError(null);
      setIsTyping(true);

      const tempUserId = `tmp_${Date.now()}`;
      const userMsg: ChatMessage = {
        id: tempUserId,
        role: "user",
        content: content || "🖼️ ছবি পাঠানো হয়েছে",
        image_path: imageBase64
          ? `data:${imageMime};base64,${imageBase64}`
          : null,
      };
      setMessages((prev) => [...prev, userMsg]);

      try {
        const history = messages.slice(-11).map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const res = await fetch(`/api/backend/ai/ask`, {
          method: "POST",
          credentials: "include",
          headers: getHeaders(true), // 👈 POST রিকোয়েস্টেও টোকেন পাঠানো হচ্ছে
          cache: "no-store",
          body: JSON.stringify({
            question: content || null,
            image: imageBase64 || null,
            image_mime: imageMime || null,
            uuid: uuid || null,
            visitor_id: getVisitorId(),
            history: isGuest ? history : null,
          }),
        });

        const json = (await res.json().catch(() => null)) as AskResponse | null;
        const data = json?.data;
        const guestUsage = data?.guest_usage ?? json?.guest_usage;
        const remaining = getGuestRemaining(guestUsage);

        if (
          !res.ok ||
          !json?.success ||
          !data?.user_message ||
          !data?.ai_message
        ) {
          setMessages((prev) => prev.filter((m) => m.id !== tempUserId));
          setError(
            typeof json?.message === "string"
              ? json.message
              : "সমস্যা হয়েছে। আবার চেষ্টা করুন।",
          );

          if (remaining !== null) {
            setGuestRemaining(remaining);
          }

          if (isGuest && (res.status === 429 || remaining === 0)) {
            setGuestRemaining(0);
            openLoginModal({
              reason:
                "ফ্রি ব্যবহারের সীমা শেষ হয়েছে। আরও ব্যবহার করতে লগইন করুন।",
            });
          }

          return;
        }

        if (data.session?.is_new && data.session.uuid) {
          setUuid(data.session.uuid);
          setTitle(data.session.title || "নতুন চ্যাট");
          router.replace(`/ai/chat/${data.session.uuid}`, { scroll: false });

          window.dispatchEvent(new CustomEvent("chat:session-created"));
        }

        setMessages((prev) => {
          const withoutTmp = prev.filter((m) => m.id !== tempUserId);
          return [...withoutTmp, data.user_message!, data.ai_message!];
        });
        setNewMessageId(data.ai_message.id);

        if (remaining !== null) {
          setGuestRemaining(remaining);

          if (isGuest && remaining === 0) {
            openLoginModal({
              reason:
                "ফ্রি ব্যবহারের সীমা শেষ হয়েছে। আরও ব্যবহার করতে লগইন করুন।",
            });
          }
        }
      } catch (e) {
        setMessages((prev) => prev.filter((m) => m.id !== tempUserId));
        setError("উত্তর পেতে সমস্যা হচ্ছে — আবার চেষ্টা করুন।");
      } finally {
        setIsTyping(false);
        setSending(false);
      }
    },
    [sending, isGuest, guestRemaining, messages, uuid, router, getHeaders, openLoginModal],
  );

  const regenerateLast = useCallback(async () => {
    if (sending) return;

    if (isGuest) {
      const lastUser = [...messages].reverse().find((m) => m.role === "user");
      if (!lastUser) return;
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

    setMessages((prev) => {
      const copy = [...prev];
      if (copy.length && copy[copy.length - 1].role === "model") copy.pop();
      return copy;
    });

    try {
      const res = await fetch(`/api/backend/ai/regenerate`, {
        method: "POST",
        credentials: "include",
        headers: getHeaders(true), // 👈 এখানেও টোকেন যোগ করা হলো
        cache: "no-store",
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
  }, [sending, isGuest, messages, uuid, ask, getHeaders]);

  const editAndRegenerate = useCallback(
    async (messageId: number, newContent: string) => {
      if (isGuest || !uuid || sending) return;
      setSending(true);
      setIsTyping(true);
      setError(null);

      try {
        const res = await fetch(`/api/backend/ai/edit-regenerate`, {
          method: "POST",
          credentials: "include",
          headers: getHeaders(true), // 👈 এখানেও টোকেন যোগ করা হলো
          cache: "no-store",
          body: JSON.stringify({
            uuid,
            message_id: messageId,
            content: newContent,
          }),
        });
        const json = await res.json();
        if (!json.success) {
          setError(json.message);
          return;
        }
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
    [isGuest, uuid, sending, getHeaders],
  );

  const inputDisabled = isTyping || sending || (isGuest && guestRemaining <= 0);

  return (
    <div className="flex-1 flex flex-col min-h-0 h-full">
      {/* Messages + Input */}
      <div className="flex-1 flex flex-col min-h-0  max-w-2xl mx-auto w-full px-3 sm:px-4">
        <MessageList
          messages={messages}
          isTyping={isTyping}
          error={error}
          newMessageId={newMessageId}
          onRegenerate={regenerateLast}
          onEditRegenerate={editAndRegenerate}
          onRetry={regenerateLast}
        />

        <ChatInput
          disabled={inputDisabled}
          isGuest={isGuest}
          guestRemaining={guestRemaining}
          onSend={ask}
          onLogin={() =>
            openLoginModal({
              reason:
                guestRemaining <= 0
                  ? "ফ্রি ব্যবহারের সীমা শেষ হয়েছে। আরও ব্যবহার করতে লগইন করুন।"
                  : "চ্যাট সেভ করতে লগইন করুন।",
            })
          }
        />
      </div>
    </div>
  );
}
