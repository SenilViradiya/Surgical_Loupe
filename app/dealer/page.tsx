import { auth } from "@/auth";

import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

export default async function DealerPage() {
  const session =
    await auth();

  if (
    !session?.user
  ) {
    return redirect(
      "/login"
    );
  }

  const dealer =
    await prisma.dealer.findUnique({
      where: {
        email:
          session.user.email!,
      },

      include: {
        leads: true,
      },
    });

  if (!dealer) {
    return redirect(
      "/"
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Dealer Dashboard
        </h1>

        <p className="text-muted-foreground">
          Welcome back{" "}
          {
            dealer.name
          }
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border bg-white p-6">
          <p className="text-muted-foreground text-sm">
            Total Leads
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {
              dealer.leads
                .length
            }
          </h2>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <p className="text-muted-foreground text-sm">
            Converted
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {
              dealer.leads.filter(
                (
                  lead
                ) =>
                  lead.status ===
                  "CONVERTED"
              ).length
            }
          </h2>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <p className="text-muted-foreground text-sm">
            Pending
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {
              dealer.leads.filter(
                (
                  lead
                ) =>
                  lead.status ===
                  "PENDING"
              ).length
            }
          </h2>
        </div>
      </div>
    </div>
  );
}