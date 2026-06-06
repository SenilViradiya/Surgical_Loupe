"use server";

import { prisma } from "@/lib/prisma";
import { requireActionRole } from "@/lib/authorization";
import { UserRole } from "@/lib/generated/prisma";

export async function deleteLens(
  id: string
) {
  try {
    await requireActionRole([UserRole.ADMIN]);
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


    return {
      success: false,
      message: "Delete failed",
    };
  }
}
