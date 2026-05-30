import { notFound } from "next/navigation";

import { getQuoteDetail } from "@/src/lib/quotes/quote-service";
import { formatCurrency } from "@/src/lib/quotes/quote-calculations";

import { QuoteResponsePanel } from "@/components/quotes/quote-response-panel";

export default async function PublicQuotePage({ params, searchParams }: { params: Promise<{ quoteId: string }>; searchParams?: Promise<{ token?: string }> }) {
  const { quoteId } = await params;
  const resolvedSearchParams = await searchParams;
  const token = resolvedSearchParams?.token;

  if (!token) {
    return notFound();
  }

  const quote = await getQuoteDetail(quoteId, token);

  if (!quote) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7f8fb_0%,#eef3f5_48%,#f8fafc_100%)] px-4 py-10">
      <div className="mx-auto w-full max-w-4xl space-y-6 rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
        <div>
          <p className="text-xs font-semibold tracking-[0.3em] text-slate-400 uppercase">Surgical Loupe</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">Quote {quote.quoteNumber}</h1>
          <p className="text-sm text-slate-600">Review the pricing, download the PDF, and accept or reject this quote securely.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border bg-white p-5">
            <h2 className="text-lg font-semibold">Customer</h2>
            <p className="mt-2 text-sm text-slate-600">{quote.lead.fullName}</p>
            <p className="text-sm text-slate-600">{quote.lead.email}</p>
            <p className="text-sm text-slate-600">{quote.lead.phone}</p>
            <p className="text-sm text-slate-600">{quote.lead.city}, {quote.lead.state}</p>
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <h2 className="text-lg font-semibold">Dealer</h2>
            <p className="mt-2 text-sm text-slate-600">{quote.dealer.name}</p>
            <p className="text-sm text-slate-600">{quote.dealer.email}</p>
            <p className="text-sm text-slate-600">{quote.dealer.phone}</p>
            <p className="text-sm text-slate-600">Expires {quote.expiresAt.toDateString()}</p>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-5">
          <h2 className="text-lg font-semibold">Items</h2>
          <div className="mt-4 space-y-3">
            {quote.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium text-slate-950">{item.productName}</p>
                  <p className="text-sm text-slate-600">{item.productType} x {item.quantity}</p>
                </div>
                <p className="font-medium text-slate-950">{formatCurrency(Number(item.price) * item.quantity)}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-2 border-t pt-4 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(Number(quote.subtotal))}</span></div>
            <div className="flex justify-between"><span>Discount</span><span>{formatCurrency(Number(quote.discount))}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>{formatCurrency(Number(quote.tax))}</span></div>
            <div className="flex justify-between text-base font-semibold"><span>Total</span><span>{formatCurrency(Number(quote.total))}</span></div>
          </div>
        </div>

        {quote.notes ? (
          <div className="rounded-2xl border bg-slate-50 p-5 text-sm text-slate-700">
            <p className="font-semibold text-slate-950">Notes</p>
            <p className="mt-2 whitespace-pre-wrap">{quote.notes}</p>
          </div>
        ) : null}

        <div className="rounded-2xl border bg-white p-5">
          <h2 className="text-lg font-semibold">Respond</h2>
          <div className="mt-4">
            <QuoteResponsePanel quoteId={quote.id} token={token} status={quote.status} />
          </div>
        </div>
      </div>
    </div>
  );
}