import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

import { formatCurrency } from "@/src/lib/quotes/quote-calculations";
import type { QuoteLineItemSnapshot } from "@/src/lib/quotes/quote-types";

interface Props {
  customerName: string;
  quoteNumber: string;
  dealerName: string;
  portalUrl: string;
  expiresAt: string;
  items: QuoteLineItemSnapshot[];
  totals: {
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
  };
}

export function QuoteSentEmail({
  customerName,
  quoteNumber,
  dealerName,
  portalUrl,
  expiresAt,
  items,
  totals,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>Your Surgical Loupe quote is ready</Preview>
      <Body style={{ backgroundColor: "#f6f9fc", fontFamily: "Arial, sans-serif" }}>
        <Container style={{ backgroundColor: "#ffffff", margin: "40px auto", padding: "32px", borderRadius: "12px", maxWidth: "640px" }}>
          <Heading>Quote ready for review</Heading>
          <Text>Hello {customerName},</Text>
          <Text>{dealerName} has prepared quote {quoteNumber} for your review.</Text>
          <Section>
            {items.map((item) => (
              <Text key={`${item.productId}-${item.sortOrder ?? 0}`}>
                <strong>{item.productName}:</strong> {formatCurrency(item.price)} x {item.quantity}
              </Text>
            ))}
            <Text><strong>Subtotal:</strong> {formatCurrency(totals.subtotal)}</Text>
            <Text><strong>Discount:</strong> {formatCurrency(totals.discount)}</Text>
            <Text><strong>Tax:</strong> {formatCurrency(totals.tax)}</Text>
            <Text><strong>Total:</strong> {formatCurrency(totals.total)}</Text>
            <Text><strong>Expires:</strong> {expiresAt}</Text>
          </Section>
          <Section style={{ marginTop: "24px" }}>
            <Button href={portalUrl}>View Quote</Button>
          </Section>
          <Text style={{ color: "#64748b" }}>Use the link above to accept or reject the quote securely.</Text>
        </Container>
      </Body>
    </Html>
  );
}