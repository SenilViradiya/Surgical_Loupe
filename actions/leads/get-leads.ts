"use server";

import { UserRole } from "@/lib/generated/prisma";

import { requireSession } from "@/lib/authorization";

import { prisma } from "@/lib/prisma";

export async function getLeads() {
  try {
    const session = await requireSession();

    if (
      session.user.role === UserRole.ADMIN
    ) {
      return await prisma.lead.findMany({
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

        orderBy: {
          createdAt: "desc",
        },
      });
    }

    if (
      session.user.role === UserRole.DEALER
    ) {
      return await prisma.lead.findMany({
        where: {
          dealer: {
            email:
              session.user.email!,
          },
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

        orderBy: {
          createdAt: "desc",
        },
      });
    }

    return [];
  } catch (error) {


    return [];
  }
}
