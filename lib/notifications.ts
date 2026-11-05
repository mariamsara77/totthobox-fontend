export type NotificationItem = {
  id: string;
  sender_name: string;
  sender_avatar: string | null;
  is_online: boolean;
  display_title: string;
  message: string;
  action_url: string;
  time: string;
  is_unread: boolean;
};

export type NotificationsResponse = {
  data: NotificationItem[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    has_more: boolean;
  };
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  if (options.signal) {
    options.signal.addEventListener("abort", () => controller.abort(), { once: true });
  }

  try {
    const baseUrl =
      typeof window !== "undefined"
        ? ""
        : (process.env.NEXT_PUBLIC_SITE_URL || "https://totthobox.com").replace(/\/+$/, "");

    const fullUrl = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

    const cleanHeaders: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    if (options.headers) {
      const rawHeaders =
        options.headers instanceof Headers
          ? Object.fromEntries(options.headers.entries())
          : (options.headers as Record<string, unknown>);

      for (const [k, v] of Object.entries(rawHeaders)) {
        if (typeof v === "string" && v.trim().length > 0) {
          cleanHeaders[k] = v.trim();
        }
      }
    }

    const res = await fetch(fullUrl, {
      cache: "no-store",
      ...options,
      headers: cleanHeaders,
      signal: controller.signal,
    });

    const json = await res.json().catch(() => ({}));
    return json as T;
  } catch (e) {
    console.warn("Notifications request error:", e);
    return {} as T;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function getNotifications(
  filter: "all" | "unread" = "all",
  page = 1,
  perPage = 15,
): Promise<NotificationsResponse> {
  try {
    const params = new URLSearchParams({
      filter,
      page: String(page),
      per_page: String(perPage),
    });

    const json = await request<any>(`/api/notifications?${params}`);

    const data = Array.isArray(json?.data)
      ? json.data
      : Array.isArray(json)
        ? json
        : [];

    return {
      data,
      meta: {
        current_page: json?.meta?.current_page ?? page,
        per_page: json?.meta?.per_page ?? perPage,
        total: json?.meta?.total ?? data.length,
        has_more: Boolean(json?.meta?.has_more),
      },
    };
  } catch {
    return {
      data: [],
      meta: {
        current_page: page,
        per_page: perPage,
        total: 0,
        has_more: false,
      },
    };
  }
}

let unreadCountPromise: Promise<number> | null = null;
let lastUnreadFetchTime = 0;
let cachedUnreadCount = 0;

export async function getUnreadCount(force = false): Promise<number> {
  const now = Date.now();
  // Client-side cache: throttle to 10 seconds unless forced or tab switched
  if (!force && now - lastUnreadFetchTime < 10000) {
    return cachedUnreadCount;
  }

  if (unreadCountPromise) {
    return unreadCountPromise;
  }

  unreadCountPromise = (async () => {
    try {
      const data = await request<any>("/api/notifications/unread-count");
      let count = 0;
      if (typeof data?.count === "number") count = data.count;
      else if (typeof data?.data?.count === "number") count = data.data.count;
      cachedUnreadCount = count;
      lastUnreadFetchTime = Date.now();
      return count;
    } catch {
      return cachedUnreadCount;
    } finally {
      unreadCountPromise = null;
    }
  })();

  return unreadCountPromise;
}

export async function markNotificationRead(id: string) {
  return request(`/api/notifications/${id}/read`, { method: "POST" });
}

export async function markAllNotificationsRead() {
  return request("/api/notifications/mark-all-read", { method: "POST" });
}

export async function clearAllNotifications() {
  return request("/api/notifications", { method: "DELETE" });
}
