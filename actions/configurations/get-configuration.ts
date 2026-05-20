"use server";

import { prisma } from "@/lib/prisma";

export async function getConfiguration(
  id: string
) {
  try {
    const configuration =
      await prisma.configuration.findUnique({
        where: {
          id,
        },

        include: {
          frame: true,

          lens: true,

          headlight: true,
        },
      });

    return configuration;
  } catch (error) {
    console.log(error);

    return null;
  }
}