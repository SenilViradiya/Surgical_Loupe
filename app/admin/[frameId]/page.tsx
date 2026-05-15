import { notFound } from "next/navigation";

import { getFrame } from "@/actions/frames/get-frames";

import { DashboardShell } from "@/components/layouts/dashboard-shell";

import { Sidebar } from "@/components/layouts/sidebar";

import { Navbar } from "@/components/layouts/navbar";

import { adminSidebarItems } from "@/constants/admin-sidebar";

import { FrameForm } from "@/components/forms/frame-form";

import { PageHeader } from "@/components/shared/page-header";

interface Props {
  params: Promise<{
    frameId: string;
  }>;
}

export default async function EditFramePage({
  params,
}: Props) {
  const { frameId } =
    await params;

  const frame =
    await getFrame(frameId);

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