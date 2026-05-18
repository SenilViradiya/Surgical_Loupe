"use server";

import { prisma } from "@/lib/prisma";

interface Props {
  frameId: string;

  lensId: string;

  headlightId?: string;
}

export async function createConfiguration({
  frameId,
  lensId,
  headlightId,
}: Props) {
  try {
    const configuration =
      await prisma.configuration.create({
        data: {
          frameId,
          lensId,
          headlightId,
        },
      });

    return {
      success: true,

      configurationId:
        configuration.id,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,

      message:
        "Failed to save configuration",
    };
  }
}