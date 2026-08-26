"use client";

import { signIn } from "next-auth/react";

export default function GoogleLoginButton() {
  return (
    <button
      onClick={() => signIn("google")}
      className="w-full flex items-center justify-center gap-4 rounded-full p-4 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed bg-orange-400"
    >
      <span className="text-xl font-bold" aria-hidden="true">
        G
      </span>
      গুগল দিয়ে লগইন করুন
    </button>
  );
}
