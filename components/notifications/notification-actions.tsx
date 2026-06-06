"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";

interface Props {
  userId: string;
  notificationId?: string;
  isRead?: boolean;
  unreadOnly?: boolean;
}

export function NotificationActions({ notificationId, isRead, unreadOnly }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const markAsRead = async () => {
    if (!notificationId) return;

    const response = await fetch(`/api/notifications/${notificationId}/read`, { method: "PATCH" });
    if (!response.ok) return;

    router.refresh();
  };

  const markAllAsRead = async () => {
    const response = await fetch("/api/notifications/read-all", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ unreadOnly: unreadOnly ?? true }),
    });

    if (!response.ok) return;

    router.refresh();
  };

  if (notificationId) {
    return (
      <Button variant="ghost" size="sm" disabled={isPending || isRead} onClick={() => startTransition(markAsRead)}>
        {isRead ? "Read" : "Mark read"}
      </Button>
    );
  }

  return (
    <Button variant="outline" size="sm" disabled={isPending} onClick={() => startTransition(markAllAsRead)}>
      Mark all read
    </Button>
  );
}
