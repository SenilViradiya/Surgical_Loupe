"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { createNotification } from "@/src/lib/notifications/notification-service";
import { requireActionRole } from "@/lib/authorization";
import { NotificationType, UserRole } from "@/lib/generated/prisma";
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

    const updatedDealer = await prisma.dealer.update({
      where: { id: parsed.dealerId },
      data: { isActive: !dealer.isActive },
    });

    if (updatedDealer.isActive) {
      await createNotification({
        recipientEmails: [updatedDealer.email],
        recipientRoles: [UserRole.ADMIN],
        title: "Dealer activated",
        message: `${updatedDealer.name} is now active and can receive leads.`,
        type: NotificationType.DEALER,
        entityType: "Dealer",
        entityId: updatedDealer.id,
        metadata: {
          dealerId: updatedDealer.id,
          dealerName: updatedDealer.name,
          dealerEmail: updatedDealer.email,
        },
        eventKey: `DEALER_ACTIVATED:${updatedDealer.id}`,
        deliveryChannels: ["IN_APP", "EMAIL"],
        ctaLabel: "Open dealers",
        ctaUrl: "/admin/dealers",
      }).catch((error) => console.error(error));
    }

    revalidatePath("/admin/dealers");

    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
}