import { auth } from "@/auth";

import { redirect } from "next/navigation";

import { UserRole } from "@/lib/generated/prisma";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (
    session.user.role !== UserRole.ADMIN
  ) {
    redirect("/dealer");
  }

  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}