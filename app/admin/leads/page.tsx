import { getLeads } from "@/actions/leads/get-leads";

import { LeadsTable } from "@/components/leads/leads-table";
import { ActivityTimeline } from "@/components/leads/activity-timeline";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/layouts/dashboard-shell";
import { Sidebar } from "@/components/layouts/sidebar";
import { Navbar } from "@/components/layouts/navbar";
import { adminSidebarItems } from "@/constants/admin-sidebar";
export default async function LeadsPage() {
  const leads =
    await getLeads();

  const activities =
    await prisma.activityLog.findMany({
      where: {
        entityType:
          "Lead",
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  return (
    <DashboardShell
      sidebar={
        <Sidebar
          items={adminSidebarItems}
        />
      }
      navbar={<Navbar />}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            Leads
          </h1>

        <p className="text-muted-foreground">
          Manage incoming quote requests
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border bg-white p-6">
          <p className="text-muted-foreground text-sm">
            Total Leads
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {leads.length}
          </h2>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <p className="text-muted-foreground text-sm">
            Converted
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {
              leads.filter(
                (lead) =>
                  lead.status ===
                  "CONVERTED"
              ).length
            }
          </h2>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <p className="text-muted-foreground text-sm">
            Pending
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {
              leads.filter(
                (lead) =>
                  lead.status ===
                  "PENDING"
              ).length
            }
          </h2>
        </div>
      </div>

        <LeadsTable
          leads={leads}
        />
        <ActivityTimeline
          activities={
            activities
          }
        />
      </div>
    </DashboardShell>
  );
}