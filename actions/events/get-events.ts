"use server";

import { prisma } from "@/lib/prisma";

interface Props {
  search?: string;
  page?: number;
  limit?: number;
}

export async function getEvents({
  search = "",
  page = 1,
  limit = 5,
}: Props) {
  try {
    const skip =
      (page - 1) * limit;

    const [events, totalCount] =
      await Promise.all([
        prisma.event.findMany({
          where: {
            OR: [
              {
                title: {
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
              {
                location: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          },
          orderBy: {
            startDate: "desc",
          },
          skip,
          take: limit,
        }),
        prisma.event.count({
          where: {
            OR: [
              {
                title: {
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
              {
                location: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          },
        }),
      ]);

    return {
      events,
      totalCount,
      totalPages: Math.ceil(
        totalCount / limit
      ),
      currentPage: page,
    };
  } catch (error) {


    return {
      events: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: 1,
    };
  }
}
