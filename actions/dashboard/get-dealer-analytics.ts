"use server";

import { prisma } from "@/lib/prisma";

import { requireActionRole } from "@/lib/authorization";

import { UserRole } from "@/lib/generated/prisma";

export async function getDealerAnalytics() {
  try {
    const session = await requireActionRole([
      UserRole.DEALER,
      UserRole.ADMIN,
    ]);

    const dealer = await prisma.dealer.findUnique({
      where: {
        email: session.user.email!,
      },

      include: {
        leads: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!dealer) {
      return {
        monthly: [],
        summary: {
          totalLeads: 0,
          convertedLeads: 0,
          pendingLeads: 0,
          conversionRate: 0,
        },
      };
    }

    const monthlyMap = new Map<
      string,
      { month: string; leads: number; converted: number }
    >();

    dealer.leads.forEach((lead) => {
      const month = new Date(lead.createdAt).toLocaleString("default", {
        month: "short",
      });

      if (!monthlyMap.has(month)) {
        monthlyMap.set(month, { month, leads: 0, converted: 0 });
      }

      const item = monthlyMap.get(month)!;
      item.leads += 1;

      if (lead.status === "CONVERTED") {
        item.converted += 1;
      }
    });

    const totalLeads = dealer.leads.length;
    const convertedLeads = dealer.leads.filter(
      (lead) => lead.status === "CONVERTED"
    ).length;
    const pendingLeads = dealer.leads.filter(
      (lead) => lead.status === "PENDING"
    ).length;

    return {
      monthly: Array.from(monthlyMap.values()),
      summary: {
        totalLeads,
        convertedLeads,
        pendingLeads,
        conversionRate: totalLeads
          ? Math.round((convertedLeads / totalLeads) * 100)
          : 0,
      },
    };
  } catch (error) {
    console.log(error);

    return {
      monthly: [],
      summary: {
        totalLeads: 0,
        convertedLeads: 0,
        pendingLeads: 0,
        conversionRate: 0,
      },
    };
  }
}
