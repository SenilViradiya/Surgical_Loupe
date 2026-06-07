"use server";

import { prisma } from "@/lib/prisma";

import { requireActionRole } from "@/lib/authorization";

import { UserRole } from "@/lib/generated/prisma";

export async function getDashboardStats() {
  try {
    await requireActionRole([
      UserRole.ADMIN,
    ]);

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


    return null;
  }
}
