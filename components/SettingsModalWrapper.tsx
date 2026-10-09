"use client";

import dynamic from "next/dynamic";
import { useSettingsModal } from "@/context/SettingsModalContext";

const SettingsModal = dynamic(() => import("@/components/SettingsModal"), {
  ssr: false,
});

export default function SettingsModalWrapper() {
  const { isSettingsOpen, closeSettingsModal } = useSettingsModal();

  if (!isSettingsOpen) return null;

  return (
    <SettingsModal
      isOpen={isSettingsOpen}
      onClose={closeSettingsModal}
    />
  );
}
