import { redirect } from "next/navigation";

import { auth } from "@/auth";

import { DashboardShell } from "@/components/layouts/dashboard-shell";
import { Sidebar } from "@/components/layouts/sidebar";
import { Navbar } from "@/components/layouts/navbar";
import { adminSidebarItems } from "@/constants/admin-sidebar";
import { getAnalytics } from "@/actions/dashboard/get-analytics";
import { getDealerPerformance } from "@/actions/dashboard/get-dealer-performance";
import { LeadsChart } from "@/components/dashboard/leads-chart";
import { DealerPerformance } from "@/components/dashboard/dealer-performance";

export default async function AdminAnalyticsPage() {
  const session = await auth();

  if (!session?.user) {
    return redirect("/login");
  }

  const analytics = await getAnalytics();
  const dealerPerformance = await getDealerPerformance();

  return (
    <DashboardShell
      sidebar={
        <Sidebar
          items={adminSidebarItems}
          title="Admin Console"
          subtitle="Platform analytics"
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
            Platform overview
          </h1>

          <p className="max-w-2xl text-sm text-slate-600">
            Review lead trends and dealer performance using a simple, neutral dashboard.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <LeadsChart data={analytics} />

          <DealerPerformance dealers={dealerPerformance} />
        </div>
      </div>
    </DashboardShell>
  );
}
