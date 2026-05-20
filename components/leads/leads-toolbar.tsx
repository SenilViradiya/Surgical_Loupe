"use client";

import { Input } from "@/components/ui/input";

interface Props {
  search: string;

  onSearchChange: (
    value: string
  ) => void;

  status: string;

  onStatusChange: (
    value: string
  ) => void;
}

export function LeadsToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: Props) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <Input
        placeholder="Search leads..."
        value={search}
        onChange={(e) =>
          onSearchChange(
            e.target.value
          )
        }
        className="max-w-sm"
      />

      <select
        value={status}
        onChange={(e) =>
          onStatusChange(
            e.target.value
          )
        }
        className="h-10 rounded-md border px-3"
      >
        <option value="ALL">
          All Statuses
        </option>

        <option value="PENDING">
          Pending
        </option>

        <option value="CONTACTED">
          Contacted
        </option>

        <option value="QUALIFIED">
          Qualified
        </option>

        <option value="CONVERTED">
          Converted
        </option>

        <option value="CLOSED">
          Closed
        </option>
      </select>
    </div>
  );
}