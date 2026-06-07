import { createHash, randomBytes } from "crypto";

import { Prisma, QuoteStatus, LeadStatus, NotificationType, UserRole } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-logger";
import { requireActionRole } from "@/lib/authorization";
import { createNotification } from "@/src/lib/notifications/notification-service";

import { assignDealer } from "@/lib/assign-dealer";

import { validateInventory } from "@/lib/inventory/inventory-service";
import { validateConfiguration } from "@/lib/compatibility/compatibility-service";

import { calculateQuoteTotals, formatCurrency } from "./quote-calculations";
import { createQuoteSchema, quoteListFiltersSchema, quoteResponseSchema, quoteTokenSchema, sendQuoteSchema } from "./quote-validators";
import type { CreateQuoteInput, QuoteLineItemSnapshot, QuoteMetrics, QuoteProductType, QuoteResponseInput, SendQuoteInput } from "./quote-types";
import { sendQuoteEmail } from "./quote-email";

const DEFAULT_EXPIRATION_DAYS = 14;

function buildQuoteNumber() {
  const datePart = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const randomPart = randomBytes(3).toString("hex").toUpperCase();
  return `QLT-${datePart}-${randomPart}`;
}

function buildCustomerToken() {
  return randomBytes(32).toString("base64url");
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function normalizeItems(items: QuoteLineItemSnapshot[]) {
  return [...items].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

function buildDefaultItems(lead: Awaited<ReturnType<typeof getLeadForQuote>>) {
  if (!lead) return [];

  const items: QuoteLineItemSnapshot[] = [
    {
      productType: "FRAME",
      productId: lead.configuration.frame.id,
      productName: lead.configuration.frame.name,
      price: lead.configuration.frame.price,
      quantity: 1,
      sortOrder: 1,
    },
    {
      productType: "LENS",
      productId: lead.configuration.lens.id,
      productName: lead.configuration.lens.name,
      price: lead.configuration.lens.price,
      quantity: 1,
      sortOrder: 2,
    },
  ];

  if (lead.configuration.headlight) {
    items.push({
      productType: "HEADLIGHT",
      productId: lead.configuration.headlight.id,
      productName: lead.configuration.headlight.name,
      price: lead.configuration.headlight.price,
      quantity: 1,
      sortOrder: 3,
    });
  }

  return items;
}

async function getLeadForQuote(leadId: string) {
  return prisma.lead.findUnique({
    where: { id: leadId },
    include: {
      dealer: true,
      configuration: {
        include: {
          frame: true,
          lens: true,
          headlight: true,
        },
      },
    },
  });
}

function isQuoteActionAllowed(status: QuoteStatus) {
  return status === QuoteStatus.SENT || status === QuoteStatus.VIEWED;
}

async function emitQuoteNotifications(params: {
  quote: { id: string; quoteNumber: string; sentToEmail: string; dealer: { id: string; email: string; name: string } };
  title: string;
  message: string;
  eventKey: string;
  ctaUrl: string;
}) {
  const dealerNotification = createNotification({
    recipientEmails: [params.quote.dealer.email],
    title: params.title,
    message: params.message,
    type: NotificationType.QUOTE,
    entityType: "Quote",
    entityId: params.quote.id,
    metadata: {
      quoteId: params.quote.id,
      quoteNumber: params.quote.quoteNumber,
      dealerId: params.quote.dealer.id,
      dealerEmail: params.quote.dealer.email,
    },
    eventKey: `${params.eventKey}:dealer`,
    deliveryChannels: ["IN_APP", "EMAIL"],
    ctaLabel: "Open quotes",
    ctaUrl: params.ctaUrl,
  });

  const adminNotification = createNotification({
    recipientRoles: [UserRole.ADMIN],
    title: params.title,
    message: params.message,
    type: NotificationType.QUOTE,
    entityType: "Quote",
    entityId: params.quote.id,
    metadata: {
      quoteId: params.quote.id,
      quoteNumber: params.quote.quoteNumber,
      dealerId: params.quote.dealer.id,
      dealerEmail: params.quote.dealer.email,
    },
    eventKey: `${params.eventKey}:admin`,
    deliveryChannels: ["IN_APP"],
    ctaLabel: "Open quotes",
    ctaUrl: "/admin/quotes",
  });

  await Promise.all([dealerNotification, adminNotification]);
}

export async function createQuote(values: CreateQuoteInput) {
  const parsed = createQuoteSchema.parse(values);
  const lead = await getLeadForQuote(parsed.leadId);

  if (!lead) {
    return { success: false, message: "Lead not found" };
  }

  if (!lead.dealerId && !parsed.dealerId) {
    return { success: false, message: "Lead is not assigned to a dealer" };
  }

  const dealerId = parsed.dealerId ?? lead.dealerId ?? undefined;

  if (!dealerId) {
    return { success: false, message: "Dealer is required" };
  }

  if (lead.dealerId && lead.dealerId !== dealerId) {
    return { success: false, message: "Lead belongs to a different dealer" };
  }

  const requestId = `quote_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const compatibility = await validateConfiguration({
    frameId: lead.configuration.frameId,
    lensId: lead.configuration.lensId,
    headlightId: lead.configuration.headlightId ?? null,
  }, requestId);

  if (!compatibility.success) {
    return compatibility;
  }

  const inventory = await validateInventory({
    frameId: lead.configuration.frameId,
    lensId: lead.configuration.lensId,
    headlightId: lead.configuration.headlightId ?? null,
  });

  if (!inventory.success) {
    return inventory;
  }

  const items = normalizeItems(parsed.items?.length ? parsed.items : buildDefaultItems(lead));

  if (!items.length) {
    return { success: false, message: "Quote must contain at least one item" };
  }

  const totals = calculateQuoteTotals({
    items,
    discount: parsed.discount,
    tax: parsed.tax,
  });

  const expiresAt = parsed.expiresAt ?? new Date(Date.now() + DEFAULT_EXPIRATION_DAYS * 24 * 60 * 60 * 1000);
  const customerToken = buildCustomerToken();

  const quote = await prisma.quote.create({
    data: {
      quoteNumber: buildQuoteNumber(),
      leadId: lead.id,
      dealerId,
      status: QuoteStatus.DRAFT,
      subtotal: new Prisma.Decimal(totals.subtotal),
      discount: new Prisma.Decimal(totals.discount),
      tax: new Prisma.Decimal(totals.tax),
      total: new Prisma.Decimal(totals.total),
      notes: parsed.notes ?? lead.notes ?? null,
      expiresAt,
      customerToken,
      customerTokenExpiresAt: expiresAt,
      sentToEmail: lead.email,
      items: {
        create: items.map((item) => ({
          productType: item.productType,
          productId: item.productId,
          productName: item.productName,
          price: new Prisma.Decimal(item.price),
          quantity: item.quantity,
          sortOrder: item.sortOrder ?? 0,
          metadata: item.metadata ? (item.metadata as Prisma.InputJsonValue) : undefined,
        })),
      },
      history: {
        create: {
          event: "QUOTE_CREATED",
          status: QuoteStatus.DRAFT,
          comment: parsed.notes ?? null,
          actorType: "DEALER",
          actorEmail: lead.dealer?.email ?? null,
        },
      },
    },
    include: {
      lead: {
        include: {
          configuration: {
            include: { frame: true, lens: true, headlight: true },
          },
        },
      },
      dealer: true,
      items: true,
      history: true,
      notifications: true,
    },
  });

  await logActivity({
    action: "QUOTE_CREATED",
    entityType: "Quote",
    entityId: quote.id,
    description: `Quote ${quote.quoteNumber} created for ${lead.fullName}`,
    userEmail: lead.dealer?.email ?? undefined,
  });

  return {
    success: true,
    quote,
    accessToken: customerToken,
    portalPath: `/quotes/${quote.id}?token=${customerToken}`,
  };
}

export async function sendQuote(values: SendQuoteInput) {
  const parsed = sendQuoteSchema.parse(values);
  const quote = await prisma.quote.findUnique({
    where: { id: parsed.quoteId },
    include: {
      lead: { include: { configuration: { include: { frame: true, lens: true, headlight: true } } } },
      dealer: true,
      items: true,
    },
  });

  if (!quote) {
    return { success: false, message: "Quote not found" };
  }

  if (quote.status === QuoteStatus.EXPIRED) {
    return { success: false, message: "Quote has expired" };
  }

  const portalUrl = `${parsed.baseUrl}/quotes/${quote.id}?token=${quote.customerToken}`;

  const emailItems: QuoteLineItemSnapshot[] = quote.items.map((item) => ({
    productType: item.productType as QuoteProductType,
    productId: item.productId,
    productName: item.productName,
    price: Number(item.price),
    quantity: item.quantity,
    sortOrder: item.sortOrder,
    metadata: (item.metadata as Record<string, unknown> | null) ?? undefined,
  }));

  const emailResult = await sendQuoteEmail({
    customerName: quote.lead.fullName,
    customerEmail: quote.sentToEmail,
    quoteNumber: quote.quoteNumber,
    dealerName: quote.dealer.name,
    portalUrl,
    expiresAt: quote.expiresAt.toISOString(),
    items: emailItems,
    totals: {
      subtotal: Number(quote.subtotal),
      discount: Number(quote.discount),
      tax: Number(quote.tax),
      total: Number(quote.total),
    },
  });

  const updated = await prisma.$transaction(async (tx) => {
    const updatedCount = await tx.quote.updateMany({
      where: { id: quote.id },
      data: {
        status: QuoteStatus.SENT,
        sentAt: new Date(),
      },
    });

    if (!updatedCount.count) {
      throw new Error("Quote not found during send");
    }

    await tx.quoteHistory.create({
      data: {
        quoteId: quote.id,
        event: "QUOTE_SENT",
        status: QuoteStatus.SENT,
        comment: `Sent by ${parsed.actorEmail ?? quote.dealer.email}`,
        actorType: "DEALER",
        actorEmail: parsed.actorEmail ?? quote.dealer.email,
      },
    });

    await tx.quoteNotification.create({
      data: {
        quoteId: quote.id,
        event: "QUOTE_SENT",
        channel: "email",
        deliveryStatus: emailResult.success ? "SENT" : "FAILED",
        recipient: quote.sentToEmail,
        providerMessageId: emailResult.providerMessageId ?? null,
        payload: {
          portalUrl,
          total: Number(quote.total),
        },
      },
    });

    const nextQuote = await tx.quote.findUnique({
      where: { id: quote.id },
      include: { lead: true, dealer: true, items: true },
    });

    if (!nextQuote) {
      throw new Error("Quote not found after send update");
    }

    return nextQuote;
  }, { timeout: 20000 });

  await logActivity({
    action: "QUOTE_SENT",
    entityType: "Quote",
    entityId: updated.id,
    description: `Quote ${updated.quoteNumber} sent to ${updated.sentToEmail}`,
    userEmail: parsed.actorEmail ?? undefined,
  });

  await emitQuoteNotifications({
    quote: {
      id: updated.id,
      quoteNumber: updated.quoteNumber,
      sentToEmail: updated.sentToEmail,
      dealer: {
        id: updated.dealerId,
        email: quote.dealer.email,
        name: quote.dealer.name,
      },
    },
    title: "Quote sent",
    message: `Quote ${updated.quoteNumber} has been sent to ${updated.sentToEmail}.`,
    eventKey: `QUOTE_SENT:${updated.id}`,
    ctaUrl: "/admin/quotes",
  });

  return {
    success: true,
    quote: updated,
    portalUrl,
    emailResult,
  };
}

async function getQuoteByToken(quoteId: string, token: string) {
  const parsed = quoteTokenSchema.parse({ quoteId, token });
  const quote = await prisma.quote.findUnique({
    where: { id: parsed.quoteId },
    include: {
      lead: { include: { configuration: { include: { frame: true, lens: true, headlight: true } } } },
      dealer: true,
      items: { orderBy: { sortOrder: "asc" } },
      history: { orderBy: { createdAt: "asc" } },
      notifications: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!quote || quote.customerToken !== parsed.token) {
    return null;
  }

  if (quote.customerTokenExpiresAt.getTime() < Date.now()) {
    return null;
  }

  return quote;
}

async function markViewed(quoteId: string, token: string) {
  const quote = await getQuoteByToken(quoteId, token);

  if (!quote) return null;

  if (quote.status === QuoteStatus.SENT) {
    await prisma.$transaction(async (tx) => {
      const viewedCount = await tx.quote.updateMany({
        where: { id: quote.id },
        data: {
          status: QuoteStatus.VIEWED,
          viewedAt: quote.viewedAt ?? new Date(),
        },
      });

      if (!viewedCount.count) {
        throw new Error("Quote not found during view tracking");
      }

      await tx.quoteHistory.create({
        data: {
          quoteId: quote.id,
          event: "QUOTE_VIEWED",
          status: QuoteStatus.VIEWED,
          actorType: "CUSTOMER",
          actorEmail: quote.sentToEmail,
        },
      });

      await tx.quoteNotification.create({
        data: {
          quoteId: quote.id,
          event: "QUOTE_VIEWED",
          channel: "email",
          deliveryStatus: "RECORDED",
          recipient: quote.sentToEmail,
        },
      });
    }, { timeout: 20000 });

    await emitQuoteNotifications({
      quote: {
        id: quote.id,
        quoteNumber: quote.quoteNumber,
        sentToEmail: quote.sentToEmail,
        dealer: {
          id: quote.dealerId,
          email: quote.dealer.email,
          name: quote.dealer.name,
        },
      },
      title: "Quote viewed",
      message: `Quote ${quote.quoteNumber} was viewed by the customer.`,
      eventKey: `QUOTE_VIEWED:${quote.id}`,
      ctaUrl: "/admin/quotes",
    });
  }

  return quote;
}

export async function acceptQuote(values: QuoteResponseInput) {
  const tStart = Date.now();

  const parsed = quoteResponseSchema.parse(values);
  const quote = await markViewed(parsed.quoteId, parsed.token);

  if (!quote) {

    return { success: false, message: "Quote not found or token invalid" };
  }



  if (quote.expiresAt.getTime() < Date.now()) {
    return { success: false, message: "Quote has expired" };
  }

  if (quote.status !== QuoteStatus.SENT && quote.status !== QuoteStatus.VIEWED) {

    return { success: false, message: "Quote cannot be accepted" };
  }

  const txStart = Date.now();
  const updated = await prisma.$transaction(async (tx) => {
    const uStart = Date.now();
    const convertedCount = await tx.quote.updateMany({
      where: { id: quote.id },
      data: {
        status: QuoteStatus.CONVERTED,
        convertedAt: new Date(),
      },
    });


    if (!convertedCount.count) {
      const actual = await prisma.quote.findUnique({ where: { id: quote.id } });

      throw new Error(`Quote not found during conversion (ID: ${quote.id})`);
    }

    const h1Start = Date.now();
    await tx.quoteHistory.create({
      data: {
        quoteId: quote.id,
        event: "QUOTE_CONVERTED",
        status: QuoteStatus.CONVERTED,
        actorType: "SYSTEM",
        actorEmail: quote.dealer.email,
      },
    });


    const lStart = Date.now();
    await tx.lead.update({
      where: { id: quote.leadId },
      data: { status: LeadStatus.CONVERTED },
    });


    const fStart = Date.now();
    const acceptedQuote = await tx.quote.findUnique({
      where: { id: quote.id },
      include: { lead: true, dealer: true },
    });


    if (!acceptedQuote) {
      throw new Error("Quote not found after acceptance update");
    }

    const h2Start = Date.now();
    await tx.quoteHistory.create({
      data: {
        quoteId: quote.id,
        event: "QUOTE_ACCEPTED",
        status: QuoteStatus.ACCEPTED,
        comment: parsed.comment ?? null,
        actorType: "CUSTOMER",
        actorEmail: quote.sentToEmail,
      },
    });


    const nStart = Date.now();
    await tx.quoteNotification.create({
      data: {
        quoteId: quote.id,
        event: "QUOTE_ACCEPTED",
        channel: "email",
        deliveryStatus: "RECORDED",
        recipient: quote.dealer.email,
        payload: { comment: parsed.comment ?? null },
      },
    });


    return acceptedQuote;
  }, { timeout: 20000 });



  await logActivity({
    action: "QUOTE_ACCEPTED",
    entityType: "Quote",
    entityId: updated.id,
    description: `Quote ${updated.quoteNumber} accepted and converted`,
    userEmail: quote.sentToEmail,
  });

  const ntfStart = Date.now();
  await emitQuoteNotifications({
    quote: {
      id: updated.id,
      quoteNumber: updated.quoteNumber,
      sentToEmail: updated.sentToEmail,
      dealer: {
        id: updated.dealerId,
        email: quote.dealer.email,
        name: quote.dealer.name,
      },
    },
    title: "Quote accepted",
    message: `Quote ${updated.quoteNumber} was accepted by ${quote.sentToEmail}.`,
    eventKey: `QUOTE_ACCEPTED:${updated.id}`,
    ctaUrl: "/admin/quotes",
  });



  return { success: true, quoteId: updated.id };
}

export async function rejectQuote(values: QuoteResponseInput) {
  const parsed = quoteResponseSchema.parse(values);
  const quote = await markViewed(parsed.quoteId, parsed.token);

  if (!quote) {
    return { success: false, message: "Quote not found or token invalid" };
  }

  if (quote.expiresAt.getTime() < Date.now()) {
    return { success: false, message: "Quote has expired" };
  }

  if (quote.status !== QuoteStatus.SENT && quote.status !== QuoteStatus.VIEWED) {
    return { success: false, message: "Quote cannot be rejected" };
  }

  await prisma.$transaction(async (tx) => {
    const rejectedCount = await tx.quote.updateMany({
      where: { id: quote.id },
      data: {
        status: QuoteStatus.REJECTED,
        rejectedAt: new Date(),
      },
    });

    if (!rejectedCount.count) {
      throw new Error("Quote not found during rejection");
    }

    await tx.quoteHistory.create({
      data: {
        quoteId: quote.id,
        event: "QUOTE_REJECTED",
        status: QuoteStatus.REJECTED,
        comment: parsed.comment ?? null,
        actorType: "CUSTOMER",
        actorEmail: quote.sentToEmail,
      },
    });

    await tx.quoteNotification.create({
      data: {
        quoteId: quote.id,
        event: "QUOTE_REJECTED",
        channel: "email",
        deliveryStatus: "RECORDED",
        recipient: quote.dealer.email,
        payload: { comment: parsed.comment ?? null },
      },
    });
  }, { timeout: 20000 });

  await logActivity({
    action: "QUOTE_REJECTED",
    entityType: "Quote",
    entityId: quote.id,
    description: `Quote ${quote.quoteNumber} rejected`,
    userEmail: quote.sentToEmail,
  });

  await emitQuoteNotifications({
    quote: {
      id: quote.id,
      quoteNumber: quote.quoteNumber,
      sentToEmail: quote.sentToEmail,
      dealer: {
        id: quote.dealerId,
        email: quote.dealer.email,
        name: quote.dealer.name,
      },
    },
    title: "Quote rejected",
    message: `Quote ${quote.quoteNumber} was rejected by ${quote.sentToEmail}.`,
    eventKey: `QUOTE_REJECTED:${quote.id}`,
    ctaUrl: "/admin/quotes",
  });

  return { success: true, quoteId: quote.id };
}

export async function expireQuote(quoteId?: string) {
  const where = quoteId
    ? { id: quoteId }
    : {
        status: { in: [QuoteStatus.SENT, QuoteStatus.VIEWED] },
        expiresAt: { lt: new Date() },
      };

  const quotes = await prisma.quote.findMany({
    where,
    include: { dealer: true },
  });

  let expired = 0;

  for (const quote of quotes) {
    if (quote.status === QuoteStatus.EXPIRED || quote.expiresAt.getTime() > Date.now()) {
      continue;
    }

    await prisma.$transaction(async (tx) => {
      const expiredCount = await tx.quote.updateMany({
        where: { id: quote.id },
        data: {
          status: QuoteStatus.EXPIRED,
        },
      });

      if (!expiredCount.count) {
        throw new Error("Quote not found during expiration");
      }

      await tx.quoteHistory.create({
        data: {
          quoteId: quote.id,
          event: "QUOTE_EXPIRED",
          status: QuoteStatus.EXPIRED,
          actorType: "SYSTEM",
          actorEmail: quote.dealer.email,
        },
      });

      await tx.quoteNotification.create({
        data: {
          quoteId: quote.id,
          event: "QUOTE_EXPIRED",
          channel: "email",
          deliveryStatus: "RECORDED",
          recipient: quote.sentToEmail,
        },
      });
    }, { timeout: 20000 });

    await logActivity({
      action: "QUOTE_EXPIRED",
      entityType: "Quote",
      entityId: quote.id,
      description: `Quote ${quote.quoteNumber} expired`,
      userEmail: quote.dealer.email,
    });

    await emitQuoteNotifications({
      quote: {
        id: quote.id,
        quoteNumber: quote.quoteNumber,
        sentToEmail: quote.sentToEmail,
        dealer: {
          id: quote.dealerId,
          email: quote.dealer.email,
          name: quote.dealer.name,
        },
      },
      title: "Quote expired",
      message: `Quote ${quote.quoteNumber} expired on ${quote.expiresAt.toDateString()}.`,
      eventKey: `QUOTE_EXPIRED:${quote.id}`,
      ctaUrl: "/admin/quotes",
    });

    expired += 1;
  }

  return { success: true, expired };
}

export async function convertQuote(quoteId: string) {
  const quote = await prisma.quote.findUnique({ where: { id: quoteId }, include: { lead: true } });

  if (!quote) {
    return { success: false, message: "Quote not found" };
  }

  if (quote.status !== QuoteStatus.ACCEPTED && quote.status !== QuoteStatus.CONVERTED) {
    return { success: false, message: "Quote must be accepted before conversion" };
  }

  await prisma.$transaction(async (tx) => {
    const convertedCount = await tx.quote.updateMany({
      where: { id: quote.id },
      data: {
        status: QuoteStatus.CONVERTED,
        convertedAt: new Date(),
      },
    });

    if (!convertedCount.count) {
      throw new Error("Quote not found during conversion");
    }

    await tx.quoteHistory.create({
      data: {
        quoteId: quote.id,
        event: "QUOTE_CONVERTED",
        status: QuoteStatus.CONVERTED,
        actorType: "SYSTEM",
      },
    });

    await tx.lead.update({
      where: { id: quote.leadId },
      data: { status: LeadStatus.CONVERTED },
    });
  }, { timeout: 20000 });

  return { success: true };
}

export async function listQuotesForDealer(dealerId: string, filters: Record<string, unknown> = {}) {
  const parsed = quoteListFiltersSchema.parse(filters);
  const where = {
    dealerId,
    ...(parsed.status ? { status: parsed.status as QuoteStatus } : {}),
    ...(parsed.query
      ? {
          OR: [
            { quoteNumber: { contains: parsed.query, mode: "insensitive" as const } },
            { sentToEmail: { contains: parsed.query, mode: "insensitive" as const } },
            { lead: { fullName: { contains: parsed.query, mode: "insensitive" as const } } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.quote.findMany({
      where,
      include: {
        lead: true,
        dealer: true,
        items: true,
        history: { orderBy: { createdAt: "desc" }, take: 3 },
      },
      orderBy: { [parsed.sortBy]: parsed.sortDir },
      skip: (parsed.page - 1) * parsed.pageSize,
      take: parsed.pageSize,
    }),
    prisma.quote.count({ where }),
  ]);

  return { items, total, page: parsed.page, pageSize: parsed.pageSize };
}

export async function listQuotesForAdmin(filters: Record<string, unknown> = {}) {
  const parsed = quoteListFiltersSchema.parse(filters);
  const where = {
    ...(parsed.status ? { status: parsed.status as QuoteStatus } : {}),
    ...(parsed.dealerId ? { dealerId: parsed.dealerId } : {}),
    ...(parsed.query
      ? {
          OR: [
            { quoteNumber: { contains: parsed.query, mode: "insensitive" as const } },
            { sentToEmail: { contains: parsed.query, mode: "insensitive" as const } },
            { lead: { fullName: { contains: parsed.query, mode: "insensitive" as const } } },
            { dealer: { name: { contains: parsed.query, mode: "insensitive" as const } } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.quote.findMany({
      where,
      include: {
        lead: true,
        dealer: true,
        items: true,
        history: { orderBy: { createdAt: "desc" }, take: 5 },
      },
      orderBy: { [parsed.sortBy]: parsed.sortDir },
      skip: (parsed.page - 1) * parsed.pageSize,
      take: parsed.pageSize,
    }),
    prisma.quote.count({ where }),
  ]);

  return { items, total, page: parsed.page, pageSize: parsed.pageSize };
}

export async function getQuoteMetrics(dealerId?: string): Promise<QuoteMetrics> {
  const where = dealerId ? { dealerId } : {};
  const [totalQuotes, sentQuotes, acceptedQuotes, rejectedQuotes, aggregate] = await Promise.all([
    prisma.quote.count({ where }),
    prisma.quote.count({ where: { ...where, status: QuoteStatus.SENT } }),
    prisma.quote.count({ where: { ...where, status: QuoteStatus.ACCEPTED } }),
    prisma.quote.count({ where: { ...where, status: QuoteStatus.REJECTED } }),
    prisma.quote.aggregate({
      where,
      _avg: { total: true },
      _sum: { total: true },
    }),
  ]);

  const averageQuoteValue = Number(aggregate._avg.total ?? 0);
  const monthlyRevenuePipeline = Number(aggregate._sum.total ?? 0);
  const conversionRate = sentQuotes > 0 ? Math.round((acceptedQuotes / sentQuotes) * 1000) / 10 : 0;

  return {
    totalQuotes,
    sentQuotes,
    acceptedQuotes,
    rejectedQuotes,
    conversionRate,
    averageQuoteValue,
    monthlyRevenuePipeline,
  };
}

export async function getQuoteDetail(quoteId: string, token?: string) {
  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    include: {
      lead: { include: { configuration: { include: { frame: true, lens: true, headlight: true } } } },
      dealer: true,
      items: { orderBy: { sortOrder: "asc" } },
      history: { orderBy: { createdAt: "desc" } },
      notifications: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!quote) return null;

  if (!token) return null;

  if (quote.customerToken !== token) return null;

  if (quote.customerTokenExpiresAt.getTime() <= Date.now()) return null;

  await markViewed(quoteId, token);

  return quote;
}

export { formatCurrency };
