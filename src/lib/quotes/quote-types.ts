import type { QuoteStatus } from "@/lib/generated/prisma";

export type QuoteProductType = "FRAME" | "LENS" | "HEADLIGHT" | "SERVICE" | "CUSTOM";

export type QuoteActorType = "ADMIN" | "DEALER" | "CUSTOMER" | "SYSTEM";

export interface QuoteLineItemInput {
  productType: QuoteProductType;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  sortOrder?: number;
  metadata?: Record<string, unknown>;
}

export interface QuoteLineItemSnapshot extends QuoteLineItemInput {}

export interface QuoteTotals {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}

export interface QuoteHistoryInput {
  event: string;
  status?: QuoteStatus | null;
  comment?: string | null;
  actorType?: QuoteActorType | null;
  actorId?: string | null;
  actorEmail?: string | null;
  metadata?: Record<string, unknown> | null;
}

export interface CreateQuoteInput {
  leadId: string;
  dealerId?: string;
  notes?: string;
  discount?: number;
  tax?: number;
  expiresAt?: Date;
  items?: QuoteLineItemInput[];
}

export interface QuoteResponseInput {
  quoteId: string;
  token: string;
  comment?: string;
}

export interface SendQuoteInput {
  quoteId: string;
  baseUrl: string;
  actorEmail?: string;
}

export interface QuoteMetrics {
  totalQuotes: number;
  sentQuotes: number;
  acceptedQuotes: number;
  rejectedQuotes: number;
  conversionRate: number;
  averageQuoteValue: number;
  monthlyRevenuePipeline: number;
}
