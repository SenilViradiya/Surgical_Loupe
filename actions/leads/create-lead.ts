"use server";

import { prisma } from "@/lib/prisma";

import { logActivity } from "@/lib/activity-logger";
import { assignDealer } from "@/lib/assign-dealer";

import { enforceRateLimit } from "@/lib/rate-limit";

interface Props {
  fullName: string;

  email: string;

  phone: string;

  city: string;

  state: string;

  pincode: string;

  configurationId: string;
}

export async function createLead(
  values: Props
) {
  try {
    const rateLimit = enforceRateLimit(
      `lead:${values.email}`,
      {
        limit: 5,
        windowMs: 60 * 60 * 1000,
      }
    );

    if (!rateLimit.success) {
      return {
        success: false,

        message:
          "Too many lead submissions. Try again later.",
      };
    }

    const dealer = await assignDealer(
      values.pincode
    );

    const lead =
      await prisma.lead.create({
        data: {
          fullName:
            values.fullName,

          email:
            values.email,

          phone:
            values.phone,

          city:
            values.city,

          state:
            values.state,

          pincode:
            values.pincode,

          configurationId:
            values.configurationId,

          dealerId:
            dealer?.id,
        },
      });

    await logActivity({
      action:
        "LEAD_CREATED",

      entityType:
        "Lead",

      entityId:
        lead.id,

      description: `Lead created for ${values.fullName}`,

      userEmail:
        values.email,
    });

    return {
      success: true,

      leadId: lead.id,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,

      message:
        "Failed to create lead",
    };
  }
}