"use client";

import { toast } from "sonner";

import {
  LeadStatus,
} from "@/lib/generated/prisma";

import { updateLeadStatus } from "@/actions/leads/update-lead-status";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  leadId: string;

  currentStatus: LeadStatus;
}

export function LeadStatusSelect({
  leadId,
  currentStatus,
}: Props) {
  const handleChange =
    async (
      value: string
    ) => {
      const response =
        await updateLeadStatus({
          leadId,

          status:
            value as LeadStatus,
        });

      if (
        response.success
      ) {
        toast.success(
          "Lead status updated"
        );
      } else {
        toast.error(
          "Failed to update status"
        );
      }
    };

  return (
    <Select
      defaultValue={
        currentStatus
      }
      onValueChange={
        handleChange
      }
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        {Object.values(
          LeadStatus
        ).map((status) => (
          <SelectItem
            key={status}
            value={status}
          >
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
