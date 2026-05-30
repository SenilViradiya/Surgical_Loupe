import { DashboardShell } from "@/components/layouts/dashboard-shell";
import { Navbar } from "@/components/layouts/navbar";
import { Sidebar } from "@/components/layouts/sidebar";
import { adminSidebarItems } from "@/constants/admin-sidebar";
import { PageHeader } from "@/components/shared/page-header";
import { getConfiguratorCompatibilityCatalog } from "@/lib/compatibility/compatibility-service";

import { CompatibilityManager } from "./components/compatibility-manager";

export default async function CompatibilityPage() {
  const catalog = await getConfiguratorCompatibilityCatalog();

  return (
    <DashboardShell
      sidebar={<Sidebar items={adminSidebarItems} title="Admin Console" subtitle="Compatibility management" />}
      navbar={<Navbar />}
    >
      <div className="space-y-6">
        <PageHeader
          title="Compatibility"
          description="Manage valid frame, lens, and headlight combinations from one database-driven screen."
        />

        <CompatibilityManager {...catalog} />
      </div>
    </DashboardShell>
  );
}
