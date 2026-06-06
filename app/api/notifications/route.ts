import { NextResponse } from "next/server";

import { requireSession } from "@/lib/authorization";
import { NotificationType } from "@/lib/generated/prisma";
import { getNotifications } from "@/src/lib/notifications/notification-service";

export async function GET(req: Request) {
  try {
    const session = await requireSession();
    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page") ?? "1");
    const limit = Number(url.searchParams.get("limit") ?? "20");
    const query = url.searchParams.get("query") ?? undefined;
    const type = url.searchParams.get("type") as NotificationType | null;
    const unreadOnly = url.searchParams.get("unreadOnly") === "true";

    const result = await getNotifications(session.user.id, {
      page,
      limit,
      query,
      type: type ?? undefined,
      unreadOnly,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error) {

    return NextResponse.json({ success: false, message: "Failed to load notifications" }, { status: 500 });
  }
}
