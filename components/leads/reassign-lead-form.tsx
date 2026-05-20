"use client";

import { useState } from "react";

import { toast } from "sonner";

import { reassignLead } from "@/actions/leads/reassign-lead";

import { Button } from "@/components/ui/button";

interface Props {
  leadId: string;

  dealers: {
    id: string;

    name: string;
  }[];

  currentDealerId?: string | null;
}

export function ReassignLeadForm({
  leadId,
  dealers,
  currentDealerId,
}: Props) {
  const [
    selectedDealer,
    setSelectedDealer,
  ] = useState(
    currentDealerId ?? ""
  );

  const [loading, setLoading] =
    useState(false);

  const handleAssign =
    async () => {
      if (
        !selectedDealer
      ) {
        toast.error(
          "Select dealer"
        );

        return;
      }

      try {
        setLoading(true);

        const response =
          await reassignLead({
            leadId,

            dealerId:
              selectedDealer,
          });

        if (
          response.success
        ) {
          toast.success(
            "Lead reassigned"
          );
        } else {
          toast.error(
            response.message ??
              "Failed"
          );
        }
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="rounded-2xl border bg-white p-6">
      <h2 className="mb-4 text-xl font-semibold">
        Assign Dealer
      </h2>

      <div className="flex gap-3">
        <select
          value={
            selectedDealer
          }
          onChange={(e) =>
            setSelectedDealer(
              e.target.value
            )
          }
          className="h-10 flex-1 rounded-md border px-3"
        >
          <option value="">
            Select Dealer
          </option>

          {dealers.map(
            (dealer) => (
              <option
                key={
                  dealer.id
                }
                value={
                  dealer.id
                }
              >
                {dealer.name}
              </option>
            )
          )}
        </select>

        <Button
          disabled={loading}
          onClick={
            handleAssign
          }
        >
          {loading
            ? "Saving..."
            : "Assign"}
        </Button>
      </div>
    </div>
  );
}