"use server";

import { prisma } from "@/lib/prisma";
import { requireActionRole } from "@/lib/authorization";
import { UserRole } from "@/lib/generated/prisma";

import { z } from "zod";

import { lensSchema } from "@/lib/validations/lens";

export async function updateLens(
  id: string,
  values: z.input<typeof lensSchema>
) {
  try {
    await requireActionRole([UserRole.ADMIN]);
    const validatedFields =
      lensSchema.safeParse(values);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid fields",
      };
    }

    await prisma.lens.update({
      where: {
        id,
      },

      data: validatedFields.data,
    });

    return {
      success: true,
      message: "Lens updated",
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "Update failed",
    };
  }
}
