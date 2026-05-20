"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";

import { prisma } from "@/lib/prisma";

import { logActivity } from "@/lib/activity-logger";

interface Props {
  leadId: string;

  dealerId: string;
}

export async function reassignLead({
  leadId,
  dealerId,
}: Props) {
  try {
    const session =
      await auth();

    const dealer =
      await prisma.dealer.findUnique({
        where: {
          id: dealerId,
        },
      });

    if (!dealer) {
      return {
        success: false,

        message:
          "Dealer not found",
      };
    }

    await prisma.lead.update({
      where: {
        id: leadId,
      },

      data: {
        dealerId,
      },
    });

    await logActivity({
      action:
        "LEAD_REASSIGNED",

      entityType:
        "Lead",

      entityId:
        leadId,

      description: `Lead reassigned to ${dealer.name}`,

      userEmail:
        session?.user?.email,
    });

    revalidatePath(
      `/admin/leads/${leadId}`
    );

    revalidatePath(
      "/admin/unassigned-leads"
    );

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
    };
  }
}