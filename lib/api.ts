import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});



const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com"; // e.g. https://admin.totthobox.com

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}/api${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw { status: res.status, ...err };
  }

  return res.json();
}

export default apiFetch;

