import Link from "next/link";

import { Plus } from "lucide-react";

import { getLenses } from "@/actions/lenses/get-lenses";

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

export default async function LensesPage({
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
    lenses,
    totalPages,
    currentPage,
    totalCount,
  } = await getLenses({
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
          title="Lenses"
          description="Manage product lenses"
          action={
            <Button asChild>
              <Link href="/admin/lenses/create">
                <Plus className="mr-2 h-4 w-4" />
                Add Lens
              </Link>
            </Button>
          }
        />

        <div className="flex items-center justify-between">
          <TableToolbar />
        </div>
        <p className="text-muted-foreground text-sm">
          Total Lenses: {totalCount}
        </p>

        {lenses.length === 0 ? (
          <EmptyState
            title="No lenses found"
            description="Create your first lens"
          />
        ) : (
          <>
            <DataTable
              columns={columns}
              data={lenses}
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
