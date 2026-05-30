"use server";

import { prisma } from "@/lib/prisma";

import { logActivity } from "@/lib/activity-logger";
import { assignDealer } from "@/lib/assign-dealer";
import { createNotification } from "@/src/lib/notifications/notification-service";

import { enforceRateLimit } from "@/lib/rate-limit";
import { NotificationType, UserRole } from "@/lib/generated/prisma";
import { leadSchema } from "@/lib/validations/lead";

export async function createLead(values: any) {
  try {
    const parsed = leadSchema.parse(values);

    const rateLimit = enforceRateLimit(
      `lead:${parsed.email}`,
      {
        limit: 5,
        windowMs: 60 * 60 * 1000,
      }
    );

    if (!rateLimit.success) {
      return {
        success: false,
        message: "Too many lead submissions. Try again later.",
      };
    }

    const dealer = await Promise.race([
      assignDealer(parsed.pincode),
      new Promise<null>((resolve) => {
        setTimeout(() => resolve(null), 2000);
      }),
    ]).catch(() => null);

    const lead = await prisma.lead.create({
      data: {
        fullName: parsed.fullName,
        email: parsed.email,
        phone: parsed.phone,
        city: parsed.city ?? "",
        state: parsed.state ?? "",
        pincode: parsed.pincode,
        configurationId: parsed.configurationId,
        dealerId: dealer?.id,
      },
    });

    await logActivity({
      action: "LEAD_CREATED",
      entityType: "Lead",
      entityId: lead.id,
      description: `Lead created for ${parsed.fullName}`,
      userEmail: parsed.email,
    });

    if (dealer) {
      const notificationBase = {
        title: "Lead assigned",
        message: `${lead.fullName} has been assigned to ${dealer.name}.`,
        type: NotificationType.LEAD,
        entityType: "Lead",
        entityId: lead.id,
        metadata: {
          leadId: lead.id,
          dealerId: dealer.id,
          dealerName: dealer.name,
          customerEmail: lead.email,
        },
      };

      await Promise.all([
        createNotification({
          ...notificationBase,
          eventKey: `LEAD_ASSIGNED:${lead.id}:dealer`,
          recipientEmails: [dealer.email],
          deliveryChannels: ["IN_APP", "EMAIL"],
          ctaLabel: "View leads",
          ctaUrl: "/dealer/quotes",
        }),
        createNotification({
          ...notificationBase,
          eventKey: `LEAD_ASSIGNED:${lead.id}:admin`,
          recipientRoles: [UserRole.ADMIN],
          deliveryChannels: ["IN_APP"],
          ctaLabel: "Open lead",
          ctaUrl: `/admin/leads/${lead.id}`,
        }),
      ]).catch((error) => console.error(error));
    }

    return {
      success: true,
      leadId: lead.id,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "Failed to create lead",
    };
  }
}