"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Event } from "@/lib/generated/prisma";
import { DeleteEventButton } from "./delete-event-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<Event>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "startDate",
    header: "Start",
    cell: ({ row }) => (
      <div>
        {new Date(row.original.startDate).toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: "endDate",
    header: "End",
    cell: ({ row }) => (
      <div>
        {new Date(row.original.endDate).toLocaleString()}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const event = row.original;

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
            <DeleteEventButton id={event.id} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
