// lib/auth-cookie.ts
// ─────────────────────────────────────────────────────────────────
// Cookie-based token storage — middleware server-side চেক করতে পারবে
// auth.ts-এর setToken/removeToken replace করো এগুলো দিয়ে
// ─────────────────────────────────────────────────────────────────

import Cookies from 'js-cookie';

const TOKEN_KEY = 'auth_token';
const USER_KEY  = 'auth_user';

const COOKIE_OPTIONS: Cookies.CookieAttributes = {
  expires  : 7,           // 7 দিন
  secure   : true,        // HTTPS only
  sameSite : 'Lax',       // CSRF protection
  // domain: '.totthobox.com', // subdomain share করতে হলে uncomment করো
};

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return Cookies.get(TOKEN_KEY) ?? null;
}

export function setToken(token: string): void {
  Cookies.set(TOKEN_KEY, token, COOKIE_OPTIONS);
  // localStorage-এও রাখো (fast read-এর জন্য)
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  Cookies.remove(TOKEN_KEY, { sameSite: 'Lax' });
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: object): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}