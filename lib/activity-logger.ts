import { prisma } from "@/lib/prisma";

interface Props {
  action: string;

  entityType: string;

  entityId: string;

  description?: string;

  userEmail?: string;
}

export async function logActivity({
  action,
  entityType,
  entityId,
  description,
  userEmail,
}: Props) {
  try {
    await prisma.activityLog.create({
      data: {
        action,

        entityType,

        entityId,

        description,

        userEmail,
      },
    });
  } catch (error) {

  }
}
