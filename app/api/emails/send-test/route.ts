import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import { z } from "zod";
import { LeadCreatedEmail } from "@/emails/lead-created-email";
import { enforceRateLimit } from "@/lib/rate-limit";

const schema = z.object({
  customerEmail: z.string().email(),
  customerName: z.string().min(1),
  frameName: z.string().min(1),
  lensName: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = schema.parse(body);

    const rate = enforceRateLimit(`send-test-email:${parsed.customerEmail}`, {
      limit: 5,
      windowMs: 60 * 60 * 1000,
    });

    if (!rate.success) {
      return NextResponse.json({ success: false, message: "Too many requests" }, { status: 429 });
    }

    await resend.emails.send({
      from: "Surgical Loupe <onboarding@resend.dev>",
      to: parsed.customerEmail,
      subject: "Test: Your Quote Request",
      react: LeadCreatedEmail({
        customerName: parsed.customerName,
        frameName: parsed.frameName,
        lensName: parsed.lensName,
      }),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {

    return NextResponse.json({ success: false, message: error?.message ?? "Failed" }, { status: 500 });
  }
}
