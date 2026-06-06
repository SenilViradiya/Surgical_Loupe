"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

import { logActivity } from "@/lib/activity-logger";
import { createNotification } from "@/src/lib/notifications/notification-service";

import { requireActionRole } from "@/lib/authorization";

import { NotificationType, UserRole } from "@/lib/generated/prisma";
import { z } from "zod";
import { enforceRateLimit } from "@/lib/rate-limit";

const reassignSchema = z.object({
  leadId: z.string().min(1),
  dealerId: z.string().min(1),
});

export async function reassignLead(values: any) {
  try {
    const parsed = reassignSchema.parse(values);

    const session = await requireActionRole([UserRole.ADMIN]);

    const rate = enforceRateLimit(`reassign-lead:${parsed.leadId}`, {
      limit: 50,
      windowMs: 60 * 60 * 1000,
    });

    if (!rate.success) return { success: false };

    const lead = await prisma.lead.findUnique({
      where: { id: parsed.leadId },
      include: { dealer: true },
    });

    if (!lead) return { success: false, message: "Lead not found" };

    const dealer = await prisma.dealer.findUnique({
      where: { id: parsed.dealerId },
    });

    if (!dealer) return { success: false, message: "Dealer not found" };

    await prisma.lead.update({
      where: { id: parsed.leadId },
      data: { dealerId: parsed.dealerId },
    });

    await logActivity({
      action: "LEAD_REASSIGNED",
      entityType: "Lead",
      entityId: parsed.leadId,
      description: `Lead reassigned to ${dealer.name}`,
      userEmail: session?.user?.email ?? undefined,
    });

    const notificationBase = {
      title: "Lead reassigned",
      message: `${lead.fullName} has been reassigned to ${dealer.name}.`,
      type: NotificationType.LEAD,
      entityType: "Lead",
      entityId: parsed.leadId,
      metadata: {
        leadId: parsed.leadId,
        dealerId: dealer.id,
        previousDealerId: lead.dealerId,
      },
    };

    await Promise.all([
      createNotification({
        ...notificationBase,
        eventKey: `LEAD_REASSIGNED:${parsed.leadId}:dealer`,
        recipientEmails: [dealer.email],
        deliveryChannels: ["IN_APP", "EMAIL"],
        ctaLabel: "View leads",
        ctaUrl: "/dealer/quotes",
      }),
      createNotification({
        ...notificationBase,
        eventKey: `LEAD_REASSIGNED:${parsed.leadId}:admin`,
        recipientRoles: [UserRole.ADMIN],
        deliveryChannels: ["IN_APP"],
        ctaLabel: "Open lead",
        ctaUrl: `/admin/leads/${parsed.leadId}`,
      }),
    ]);

    revalidatePath(`/admin/leads/${parsed.leadId}`);
    revalidatePath("/admin/unassigned-leads");

    return { success: true };
  } catch (error) {

    return { success: false };
  }
}
