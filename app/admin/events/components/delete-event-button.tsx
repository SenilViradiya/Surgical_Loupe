"use client";

import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteEvent } from "@/actions/events/delete-event";
import { DeleteAlert } from "@/components/shared/delete-alert";
import {
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface Props {
  id: string;
}

export function DeleteEventButton({
  id,
}: Props) {
  const router = useRouter();

  const handleDelete = async () => {
    const response =
      await deleteEvent(id);

    if (response.success) {
      router.refresh();
    }
  };

  return (
    <DeleteAlert
      onConfirm={handleDelete}
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
