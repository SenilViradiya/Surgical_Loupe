import { DashboardShell } from "@/components/layouts/dashboard-shell";

import { Sidebar } from "@/components/layouts/sidebar";

import { Navbar } from "@/components/layouts/navbar";

import { adminSidebarItems } from "@/constants/admin-sidebar";

import { HeadlightForm } from "@/components/forms/headlight-form";

import { PageHeader } from "@/components/shared/page-header";

export default function CreateHeadlightPage() {
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
          title="Create Headlight"
          description="Add new headlight"
        />

        <div className="rounded-xl border bg-white p-6">
          <HeadlightForm />
        </div>
      </div>
    </DashboardShell>
  );
}
