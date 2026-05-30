"use client";

import { useEffect, useMemo, useState, useTransition } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, ExternalLink, Loader2, MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buildNotificationHref, getNotificationTypeLabel } from "@/src/lib/notifications/notification-utils";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  entityType: string | null;
  entityId: string | null;
  isRead: boolean;
  createdAt: string;
}

export function NotificationBell() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [items, setItems] = useState<NotificationItem[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch("/api/notifications?limit=5");
        const json = await response.json();

        if (!response.ok || !json.success || cancelled) {
          return;
        }

        setItems(json.items ?? []);
        setUnreadCount(json.unreadCount ?? 0);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const markRead = async (notificationId: string) => {
    setItems((current) =>
      current.map((item) =>
        item.id === notificationId ? { ...item, isRead: true } : item
      )
    );
    setUnreadCount((current) => Math.max(0, current - 1));

    const response = await fetch(`/api/notifications/${notificationId}/read`, {
      method: "PATCH",
    });

    if (!response.ok) {
      router.refresh();
    }
  };

  const markAllRead = async () => {
    const snapshot = items;
    setItems((current) => current.map((item) => ({ ...item, isRead: true })));
    setUnreadCount(0);

    const response = await fetch("/api/notifications/read-all", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ unreadOnly: true }),
    });

    if (!response.ok) {
      setItems(snapshot);
      router.refresh();
    }
  };

  const unreadBadge = useMemo(() => (unreadCount > 9 ? "9+" : String(unreadCount)), [unreadCount]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Notifications" className="relative rounded-full border bg-white/80 shadow-sm">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 ? (
            <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-sky-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
              {unreadBadge}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-95 p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <DropdownMenuLabel className="p-0 text-sm font-semibold text-slate-950">Notifications</DropdownMenuLabel>
            <p className="text-xs text-slate-500">{unreadCount} unread</p>
          </div>
          <Button variant="ghost" size="sm" disabled={isPending || unreadCount === 0} onClick={() => startTransition(markAllRead)}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all read
          </Button>
        </div>

        <div className="max-h-105 overflow-y-auto p-2">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading notifications
            </div>
          ) : items.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500">No notifications yet.</div>
          ) : (
            items.map((item) => {
              const href = buildNotificationHref({
                type: item.type,
                entityType: item.entityType,
                entityId: item.entityId,
                role: "ADMIN",
              });

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    void markRead(item.id);
                    router.push(href);
                  }}
                  className={`mb-2 w-full rounded-xl border p-3 text-left transition hover:bg-slate-50 ${item.isRead ? "bg-white" : "bg-sky-50/70"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={item.isRead ? "outline" : "default"}>{getNotificationTypeLabel(item.type)}</Badge>
                        {!item.isRead ? <span className="h-2 w-2 rounded-full bg-sky-500" /> : null}
                      </div>
                      <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                      <p className="text-sm text-slate-600 line-clamp-2">{item.message}</p>
                      <p className="text-xs text-slate-400">{new Date(item.createdAt).toLocaleString()}</p>
                    </div>
                    <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        <DropdownMenuSeparator />
        <div className="flex items-center justify-between px-4 py-3">
          <Button asChild variant="secondary" size="sm">
            <Link href="/notifications">
              View all
              <MoreHorizontal className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => router.refresh()}>
            Refresh
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
