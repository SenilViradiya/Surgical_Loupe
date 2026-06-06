import { auth } from "@/auth";

import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

import { DashboardShell } from "@/components/layouts/dashboard-shell";

import { Sidebar } from "@/components/layouts/sidebar";

import { Navbar } from "@/components/layouts/navbar";

import { dealerSidebarItems } from "@/constants/dealer-sidebar";
import { getQuoteMetrics } from "@/src/lib/quotes/quote-service";
import { formatCurrency } from "@/src/lib/quotes/quote-calculations";

export default async function DealerPage() {
  const session =
    await auth();

  if (
    !session?.user
  ) {
    return redirect(
      "/login"
    );
  }

  const dealer =
    await prisma.dealer.findUnique({
      where: {
        email:
          session.user.email!,
      },

      include: {
        leads: true,
      },
    });

  if (!dealer) {
    return redirect(
      "/"
    );
  }

  const quoteMetrics = await getQuoteMetrics(dealer.id);

  return (
    <DashboardShell
      sidebar={
        <Sidebar
          items={dealerSidebarItems}
          title="Dealer Portal"
          subtitle="Assigned lead workspace"
        />
      }
      navbar={<Navbar />}
    >
      {dealer.onboardingStatus === "PENDING_SETUP" ? (
        <div className="mb-6 rounded-md border border-yellow-300 bg-yellow-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-yellow-800">Complete your dealer profile</p>
              <p className="text-sm text-yellow-700">Your account is almost ready — finish setup to unlock the full dashboard.</p>
            </div>

            <div>
              <a
                href="/dealer/onboarding/profile"
                className="inline-flex items-center rounded-md bg-yellow-600 px-3 py-2 text-sm font-semibold text-white hover:bg-yellow-700"
              >
                Complete profile
              </a>
            </div>
          </div>
        </div>
      ) : null}
      <div className="space-y-8">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
            Dealer Dashboard
          </p>

          <h1 className="text-3xl font-bold">
            Welcome back, {dealer.name}
          </h1>

          <p className="text-muted-foreground">
            Track your assigned pipeline and complete onboarding tasks.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <div className="rounded-2xl border bg-white p-6">
            <p className="text-sm text-muted-foreground">
              Total Leads
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {dealer.leads.length}
            </h2>
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <p className="text-sm text-muted-foreground">
              Converted
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {dealer.leads.filter((lead) => lead.status === "CONVERTED").length}
            </h2>
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <p className="text-sm text-muted-foreground">
              Pending
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {dealer.leads.filter((lead) => lead.status === "PENDING").length}
            </h2>
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <p className="text-sm text-muted-foreground">
              Onboarding
            </p>

            <h2 className="mt-2 text-lg font-semibold capitalize">
              {dealer.onboardingStatus.toLowerCase().replaceAll("_", " ")}
            </h2>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          <Metric label="Quotes" value={quoteMetrics.totalQuotes} />
          <Metric label="Sent" value={quoteMetrics.sentQuotes} />
          <Metric label="Accepted" value={quoteMetrics.acceptedQuotes} />
          <Metric label="Rejected" value={quoteMetrics.rejectedQuotes} />
          <Metric label="Conversion" value={`${quoteMetrics.conversionRate}%`} />
          <Metric label="Pipeline" value={formatCurrency(quoteMetrics.monthlyRevenuePipeline)} />
        </div>
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