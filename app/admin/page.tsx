import { DashboardShell } from "@/components/layouts/dashboard-shell";
import { Sidebar } from "@/components/layouts/sidebar";
import { Navbar } from "@/components/layouts/navbar";
import { adminSidebarItems } from "@/constants/admin-sidebar";
import { getDashboardStats } from "@/actions/dashboard/get-dashboard-stats";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { getAnalytics } from "@/actions/dashboard/get-analytics";

import { LeadsChart } from "@/components/dashboard/leads-chart";

import { getDealerPerformance } from "@/actions/dashboard/get-dealer-performance";

import { DealerPerformance } from "@/components/dashboard/dealer-performance";

export default async function AdminPage() {
  const stats =
    await getDashboardStats();

  if (!stats) {
    return null;
  }

  const analytics =
  await getAnalytics();

const dealerPerformance =
  await getDealerPerformance();

  return (
    <DashboardShell
      sidebar={
        <Sidebar
          items={adminSidebarItems}
          title="Admin Console"
          subtitle="Platform operations"
        />
      }
      navbar={<Navbar />}
    >
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">
            Dashboard
          </h1>

          <p className="text-muted-foreground">
            Overview of your business
          </p>
        </div>

        <StatsCards
          stats={stats}
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <LeadsChart
          data={analytics}
        />

        <DealerPerformance
          dealers={
            dealerPerformance
          }
        />
      </div>
    </DashboardShell>
  );
}