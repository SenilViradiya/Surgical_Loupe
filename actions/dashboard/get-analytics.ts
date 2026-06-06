"use server";

import { prisma } from "@/lib/prisma";

import { requireActionRole } from "@/lib/authorization";

import { UserRole } from "@/lib/generated/prisma";

export async function getAnalytics() {
  try {
    await requireActionRole([
      UserRole.ADMIN,
    ]);

    const leads =
      await prisma.lead.findMany({
        orderBy: {
          createdAt: "asc",
        },
      });

    const monthlyMap =
      new Map<
        string,
        {
          month: string;

          leads: number;

          converted: number;
        }
      >();

    leads.forEach((lead) => {
      const month =
        new Date(
          lead.createdAt
        ).toLocaleString(
          "default",
          {
            month: "short",
          }
        );

      if (
        !monthlyMap.has(
          month
        )
      ) {
        monthlyMap.set(
          month,
          {
            month,

            leads: 0,

            converted: 0,
          }
        );
      }

      const item =
        monthlyMap.get(
          month
        )!;

      item.leads += 1;

      if (
        lead.status ===
        "CONVERTED"
      ) {
        item.converted += 1;
      }
    });

    const analytics =
      Array.from(
        monthlyMap.values()
      );

    return analytics;
  } catch (error) {


    return [];
  }
}
