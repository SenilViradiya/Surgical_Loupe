"use client";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";

import { generateQuotePDF } from "@/lib/generate-quote-pdf";

interface Props {
  lead: {
    fullName: string;

    email: string;

    phone: string;
  };

  configuration: {
    frame: {
      name: string;

      price: number;
    };

    lens: {
      name: string;

      price: number;
    };

    headlight?: {
      name: string;

      price: number;
    } | null;
  };
}

export function DownloadQuoteButton({
  lead,
  configuration,
}: Props) {
  return (
    <Button
      onClick={() =>
        generateQuotePDF({
          customer: lead,

          configuration,
        })
      }
    >
      <Download className="mr-2 h-4 w-4" />
      Download Quote
    </Button>
  );
}