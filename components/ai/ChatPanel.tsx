"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ChatInput from "./ChatInput";
import MessageList from "./MessageList";
import { useAuth } from "@/context/AuthContext";

export type ChatMessage = {
  id: string | number;
  role: "user" | "model";
  content: string;
  image_path?: string | null;
  created_at?: string;
};

const API =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

export default function ChatPanel({
  uuid: initialUuid,
}: {
  uuid: string | null;
}) {
  const router = useRouter();

  // Auth Check from AuthContext (টোকেন বের করে নিচ্ছি)
  // যদি আপনার useAuth-এ token না থাকে, তবে localStorage থেকে নেওয়া হবে।
  const {
    isLoggedIn,
    loading: authLoading,
    token: contextToken,
  } = useAuth() as any;
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
  const getHeaders = useCallback(
    (isPost = false) => {
      // AuthContext বা localStorage থেকে টোকেন নেওয়া হচ্ছে
      const token =
        contextToken ||
        (typeof window !== "undefined" ? localStorage.getItem("token") : "");

      const headers: Record<string, string> = {
        Accept: "application/json",
      };

      if (isPost) {
        headers["Content-Type"] = "application/json";
      }

      // টোকেন থাকলে সেটি Bearer হিসেবে পাঠানো হবে
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      return headers;
    },
    [contextToken],
  );

  // ১. URL/Props থেকে initialUuid পরিবর্তন হলে uuid স্টেট আপডেট করা
  useEffect(() => {
    setUuid(initialUuid);
  }, [initialUuid]);

  const loadGuestUsage = async () => {
    try {
      const res = await fetch(`${API}/api/ai/guest-usage`, {
        credentials: "include",
        headers: getHeaders(), // 👈 টোকেন পাঠানো হচ্ছে
      });
      const json = await res.json();
      if (json.success) setGuestRemaining(json.data.remaining);
    } catch {}
  };

  useEffect(() => {
    if (isGuest && !authLoading) {
      loadGuestUsage();
    }
  }, [isGuest, authLoading, getHeaders]);

  // ২. Session Load Effect (Fixes Old Chat Fetching)
  useEffect(() => {
    if (authLoading) return;

    if (!uuid) {
      setMessages([]);
      setTitle("নতুন চ্যাট");
      return;
    }

    if (isGuest) return;

    let isMounted = true;

    (async () => {
      try {
        const res = await fetch(`${API}/api/ai/sessions/${uuid}`, {
          credentials: "include",
          headers: getHeaders(), // 🛠️ ফিক্স ২: এখানেই টোকেন না যাওয়ার কারণে ডেটা আসত না
        });

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
  }, [uuid, isGuest, authLoading, router, getHeaders]);

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

        const res = await fetch(`${API}/api/ai/ask`, {
          method: "POST",
          credentials: "include",
          headers: getHeaders(true), // 👈 POST রিকোয়েস্টেও টোকেন পাঠানো হচ্ছে
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
          router.replace(`/ai/chat/${data.session.uuid}`, { scroll: false });
        }

        setMessages((prev) => {
          const withoutTmp = prev.filter((m) => m.id !== tempUserId);
          return [...withoutTmp, data.user_message, data.ai_message];
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
    [sending, isGuest, guestRemaining, messages, uuid, router, getHeaders],
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
      const res = await fetch(`${API}/api/ai/regenerate`, {
        method: "POST",
        credentials: "include",
        headers: getHeaders(true), // 👈 এখানেও টোকেন যোগ করা হলো
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
        const res = await fetch(`${API}/api/ai/edit-regenerate`, {
          method: "POST",
          credentials: "include",
          headers: getHeaders(true), // 👈 এখানেও টোকেন যোগ করা হলো
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
      <div className="flex-1 flex flex-col min-h-0 max-w-3xl mx-auto w-full px-3 sm:px-4">
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
            window.dispatchEvent(new CustomEvent("session-created"))
          }
        />
      </div>
    </div>
  );
}
