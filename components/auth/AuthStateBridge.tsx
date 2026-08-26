"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { setAuthUser } from "@/lib/auth";

/**
 * Keeps legacy synchronous UI helpers in sync with the single AuthContext
 * source of truth. No token or session data is stored here.
 */
export function AuthStateBridge() {
  const { user } = useAuth();

  useEffect(() => {
    setAuthUser(user);
  }, [user]);

  return null;
}
