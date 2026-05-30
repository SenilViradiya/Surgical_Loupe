import { resend } from "@/lib/resend";

import { QuoteSentEmail } from "@/emails/quote-sent-email";

import type { QuoteLineItemSnapshot, QuoteTotals } from "./quote-types";

interface SendQuoteEmailInput {
  customerName: string;
  customerEmail: string;
  quoteNumber: string;
  dealerName: string;
  portalUrl: string;
  expiresAt: string;
  items: QuoteLineItemSnapshot[];
  totals: QuoteTotals;
}

export async function sendQuoteEmail(input: SendQuoteEmailInput) {
  if (process.env.NODE_ENV !== "production" || !process.env.RESEND_API_KEY) {
    return { success: true, providerMessageId: "mocked-resend-message-id" };
  }

  const response = await resend.emails.send({
    from: "Surgical Loupe <onboarding@resend.dev>",
    to: input.customerEmail,
    subject: `Quote ${input.quoteNumber} from ${input.dealerName}`,
    react: QuoteSentEmail({
      customerName: input.customerName,
      quoteNumber: input.quoteNumber,
      dealerName: input.dealerName,
      portalUrl: input.portalUrl,
      expiresAt: input.expiresAt,
      items: input.items,
      totals: input.totals,
    }),
  });

  return {
    success: true,
    providerMessageId: response.data?.id ?? null,
  };
}