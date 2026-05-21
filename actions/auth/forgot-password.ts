"use server";

import crypto from "crypto";

import { addHours } from "date-fns";

import { prisma } from "@/lib/prisma";

import { resend } from "@/lib/resend";

import { enforceRateLimit } from "@/lib/rate-limit";

export async function forgotPassword(
  email: string
) {
  try {
    const rateLimit = enforceRateLimit(
      `forgot-password:${email}`,
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

    const user =
      await prisma.user.findUnique({
        where: {
          email,
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
        identifier: email,
      },
    });

    await prisma.verificationToken.create({
      data: {
        identifier: email,

        token,

        expires:
          addHours(
            new Date(),
            1
          ),
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    await resend.emails.send({
      from:
        "Surgical Loupe <onboarding@resend.dev>",

      to: email,

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