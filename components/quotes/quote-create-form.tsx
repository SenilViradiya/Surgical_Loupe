"use client";

import { useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { calculateQuoteTotals, formatCurrency } from "@/src/lib/quotes/quote-calculations";
import type { QuoteLineItemSnapshot } from "@/src/lib/quotes/quote-types";

interface Props {
  leadId: string;
  leadName: string;
  dealerName: string;
  items: QuoteLineItemSnapshot[];
  defaultDiscount?: number;
  defaultTax?: number;
  defaultNotes?: string;
}

export function QuoteCreateForm({
  leadId,
  leadName,
  dealerName,
  items,
  defaultDiscount = 0,
  defaultTax = 0,
  defaultNotes = "",
}: Props) {
  const router = useRouter();
  const [discount, setDiscount] = useState(String(defaultDiscount));
  const [tax, setTax] = useState(String(defaultTax));
  const [notes, setNotes] = useState(defaultNotes);
  const [expiresAt, setExpiresAt] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date.toISOString().slice(0, 10);
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const previewTotals = useMemo(() => {
    return calculateQuoteTotals({
      items,
      discount: Number(discount || 0),
      tax: Number(tax || 0),
    });
  }, [discount, items, tax]);

  const submit = async (sendImmediately: boolean) => {
    const loadingSetter = sendImmediately ? setIsSending : setIsSaving;
    loadingSetter(true);

    try {
      const createResponse = await fetch("/api/quotes", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          leadId,
          discount: Number(discount || 0),
          tax: Number(tax || 0),
          notes,
          expiresAt,
          items,
        }),
      });

      const created = await createResponse.json();

      if (!createResponse.ok || !created?.success) {
        toast.error(created?.message ?? "Failed to create quote");
        return;
      }

      if (sendImmediately) {
        const sendResponse = await fetch(`/api/quotes/${created.quote.id}/send`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ baseUrl: window.location.origin }),
        });

        const sent = await sendResponse.json();

        if (!sendResponse.ok || !sent?.success) {
          toast.error(sent?.message ?? "Quote created but sending failed");
          router.push(`/dealer/quotes?created=${created.quote.id}`);
          return;
        }

        toast.success("Quote created and sent");
        router.push(`/dealer/quotes?sent=${created.quote.id}`);
        return;
      }

      toast.success("Quote draft created");
      router.push(`/dealer/quotes?draft=${created.quote.id}`);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      loadingSetter(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <Card>
        <CardHeader>
          <CardTitle>Create quote for {leadName}</CardTitle>
          <CardDescription>{dealerName} can review the configuration, add pricing adjustments, and send the quote.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Discount</label>
              <Input type="number" min="0" step="0.01" value={discount} onChange={(event) => setDiscount(event.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tax</label>
              <Input type="number" min="0" step="0.01" value={tax} onChange={(event) => setTax(event.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Expiration date</label>
              <Input type="date" value={expiresAt} onChange={(event) => setExpiresAt(event.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={5} placeholder="Optional quote notes, warranty details, or closing comments." />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="secondary" disabled={isSaving || isSending} onClick={() => submit(false)}>
              {isSaving ? "Saving..." : "Save Draft"}
            </Button>
            <Button type="button" disabled={isSaving || isSending} onClick={() => submit(true)}>
              {isSending ? "Sending..." : "Create & Send Quote"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>Snapshot pricing from the selected configuration.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {items.map((item) => (
            <div key={`${item.productId}-${item.sortOrder ?? 0}`} className="flex items-center justify-between gap-4 border-b pb-2 last:border-0">
              <div>
                <p className="font-medium">{item.productName}</p>
                <p className="text-muted-foreground">{item.productType} x {item.quantity}</p>
              </div>
              <span>{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}

          <div className="space-y-1 pt-2">
            <div className="flex items-center justify-between"><span>Subtotal</span><span>{formatCurrency(previewTotals.subtotal)}</span></div>
            <div className="flex items-center justify-between"><span>Discount</span><span>{formatCurrency(previewTotals.discount)}</span></div>
            <div className="flex items-center justify-between"><span>Tax</span><span>{formatCurrency(previewTotals.tax)}</span></div>
            <div className="flex items-center justify-between border-t pt-2 text-base font-semibold"><span>Total</span><span>{formatCurrency(previewTotals.total)}</span></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}