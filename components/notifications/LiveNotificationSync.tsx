"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUnreadCount } from "@/lib/notifications";

function scheduleIdle(callback: () => void) {
  const requestIdle = (
    window as Window & {
      requestIdleCallback?: (
        callback: IdleRequestCallback,
        options?: IdleRequestOptions,
      ) => number;
    }
  ).requestIdleCallback;

  if (requestIdle) return requestIdle(callback, { timeout: 8000 });
  return window.setTimeout(callback, 4000);
}

function cancelIdle(handle: number) {
  const cancelIdle = (
    window as Window & {
      cancelIdleCallback?: (handle: number) => void;
    }
  ).cancelIdleCallback;

  if (cancelIdle) cancelIdle(handle);
  else window.clearTimeout(handle);
}

export default function LiveNotificationSync() {
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    if (!user?.id || !isLoggedIn) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const idleHandle = scheduleIdle(() => {
      void import("@/lib/echo")
        .then(({ getEcho }) => {
          if (cancelled) return;

          const echo = getEcho();
          if (!echo) return;

          const channel = echo.private("user." + user.id);
          const refresh = () => {
            void getUnreadCount().catch(() => undefined);
          };

          channel.notification(refresh);
          channel.listen(".NotificationCreated", refresh);

          cleanup = () => {
            channel.stopListening(
              ".Illuminate\\Notifications\\Events\\BroadcastNotificationCreated",
            );
            channel.stopListening(".NotificationCreated");
          };
        })
        .catch(() => undefined);
    });

    return () => {
      cancelled = true;
      cancelIdle(idleHandle);
      cleanup?.();
    };
  }, [user?.id, isLoggedIn]);

  return null;
}
