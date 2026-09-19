"use client";

import { useSettingsModal } from "@/context/SettingsModalContext";
import SettingsModal from "@/components/SettingsModal";

export default function SettingsModalWrapper() {
  const { isSettingsOpen, closeSettingsModal } = useSettingsModal();

  return (
    <SettingsModal
      isOpen={isSettingsOpen}
      onClose={closeSettingsModal}
    />
  );
}