"use server";

import { prisma } from "@/lib/prisma";

import { z } from "zod";

import { headlightSchema } from "@/lib/validations/headlight";

export async function createHeadlight(
  values: z.input<typeof headlightSchema>
) {
  try {
    const validatedFields =
      headlightSchema.safeParse(values);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid fields",
      };
    }

    const data = validatedFields.data;

    const existingHeadlight =
      await prisma.headlight.findUnique({
        where: {
          slug: data.slug,
        },
      });

    if (existingHeadlight) {
      return {
        success: false,
        message:
          "Headlight with this slug already exists",
      };
    }

    await prisma.headlight.create({
      data,
    });

    return {
      success: true,
      message: "Headlight created",
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "Something went wrong",
    };
  }
}
