"use server";

import crypto from "crypto";

import { revalidatePath } from "next/cache";

import { addHours } from "date-fns";

import { prisma } from "@/lib/prisma";

import { resend } from "@/lib/resend";

import { enforceRateLimit } from "@/lib/rate-limit";

interface Props {
  name: string;

  email: string;

  phone: string;

  city: string;

  state: string;
}

export async function createDealer(
  values: Props
) {
  try {
    const rateLimit = enforceRateLimit(
      `create-dealer:${values.email}`,
      {
        limit: 3,
        windowMs: 60 * 60 * 1000,
      }
    );

    if (!rateLimit.success) {
      return {
        success: false,

        message:
          "Too many dealer invitations were created. Try again later.",
      };
    }

    const existingUser =
      await prisma.user.findUnique({
        where: {
          email:
            values.email,
        },
      });

    if (existingUser) {
      return {
        success: false,

        message:
          "User already exists",
      };
    }

    const inviteToken =
      crypto.randomBytes(32).toString(
        "hex"
      );

    const inviteExpiresAt = addHours(
      new Date(),
      24
    );

    await prisma.verificationToken.deleteMany({
      where: {
        identifier:
          values.email,
      },
    });

    /*
      Create auth user
    */

    await prisma.user.create({
      data: {
        name:
          values.name,

        email:
          values.email,

        password: null,

        role: "DEALER",
      },
    });

    /*
      Create dealer profile
    */

    await prisma.dealer.create({
      data: {
        ...values,

        isActive: false,

        onboardingStatus:
          "INVITED",

        inviteToken,

        inviteTokenExpiresAt:
          inviteExpiresAt,
      },
    });

    await prisma.verificationToken.create({
      data: {
        identifier:
          values.email,

        token:
          inviteToken,

        expires:
          inviteExpiresAt,
      },
    });

    /*
      Send onboarding email
    */

    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${inviteToken}&mode=invite`;

    await resend.emails.send({
      from:
        "Surgical Loupe <onboarding@resend.dev>",

      to: values.email,

      subject:
        "Activate Your Dealer Account",

      html: `
        <h2>Welcome ${values.name}</h2>

        <p>Your dealer account has been created and is waiting for activation.</p>

        <p><a href="${inviteUrl}">Set your password and activate your account</a></p>

        <p>
          This activation link expires in 24 hours.
        </p>
      `,
    });

    revalidatePath(
      "/admin/dealers"
    );

    return {
      success: true,
      message: "Dealer invitation sent",
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
    };
  }
}