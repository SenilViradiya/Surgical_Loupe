import { DashboardShell } from "@/components/layouts/dashboard-shell";
import { Sidebar } from "@/components/layouts/sidebar";
import { Navbar } from "@/components/layouts/navbar";
import { adminSidebarItems } from "@/constants/admin-sidebar";
import { EventForm } from "@/components/forms/event-form";
import { PageHeader } from "@/components/shared/page-header";

export default function CreateEventPage() {
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
          title="Create Event"
          description="Add a new event"
        />

        <div className="rounded-xl border bg-white p-6">
          <EventForm />
        </div>
      </div>
    </DashboardShell>
  );
}
