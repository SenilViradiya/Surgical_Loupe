import { NextResponse } from "next/server";

import { acceptQuote } from "@/src/lib/quotes/quote-service";

export async function POST(req: Request, { params }: { params: Promise<{ quoteId: string }> }) {
  try {
    const { quoteId } = await params;
    const body = await req.json();
    const result = await acceptQuote({ quoteId, token: body.token, comment: body.comment });

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}