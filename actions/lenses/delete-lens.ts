"use server";

import { prisma } from "@/lib/prisma";

export async function deleteLens(
  id: string
) {
  try {
    await prisma.lens.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
      message: "Lens deleted",
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "Delete failed",
    };
  }
}
