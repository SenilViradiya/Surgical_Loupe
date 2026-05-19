import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { LeadStatusSelect } from "@/components/leads/lead-status-select";
import { DownloadQuoteButton } from "@/components/configurator/download-quote-button";
import { DashboardShell } from "@/components/layouts/dashboard-shell";
import { Sidebar } from "@/components/layouts/sidebar";
import { Navbar } from "@/components/layouts/navbar";
import { adminSidebarItems } from "@/constants/admin-sidebar";
export default async function LeadDetailsPage({
  params,
}: {
  params: Promise<{
    leadId: string;
  }>;
}) {
  const { leadId } =
    await params;

  const lead =
    await prisma.lead.findUnique({
      where: {
        id: leadId,
      },

      include: {
        configuration: {
          include: {
            frame: true,

            lens: true,

            headlight: true,
          },
        },

        dealer: true,
      },
    });

  if (!lead) {
    return notFound();
  }

  return (
    <DashboardShell
      sidebar={
        <Sidebar
          items={adminSidebarItems}
        />
      }
      navbar={<Navbar />}
    >
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">
            Lead Details
          </h1>

          <p className="text-muted-foreground">
            Review customer inquiry
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">
              Customer Info
            </h2>

            <div className="space-y-3">
              <p>
                <strong>
                  Name:
                </strong>{" "}
                {
                  lead.fullName
                }
              </p>

              <p>
                <strong>
                  Email:
                </strong>{" "}
                {lead.email}
              </p>

              <p>
                <strong>
                  Phone:
                </strong>{" "}
                {lead.phone}
              </p>

              <p>
                <strong>
                  City:
                </strong>{" "}
                {lead.city}
              </p>

              <p>
                <strong>
                  State:
                </strong>{" "}
                {lead.state}
              </p>

              <p>
                <strong>
                  Pincode:
                </strong>{" "}
                {
                  lead.pincode
                }
              </p>
              <div className="pt-4">
                <LeadStatusSelect
                  leadId={lead.id}
                  currentStatus={
                    lead.status
                  }
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">
              Configuration
            </h2>

            <div className="space-y-3">
              <p>
                <strong>
                  Frame:
                </strong>{" "}
                {
                  lead
                    .configuration
                    .frame.name
                }
              </p>

              <p>
                <strong>
                  Lens:
                </strong>{" "}
                {
                  lead
                    .configuration
                    .lens.name
                }
              </p>

              <p>
                <strong>
                  Headlight:
                </strong>{" "}
                {lead
                  .configuration
                  .headlight
                  ?.name ??
                  "-"}
              </p>

              <p>
                <strong>
                  Dealer:
                </strong>{" "}
                {lead.dealer
                  ?.name ?? "-"}
              </p>
            </div>

            <div className="pt-6">
              <DownloadQuoteButton
                lead={{
                  fullName:
                    lead.fullName,

                  email:
                    lead.email,

                  phone:
                    lead.phone,
                }}
                configuration={{
                  frame: {
                    name:
                      lead.configuration
                        .frame.name,

                    price:
                      lead.configuration
                        .frame.price,
                  },

                  lens: {
                    name:
                      lead.configuration
                        .lens.name,

                    price:
                      lead.configuration
                        .lens.price,
                  },

                  headlight:
                    lead.configuration
                      .headlight
                      ? {
                          name:
                            lead
                              .configuration
                              .headlight
                              .name,

                          price:
                            lead
                              .configuration
                              .headlight
                              .price,
                        }
                      : null,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}