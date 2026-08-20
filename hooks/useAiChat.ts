// hooks/useAiChat.ts
"use client";

import { useState, useCallback } from "react";
import apiFetch from "@/lib/api";

type Message = {
  id: string | number;
  role: "user" | "model";
  content: string;
  image_path?: string | null;
};

type Session = {
  id: number;
  uuid: string;
  title: string;
  is_new?: boolean;
};

export function useAiChat(token?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [guestUsage, setGuestUsage] = useState({ used: 0, limit: 20, remaining: 20 });
  const [error, setError] = useState<string | null>(null);

  // ── Guest usage fetch ──
  const fetchGuestUsage = useCallback(async () => {
    try {
      const data = await apiFetch<{ success: boolean; data: typeof guestUsage }>(
        "/ai/guest-usage"
      );
      setGuestUsage(data.data);
    } catch {}
  }, []);

  // ── Load existing session ──
  const loadSession = useCallback(
    async (uuid: string) => {
      const data = await apiFetch<{
        success: boolean;
        data: { session: Session; messages: Message[] };
      }>(`/ai/sessions/${uuid}`, {}, token);

      setSession(data.data.session);
      setMessages(data.data.messages);
    },
    [token]
  );

  // ── Send message ──
  const ask = useCallback(
    async (question: string, imageBase64?: string, imageMime?: string) => {
      if (!question.trim() && !imageBase64) return;
      setError(null);
      setIsTyping(true);

      // Optimistic user message
      const tempId = `temp_${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        { id: tempId, role: "user", content: question || "🖼️ ছবি পাঠানো হয়েছে" },
      ]);

      try {
        const body: Record<string, unknown> = {
          question,
          uuid: session?.uuid ?? undefined,
        };
        if (imageBase64) {
          body.image = imageBase64;
          body.image_mime = imageMime;
        }

        const data = await apiFetch<{
          success: boolean;
          data: {
            session?: Session;
            user_message: Message;
            ai_message: Message;
            guest_usage?: typeof guestUsage;
          };
        }>("/ai/ask", {
          method: "POST",
          body: JSON.stringify(body),
        }, token);

        // Replace temp message + add AI response
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== tempId),
          data.data.user_message,
          data.data.ai_message,
        ]);

        if (data.data.session) setSession(data.data.session);
        if (data.data.guest_usage) setGuestUsage(data.data.guest_usage);
      } catch (err: any) {
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        setError(err?.message ?? "উত্তর পেতে সমস্যা হচ্ছে — আবার চেষ্টা করুন।");
      } finally {
        setIsTyping(false);
      }
    },
    [session, token]
  );

  // ── Regenerate ──
  const regenerate = useCallback(async () => {
    if (!session) return;
    setIsTyping(true);
    try {
      const data = await apiFetch<{
        success: boolean;
        data: { ai_message: Message };
      }>("/ai/regenerate", {
        method: "POST",
        body: JSON.stringify({ uuid: session.uuid }),
      }, token);

      setMessages((prev) => [...prev, data.data.ai_message]);
    } catch (err: any) {
      setError(err?.message ?? "পুনরায় তৈরি করতে সমস্যা হচ্ছে।");
    } finally {
      setIsTyping(false);
    }
  }, [session, token]);

  // ── Edit + Regenerate ──
  const editAndRegenerate = useCallback(
    async (messageId: number, newContent: string) => {
      if (!session) return;
      setIsTyping(true);
      try {
        const data = await apiFetch<{
          success: boolean;
          data: { user_message: Message; ai_message: Message };
        }>("/ai/edit-regenerate", {
          method: "POST",
          body: JSON.stringify({
            uuid: session.uuid,
            message_id: messageId,
            content: newContent,
          }),
        }, token);

        setMessages((prev) => {
          const idx = prev.findIndex((m) => m.id === messageId);
          const updated = [...prev.slice(0, idx + 1)];
          updated[idx] = data.data.user_message;
          return [...updated, data.data.ai_message];
        });
      } catch (err: any) {
        setError(err?.message ?? "সম্পাদনা করতে সমস্যা হচ্ছে।");
      } finally {
        setIsTyping(false);
      }
    },
    [session, token]
  );

  return {
    messages,
    session,
    isTyping,
    guestUsage,
    error,
    ask,
    regenerate,
    editAndRegenerate,
    loadSession,
    fetchGuestUsage,
  };
}