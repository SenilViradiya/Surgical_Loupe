import { prisma } from "@/lib/prisma";
import { DealerOnboardingStatus, QuoteStatus, LeadStatus } from "@/lib/generated/prisma";
import { 
  DashboardKPIs, 
  DealerPerformanceMetric, 
  PerformanceChartsData, 
  DealerPerformanceFilters 
} from "./performance-types";

export async function getDealerPerformanceKPIs(filters?: DealerPerformanceFilters): Promise<DashboardKPIs> {
  const whereQuote: any = {};
  const whereLead: any = {};
  const whereDealer: any = {};

  if (filters?.dateRange) {
    whereQuote.createdAt = {
      gte: filters.dateRange.from,
      lte: filters.dateRange.to,
    };
    whereLead.createdAt = {
      gte: filters.dateRange.from,
      lte: filters.dateRange.to,
    };
  }

  const [
    totalDealers,
    activeDealers,
    totalLeads,
    totalQuotes,
    acceptedQuotesCount,
    revenueAggregate
  ] = await Promise.all([
    prisma.dealer.count(),
    prisma.dealer.count({ where: { onboardingStatus: "ACTIVE" } }),
    prisma.lead.count({ where: whereLead }),
    prisma.quote.count({ where: whereQuote }),
    prisma.quote.count({ 
      where: { 
        ...whereQuote, 
        status: { in: [QuoteStatus.ACCEPTED, QuoteStatus.CONVERTED] } 
      } 
    }),
    prisma.quote.aggregate({
      _sum: { total: true },
      where: { 
        ...whereQuote, 
        status: { in: [QuoteStatus.ACCEPTED, QuoteStatus.CONVERTED] } 
      }
    })
  ]);

  const totalRevenue = Number(revenueAggregate._sum.total || 0);
  const conversionRate = totalQuotes > 0 ? (acceptedQuotesCount / totalQuotes) * 100 : 0;
  const avgQuoteValue = acceptedQuotesCount > 0 ? totalRevenue / acceptedQuotesCount : 0;

  return {
    totalDealers,
    activeDealers,
    totalLeads,
    totalQuotes,
    acceptedQuotes: acceptedQuotesCount,
    conversionRate,
    totalRevenue,
    avgQuoteValue,
  };
}

export async function getDealerPerformanceTable(filters: DealerPerformanceFilters) {
  const { 
    search, 
    status, 
    dateRange, 
    page = 1, 
    limit = 10, 
    sortBy = "revenue", 
    sortOrder = "desc" 
  } = filters;

  const skip = (page - 1) * limit;

  // Base where for dealers
  const dealerWhere: any = {};
  if (search) {
    dealerWhere.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }
  if (status) {
    dealerWhere.onboardingStatus = status;
  }

  // To avoid N+1 and handle large datasets, we first fetch dealers
  const dealers = await prisma.dealer.findMany({
    where: dealerWhere,
    select: {
      id: true,
      name: true,
      email: true,
      onboardingStatus: true,
    },
    skip,
    take: limit,
  });

  const totalCount = await prisma.dealer.count({ where: dealerWhere });

  const dealerIds = dealers.map(d => d.id);

  // Fetch metrics in bulk for these specific dealers
  const [quoteMetrics, leadMetrics, activityMetrics] = await Promise.all([
    prisma.quote.groupBy({
      by: ['dealerId', 'status'],
      where: {
        dealerId: { in: dealerIds },
        ...(dateRange ? { createdAt: { gte: dateRange.from, lte: dateRange.to } } : {})
      },
      _count: { _all: true },
      _sum: { total: true }
    }),
    prisma.lead.groupBy({
      by: ['dealerId'],
      where: {
        dealerId: { in: dealerIds },
        ...(dateRange ? { createdAt: { gte: dateRange.from, lte: dateRange.to } } : {})
      },
      _count: { _all: true }
    }),
    prisma.activityLog.groupBy({
      by: ['userEmail'],
      where: {
        userEmail: { in: dealers.map(d => d.email) }
      },
      _max: { createdAt: true }
    })
  ]);

  // Aggregate the metrics
  const performance: DealerPerformanceMetric[] = dealers.map(dealer => {
    const dQuotes = quoteMetrics.filter(q => q.dealerId === dealer.id);
    const dLeads = leadMetrics.find(l => l.dealerId === dealer.id);
    const dActivity = activityMetrics.find(a => a.userEmail === dealer.email);

    const quotesCreated = dQuotes.reduce((acc, q) => acc + q._count._all, 0);
    const quotesAccepted = dQuotes
      .filter(q => ([QuoteStatus.ACCEPTED, QuoteStatus.CONVERTED] as QuoteStatus[]).includes(q.status))
      .reduce((acc, q) => acc + q._count._all, 0);
    
    const revenue = dQuotes
      .filter(q => ([QuoteStatus.ACCEPTED, QuoteStatus.CONVERTED] as QuoteStatus[]).includes(q.status))
      .reduce((acc, q) => acc + Number(q._sum.total || 0), 0);

    return {
      id: dealer.id,
      name: dealer.name,
      email: dealer.email,
      totalLeads: dLeads?._count._all || 0,
      quotesCreated,
      quotesAccepted,
      conversionRate: quotesCreated > 0 ? (quotesAccepted / quotesCreated) * 100 : 0,
      revenue,
      lastActivity: dActivity?._max.createdAt || null,
      status: dealer.onboardingStatus,
    };
  });

  // Sort if needed (Prisma doesn't allow ordering by aggregate in nested select easily without complex raw SQL)
  // Since we are paging at dealer level, we can sort the resulting page.
  // Realistically, sorting by revenue across ALL 10k dealers would require a different approach (materialized view or raw SQL)
  // For this implementation, we will keep it simple and sort the current page.
  performance.sort((a: any, b: any) => {
    const valA = a[sortBy];
    const valB = b[sortBy];
    if (sortOrder === "asc") return valA > valB ? 1 : -1;
    return valA < valB ? 1 : -1;
  });

  return {
    items: performance,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
  };
}

export async function getDealerAnalyticsCharts(): Promise<PerformanceChartsData> {
  const [revenueByDealer, leadConversionByDealer, revenueByMonth] = await Promise.all([
    // Top 10 Revenue
    prisma.quote.groupBy({
      by: ['dealerId'],
      where: { status: { in: [QuoteStatus.ACCEPTED, QuoteStatus.CONVERTED] } },
      _sum: { total: true },
      orderBy: { _sum: { total: 'desc' } },
      take: 10
    }),
    // Lead vs Quote
    prisma.dealer.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            leads: true,
            quotes: true,
          }
        },
        quotes: {
          where: { status: { in: [QuoteStatus.ACCEPTED, QuoteStatus.CONVERTED] } },
          select: { id: true }
        }
      },
      take: 10
    }),
    // Revenue Trend (Last 6 months)
    prisma.$queryRaw`
      SELECT 
        TO_CHAR(date_trunc('month', "createdAt"), 'Mon YYYY') as month,
        SUM(total::numeric) as revenue,
        date_trunc('month', "createdAt") as month_date
      FROM "Quote"
      WHERE status IN ('ACCEPTED', 'CONVERTED')
      AND "createdAt" >= NOW() - INTERVAL '6 months'
      GROUP BY 1, 3
      ORDER BY 3 ASC
    `
  ]);

  const dealerIds = revenueByDealer.map(r => r.dealerId);
  const dealers = await prisma.dealer.findMany({
    where: { id: { in: dealerIds } },
    select: { id: true, name: true }
  });

  const dealerRanking = revenueByDealer.map(r => ({
    name: dealers.find(d => d.id === r.dealerId)?.name || 'Unknown',
    revenue: Number(r._sum.total || 0)
  }));

  const conversionRanking = leadConversionByDealer.map(d => ({
    name: d.name,
    leads: d._count.leads,
    quotes: d._count.quotes,
    accepted: d.quotes.length
  }));

  const revenueTrend = (revenueByMonth as any[]).map(m => ({
    month: m.month,
    revenue: Number(m.revenue)
  }));

  return {
    revenueTrend,
    dealerRanking,
    conversionRanking,
    topDealers: dealerRanking.slice(0, 10),
  };
}

export async function getDealerDetails(dealerId: string) {
  const dealer = await prisma.dealer.findUnique({
    where: { id: dealerId },
    include: {
      _count: {
        select: {
          leads: true,
          quotes: true,
        }
      },
      quotes: {
        select: {
          status: true,
          total: true,
        }
      }
    }
  });

  if (!dealer) return null;

  const quotes = dealer.quotes;
  const accepted = quotes.filter(q => ([QuoteStatus.ACCEPTED, QuoteStatus.CONVERTED] as QuoteStatus[]).includes(q.status));
  const rejected = quotes.filter(q => q.status === QuoteStatus.REJECTED).length;
  const pending = quotes.filter(q => ([QuoteStatus.DRAFT, QuoteStatus.SENT, QuoteStatus.VIEWED] as QuoteStatus[]).includes(q.status)).length;
  const totalRevenue = accepted.reduce((acc, q) => acc + Number(q.total), 0);

  const recentActivity = await prisma.activityLog.findMany({
    where: { userEmail: dealer.email },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  const { quotes: dealerQuotes, ...dealerData } = dealer;

  return {
    ...dealerData,
    metrics: {
      totalLeads: dealer._count.leads,
      totalQuotes: dealer._count.quotes,
      acceptedQuotes: accepted.length,
      rejectedQuotes: rejected,
      pendingQuotes: pending,
      revenueGenerated: totalRevenue,
      recentActivity
    }
  };
}
