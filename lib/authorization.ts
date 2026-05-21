import { auth } from "@/auth";

import { UserRole } from "@/lib/generated/prisma";

export async function requireSession() {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return session;
}

export async function requireRole(role: UserRole) {
  const session = await requireSession();

  if (session.user.role !== role) {
    throw new Error("Forbidden");
  }

  return session;
}

export async function requireActionRole(
  allowedRoles: UserRole[]
) {
  const session = await requireSession();

  if (!allowedRoles.includes(session.user.role)) {
    throw new Error("Forbidden");
  }

  return session;
}