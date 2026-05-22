"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireActionRole } from "@/lib/authorization";
import { UserRole } from "@/lib/generated/prisma";
import { z } from "zod";
import { enforceRateLimit } from "@/lib/rate-limit";

const addCoverageSchema = z.object({
  dealerId: z.string().min(1),
  pincode: z.string().min(1),
});

export async function addCoverage(values: any) {
  try {
    await requireActionRole([UserRole.ADMIN]);

    const parsed = addCoverageSchema.parse(values);

    const rate = enforceRateLimit(`add-coverage:${parsed.dealerId}`, {
      limit: 20,
      windowMs: 60 * 60 * 1000,
    });

    if (!rate.success) {
      return { success: false, message: "Too many requests" };
    }

    const exists = await prisma.dealerCoverage.findFirst({
      where: {
        dealerId: parsed.dealerId,
        pincode: parsed.pincode,
      },
    });

    if (exists) {
      return { success: false, message: "Coverage already exists" };
    }

    await prisma.dealerCoverage.create({
      data: {
        dealerId: parsed.dealerId,
        pincode: parsed.pincode,
      },
    });

    revalidatePath("/admin/dealers");

    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
}