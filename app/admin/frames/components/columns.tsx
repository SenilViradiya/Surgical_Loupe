"use client";

import Link from "next/link";

import { ColumnDef } from "@tanstack/react-table";

import { DeleteFrameButton } from "./delete-frame-button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import { MoreHorizontal } from "lucide-react";

import { Frame } from "@/lib/generated/prisma";

export const columns: ColumnDef<Frame>[] =
  [
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
  const frame = row.original;

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
            window.location.href = `/admin/frames/${frame.id}`;
          }}
        >
          Edit
        </DropdownMenuItem>

        <DeleteFrameButton
          id={frame.id}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
},
    },
  ];