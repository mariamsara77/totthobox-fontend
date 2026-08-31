import Echo from "laravel-echo";
import Pusher from "pusher-js";

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

if (typeof window !== "undefined") {
  window.Pusher = Pusher;
}

let echoInstance: Echo<any> | null = null;

/**
 * Singleton Echo instance.
 * Auth token client-এ কখনোই আনার দরকার নেই — httpOnly cookie
 * সরাসরি ব্রাউজার থেকে পড়া যায় না (এবং সেটাই ইচ্ছাকৃত/নিরাপদ)।
 * তাই authEndpoint কে same-origin Next.js route-এ পাঠানো হচ্ছে,
 * যেটা server-side এ cookie পড়ে backend-কে ফরওয়ার্ড করে।
 */
export const getEcho = () => {
  if (typeof window === "undefined") return null;
  if (echoInstance) return echoInstance;

  echoInstance = new Echo({
    broadcaster: "reverb",
    key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
    wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
    wsPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT) || 80,
    wssPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT) || 443,
    forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME || "https") === "https",
    enabledTransports: ["ws", "wss"],
    authEndpoint: "/api/broadcasting/auth", // same-origin => cookie নিজে থেকেই যাবে
    auth: {
      headers: {
        Accept: "application/json",
      },
    },
  });

  return echoInstance;
};

export const disconnectEcho = () => {
  if (echoInstance) {
    echoInstance.disconnect();
    echoInstance = null;
  }
};