import { createHash } from "crypto";

import { Prisma, NotificationType, UserRole } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { NotificationEmail } from "@/emails/notification-email";

import { getNotificationTypeLabel } from "./notification-utils";

export type NotificationChannel = "IN_APP" | "EMAIL" | "SMS" | "PUSH";

export interface CreateNotificationInput {
  recipientUserIds?: string[];
  recipientEmails?: string[];
  recipientRoles?: UserRole[];
  title: string;
  message: string;
  type: NotificationType;
  entityType?: string | null;
  entityId?: string | null;
  metadata?: Prisma.InputJsonValue;
  eventKey: string;
  deliveryChannels?: NotificationChannel[];
  ctaLabel?: string;
  ctaUrl?: string;
}

export interface NotificationListFilters {
  page?: number;
  limit?: number;
  query?: string;
  type?: NotificationType;
  unreadOnly?: boolean;
}

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function buildRecipientEventKey(eventKey: string, userId: string) {
  return createHash("sha256").update(`${eventKey}:${userId}`).digest("hex");
}

async function sendNotificationEmail(input: {
  email: string;
  title: string;
  message: string;
  preview: string;
  ctaLabel?: string;
  ctaUrl?: string;
}) {
  if (process.env.NODE_ENV !== "production" || !process.env.RESEND_API_KEY) {
    return { success: true, providerMessageId: "mocked-notification-message-id" };
  }

  try {
    const response = await resend.emails.send({
      from: "Surgical Loupe <notifications@resend.dev>",
      to: input.email,
      subject: input.title,
      react: NotificationEmail({
        title: input.title,
        message: input.message,
        preview: input.preview,
        ctaLabel: input.ctaLabel,
        ctaUrl: input.ctaUrl,
      }),
    });

    return {
      success: true,
      providerMessageId: response.data?.id ?? null,
    };
  } catch (error) {
    console.error(error);
    return { success: false, providerMessageId: null };
  }
}

async function resolveRecipients(input: CreateNotificationInput) {
  const targetIds = new Set<string>(input.recipientUserIds ?? []);
  const recipientEmails = (input.recipientEmails ?? []).map(normalizeText).filter(Boolean);
  const recipientRoles = input.recipientRoles ?? [];

  if (recipientEmails.length > 0) {
    const emailUsers = await prisma.user.findMany({
      where: { email: { in: recipientEmails } },
      select: { id: true },
    });

    for (const user of emailUsers) {
      targetIds.add(user.id);
    }
  }

  if (recipientRoles.length > 0) {
    const roleUsers = await prisma.user.findMany({
      where: { role: { in: recipientRoles } },
      select: { id: true },
    });

    for (const user of roleUsers) {
      targetIds.add(user.id);
    }
  }

  return Array.from(targetIds);
}

export async function createNotification(input: CreateNotificationInput) {
  const recipientUserIds = await resolveRecipients(input);
  const createdNotifications = [] as Awaited<ReturnType<typeof prisma.notification.create>>[];

  if (recipientUserIds.length === 0) {
    return createdNotifications;
  }

  for (const userId of recipientUserIds) {
    const eventKey = buildRecipientEventKey(input.eventKey, userId);
    const existing = await prisma.notification.findUnique({ where: { eventKey } });

    if (existing) {
      createdNotifications.push(existing);
      continue;
    }

    const [notification, user] = await Promise.all([
      prisma.notification.create({
        data: {
          userId,
          title: input.title,
          message: input.message,
          type: input.type,
          entityType: input.entityType ?? null,
          entityId: input.entityId ?? null,
          metadata: input.metadata ?? undefined,
          deliveryChannel: (input.deliveryChannels?.[0] ?? "IN_APP") as string,
          deliveryStatus: "PENDING",
          eventKey,
        },
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { email: true },
      }),
    ]);

    createdNotifications.push(notification);

    if ((input.deliveryChannels ?? ["IN_APP"]).includes("EMAIL") && user?.email) {
      const emailResult = await sendNotificationEmail({
        email: user.email,
        title: input.title,
        message: input.message,
        preview: input.message,
        ctaLabel: input.ctaLabel,
        ctaUrl: input.ctaUrl,
      });

      await prisma.notification.update({
        where: { id: notification.id },
        data: {
          deliveryStatus: emailResult.success ? "SENT" : "FAILED",
          metadata: {
            ...(typeof notification.metadata === "object" && notification.metadata !== null ? notification.metadata as Record<string, unknown> : {}),
            emailMessageId: emailResult.providerMessageId,
          },
        },
      });
    } else if ((input.deliveryChannels ?? ["IN_APP"]).includes("EMAIL")) {
      await prisma.notification.update({
        where: { id: notification.id },
        data: {
          deliveryStatus: "FAILED",
        },
      });
    } else {
      await prisma.notification.update({
        where: { id: notification.id },
        data: {
          deliveryStatus: "DELIVERED",
        },
      });
    }
  }

  return createdNotifications;
}

export async function markAsRead(notificationId: string, userId: string) {
  const notification = await prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });

  return { success: notification.count > 0 };
}

export async function markAllAsRead(userId: string, filters: { type?: NotificationType; unreadOnly?: boolean } = {}) {
  const result = await prisma.notification.updateMany({
    where: {
      userId,
      ...(filters.type ? { type: filters.type } : {}),
      ...(filters.unreadOnly !== false ? { isRead: false } : {}),
    },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });

  return { success: true, count: result.count };
}

export async function deleteNotification(notificationId: string, userId: string) {
  const result = await prisma.notification.deleteMany({
    where: { id: notificationId, userId },
  });

  return { success: result.count > 0 };
}

export async function getUnreadNotificationCount(userId: string) {
  return prisma.notification.count({
    where: { userId, isRead: false },
  });
}

export async function getNotifications(userId: string, filters: NotificationListFilters = {}) {
  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.min(50, Math.max(1, filters.limit ?? 20));
  const skip = (page - 1) * limit;

  const where = {
    userId,
    ...(filters.type ? { type: filters.type } : {}),
    ...(filters.unreadOnly ? { isRead: false } : {}),
    ...(filters.query
      ? {
          OR: [
            { title: { contains: filters.query, mode: "insensitive" as const } },
            { message: { contains: filters.query, mode: "insensitive" as const } },
            { entityType: { contains: filters.query, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [items, total, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: [
        { createdAt: "desc" },
        { id: "desc" },
      ],
      skip,
      take: limit,
    }),
    prisma.notification.count({ where }),
    getUnreadNotificationCount(userId),
  ]);

  return {
    items,
    total,
    unreadCount,
    page,
    pageSize: limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export function formatNotificationTypeLabel(type: NotificationType | string) {
  return getNotificationTypeLabel(type as any);
}
