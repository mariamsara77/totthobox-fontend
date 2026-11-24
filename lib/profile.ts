import { apiFetch } from "@/lib/api-client";
import type { UserProfile, SelectOption } from "@/types/profile";

// ── Current user profile ────────────────────────────────────────────────
export async function getProfile(): Promise<UserProfile> {
  const res = await apiFetch<any>("/v1/profile");
  return res.user ?? res.data ?? res;
}

// ── Update profile ──────────────────────────────────────────────────────
export async function updateProfile(data: FormData | Record<string, any>) {
  const isFormData = data instanceof FormData;

  return apiFetch<{ message: string; user: UserProfile }>("/v1/profile", {
    method: isFormData ? "POST" : "PUT",
    body: isFormData ? data : JSON.stringify(data),
  });
}

// ── Avatar ──────────────────────────────────────────────────────────────
export async function updateAvatar(file: File) {
  const formData = new FormData();
  formData.append("avatar", file);

  return apiFetch<{ message: string; avatar_url: string }>("/v1/profile/avatar", {
    method: "POST",
    body: formData,
  });
}

export async function removeAvatar() {
  return apiFetch<{ message: string }>("/v1/profile/avatar", {
    method: "DELETE",
  });
}

// ── Role ────────────────────────────────────────────────────────────────
export async function getAvailableRoles(): Promise<string[]> {
  const res = await apiFetch<{ roles: string[] }>("/v1/profile/available-roles");
  return res.roles;
}

export async function removeRole() {
  return apiFetch<{ message: string; user: UserProfile }>("/v1/profile/role", {
    method: "DELETE",
  });
}

// ── Location cascade ────────────────────────────────────────────────────
export async function getDivisions(): Promise<SelectOption[]> {
  return apiFetch<SelectOption[]>("/v1/profile/divisions");
}

export async function getDistricts(divisionId: number): Promise<SelectOption[]> {
  return apiFetch<SelectOption[]>(`/v1/profile/districts/${divisionId}`);
}

export async function getThanas(districtId: number): Promise<SelectOption[]> {
  return apiFetch<SelectOption[]>(`/v1/profile/thanas/${districtId}`);
}

export async function getClassLevels(): Promise<SelectOption[]> {
  return apiFetch<SelectOption[]>("/v1/profile/class-levels");
}

// ── Password ────────────────────────────────────────────────────────────
export async function updatePassword(payload: {
  current_password: string;
  password: string;
  password_confirmation: string;
}) {
  return apiFetch<{ message: string }>("/v1/password", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// ── Delete account ──────────────────────────────────────────────────────
export async function deleteAccount(password: string) {
  return apiFetch<{ message: string }>("/v1/account", {
    method: "DELETE",
    body: JSON.stringify({ password }),
  });
}