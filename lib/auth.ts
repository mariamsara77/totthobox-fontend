// lib/auth.ts
// ─────────────────────────────────────────────────────────────────
// Auth utility — token management + API calls
// ─────────────────────────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://admin.totthobox.com/api';

// ─── Token Helpers ────────────────────────────────────────────────

export const TOKEN_KEY = 'auth_token';
export const USER_KEY  = 'auth_user';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: User): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// ─── Types ────────────────────────────────────────────────────────

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  roles: string[];
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

// ─── API Helpers ──────────────────────────────────────────────────

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  return res.json();
}

// ─── Auth API Calls ───────────────────────────────────────────────

/** Google OAuth URL নাও Laravel থেকে */
export async function getGoogleRedirectUrl(): Promise<string> {
  const data = await apiFetch<{ url: string }>('/auth/google/redirect');
  return data.url;
}

/** Callback-এ পাওয়া token দিয়ে user info নাও */
export async function fetchMe(): Promise<User> {
  return apiFetch<User>('/user');
}

/** Google One Tap token verify */
export async function verifyOneTapToken(token: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/google/one-tap', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
}

/** Logout */
export async function logoutApi(): Promise<void> {
  await apiFetch('/logout', { method: 'POST' }).catch(() => null);
  removeToken();
}