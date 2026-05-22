"use server";

import { prisma } from "@/lib/prisma";

import { requireSession } from "@/lib/authorization";

export async function getDealerOnboarding() {
  const session = await requireSession();

  const email = session.user.email as string;

  const dealer = await prisma.dealer.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      companyName: true,
      onboardingStatus: true,
      profileCompletedAt: true,
      phone: true,
      address: true,
      serviceRegions: true,
      city: true,
      state: true,
      businessDetails: true,
    },
  });

  return dealer;
}
