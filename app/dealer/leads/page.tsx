import { DashboardShell } from "@/components/layouts/dashboard-shell";

import { Sidebar } from "@/components/layouts/sidebar";

import { Navbar } from "@/components/layouts/navbar";

import { dealerSidebarItems } from "@/constants/dealer-sidebar";

import { getLeads } from "@/actions/leads/get-leads";

export default async function DealerLeadsPage() {
  const leads = await getLeads();

  return (
    <DashboardShell
      sidebar={
        <Sidebar
          items={dealerSidebarItems}
          title="Dealer Portal"
          subtitle="My leads"
        />
      }
      navbar={<Navbar />}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Leads</h1>
          <p className="text-muted-foreground">Only leads assigned to your dealer account are shown here.</p>
        </div>

        <div className="space-y-3">
          {leads.map((lead) => (
            <div key={lead.id} className="rounded-2xl border bg-white p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">{lead.fullName}</h2>
                  <p className="text-sm text-muted-foreground">{lead.email}</p>
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-wide">
                  {lead.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}