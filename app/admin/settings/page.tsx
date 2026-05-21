import { DashboardShell } from "@/components/layouts/dashboard-shell";

import { Sidebar } from "@/components/layouts/sidebar";

import { Navbar } from "@/components/layouts/navbar";

import { adminSidebarItems } from "@/constants/admin-sidebar";

export default function AdminSettingsPage() {
  return (
    <DashboardShell
      sidebar={
        <Sidebar
          items={adminSidebarItems}
          title="Admin Console"
          subtitle="Platform settings"
        />
      }
      navbar={<Navbar />}
    >
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Security, branding, and operational settings will be added here.</p>
      </div>
    </DashboardShell>
  );
}