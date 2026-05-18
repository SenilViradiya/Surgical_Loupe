"use server";

import { prisma } from "@/lib/prisma";

interface Props {
  search?: string;

  page?: number;

  limit?: number;
}

export async function getHeadlights({
  search = "",

  page = 1,

  limit = 5,
}: Props) {
  try {
    const skip =
      (page - 1) * limit;

    const [headlights, totalCount] =
      await Promise.all([
        prisma.headlight.findMany({
          where: {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },

              {
                slug: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          },

          orderBy: {
            createdAt: "desc",
          },

          skip,

          take: limit,
        }),

        prisma.headlight.count({
          where: {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },

              {
                slug: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          },
        }),
      ]);

    return {
      headlights,

      totalCount,

      totalPages: Math.ceil(
        totalCount / limit
      ),

      currentPage: page,
    };
  } catch (error) {
    console.log(error);

    return {
      headlights: [],

      totalCount: 0,

      totalPages: 0,

      currentPage: 1,
    };
  }
}
