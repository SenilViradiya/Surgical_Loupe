import { auth } from "@/auth";

import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

import { DashboardShell } from "@/components/layouts/dashboard-shell";

import { Sidebar } from "@/components/layouts/sidebar";

import { Navbar } from "@/components/layouts/navbar";

import { dealerSidebarItems } from "@/constants/dealer-sidebar";

export default async function DealerProfilePage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const dealer = await prisma.dealer.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!dealer) {
    redirect("/dealer");
  }

  return (
    <DashboardShell
      sidebar={
        <Sidebar
          items={dealerSidebarItems}
          title="Dealer Portal"
          subtitle="Profile"
        />
      }
      navbar={<Navbar />}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Complete your dealer profile details.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border bg-white p-6">
            <p className="text-sm text-muted-foreground">Company</p>
            <div className="mt-2 text-lg font-semibold">{dealer.companyName ?? dealer.name}</div>
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <p className="text-sm text-muted-foreground">Status</p>
            <div className="mt-2 text-lg font-semibold capitalize">{dealer.onboardingStatus.toLowerCase().replaceAll("_", " ")}</div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}