import { apiFetch } from "@/lib/api-client";

export interface ChatUser {
  id: number;
  name: string;
  slug: string;
  email?: string | null;
  phone?: string | null;
  avatar?: string | null;
  avatar_url?: string | null;
  profile_photo_url?: string | null;
  is_online?: boolean;
  status?: string | null;
  role_label?: string | null;
  roles?: Array<{ id?: number; name: string }>;
  sentMessages?: ChatMessage[];
  receivedMessages?: ChatMessage[];
}

export interface MessageMedia {
  id: number;
  name?: string | null;
  file_name?: string | null;
  mime_type?: string | null;
  size?: number | null;
  url?: string | null;
  original_url?: string | null;
  preview_url?: string | null;
  collection_name?: string | null;
}

export interface ChatMessage {
  id: number;
  sender_id: number;
  receiver_id: number;
  message?: string | null;
  parent_id?: number | null;
  read?: boolean | number;
  read_at?: string | null;
  created_at: string;
  updated_at?: string;
  sender?: ChatUser | null;
  receiver?: ChatUser | null;
  parent?: ChatMessage | null;
  media?: MessageMedia[];
}

export interface PaginatedMessages {
  data: ChatMessage[];
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
  next_page_url?: string | null;
  prev_page_url?: string | null;
}

export interface UserProfileResponse {
  success?: boolean;
  data?: { profile?: ChatUser & { bio?: string | null; location?: string | null } };
  profile?: ChatUser;
}

export interface UserSearchResponse {
  success?: boolean;
  data?: ChatUser[] | { data?: ChatUser[] };
}

function normalizeUser(user: ChatUser): ChatUser {
  if (!user) return user;
  return { ...user, avatar: user.avatar || user.avatar_url || user.profile_photo_url || null };
}

export function normalizeMessage(message: ChatMessage): ChatMessage {
  if (!message) return message;
  return {
    ...message,
    sender: message.sender ? normalizeUser(message.sender) : message.sender,
    receiver: message.receiver ? normalizeUser(message.receiver) : message.receiver,
    parent: message.parent ? normalizeMessage(message.parent) : message.parent,
  };
}

export async function getChatUsers() {
  const users = await apiFetch<any>("/messages/users");
  const rawList = Array.isArray(users) ? users : Array.isArray(users?.data) ? users.data : [];
  return rawList.map(normalizeUser);
}

export async function searchUsers(search = "") {
  const response = await apiFetch<UserSearchResponse>(`/users/search?search=${encodeURIComponent(search.trim())}`);
  const raw = Array.isArray(response.data) ? response.data : response.data?.data || [];
  return raw.map(normalizeUser);
}

export async function getOnlineUsers() {
  const users = await apiFetch<any>("/messages/online");
  const rawList = Array.isArray(users) ? users : Array.isArray(users?.data) ? users.data : [];
  return rawList.map(normalizeUser);
}

export async function getMessages(userSlug: string, page = 1, perPage = 30): Promise<PaginatedMessages> {
  const payload = await apiFetch<any>(`/messages/${encodeURIComponent(userSlug)}?page=${page}&per_page=${perPage}`);
  const rawList = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : Array.isArray(payload?.messages) ? payload.messages : [];
  return {
    ...payload,
    data: rawList.map(normalizeMessage),
    current_page: payload?.current_page ?? page,
    last_page: payload?.last_page,
    next_page_url: payload?.next_page_url,
  };
}

export async function sendMessage(userId: number, message: string, attachment?: File | null, parentId?: number | null) {
  const form = new FormData();
  form.append("receiver_id", String(userId));
  if (message.trim()) form.append("message", message.trim());
  if (parentId) form.append("parent_id", String(parentId));
  if (attachment) form.append("attachment", attachment);
  const res = await apiFetch<any>("/messages", { method: "POST", body: form });
  const rawMsg = res?.data || res?.message_data || res;
  return normalizeMessage(rawMsg);
}

export async function markMessagesAsRead(userSlug: string) {
  return apiFetch<{ message: string }>(`/messages/${encodeURIComponent(userSlug)}/read`, { method: "POST" });
}

export async function editMessage(messageId: number, message: string) {
  const res = await apiFetch<any>(`/messages/${messageId}`, { method: "PUT", body: JSON.stringify({ message: message.trim() }) });
  const rawMsg = res?.data || res?.message || res;
  return normalizeMessage(rawMsg);
}

export async function deleteMessage(messageId: number) {
  return apiFetch<void>(`/messages/${messageId}`, { method: "DELETE" });
}

export async function getBlockStatus(userSlug: string) {
  return apiFetch<{ blocked?: boolean; is_blocked?: boolean }>(`/users/${encodeURIComponent(userSlug)}/block-status`);
}

export async function toggleBlock(userSlug: string) {
  return apiFetch<{ blocked?: boolean; is_blocked?: boolean; message?: string }>(`/users/${encodeURIComponent(userSlug)}/block`, { method: "POST" });
}

export async function getUserProfileBySlug(slug: string) {
  const response = await apiFetch<any>(`/users/${encodeURIComponent(slug)}/profile`);
  if (response.data?.profile) response.data.profile = normalizeUser(response.data.profile);
  if (response.profile) response.profile = normalizeUser(response.profile);
  return response;
}

export function getMediaUrl(media?: MessageMedia | null) { return media?.original_url || media?.url || media?.preview_url || null; }
export function isImageMedia(media?: MessageMedia | null) { return Boolean(media?.mime_type?.startsWith("image/")); }
export function isVideoMedia(media?: MessageMedia | null) { return Boolean(media?.mime_type?.startsWith("video/")); }
export function isAudioMedia(media?: MessageMedia | null) { return Boolean(media?.mime_type?.startsWith("audio/")); }

export function formatFileSize(bytes?: number | null) {
  if (!bytes || bytes <= 0) return "ফাইল";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}
