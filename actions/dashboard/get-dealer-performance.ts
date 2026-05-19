"use server";

import { prisma } from "@/lib/prisma";

export async function getDealerPerformance() {
  try {
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