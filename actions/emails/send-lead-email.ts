"use server";

import { resend } from "@/lib/resend";

import { LeadCreatedEmail } from "@/emails/lead-created-email";
import { z } from "zod";
import { enforceRateLimit } from "@/lib/rate-limit";
import { promises as fs } from "fs";
import path from "path";

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

    // Load template subject if present
    let subject = "Your Quote Request";

    try {
      const tplPath = path.resolve(process.cwd(), "config", "email-templates.json");
      const raw = await fs.readFile(tplPath, "utf-8");
      const data = JSON.parse(raw);

      const tpl = data["lead-created"];

      if (tpl?.subject) {
        subject = tpl.subject;
      }
    } catch (err) {
      // ignore and use fallback subject
    }

    await resend.emails.send({
      from: "Surgical Loupe <onboarding@resend.dev>",
      to: parsed.customerEmail,
      subject,
      react: LeadCreatedEmail({
        customerName: parsed.customerName,
        frameName: parsed.frameName,
        lensName: parsed.lensName,
      }),
    });

    return { success: true };
  } catch (error) {

    return { success: false };
  }
}
