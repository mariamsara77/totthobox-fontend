import apiFetch from "./api";
import axios from "./axios";

// লগইন করার আগে Sanctum এর CSRF কুকি সেট করতে হয়
export async function login(email: string, password: string): Promise<any> {
  // ১. CSRF Cookie ইনিশিয়ালাইজ করা
  await axios.get("/sanctum/csrf-cookie", { 
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com" 
  });

  // ২. লগইন রিকোয়েস্ট পাঠানো
  const data = await apiFetch<any>("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  
  return data;
}

export async function logout(): Promise<void> {
  await apiFetch("/logout", { method: "POST" });
}