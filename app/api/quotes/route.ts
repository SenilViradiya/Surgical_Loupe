import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireActionRole } from "@/lib/authorization";
import { UserRole } from "@/lib/generated/prisma";

import { createQuote } from "@/src/lib/quotes/quote-service";

export async function POST(req: Request) {
  try {
    const session = await requireActionRole([UserRole.ADMIN, UserRole.DEALER]);
    const body = await req.json();

    const dealer = session.user.role === UserRole.DEALER
      ? await prisma.dealer.findUnique({ where: { email: session.user.email! } })
      : null;

    const result = await createQuote({
      ...body,
      dealerId: dealer?.id ?? body.dealerId,
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to create quote" }, { status: 500 });
  }
}