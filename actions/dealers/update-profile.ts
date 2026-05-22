"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

import { dealerProfileSchema } from "@/lib/validations/dealer";

import { requireActionRole } from "@/lib/authorization";

import { UserRole } from "@/lib/generated/prisma";

import { z } from "zod";

export async function updateDealerProfile(values: any) {
  const session = await requireActionRole([UserRole.DEALER]);

  const parsed = dealerProfileSchema.parse(values);

  const email = session.user.email as string;

  const updateData: any = {
    companyName: parsed.companyName ?? undefined,
    businessDetails: parsed.businessDetails ?? undefined,
    address: parsed.address ?? undefined,
    serviceRegions: parsed.serviceRegions ?? undefined,
    phone: parsed.phone ?? undefined,
    city: parsed.city ?? undefined,
    state: parsed.state ?? undefined,
  };

  // If at least one meaningful field is present, mark profile completed
  const meaningful = Object.values(updateData).some((v) => v !== undefined && v !== "");

  if (meaningful) {
    updateData.profileCompletedAt = new Date();
    updateData.onboardingStatus = "ACTIVE";
  }

  await prisma.dealer.updateMany({
    where: { email },
    data: updateData,
  });

  try {
    revalidatePath("/dealer");
  } catch (e) {
    // ignore in non-edge environments
  }

  return { success: true, message: "Profile updated" };
}
