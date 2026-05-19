"use server";

import { auth } from "@/auth";

import { prisma } from "@/lib/prisma";

export async function getLeads() {
  try {
    const session =
      await auth();

    if (!session?.user) {
      return [];
    }

    if (
      session.user.role ===
      "ADMIN"
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
      session.user.role ===
      "DEALER"
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
    console.log(error);

    return [];
  }
}