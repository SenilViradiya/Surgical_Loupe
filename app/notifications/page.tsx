import { auth } from "@/auth";

import { redirect } from "next/navigation";

import { UserRole } from "@/lib/generated/prisma";
import { getNotifications, markAllAsRead } from "@/src/lib/notifications/notification-service";
import { buildNotificationHref, getNotificationTypeLabel } from "@/src/lib/notifications/notification-utils";

import { DashboardShell } from "@/components/layouts/dashboard-shell";
import { Sidebar } from "@/components/layouts/sidebar";
import { Navbar } from "@/components/layouts/navbar";
import { adminSidebarItems } from "@/constants/admin-sidebar";
import { dealerSidebarItems } from "@/constants/dealer-sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import Link from "next/link";
import { NotificationActions } from "@/components/notifications/notification-actions";

export default async function NotificationsPage({ searchParams }: { searchParams?: Promise<{ page?: string; query?: string; type?: string; unreadOnly?: string }> }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = session.user.role;
  const resolvedSearchParams = await searchParams;
  const page = Math.max(1, Number(resolvedSearchParams?.page ?? "1"));
  const query = resolvedSearchParams?.query?.trim() || undefined;
  const type = resolvedSearchParams?.type as any;
  const unreadOnly = resolvedSearchParams?.unreadOnly === "true";

  const [result] = await Promise.all([
    getNotifications(session.user.id, { page, limit: 20, query, type, unreadOnly }),
  ]);

  const sidebarItems = role === UserRole.ADMIN ? adminSidebarItems : dealerSidebarItems;

  return (
    <DashboardShell sidebar={<Sidebar items={sidebarItems} />} navbar={<Navbar />}>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] text-slate-400 uppercase">Notification Center</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950">Notifications</h1>
            <p className="text-sm text-slate-600">Track quote, lead, inventory, and dealer events in one place.</p>
          </div>
          <form action="/notifications" method="get" className="flex flex-col gap-3 rounded-2xl border bg-white p-4 md:flex-row md:items-center">
            <Input name="query" defaultValue={query ?? ""} placeholder="Search notifications" className="w-full md:w-72" />
            <select name="type" defaultValue={resolvedSearchParams?.type ?? ""} className="h-10 rounded-md border bg-white px-3 text-sm">
              <option value="">All types</option>
              <option value="LEAD">Lead</option>
              <option value="QUOTE">Quote</option>
              <option value="INVENTORY">Inventory</option>
              <option value="DEALER">Dealer</option>
              <option value="SYSTEM">System</option>
            </select>
            <label className="flex h-10 items-center gap-2 rounded-md border bg-white px-3 text-sm text-slate-600">
              <input type="checkbox" name="unreadOnly" value="true" defaultChecked={unreadOnly} />
              Unread only
            </label>
            <Button type="submit">Filter</Button>
          </form>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-white p-4">
          <div className="flex items-center gap-3">
            <Badge variant="secondary">{result.unreadCount} unread</Badge>
            <span className="text-sm text-slate-600">{result.total} total</span>
          </div>
          <NotificationActions userId={session.user.id} unreadOnly={unreadOnly} />
        </div>

        <div className="space-y-3">
          {result.items.map((notification) => {
            const href = buildNotificationHref({
              type: notification.type,
              entityType: notification.entityType,
              entityId: notification.entityId,
              role,
            });

            return (
              <article key={notification.id} className={`rounded-2xl border bg-white p-5 shadow-sm transition ${notification.isRead ? "opacity-75" : "ring-1 ring-sky-200"}`}>
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={notification.isRead ? "outline" : "default"}>{getNotificationTypeLabel(notification.type)}</Badge>
                      {!notification.isRead ? <Badge variant="secondary">New</Badge> : null}
                      <span className="text-xs uppercase tracking-[0.25em] text-slate-400">{notification.entityType ?? "System"}</span>
                    </div>
                    <h2 className="text-lg font-semibold text-slate-950">{notification.title}</h2>
                    <p className="max-w-3xl text-sm text-slate-600">{notification.message}</p>
                    <p className="text-xs text-slate-400">{new Date(notification.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button asChild variant="secondary" size="sm">
                      <Link href={href}>Open</Link>
                    </Button>
                    <NotificationActions notificationId={notification.id} isRead={notification.isRead} userId={session.user.id} />
                  </div>
                </div>
              </article>
            );
          })}

          {result.items.length === 0 ? (
            <div className="rounded-2xl border border-dashed bg-slate-50 p-10 text-center text-sm text-slate-500">No notifications found.</div>
          ) : null}
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href={`/notifications?page=${Math.max(1, result.page - 1)}${query ? `&query=${encodeURIComponent(query)}` : ""}${type ? `&type=${type}` : ""}${unreadOnly ? "&unreadOnly=true" : ""}`} aria-disabled={result.page <= 1} />
            </PaginationItem>
            <PaginationItem>
              <span className="flex h-10 items-center px-4 text-sm text-slate-600">Page {result.page} of {result.totalPages}</span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href={`/notifications?page=${Math.min(result.totalPages, result.page + 1)}${query ? `&query=${encodeURIComponent(query)}` : ""}${type ? `&type=${type}` : ""}${unreadOnly ? "&unreadOnly=true" : ""}`} aria-disabled={result.page >= result.totalPages} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </DashboardShell>
  );
}
