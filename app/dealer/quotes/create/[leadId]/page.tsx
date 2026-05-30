import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import { DashboardShell } from "@/components/layouts/dashboard-shell";
import { Sidebar } from "@/components/layouts/sidebar";
import { Navbar } from "@/components/layouts/navbar";
import { dealerSidebarItems } from "@/constants/dealer-sidebar";

import { QuoteCreateForm } from "@/components/quotes/quote-create-form";

export default async function DealerCreateQuotePage({ params }: { params: Promise<{ leadId: string }> }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { leadId } = await params;

  const dealer = await prisma.dealer.findUnique({ where: { email: session.user.email! } });

  if (!dealer) {
    redirect("/dealer");
  }

  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: {
      dealer: true,
      configuration: { include: { frame: true, lens: true, headlight: true } },
    },
  });

  if (!lead || lead.dealerId !== dealer.id) {
    return notFound();
  }

  const items = [
    { productType: "FRAME" as const, productId: lead.configuration.frame.id, productName: lead.configuration.frame.name, price: lead.configuration.frame.price, quantity: 1, sortOrder: 1 },
    { productType: "LENS" as const, productId: lead.configuration.lens.id, productName: lead.configuration.lens.name, price: lead.configuration.lens.price, quantity: 1, sortOrder: 2 },
    ...(lead.configuration.headlight
      ? [{ productType: "HEADLIGHT" as const, productId: lead.configuration.headlight.id, productName: lead.configuration.headlight.name, price: lead.configuration.headlight.price, quantity: 1, sortOrder: 3 }]
      : []),
  ];

  return (
    <DashboardShell sidebar={<Sidebar items={dealerSidebarItems} title="Dealer Portal" subtitle="Quote workflow" />} navbar={<Navbar />}>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">Quote workflow</p>
          <h1 className="text-3xl font-bold">Create quote</h1>
          <p className="text-muted-foreground">Review the lead, tune pricing, and send a secure quote link to the customer.</p>
        </div>

        <QuoteCreateForm leadId={lead.id} leadName={lead.fullName} dealerName={dealer.name} items={items} defaultNotes={lead.notes ?? ""} />
      </div>
    </DashboardShell>
  );
}