import { DashboardShell } from "@/components/layouts/dashboard-shell";

import { Sidebar } from "@/components/layouts/sidebar";

import { Navbar } from "@/components/layouts/navbar";

import { dealerSidebarItems } from "@/constants/dealer-sidebar";

import { getLeads } from "@/actions/leads/get-leads";

export default async function DealerAnalyticsPage() {
  const leads = await getLeads();
  const converted = leads.filter((lead) => lead.status === "CONVERTED").length;

  return (
    <DashboardShell
      sidebar={
        <Sidebar
          items={dealerSidebarItems}
          title="Dealer Portal"
          subtitle="Performance"
        />
      }
      navbar={<Navbar />}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Track your assigned lead performance.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border bg-white p-6">
            <p className="text-sm text-muted-foreground">Leads</p>
            <div className="mt-2 text-3xl font-bold">{leads.length}</div>
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <p className="text-sm text-muted-foreground">Converted</p>
            <div className="mt-2 text-3xl font-bold">{converted}</div>
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <p className="text-sm text-muted-foreground">Pending</p>
            <div className="mt-2 text-3xl font-bold">{leads.filter((lead) => lead.status === "PENDING").length}</div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}