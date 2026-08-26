"use client";

export default function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
    window.location.href = `${baseUrl}/api/auth/google/redirect`;
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="flex w-full items-center justify-center gap-4 rounded-xl border border-zinc-400/25 bg-zinc-400/10 p-4 hover:bg-zinc-400/25"
    >
      <span className="text-xl font-bold">G</span>
      গুগল দিয়ে লগইন করুন
    </button>
  );
}
