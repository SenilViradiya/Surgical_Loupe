"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  quoteId: string;
  token: string;
  status: string;
}

export function QuoteResponsePanel({ quoteId, token, status }: Props) {
  const router = useRouter();
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState<"accept" | "reject" | null>(null);

  const submit = async (action: "accept" | "reject") => {
    setLoading(action);

    try {
      const response = await fetch(`/api/quotes/${quoteId}/${action}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, comment }),
      });

      const json = await response.json();

      if (!response.ok || !json?.success) {
        toast.error(json?.message ?? "Unable to update quote");
        return;
      }

      toast.success(action === "accept" ? "Quote accepted" : "Quote rejected");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Unable to update quote");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-3">
      <Textarea value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Optional comment for the dealer" rows={4} />
      <div className="flex flex-wrap gap-3">
        <Button asChild variant="secondary">
          <a href={`/api/quotes/${quoteId}/pdf?token=${token}`}>Download PDF</a>
        </Button>
        <Button disabled={loading !== null || status === "ACCEPTED" || status === "CONVERTED"} onClick={() => submit("accept")}>{loading === "accept" ? "Accepting..." : "Accept Quote"}</Button>
        <Button disabled={loading !== null || status === "REJECTED" || status === "EXPIRED"} variant="destructive" onClick={() => submit("reject")}>{loading === "reject" ? "Rejecting..." : "Reject Quote"}</Button>
      </div>
    </div>
  );
}