"use client";

export default function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    // এটি সরাসরি Laravel-এর Google redirect রাউটে হিট করবে
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
    window.location.href = `${baseUrl}/api/auth/google/redirect`; 
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="w-full flex items-center text-white justify-center gap-4 rounded-full p-4 hover:opacity-90 bg-orange-400"
    >
      <span className=" text-xl font-bold">G</span>
      গুগল দিয়ে লগইন করুন
    </button>
  );
}