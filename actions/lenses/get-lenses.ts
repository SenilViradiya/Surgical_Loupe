"use server";

import { prisma } from "@/lib/prisma";

interface Props {
  search?: string;

  page?: number;

  limit?: number;
}

export async function getLenses({
  search = "",

  page = 1,

  limit = 5,
}: Props) {
  try {
    const skip =
      (page - 1) * limit;

    const [lenses, totalCount] =
      await Promise.all([
        prisma.lens.findMany({
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

        prisma.lens.count({
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
      lenses,

      totalCount,

      totalPages: Math.ceil(
        totalCount / limit
      ),

      currentPage: page,
    };
  } catch (error) {


    return {
      lenses: [],

      totalCount: 0,

      totalPages: 0,

      currentPage: 1,
    };
  }
}
