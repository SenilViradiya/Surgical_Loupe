import { NextResponse } from "next/server";

import { requireSession } from "@/lib/authorization";
import { NotificationType } from "@/lib/generated/prisma";
import { markAllAsRead } from "@/src/lib/notifications/notification-service";

export async function POST(req: Request) {
  try {
    const session = await requireSession();
    const payload = await req.json().catch(() => ({}));

    const result = await markAllAsRead(session.user.id, {
      type: payload.type as NotificationType | undefined,
      unreadOnly: payload.unreadOnly,
    });

    return NextResponse.json({ ...result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to mark notifications as read" }, { status: 500 });
  }
}
