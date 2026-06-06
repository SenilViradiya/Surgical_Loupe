import { prisma } from "@/lib/prisma";

import { DealerForm } from "@/components/dealers/dealer-form";

import { AddCoverageForm } from "@/components/dealers/add-coverage-form";
import { DashboardShell } from "@/components/layouts/dashboard-shell";
import { Sidebar } from "@/components/layouts/sidebar";
import { Navbar } from "@/components/layouts/navbar";
import { adminSidebarItems } from "@/constants/admin-sidebar";

export default async function DealersPage() {
  const dealers =
    await prisma.dealer.findMany({
      include: {
        coverages: true,

        leads: true,
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
          title="Admin Console"
          subtitle="Dealer network"
        />
      }
      navbar={<Navbar />}
    >
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">
            Dealers
          </h1>

          <p className="text-muted-foreground">
            Manage dealer network
          </p>
        </div>

        <DealerForm />

        <div className="grid gap-6">
          {dealers.map(
            (dealer) => (
              <div
                key={dealer.id}
                className="rounded-2xl border bg-white p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {
                        dealer.name
                      }
                    </h2>

                    <p className="text-muted-foreground">
                      {
                        dealer.email
                      }
                    </p>

                    <p className="mt-2 text-sm">
                      Active Leads:{" "}
                      {
                        dealer.leads
                          .length
                      }
                    </p>

                    <p className="mt-1 text-sm">
                      Converted Leads:{" "}
                      {
                        dealer.leads.filter(
                          (lead) =>
                            lead.status ===
                            "CONVERTED"
                        ).length
                      }
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-sm ${
                      dealer.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {dealer.isActive
                      ? "Active"
                      : "Inactive"}
                  </span>
                </div>

                <div className="mt-6">
                  <h3 className="mb-3 font-medium">
                    Coverage Areas
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {dealer.coverages.map((coverage) => (
                      <span
                        key={
                          coverage.id
                        }
                        className="rounded-full border px-3 py-1 text-sm"
                      >
                        {
                          coverage.pincode
                        }
                      </span>
                    ))}
                  </div>

                  <AddCoverageForm
                    dealerId={
                      dealer.id
                    }
                  />
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
