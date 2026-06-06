import { auth } from "@/auth";

import { UserRole } from "@/lib/generated/prisma";

export class AuthorizationError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "AuthorizationError";
  }
}

export async function requireSession() {
  const session = await auth();

  if (!session?.user) {
    throw new AuthorizationError();
  }

  return session;
}

export async function requireActionRole(
  allowedRoles: UserRole[]
) {
  const session = await requireSession();

  if (!allowedRoles.includes(session.user.role)) {
    throw new AuthorizationError("Forbidden");
  }

  return session;
}
