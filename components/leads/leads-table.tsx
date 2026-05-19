"use client";

import Link from "next/link";

import { useMemo, useState } from "react";

import {
  Lead,
  Dealer,
  Configuration,
  Frame,
  Lens,
  Headlight,
} from "@/lib/generated/prisma";

import { LeadsToolbar } from "./leads-toolbar";

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
  const [
    search,
    setSearch,
  ] = useState("");

  const [
    status,
    setStatus,
  ] = useState("ALL");

  const filteredLeads =
    useMemo(() => {
      return leads.filter(
        (lead) => {
          const matchesSearch =
            lead.fullName
              .toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||
            lead.email
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchesStatus =
            status === "ALL"
              ? true
              : lead.status ===
                status;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      leads,
      search,
      status,
    ]);

  return (
    <div className="space-y-6">
      <LeadsToolbar
        search={search}
        onSearchChange={
          setSearch
        }
        status={status}
        onStatusChange={
          setStatus
        }
      />

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
            {filteredLeads.length ===
            0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-10 text-center text-muted-foreground"
                >
                  No leads found
                </td>
              </tr>
            ) : (
              filteredLeads.map(
                (lead) => (
                  <tr
                    key={
                      lead.id
                    }
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
                          {
                            lead.email
                          }
                        </p>
                      </div>
                    </td>

                    <td className="p-4">
                      {
                        lead
                          .configuration
                          .frame
                          .name
                      }
                    </td>

                    <td className="p-4">
                      {
                        lead
                          .configuration
                          .lens
                          .name
                      }
                    </td>

                    <td className="p-4">
                      {lead
                        .dealer
                        ?.name ??
                        "-"}
                    </td>

                    <td className="p-4">
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium ${
                          lead.status ===
                          "CONVERTED"
                            ? "bg-green-100 text-green-700"
                            : lead.status ===
                                "PENDING"
                              ? "bg-yellow-100 text-yellow-700"
                              : lead.status ===
                                  "CONTACTED"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {
                          lead.status
                        }
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
                )
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}