"use client";

import { useState } from "react";

import { toast } from "sonner";

import { addCoverage } from "@/actions/dealers/add-coverage";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

interface Props {
  dealerId: string;
}

export function AddCoverageForm({
  dealerId,
}: Props) {
  const [pincode, setPincode] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      try {
        setLoading(true);

        const response =
          await addCoverage({
            dealerId,
            pincode,
          });

        if (
          response.success
        ) {
          toast.success(
            "Coverage added"
          );

          setPincode("");
        } else {
          toast.error(
            response.message
          );
        }
      } finally {
        setLoading(false);
      }
    };

  return (
    <form
      onSubmit={
        handleSubmit
      }
      className="mt-4 flex gap-2"
    >
      <Input
        placeholder="Add Pincode"
        value={pincode}
        onChange={(e) =>
          setPincode(
            e.target.value
          )
        }
      />

      <Button
        disabled={loading}
        type="submit"
      >
        Add
      </Button>
    </form>
  );
}