"use server";

import { prisma } from "@/lib/prisma";

import {
  frameSchema,
  FrameInput,
} from "@/lib/validations/frame";

export async function createFrame(
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

    const data = validatedFields.data;

    const existingFrame =
      await prisma.frame.findUnique({
        where: {
          slug: data.slug,
        },
      });

    if (existingFrame) {
      return {
        success: false,
        message:
          "Frame with this slug already exists",
      };
    }

    await prisma.frame.create({
      data,
    });

    return {
      success: true,
      message: "Frame created",
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "Something went wrong",
    };
  }
}