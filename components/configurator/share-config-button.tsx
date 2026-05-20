"use client";

import { Share2 } from "lucide-react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

interface Props {
  configurationId: string;
}

export function ShareConfigButton({
  configurationId,
}: Props) {
  const handleShare =
    async () => {
      const url = `${window.location.origin}/configurator/${configurationId}`;

      await navigator.clipboard.writeText(
        url
      );

      toast.success(
        "Configuration link copied"
      );
    };

  return (
    <Button
      onClick={
        handleShare
      }
    >
      <Share2 className="mr-2 h-4 w-4" />
      Share Configuration
    </Button>
  );
}