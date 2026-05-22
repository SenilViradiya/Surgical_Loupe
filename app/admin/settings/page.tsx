import { DashboardShell } from "@/components/layouts/dashboard-shell";
import { Sidebar } from "@/components/layouts/sidebar";
import { Navbar } from "@/components/layouts/navbar";
import { adminSidebarItems } from "@/constants/admin-sidebar";
import { PageHeader } from "@/components/shared/page-header";
import { SettingsForm } from "@/components/forms/settings-form";
import { getSettings } from "@/actions/settings/get-settings";

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <DashboardShell
      sidebar={<Sidebar items={adminSidebarItems} />}
      navbar={<Navbar />}
    >
      <div className="space-y-6">
        <PageHeader
          title="Settings"
          description="Update site-wide settings"
        />

        <div className="rounded-xl border bg-white p-6">
          <SettingsForm defaultValues={settings} />
        </div>
      </div>
    </DashboardShell>
  );
}
