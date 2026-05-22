"use server";

import crypto from "crypto";

import { addHours } from "date-fns";

import { prisma } from "@/lib/prisma";

import { resend } from "@/lib/resend";

import { enforceRateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const emailSchema = z.string().email();

export async function forgotPassword(email: string) {
  try {
    const parsed = emailSchema.parse(email);
    const rateLimit = enforceRateLimit(
      `forgot-password:${parsed}`,
      {
        limit: 3,
        windowMs: 60 * 60 * 1000,
      }
    );

    if (!rateLimit.success) {
      return {
        success: false,
      };
    }

    const user = await prisma.user.findUnique({
      where: {
        email: parsed,
      },
    });

    /*
      Never reveal
      if user exists
    */

    if (!user) {
      return {
        success: true,
      };
    }

    const token =
      crypto.randomBytes(32).toString(
        "hex"
      );

    await prisma.verificationToken.deleteMany({
      where: {
        identifier: parsed,
      },
    });

    await prisma.verificationToken.create({
      data: {
        identifier: parsed,

        token,

        expires: addHours(new Date(), 1),
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    await resend.emails.send({
      from:
        "Surgical Loupe <onboarding@resend.dev>",

      to: parsed,

      subject:
        "Reset Your Password",

      html: `
        <h2>Password Reset</h2>

        <p>
          Click below to reset your password:
        </p>

        <a href="${resetUrl}">
          Reset Password
        </a>

        <p>
          This link expires in 1 hour.
        </p>
      `,
    });

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