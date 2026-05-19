import Link from "next/link";

import { prisma } from "@/lib/prisma";

export default async function UnassignedLeadsPage() {
  const leads =
    await prisma.lead.findMany({
      where: {
        dealerId: null,
      },

      include: {
        configuration: {
          include: {
            frame: true,

            lens: true,
          },
        },
      },
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Unassigned Leads
        </h1>

        <p className="text-muted-foreground">
          Leads requiring manual assignment
        </p>
      </div>

      <div className="rounded-2xl border bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-4 text-left">
                Customer
              </th>

              <th className="p-4 text-left">
                Pincode
              </th>

              <th className="p-4 text-left">
                Frame
              </th>

              <th className="p-4 text-left">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className="border-b"
              >
                <td className="p-4">
                  {
                    lead.fullName
                  }
                </td>

                <td className="p-4">
                  {
                    lead.pincode
                  }
                </td>

                <td className="p-4">
                  {
                    lead
                      .configuration
                      .frame.name
                  }
                </td>

                <td className="p-4">
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="underline"
                  >
                    Assign
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}