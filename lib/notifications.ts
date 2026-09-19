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
  const res = await fetch(path, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const json = await res.json().catch(() => ({}));

  if (res.status === 401) {
    throw new Error("Unauthenticated.");
  }

  if (!res.ok) {
    throw new Error(json.message || "Request failed");
  }

  return json as T;
}

export async function getNotifications(
  filter: "all" | "unread" = "all",
  page = 1,
  perPage = 15,
): Promise<NotificationsResponse> {
  const params = new URLSearchParams({
    filter,
    page: String(page),
    per_page: String(perPage),
  });

  const json = await request<any>(`/api/notifications?${params}`);

  // সবসময় safe shape রিটার্ন করো
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
}

export async function getUnreadCount(): Promise<number> {
  const data = await request<{ count: number }>("/api/notifications/unread-count");
  return data.count ?? 0;
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