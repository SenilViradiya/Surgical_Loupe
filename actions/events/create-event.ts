"use server";

import { prisma } from "@/lib/prisma";
import { requireActionRole } from "@/lib/authorization";
import { UserRole } from "@/lib/generated/prisma";
import { z } from "zod";
import { eventSchema } from "@/lib/validations/event";

export async function createEvent(
  values: z.input<typeof eventSchema>
) {
  try {
    await requireActionRole([UserRole.ADMIN]);

    const validatedFields =
      eventSchema.safeParse(values);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid fields",
      };
    }

    const data = validatedFields.data;

    const existingEvent =
      await prisma.event.findUnique({
        where: {
          slug: data.slug,
        },
      });

    if (existingEvent) {
      return {
        success: false,
        message: "Event with this slug already exists",
      };
    }

    await prisma.event.create({
      data,
    });

    return {
      success: true,
      message: "Event created",
    };
  } catch (error) {


    return {
      success: false,
      message: "Something went wrong",
    };
  }
}
