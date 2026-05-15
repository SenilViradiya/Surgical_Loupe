import { DashboardShell } from "@/components/layouts/dashboard-shell";

import { Sidebar } from "@/components/layouts/sidebar";

import { Navbar } from "@/components/layouts/navbar";

import { adminSidebarItems } from "@/constants/admin-sidebar";

import { FrameForm } from "@/components/forms/frame-form";

import { PageHeader } from "@/components/shared/page-header";

export default function CreateFramePage() {
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
          title="Create Frame"
          description="Add new frame"
        />

        <div className="rounded-xl border bg-white p-6">
          <FrameForm />
        </div>
      </div>
    </DashboardShell>
  );
}