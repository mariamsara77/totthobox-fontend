"use client";

export default function FacebookLoginButton() {
  const handleFacebookLogin = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";
    window.location.href = `${baseUrl}/auth/facebook/redirect`;
  };

  return (
    <button
      type="button"
      onClick={handleFacebookLogin}
      className="flex w-full items-center justify-center gap-4 rounded-xl border border-zinc-400/25 bg-zinc-400/10 p-4 hover:bg-zinc-400/25"
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-xl border border-zinc-400/25 bg-zinc-400/10 text-xl font-bold">f</span>
      ফেসবুক দিয়ে লগইন করুন
    </button>
  );
}
