"use client";

import { useRouter } from "next/navigation";

import {
  useSearchParams,
} from "next/navigation";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

import { useDebouncedCallback } from "use-debounce";

export function TableToolbar() {
  const router = useRouter();

  const searchParams =
    useSearchParams();

  const handleSearch =
    useDebouncedCallback(
      (value: string) => {
        const params =
          new URLSearchParams(
            searchParams
          );

        if (value) {
          params.set(
            "search",
            value
          );
        } else {
          params.delete("search");
        }

        params.set("page", "1");

        router.push(
          `?${params.toString()}`
        );
      },

      400
    );

  return (
    <div className="relative max-w-sm">
      <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />

      <Input
        placeholder="Search..."
        className="pl-9"
        defaultValue={
          searchParams.get(
            "search"
          ) ?? ""
        }
        onChange={(e) =>
          handleSearch(
            e.target.value
          )
        }
      />
    </div>
  );
}