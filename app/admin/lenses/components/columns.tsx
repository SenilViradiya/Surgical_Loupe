"use client";

import { ColumnDef } from "@tanstack/react-table";

import { MoreHorizontal } from "lucide-react";

import { Lens } from "@/lib/generated/prisma";

import { DeleteLensButton } from "./delete-lens-button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

export const columns: ColumnDef<Lens>[] = [
  {
    accessorKey: "name",

    header: "Name",
  },

  {
    accessorKey: "slug",

    header: "Slug",
  },

  {
    accessorKey: "magnification",

    header: "Magnification",
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
      const lens = row.original;

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
                window.location.href = `/admin/lenses/${lens.id}`;
              }}
            >
              Edit
            </DropdownMenuItem>

            <DeleteLensButton
              id={lens.id}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
