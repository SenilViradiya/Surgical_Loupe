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
import { getQuoteMetrics } from "@/src/lib/quotes/quote-service";
import { formatCurrency } from "@/src/lib/quotes/quote-calculations";

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
  const quoteMetrics = await getQuoteMetrics();

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
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          <Metric label="Quotes" value={quoteMetrics.totalQuotes} />
          <Metric label="Sent" value={quoteMetrics.sentQuotes} />
          <Metric label="Accepted" value={quoteMetrics.acceptedQuotes} />
          <Metric label="Rejected" value={quoteMetrics.rejectedQuotes} />
          <Metric label="Conversion" value={`${quoteMetrics.conversionRate}%`} />
          <Metric label="Avg. Quote" value={formatCurrency(quoteMetrics.averageQuoteValue)} />
        </div>
      </div>
      <div className="grid min-w-0 gap-6 lg:grid-cols-2">
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

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}