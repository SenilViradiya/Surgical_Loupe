"use server";

import { prisma } from "@/lib/prisma";

export async function deleteFrame(
  id: string
) {
  try {
    await prisma.frame.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
      message: "Frame deleted",
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "Delete failed",
    };
  }
}