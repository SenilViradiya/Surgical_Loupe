import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

import { DashboardShell } from "@/components/layouts/dashboard-shell";

import { Sidebar } from "@/components/layouts/sidebar";

import { Navbar } from "@/components/layouts/navbar";

import { adminSidebarItems } from "@/constants/admin-sidebar";

import { FrameForm } from "@/components/forms/frame-form";

import { PageHeader } from "@/components/shared/page-header";

interface Props {
  params: {
    frameId: string;
  };
}

export default async function EditFramePage({
  params,
}: Props) {
  const frame =
    await prisma.frame.findFirst({
      where: {
        id: params.frameId,
      },
    });

  if (!frame) {
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
          title="Edit Frame"
          description="Update frame"
        />

        <div className="rounded-xl border bg-white p-6">
          <FrameForm
            initialData={frame}
            isEdit
          />
        </div>
      </div>
    </DashboardShell>
  );
}
