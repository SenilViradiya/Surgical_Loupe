"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

import { auth } from "@/auth";

import { logActivity } from "@/lib/activity-logger";

import {
  LeadStatus,
} from "@/lib/generated/prisma";

interface Props {
  leadId: string;

  status: LeadStatus;
}

export async function updateLeadStatus({
  leadId,
  status,
}: Props) {
  try {
    const session =
      await auth();

    await prisma.lead.update({
      where: {
        id: leadId,
      },

      data: {
        status,
      },
    });

    await logActivity({
      action:
        "LEAD_STATUS_UPDATED",

      entityType:
        "Lead",

      entityId:
        leadId,

      description: `Lead status changed to ${status}`,

      userEmail:
        session?.user?.email ?? undefined,
    });

    revalidatePath(
      "/admin/leads"
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