"use client";

import dynamic from "next/dynamic";
import { useNotificationModal } from "@/context/NotificationModalContext";

const NotificationModal = dynamic(
  () =>
    import("@/components/notifications/NotificationModal").then(
      (mod) => mod.NotificationModal,
    ),
  { ssr: false },
);

export default function NotificationModalWrapper() {
  const { isNotificationOpen, closeNotificationModal, setUnreadCount } =
    useNotificationModal();

  if (!isNotificationOpen) return null;

  return (
    <NotificationModal
      open={isNotificationOpen}
      onClose={closeNotificationModal}
      onCountChange={setUnreadCount}
    />
  );
}
