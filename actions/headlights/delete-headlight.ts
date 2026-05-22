"use server";

import { prisma } from "@/lib/prisma";
import { requireActionRole } from "@/lib/authorization";
import { UserRole } from "@/lib/generated/prisma";

export async function deleteHeadlight(
  id: string
) {
  try {
    await requireActionRole([UserRole.ADMIN]);
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
