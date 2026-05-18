"use client";

import { Trash } from "lucide-react";

import { useRouter } from "next/navigation";

import { deleteHeadlight } from "@/actions/headlights/delete-headlight";

import { DeleteAlert } from "@/components/shared/delete-alert";

import {
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface Props {
  id: string;
}

export function DeleteHeadlightButton({
  id,
}: Props) {
  const router = useRouter();

  const handleDelete =
    async () => {
      const response =
        await deleteHeadlight(id);

      if (
        response.success
      ) {
        router.refresh();
      }
    };

  return (
    <DeleteAlert
      onConfirm={
        handleDelete
      }
    >
      <div>
        <DropdownMenuItem
          className="text-red-500"
          onSelect={(e) =>
            e.preventDefault()
          }
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </div>
    </DeleteAlert>
  );
}
