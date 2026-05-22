"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireActionRole } from "@/lib/authorization";
import { UserRole } from "@/lib/generated/prisma";
import { z } from "zod";
import { enforceRateLimit } from "@/lib/rate-limit";

const toggleSchema = z.object({ dealerId: z.string().min(1) });

export async function toggleDealerStatus(values: any) {
  try {
    await requireActionRole([UserRole.ADMIN]);

    const parsed = toggleSchema.parse(values);

    const rate = enforceRateLimit(`toggle-dealer:${parsed.dealerId}`, {
      limit: 30,
      windowMs: 60 * 60 * 1000,
    });

    if (!rate.success) {
      return { success: false };
    }

    const dealer = await prisma.dealer.findUnique({
      where: { id: parsed.dealerId },
    });

    if (!dealer) return { success: false };

    await prisma.dealer.update({
      where: { id: parsed.dealerId },
      data: { isActive: !dealer.isActive },
    });

    revalidatePath("/admin/dealers");

    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
}