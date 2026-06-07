import type { QuoteLineItemSnapshot, QuoteTotals } from "./quote-types";

export function roundCurrency(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculateSubtotal(items: QuoteLineItemSnapshot[]) {
  return roundCurrency(
    items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );
}

export function calculateQuoteTotals({
  items,
  discount = 0,
  tax = 0,
}: {
  items: QuoteLineItemSnapshot[];
  discount?: number;
  tax?: number;
}): QuoteTotals {
  const subtotal = calculateSubtotal(items);
  const normalizedDiscount = roundCurrency(Math.max(0, discount));
  const normalizedTax = roundCurrency(Math.max(0, tax));
  const total = roundCurrency(Math.max(0, subtotal - normalizedDiscount + normalizedTax));

  return {
    subtotal,
    discount: normalizedDiscount,
    tax: normalizedTax,
    total,
  };
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}
