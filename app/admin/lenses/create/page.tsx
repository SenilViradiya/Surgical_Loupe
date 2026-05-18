import { DashboardShell } from "@/components/layouts/dashboard-shell";

import { Sidebar } from "@/components/layouts/sidebar";

import { Navbar } from "@/components/layouts/navbar";

import { adminSidebarItems } from "@/constants/admin-sidebar";

import { LensForm } from "@/components/forms/lens-form";

import { PageHeader } from "@/components/shared/page-header";

export default function CreateLensPage() {
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
          title="Create Lens"
          description="Add new lens"
        />

        <div className="rounded-xl border bg-white p-6">
          <LensForm />
        </div>
      </div>
    </DashboardShell>
  );
}
