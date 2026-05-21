import { DashboardShell } from "@/components/layouts/dashboard-shell";

import { Sidebar } from "@/components/layouts/sidebar";

import { Navbar } from "@/components/layouts/navbar";

import { adminSidebarItems } from "@/constants/admin-sidebar";

import { getDashboardStats } from "@/actions/dashboard/get-dashboard-stats";

import { getAnalytics } from "@/actions/dashboard/get-analytics";

import { getDealerPerformance } from "@/actions/dashboard/get-dealer-performance";

export default async function AdminAnalyticsPage() {
  const stats = await getDashboardStats();
  const analytics = await getAnalytics();
  const dealerPerformance = await getDealerPerformance();

  return (
    <DashboardShell
      sidebar={
        <Sidebar
          items={adminSidebarItems}
          title="Admin Console"
          subtitle="Business intelligence"
        />
      }
      navbar={<Navbar />}
    >
      <div className="space-y-8">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
            Analytics
          </p>

          <h1 className="text-3xl font-bold">
            Enterprise Analytics
          </h1>

          <p className="text-muted-foreground">
            Revenue, growth, and dealer performance overview.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border bg-white p-6">
            <p className="text-sm text-muted-foreground">Leads</p>
            <div className="mt-2 text-3xl font-bold">{stats?.totalLeads ?? 0}</div>
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <p className="text-sm text-muted-foreground">Converted</p>
            <div className="mt-2 text-3xl font-bold">{stats?.convertedLeads ?? 0}</div>
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <p className="text-sm text-muted-foreground">Dealers</p>
            <div className="mt-2 text-3xl font-bold">{stats?.totalDealers ?? 0}</div>
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <p className="text-sm text-muted-foreground">Frames</p>
            <div className="mt-2 text-3xl font-bold">{stats?.totalFrames ?? 0}</div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border bg-white p-6">
            <h2 className="text-lg font-semibold">Monthly lead flow</h2>
            <div className="mt-4 space-y-3">
              {analytics.map((item) => (
                <div key={item.month} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm">
                  <span>{item.month}</span>
                  <span>{item.leads} leads / {item.converted} converted</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <h2 className="text-lg font-semibold">Dealer performance</h2>
            <div className="mt-4 space-y-3">
              {dealerPerformance.map((dealer) => (
                <div key={dealer.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm">
                  <span>{dealer.name}</span>
                  <span>{dealer.totalLeads} leads / {dealer.converted} converted</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}