"use client";

import { useNotificationModal } from "@/context/NotificationModalContext";
import { NotificationModal } from "./NotificationModal";

export default function NotificationModalWrapper() {
  const { isNotificationOpen, closeNotificationModal, setUnreadCount } =
    useNotificationModal();

  return (
    <NotificationModal
      open={isNotificationOpen}
      onClose={closeNotificationModal}
      onCountChange={setUnreadCount}
    />
  );
}
