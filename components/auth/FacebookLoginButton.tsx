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
      className="w-full flex items-center text-white justify-center gap-3 border border-zinc-400/25 rounded-full py-3.5 bg-blue-600 hover:bg-blue-600/80 transition font-medium"
    >
      <span className="flex justify-center rounded-full pt-1 text-xl font-bold items-center text-center text-blue-600 bg-white/80 h-6 w-6">f</span>
      ফেসবুক দিয়ে লগইন করুন
    </button>
  );
}