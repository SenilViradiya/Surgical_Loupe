"use server";

import { prisma } from "@/lib/prisma";

import { z } from "zod";

import { lensSchema } from "@/lib/validations/lens";

export async function createLens(
  values: z.input<typeof lensSchema>
) {
  try {
    const validatedFields =
      lensSchema.safeParse(values);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid fields",
      };
    }

    const data = validatedFields.data;

    const existingLens =
      await prisma.lens.findUnique({
        where: {
          slug: data.slug,
        },
      });

    if (existingLens) {
      return {
        success: false,
        message:
          "Lens with this slug already exists",
      };
    }

    await prisma.lens.create({
      data,
    });

    return {
      success: true,
      message: "Lens created",
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "Something went wrong",
    };
  }
}
