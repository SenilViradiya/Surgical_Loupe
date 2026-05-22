import { redirect } from "next/navigation";

import { auth } from "@/auth";

import { DashboardShell } from "@/components/layouts/dashboard-shell";
import { Sidebar } from "@/components/layouts/sidebar";
import { Navbar } from "@/components/layouts/navbar";
import { dealerSidebarItems } from "@/constants/dealer-sidebar";
import { getDealerAnalytics } from "@/actions/dashboard/get-dealer-analytics";
import { LeadsChart } from "@/components/dashboard/leads-chart";

export default async function DealerAnalyticsPage() {
  const session = await auth();

  if (!session?.user) {
    return redirect("/login");
  }

  const analytics = await getDealerAnalytics();

  return (
    <DashboardShell
      sidebar={
        <Sidebar
          items={dealerSidebarItems}
          title="Dealer Portal"
          subtitle="Your analytics"
        />
      }
      navbar={<Navbar />}
    >
      <div className="space-y-8">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-500">
            Analytics
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Your lead performance
          </h1>

          <p className="max-w-2xl text-sm text-slate-600">
            Track your own lead volume and conversions.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Leads</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">
              {analytics.summary.totalLeads}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Converted</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">
              {analytics.summary.convertedLeads}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Pending</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">
              {analytics.summary.pendingLeads}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Conversion Rate</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">
              {analytics.summary.conversionRate}%
            </h2>
          </div>
        </div>

        <LeadsChart data={analytics.monthly} />
      </div>
    </DashboardShell>
  );
}
