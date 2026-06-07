import Link from "next/link";
import { Plus } from "lucide-react";
import { getEvents } from "@/actions/events/get-events";
import { DashboardShell } from "@/components/layouts/dashboard-shell";
import { Sidebar } from "@/components/layouts/sidebar";
import { Navbar } from "@/components/layouts/navbar";
import { adminSidebarItems } from "@/constants/admin-sidebar";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { columns } from "./components/columns";
import { TableToolbar } from "@/components/shared/table-toolbar";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/empty-state";

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;

  const search =
    params.search ?? "";

  const page = Number(
    params.page ?? "1"
  );

  const {
    events,
    totalPages,
    currentPage,
    totalCount,
  } = await getEvents({
    search,
    page,
  });

  return (
    <DashboardShell
      sidebar={
        <Sidebar
          items={adminSidebarItems}
        />
      }
      navbar={<Navbar />}
    >
      <div className="space-y-6">
        <PageHeader
          title="Events"
          description="Manage events and schedules"
          action={
            <Button asChild>
              <Link href="/admin/events/create">
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </Link>
            </Button>
          }
        />

        <div className="flex items-center justify-between">
          <TableToolbar />
        </div>
        <p className="text-muted-foreground text-sm">
          Total Events: {totalCount}
        </p>

        {events.length === 0 ? (
          <EmptyState
            title="No events found"
            description="Create your first event"
          />
        ) : (
          <>
            <DataTable
              columns={columns}
              data={events}
            />

            <Pagination
              totalPages={
                totalPages
              }
              currentPage={
                currentPage
              }
            />
          </>
        )}
      </div>
    </DashboardShell>
  );
}
