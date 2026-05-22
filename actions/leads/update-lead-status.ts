"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

import { logActivity } from "@/lib/activity-logger";

import { requireActionRole } from "@/lib/authorization";

import {
  LeadStatus,
  UserRole,
} from "@/lib/generated/prisma";
import { z } from "zod";
import { enforceRateLimit } from "@/lib/rate-limit";

const updateLeadStatusSchema = z.object({
  leadId: z.string().min(1),
  status: z.nativeEnum(LeadStatus),
});

export async function updateLeadStatus(values: any) {
  try {
    const parsed = updateLeadStatusSchema.parse(values);

    const session = await requireActionRole([
      UserRole.ADMIN,
      UserRole.DEALER,
    ]);

    const rate = enforceRateLimit(`update-lead-status:${parsed.leadId}`, {
      limit: 100,
      windowMs: 60 * 60 * 1000,
    });

    if (!rate.success) return { success: false };

    const lead = await prisma.lead.findUnique({
      where: { id: parsed.leadId },
      include: { dealer: true },
    });

    if (!lead) return { success: false, message: "Lead not found" };

    if (
      session.user.role === UserRole.DEALER &&
      lead.dealer?.email !== session.user.email
    ) {
      return { success: false, message: "Forbidden" };
    }

    await prisma.lead.update({
      where: { id: parsed.leadId },
      data: { status: parsed.status },
    });

    await logActivity({
      action: "LEAD_STATUS_UPDATED",
      entityType: "Lead",
      entityId: parsed.leadId,
      description: `Lead status changed to ${parsed.status}`,
      userEmail: session?.user?.email ?? undefined,
    });

    revalidatePath("/admin/leads");

    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
}