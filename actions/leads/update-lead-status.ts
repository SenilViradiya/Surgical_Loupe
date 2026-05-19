"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

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
    await prisma.lead.update({
      where: {
        id: leadId,
      },

      data: {
        status,
      },
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