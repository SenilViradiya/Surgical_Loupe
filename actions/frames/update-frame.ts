"use server";

import { prisma } from "@/lib/prisma";

import {
  frameSchema,
  FrameInput,
} from "@/lib/validations/frame";

export async function updateFrame(
  id: string,
  values: FrameInput
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