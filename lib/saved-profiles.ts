/**
 * localStorage-এ শুধু non-sensitive profile info।
 * Token কখনো এখানে আসবে না — httpOnly cookie-তে থাকে।
 */

export interface SavedProfile {
  id: number;
  name: string;
  email: string;
  slug?: string | null;
  avatar_url?: string | null;
  lastLoginAt: string;
}

const STORAGE_KEY = "totthobox_saved_profiles";
const MAX_PROFILES = 5;

const isBrowser = () => typeof window !== "undefined";

export function getSavedProfiles(): SavedProfile[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // পুরনো data-তে token থাকলে strip করো
    return parsed.map(({ token: _t, ...rest }) => rest as SavedProfile);
  } catch {
    return [];
  }
}

export function saveProfile(profile: Omit<SavedProfile, "lastLoginAt">): void {
  if (!isBrowser()) return;
  try {
    const existing = getSavedProfiles().filter((p) => p.email !== profile.email);
    const next: SavedProfile[] = [
      { ...profile, lastLoginAt: new Date().toISOString() },
      ...existing,
    ].slice(0, MAX_PROFILES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // incognito-তে blocked হলে ignore
  }
}

export function removeSavedProfile(email: string): void {
  if (!isBrowser()) return;
  try {
    const next = getSavedProfiles().filter((p) => p.email !== email);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {}
}