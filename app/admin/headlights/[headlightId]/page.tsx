import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

import { DashboardShell } from "@/components/layouts/dashboard-shell";

import { Sidebar } from "@/components/layouts/sidebar";

import { Navbar } from "@/components/layouts/navbar";

import { adminSidebarItems } from "@/constants/admin-sidebar";

import { HeadlightForm } from "@/components/forms/headlight-form";

import { PageHeader } from "@/components/shared/page-header";

interface Props {
  params: {
    headlightId: string;
  };
}

export default async function EditHeadlightPage({
  params,
}: Props) {
  const headlight =
    await prisma.headlight.findFirst({
      where: {
        id: params.headlightId,
      },
    });

  if (!headlight) {
    return notFound();
  }

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
          title="Edit Headlight"
          description="Update headlight"
        />

        <div className="rounded-xl border bg-white p-6">
          <HeadlightForm
            initialData={headlight}
            isEdit
          />
        </div>
      </div>
    </DashboardShell>
  );
}
