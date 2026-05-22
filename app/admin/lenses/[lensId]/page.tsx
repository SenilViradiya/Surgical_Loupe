import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

import { DashboardShell } from "@/components/layouts/dashboard-shell";

import { Sidebar } from "@/components/layouts/sidebar";

import { Navbar } from "@/components/layouts/navbar";

import { adminSidebarItems } from "@/constants/admin-sidebar";

import { LensForm } from "@/components/forms/lens-form";

import { PageHeader } from "@/components/shared/page-header";

interface Props {
  params: Promise<{
    lensId: string;
  }>;
}

export default async function EditLensPage({
  params,
}: Props) {
  const { lensId } = await params;

  const lens =
    await prisma.lens.findFirst({
      where: {
        id: lensId,
      },
    });

  if (!lens) {
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
          title="Edit Lens"
          description="Update lens"
        />

        <div className="rounded-xl border bg-white p-6">
          <LensForm
            initialData={lens}
            isEdit
          />
        </div>
      </div>
    </DashboardShell>
  );
}
