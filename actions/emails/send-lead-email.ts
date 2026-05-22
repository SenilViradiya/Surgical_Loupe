"use server";

import { resend } from "@/lib/resend";

import { LeadCreatedEmail } from "@/emails/lead-created-email";
import { z } from "zod";
import { enforceRateLimit } from "@/lib/rate-limit";

const sendLeadEmailSchema = z.object({
  customerEmail: z.string().email(),
  customerName: z.string().min(1),
  frameName: z.string().min(1),
  lensName: z.string().min(1),
});

export async function sendLeadEmail(values: any) {
  try {
    const parsed = sendLeadEmailSchema.parse(values);

    const rateLimit = enforceRateLimit(
      `send-lead-email:${parsed.customerEmail}`,
      { limit: 5, windowMs: 60 * 60 * 1000 }
    );

    if (!rateLimit.success) {
      return { success: false };
    }

    await resend.emails.send({
      from: "Surgical Loupe <onboarding@resend.dev>",
      to: parsed.customerEmail,
      subject: "Your Quote Request",
      react: LeadCreatedEmail({
        customerName: parsed.customerName,
        frameName: parsed.frameName,
        lensName: parsed.lensName,
      }),
    });

    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
}