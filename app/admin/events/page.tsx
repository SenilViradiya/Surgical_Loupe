import { DashboardShell } from "@/components/layouts/dashboard-shell";

import { Sidebar } from "@/components/layouts/sidebar";

import { Navbar } from "@/components/layouts/navbar";

import { adminSidebarItems } from "@/constants/admin-sidebar";

export default function AdminEventsPage() {
  return (
    <DashboardShell
      sidebar={
        <Sidebar
          items={adminSidebarItems}
          title="Admin Console"
          subtitle="Events and activity"
        />
      }
      navbar={<Navbar />}
    >
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Events</h1>
        <p className="text-muted-foreground">Activity log and operational events will appear here.</p>
      </div>
    </DashboardShell>
  );
}