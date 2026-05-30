"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { createNotification } from "@/src/lib/notifications/notification-service";

import { dealerProfileSchema } from "@/lib/validations/dealer";

import { requireActionRole } from "@/lib/authorization";

import { NotificationType, UserRole } from "@/lib/generated/prisma";

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

  if (meaningful) {
    const dealer = await prisma.dealer.findUnique({
      where: { email },
      select: { id: true, name: true, email: true },
    });

    if (dealer) {
      await createNotification({
        recipientEmails: [dealer.email],
        recipientRoles: [UserRole.ADMIN],
        title: "Dealer activated",
        message: `${dealer.name} completed onboarding and is now active.`,
        type: NotificationType.DEALER,
        entityType: "Dealer",
        entityId: dealer.id,
        metadata: {
          dealerId: dealer.id,
          dealerName: dealer.name,
          dealerEmail: dealer.email,
        },
        eventKey: `DEALER_ACTIVATED:${dealer.id}`,
        deliveryChannels: ["IN_APP", "EMAIL"],
        ctaLabel: "Open dealers",
        ctaUrl: "/admin/dealers",
      }).catch((error) => console.error(error));
    }
  }

  // If a profile image / photo URL was provided, persist it on the User record
  if (parsed.photoUrl) {
    try {
      await prisma.user.update({
        where: { email },
        data: { image: parsed.photoUrl },
      });
    } catch (e) {
      // don't fail the profile update if user image persist fails
      console.log("Failed to persist user image", e);
    }
  }

  try {
    revalidatePath("/dealer");
  } catch (e) {
    // ignore in non-edge environments
  }

  return { success: true, message: "Profile updated" };
}
