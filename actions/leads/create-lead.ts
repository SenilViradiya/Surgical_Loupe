"use server";

import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-logger";
import { assignDealer } from "@/lib/assign-dealer";

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
    const dealer =
      await assignDealer(
        values.pincode
      );    ({
        where: {
          pincode:
            values.pincode,
        },

        include: {
          dealer: true,
        },
      });

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