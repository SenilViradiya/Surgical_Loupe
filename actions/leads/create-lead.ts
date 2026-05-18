"use server";

import { prisma } from "@/lib/prisma";

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
    const dealerCoverage =
      await prisma.dealerCoverage.findFirst({
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
            dealerCoverage?.dealerId,
        },
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