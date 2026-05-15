import Link from "next/link";

import { Plus } from "lucide-react";

import { getFrames } from "@/actions/frames/get-frames";

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

interface Props {
  searchParams: Promise<{
    search?: string;

    page?: string;
  }>;
}

export default async function FramesPage({
  searchParams,
}: Props) {
  const params =
    await searchParams;

  const search =
    params.search ?? "";

  const page = Number(
    params.page ?? "1"
  );

 const {
  frames,
  totalPages,
  currentPage,
  totalCount,
} = await getFrames({
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
          title="Frames"
          description="Manage product frames"
          action={
            <Button asChild>
              <Link href="/admin/frames/create">
                <Plus className="mr-2 h-4 w-4" />
                Add Frame
              </Link>
            </Button>
          }
        />

        <div className="flex items-center justify-between">
          <TableToolbar />
        </div>
        <p className="text-muted-foreground text-sm">
          Total Frames: {totalCount}
        </p>

        {frames.length === 0 ? (
          <EmptyState
            title="No frames found"
            description="Create your first frame"
          />
        ) : (
          <>
            <DataTable
              columns={columns}
              data={frames}
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