"use client";

import Link from "next/link";

import {
  Lead,
  Dealer,
  Configuration,
  Frame,
  Lens,
  Headlight,
} from "@/lib/generated/prisma";

interface Props {
  leads: (Lead & {
    dealer: Dealer | null;

    configuration: Configuration & {
      frame: Frame;

      lens: Lens;

      headlight: Headlight | null;
    };
  })[];
}

export function LeadsTable({
  leads,
}: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl border bg-white">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50 text-left">
            <th className="p-4">
              Customer
            </th>

            <th className="p-4">
              Frame
            </th>

            <th className="p-4">
              Lens
            </th>

            <th className="p-4">
              Dealer
            </th>

            <th className="p-4">
              Status
            </th>

            <th className="p-4">
              Actions
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
                <div>
                  <p className="font-medium">
                    {
                      lead.fullName
                    }
                  </p>

                  <p className="text-muted-foreground text-sm">
                    {lead.email}
                  </p>
                </div>
              </td>

              <td className="p-4">
                {
                  lead
                    .configuration
                    .frame.name
                }
              </td>

              <td className="p-4">
                {
                  lead
                    .configuration
                    .lens.name
                }
              </td>

              <td className="p-4">
                {lead.dealer
                  ?.name ?? "-"}
              </td>

              <td className="p-4">
                <span className="rounded-full border px-3 py-1 text-sm">
                  {lead.status}
                </span>
              </td>

              <td className="p-4">
                <Link
                  href={`/admin/leads/${lead.id}`}
                  className="text-sm font-medium underline"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}