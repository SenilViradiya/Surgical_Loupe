import { auth } from "@/auth";

import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

import { DashboardShell } from "@/components/layouts/dashboard-shell";

import { Sidebar } from "@/components/layouts/sidebar";

import { Navbar } from "@/components/layouts/navbar";

import { dealerSidebarItems } from "@/constants/dealer-sidebar";

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
      </div>
    </DashboardShell>
  );
}