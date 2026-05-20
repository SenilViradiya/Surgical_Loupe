"use server";

import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  try {
    const [
      totalLeads,
      convertedLeads,
      totalDealers,
      totalFrames,
    ] = await Promise.all([
      prisma.lead.count(),

      prisma.lead.count({
        where: {
          status:
            "CONVERTED",
        },
      }),

      prisma.dealer.count(),

      prisma.frame.count(),
    ]);

    const conversionRate =
      totalLeads === 0
        ? 0
        : (
            (convertedLeads /
              totalLeads) *
            100
          ).toFixed(1);

    return {
      totalLeads,

      convertedLeads,

      totalDealers,

      totalFrames,

      conversionRate,
    };
  } catch (error) {
    console.log(error);

    return null;
  }
}