"use server";

import { prisma } from "@/lib/prisma";

export async function deleteHeadlight(
  id: string
) {
  try {
    await prisma.headlight.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
      message: "Headlight deleted",
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "Delete failed",
    };
  }
}
