import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

import { formatCurrency } from "./quote-calculations";
import type { QuoteLineItemSnapshot, QuoteTotals } from "./quote-types";

interface QuotePdfInput {
  companyName: string;
  quoteNumber: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    city: string;
    state: string;
  };
  dealer: {
    name: string;
    email: string;
    phone: string;
  };
  items: QuoteLineItemSnapshot[];
  totals: QuoteTotals;
  expiresAt: string;
  notes?: string | null;
}

export async function generateQuotePdfBytes(input: QuotePdfInput) {
  const doc = await PDFDocument.create();
  let page = doc.addPage([612, 792]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);

  const left = 48;
  let y = 740;

  const drawText = (text: string, options: { size?: number; fontFace?: typeof font; color?: [number, number, number] } = {}) => {
    page.drawText(text, {
      x: left,
      y,
      size: options.size ?? 11,
      font: options.fontFace ?? font,
      color: options.color ? rgb(options.color[0], options.color[1], options.color[2]) : rgb(0.12, 0.16, 0.22),
    });
    y -= options.size ? options.size + 8 : 18;
  };

  const formatPdfCurrency = (value: number) => formatCurrency(value).replace("₹", "INR ");

  const ensureSpace = (height = 24) => {
    if (y > height) return;

    page = doc.addPage([612, 792]);
    y = 740;
    page.drawText("Surgical Loupe Quote", { x: left, y, size: 22, font: boldFont });
    y -= 28;
  };

  page.drawText(input.companyName, { x: left, y, size: 22, font: boldFont });
  y -= 28;
  drawText(`Quote #${input.quoteNumber}`, { size: 14, fontFace: boldFont });
  drawText(`Expires: ${input.expiresAt}`, { size: 11 });

  y -= 8;
  drawText("Customer Details", { size: 13, fontFace: boldFont });
  drawText(`${input.customer.fullName}`);
  drawText(`${input.customer.email}`);
  drawText(`${input.customer.phone}`);
  drawText(`${input.customer.city}, ${input.customer.state}`);

  y -= 8;
  drawText("Dealer Details", { size: 13, fontFace: boldFont });
  drawText(`${input.dealer.name}`);
  drawText(`${input.dealer.email}`);
  drawText(`${input.dealer.phone}`);

  y -= 8;
  drawText("Items", { size: 13, fontFace: boldFont });
  input.items.forEach((item, index) => {
    ensureSpace(90);
    drawText(`${index + 1}. ${item.productName}`, { fontFace: boldFont });
    drawText(`Type: ${item.productType}`);
    drawText(`Qty: ${item.quantity}`);
    drawText(`Price: ${formatPdfCurrency(item.price)}`);
  });

  if (input.notes) {
    ensureSpace(100);
    y -= 4;
    drawText("Notes", { size: 13, fontFace: boldFont });
    drawText(input.notes);
  }

  ensureSpace(100);
  y -= 4;
  drawText("Summary", { size: 13, fontFace: boldFont });
  drawText(`Subtotal: ${formatPdfCurrency(input.totals.subtotal)}`);
  drawText(`Discount: ${formatPdfCurrency(input.totals.discount)}`);
  drawText(`Tax: ${formatPdfCurrency(input.totals.tax)}`);
  drawText(`Total: ${formatPdfCurrency(input.totals.total)}`, { size: 13, fontFace: boldFont });

  return await doc.save();
}