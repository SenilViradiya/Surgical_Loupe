"use server";

import { prisma } from "@/lib/prisma";
import { requireActionRole } from "@/lib/authorization";
import { UserRole } from "@/lib/generated/prisma";

export async function deleteFrame(
  id: string
) {
  try {
    await requireActionRole([UserRole.ADMIN]);
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


    return {
      success: false,
      message: "Delete failed",
    };
  }
}
