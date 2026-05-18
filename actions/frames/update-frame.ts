"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import {frameSchema} from "@/lib/validations/frame";

export async function updateFrame(
  id: string,
  values: z.input<typeof frameSchema>
) {
  try {
    const validatedFields =
      frameSchema.safeParse(values);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid fields",
      };
    }

    await prisma.frame.update({
      where: {
        id,
      },

      data: validatedFields.data,
    });

    return {
      success: true,
      message: "Frame updated",
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "Update failed",
    };
  }
}