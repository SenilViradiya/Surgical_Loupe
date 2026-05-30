import { NextResponse } from "next/server";

import { requireActionRole } from "@/lib/authorization";
import { UserRole } from "@/lib/generated/prisma";

import { sendQuote } from "@/src/lib/quotes/quote-service";

export async function POST(req: Request, { params }: { params: Promise<{ quoteId: string }> }) {
  try {
    const session = await requireActionRole([UserRole.ADMIN, UserRole.DEALER]);
    const { quoteId } = await params;
    const payload = await req.json().catch(() => ({}));
    const baseUrl = payload.baseUrl ?? new URL(req.url).origin;

    const result = await sendQuote({
      quoteId,
      baseUrl,
      actorEmail: session.user.email ?? undefined,
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to send quote" }, { status: 500 });
  }
}