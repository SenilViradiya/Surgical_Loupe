import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

import { DashboardShell } from "@/components/layouts/dashboard-shell";
import { Sidebar } from "@/components/layouts/sidebar";
import { Navbar } from "@/components/layouts/navbar";
import { dealerSidebarItems } from "@/constants/dealer-sidebar";

import { getQuoteMetrics, listQuotesForDealer } from "@/src/lib/quotes/quote-service";
import { formatCurrency } from "@/src/lib/quotes/quote-calculations";

export default async function DealerQuotesPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const dealer = await prisma.dealer.findUnique({ where: { email: session.user.email! } });

  if (!dealer) {
    redirect("/dealer");
  }

  const params = (await searchParams) ?? {};
  const query = typeof params.q === "string" ? params.q : undefined;
  const status = typeof params.status === "string" ? params.status : undefined;
  const page = typeof params.page === "string" ? Number(params.page) : 1;

  const [quotes, metrics] = await Promise.all([
    listQuotesForDealer(dealer.id, { query, status, page }),
    getQuoteMetrics(dealer.id),
  ]);

  return (
    <DashboardShell sidebar={<Sidebar items={dealerSidebarItems} title="Dealer Portal" subtitle="Quote tracking" />} navbar={<Navbar />}>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">Quotes</p>
          <h1 className="text-3xl font-bold">Dealer Quotes</h1>
          <p className="text-muted-foreground">Track sent quotes, conversions, and follow-up opportunities.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          <Metric label="Total" value={metrics.totalQuotes} />
          <Metric label="Sent" value={metrics.sentQuotes} />
          <Metric label="Accepted" value={metrics.acceptedQuotes} />
          <Metric label="Rejected" value={metrics.rejectedQuotes} />
          <Metric label="Conversion" value={`${metrics.conversionRate}%`} />
          <Metric label="Pipeline" value={formatCurrency(metrics.monthlyRevenuePipeline)} />
        </div>

        <div className="overflow-hidden rounded-2xl border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="px-4 py-3">Quote</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Expires</th>
              </tr>
            </thead>
            <tbody>
              {quotes.items.map((quote) => (
                <tr key={quote.id} className="border-t">
                  <td className="px-4 py-3 font-medium">{quote.quoteNumber}</td>
                  <td className="px-4 py-3">{quote.lead.fullName}</td>
                  <td className="px-4 py-3">{quote.status}</td>
                  <td className="px-4 py-3">{formatCurrency(Number(quote.total))}</td>
                  <td className="px-4 py-3">{quote.expiresAt.toDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}
