"use server";

import { prisma } from "@/lib/prisma";

import { logActivity } from "@/lib/activity-logger";
import { assignDealer } from "@/lib/assign-dealer";

import { enforceRateLimit } from "@/lib/rate-limit";
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

    const dealer = await assignDealer(parsed.pincode);

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