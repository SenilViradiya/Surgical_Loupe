import { z } from "zod";

export const quoteProductTypeSchema = z.enum(["FRAME", "LENS", "HEADLIGHT", "SERVICE", "CUSTOM"]);

export const quoteLineItemSchema = z.object({
  productType: quoteProductTypeSchema,
  productId: z.string().min(1),
  productName: z.string().min(1),
  price: z.coerce.number().min(0),
  quantity: z.coerce.number().int().positive(),
  sortOrder: z.coerce.number().int().nonnegative().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const createQuoteSchema = z.object({
  leadId: z.string().min(1),
  dealerId: z.string().min(1).optional(),
  notes: z.string().max(5_000).optional(),
  discount: z.coerce.number().min(0).default(0),
  tax: z.coerce.number().min(0).default(0),
  expiresAt: z.coerce.date().optional(),
  items: z.array(quoteLineItemSchema).optional(),
});

export const quoteResponseSchema = z.object({
  quoteId: z.string().min(1),
  token: z.string().min(8),
  comment: z.string().max(2_000).optional(),
});

export const sendQuoteSchema = z.object({
  quoteId: z.string().min(1),
  baseUrl: z.string().url(),
  actorEmail: z.string().email().optional(),
});

export const quoteListFiltersSchema = z.object({
  query: z.string().trim().optional(),
  status: z.string().trim().optional(),
  dealerId: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.enum(["createdAt", "expiresAt", "total", "status"]).default("createdAt"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
});

export const quoteTokenSchema = z.object({
  quoteId: z.string().min(1),
  token: z.string().min(8),
});