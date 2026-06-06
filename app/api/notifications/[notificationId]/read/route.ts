import { NextResponse } from "next/server";

import { requireSession } from "@/lib/authorization";
import { markAsRead } from "@/src/lib/notifications/notification-service";

export async function PATCH(req: Request, { params }: { params: Promise<{ notificationId: string }> }) {
  try {
    const session = await requireSession();
    const { notificationId } = await params;
    const result = await markAsRead(notificationId, session.user.id);

    if (!result.success) {
      return NextResponse.json({ success: false, message: "Notification not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to mark notification as read" }, { status: 500 });
  }
}
