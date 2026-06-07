"use server";

import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

import { enforceRateLimit } from "@/lib/rate-limit";

interface Props {
  token: string;

  password: string;
}

export async function resetPassword({
  token,
  password,
}: Props) {
  try {
    const rateLimit = enforceRateLimit(
      `reset-password:${token}`,
      {
        limit: 5,
        windowMs: 60 * 60 * 1000,
      }
    );

    if (!rateLimit.success) {
      return {
        success: false,

        message:
          "Too many attempts. Try again later.",
      };
    }

    const verificationToken =
      await prisma.verificationToken.findUnique({
        where: {
          token,
        },
      });

    if (!verificationToken) {
      return { success: false, message: "Invalid or expired token" };
    }

    // Check expiry
    if (verificationToken.expires && verificationToken.expires < new Date()) {
      return { success: false, message: "Token has expired" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { password: hashedPassword },
    });

    // Mark dealer as pending setup after password set; profile completion
    // will transition the dealer to ACTIVE via updateDealerProfile
    await prisma.dealer.updateMany({
      where: { email: verificationToken.identifier },
      data: { onboardingStatus: "PENDING_SETUP", isActive: true },
    });

    await prisma.verificationToken.delete({ where: { token } });

    return {
      success: true,
      email: verificationToken.identifier,
    };
  } catch (error) {


    return {
      success: false,
    };
  }
}
