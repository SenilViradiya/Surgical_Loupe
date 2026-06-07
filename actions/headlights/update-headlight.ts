"use server";

import { prisma } from "@/lib/prisma";
import { requireActionRole } from "@/lib/authorization";
import { UserRole } from "@/lib/generated/prisma";

import { z } from "zod";

import { headlightSchema } from "@/lib/validations/headlight";

export async function updateHeadlight(
  id: string,
  values: z.input<typeof headlightSchema>
) {
  try {
    await requireActionRole([UserRole.ADMIN]);
    const validatedFields =
      headlightSchema.safeParse(values);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid fields",
      };
    }

    await prisma.headlight.update({
      where: {
        id,
      },

      data: validatedFields.data,
    });

    return {
      success: true,
      message: "Headlight updated",
    };
  } catch (error) {


    return {
      success: false,
      message: "Update failed",
    };
  }
}
