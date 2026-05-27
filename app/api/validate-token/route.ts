import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ valid: false, reason: "missing" }, { status: 400 });
  }

  const vt = await prisma.verificationToken.findUnique({ where: { token } });

  if (!vt) {
    return NextResponse.json({ valid: false, reason: "invalid" }, { status: 404 });
  }

  if (vt.expires && vt.expires < new Date()) {
    return NextResponse.json({ valid: false, reason: "expired" }, { status: 410 });
  }

  return NextResponse.json({ valid: true });
}
