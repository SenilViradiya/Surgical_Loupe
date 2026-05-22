"use server";

import { prisma } from "@/lib/prisma";

import { requireActionRole } from "@/lib/authorization";

import { UserRole } from "@/lib/generated/prisma";

export async function getDealerPerformance() {
  try {
    await requireActionRole([
      UserRole.ADMIN,
    ]);

    const dealers =
      await prisma.dealer.findMany({
        include: {
          leads: true,
        },
      });

    return dealers.map(
      (dealer) => {
        const converted =
          dealer.leads.filter(
            (lead) =>
              lead.status ===
              "CONVERTED"
          ).length;

        return {
          id: dealer.id,

          name:
            dealer.name,

          totalLeads:
            dealer.leads.length,

          converted,
        };
      }
    );
  } catch (error) {
    console.log(error);

    return [];
  }
}