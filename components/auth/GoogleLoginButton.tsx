"use client";

export default function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

    window.location.href = `${baseUrl}/auth/google/redirect`;
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="w-full flex items-center text-white justify-center gap-3 border border-zinc-400/25 rounded-full py-3.5 hover:bg-orange-400/80 bg-orange-400 transition font-medium"
    >
      <span className="font-sans text-xl font-bold">G</span>
      গুগল দিয়ে লগইন করুন
    </button>
  );
}
