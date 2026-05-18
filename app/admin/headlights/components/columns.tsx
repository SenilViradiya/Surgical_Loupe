"use client";

import { ColumnDef } from "@tanstack/react-table";

import { MoreHorizontal } from "lucide-react";

import { Headlight } from "@/lib/generated/prisma";

import { DeleteHeadlightButton } from "./delete-headlight-button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

export const columns: ColumnDef<Headlight>[] = [
  {
    accessorKey: "name",

    header: "Name",
  },

  {
    accessorKey: "slug",

    header: "Slug",
  },

  {
    accessorKey: "price",

    header: "Price",

    cell: ({ row }) => {
      return (
        <div>
          ₹{row.original.price}
        </div>
      );
    },
  },

  {
    accessorKey: "status",

    header: "Status",
  },

  {
    id: "actions",

    cell: ({ row }) => {
      const headlight = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                window.location.href = `/admin/headlights/${headlight.id}`;
              }}
            >
              Edit
            </DropdownMenuItem>

            <DeleteHeadlightButton
              id={headlight.id}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
