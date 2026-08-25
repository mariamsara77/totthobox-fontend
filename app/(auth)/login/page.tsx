import { Suspense } from "react";
import LoginContent from "./LoginContent"; // or "./login-content"

export const dynamic = "force-dynamic"; // now this actually works

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-10">লোডিং...</div>}>
      <LoginContent />
    </Suspense>
  );
}