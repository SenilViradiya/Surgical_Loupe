import { NextResponse } from "next/server";

import { requireSession } from "@/lib/authorization";
import { deleteNotification } from "@/src/lib/notifications/notification-service";

export async function DELETE(req: Request, { params }: { params: Promise<{ notificationId: string }> }) {
  try {
    const session = await requireSession();
    const { notificationId } = await params;
    const result = await deleteNotification(notificationId, session.user.id);

    if (!result.success) {
      return NextResponse.json({ success: false, message: "Notification not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to delete notification" }, { status: 500 });
  }
}
