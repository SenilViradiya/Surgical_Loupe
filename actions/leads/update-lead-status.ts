"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

import { logActivity } from "@/lib/activity-logger";

import { requireActionRole } from "@/lib/authorization";

import {
  LeadStatus,
  UserRole,
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
    const session = await requireActionRole([
      UserRole.ADMIN,
      UserRole.DEALER,
    ]);

    const lead = await prisma.lead.findUnique({
      where: {
        id: leadId,
      },

      include: {
        dealer: true,
      },
    });

    if (!lead) {
      return {
        success: false,
        message: "Lead not found",
      };
    }

    if (
      session.user.role === UserRole.DEALER &&
      lead.dealer?.email !== session.user.email
    ) {
      return {
        success: false,
        message: "Forbidden",
      };
    }

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