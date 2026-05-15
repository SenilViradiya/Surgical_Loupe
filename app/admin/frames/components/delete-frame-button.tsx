"use client";

import { useRouter } from "next/navigation";

import { deleteFrame } from "@/actions/frames/delete-frame";

import { DeleteAlert } from "@/components/shared/delete-alert";

interface Props {
  id: string;
}

export function DeleteFrameButton({
  id,
}: Props) {
  const router = useRouter();

  const handleDelete = async () => {
    const response =
      await deleteFrame(id);

    if (response.success) {
      router.refresh();
    }
  };

  return (
    <DeleteAlert
      onConfirm={handleDelete}
    >
      <button className="w-full text-left text-sm text-red-500">
        Delete
      </button>
    </DeleteAlert>
  );
}