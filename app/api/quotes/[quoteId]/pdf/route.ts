import { NextResponse } from "next/server";

import { generateQuotePdfBytes } from "@/src/lib/quotes/quote-pdf";
import { formatCurrency } from "@/src/lib/quotes/quote-calculations";
import { getQuoteDetail } from "@/src/lib/quotes/quote-service";

export async function GET(req: Request, { params }: { params: Promise<{ quoteId: string }> }) {
  const { quoteId } = await params;
  const url = new URL(req.url);
  const token = url.searchParams.get("token") ?? undefined;

  const quote = await getQuoteDetail(quoteId, token);

  if (!quote) {
    return NextResponse.json({ success: false, message: "Quote not found" }, { status: 404 });
  }

  const bytes = await generateQuotePdfBytes({
    companyName: "Surgical Loupe",
    quoteNumber: quote.quoteNumber,
    customer: {
      fullName: quote.lead.fullName,
      email: quote.lead.email,
      phone: quote.lead.phone,
      city: quote.lead.city,
      state: quote.lead.state,
    },
    dealer: {
      name: quote.dealer.name,
      email: quote.dealer.email,
      phone: quote.dealer.phone,
    },
    items: quote.items.map((item) => ({
      productType: item.productType as any,
      productId: item.productId,
      productName: item.productName,
      price: Number(item.price),
      quantity: item.quantity,
      sortOrder: item.sortOrder,
      metadata: (item.metadata as Record<string, unknown> | null) ?? undefined,
    })),
    totals: {
      subtotal: Number(quote.subtotal),
      discount: Number(quote.discount),
      tax: Number(quote.tax),
      total: Number(quote.total),
    },
    expiresAt: quote.expiresAt.toISOString(),
    notes: quote.notes,
  });

  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename=quote-${quote.quoteNumber}.pdf`,
    },
  });
}