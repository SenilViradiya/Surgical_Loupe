"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

export async function toggleDealerStatus(
  dealerId: string
) {
  try {
    const dealer =
      await prisma.dealer.findUnique({
        where: {
          id: dealerId,
        },
      });

    if (!dealer) {
      return {
        success: false,
      };
    }

    await prisma.dealer.update({
      where: {
        id: dealerId,
      },

      data: {
        isActive:
          !dealer.isActive,
      },
    });

    revalidatePath(
      "/admin/dealers"
    );

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
    };
  }
}