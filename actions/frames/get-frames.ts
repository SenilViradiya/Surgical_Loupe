"use server";

import { prisma } from "@/lib/prisma";

interface Props {
  search?: string;

  page?: number;

  limit?: number;
}

export async function getFrames({
  search = "",

  page = 1,

  limit = 5,
}: Props) {
  try {
    const skip =
      (page - 1) * limit;

    const [frames, totalCount] =
      await Promise.all([
        prisma.frame.findMany({
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

        prisma.frame.count({
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
      frames,

      totalCount,

      totalPages: Math.ceil(
        totalCount / limit
      ),

      currentPage: page,
    };
  } catch (error) {


    return {
      frames: [],

      totalCount: 0,

      totalPages: 0,

      currentPage: 1,
    };
  }
}
