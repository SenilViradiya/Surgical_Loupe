"use server";

import { resend } from "@/lib/resend";

import { LeadCreatedEmail } from "@/emails/lead-created-email";

interface Props {
  customerEmail: string;

  customerName: string;

  frameName: string;

  lensName: string;
}

export async function sendLeadEmail({
  customerEmail,
  customerName,
  frameName,
  lensName,
}: Props) {
  try {
    await resend.emails.send({
      from:
        "Surgical Loupe <onboarding@resend.dev>",

      to: customerEmail,

      subject:
        "Your Quote Request",

      react:
        LeadCreatedEmail({
          customerName,

          frameName,

          lensName,
        }),
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