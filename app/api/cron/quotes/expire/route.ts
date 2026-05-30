import { NextResponse } from "next/server";

import { expireQuote } from "@/src/lib/quotes/quote-service";

export async function GET(req: Request) {
  const secret = req.headers.get("x-cron-secret");

  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const result = await expireQuote();
  return NextResponse.json(result);
}