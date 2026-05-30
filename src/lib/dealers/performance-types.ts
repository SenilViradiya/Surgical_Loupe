import { DealerOnboardingStatus, QuoteStatus } from "@/lib/generated/prisma";

export interface DashboardKPIs {
  totalDealers: number;
  activeDealers: number;
  totalLeads: number;
  totalQuotes: number;
  acceptedQuotes: number;
  conversionRate: number;
  totalRevenue: number;
  avgQuoteValue: number;
}

export interface DealerPerformanceMetric {
  id: string;
  name: string;
  email: string;
  totalLeads: number;
  quotesCreated: number;
  quotesAccepted: number;
  conversionRate: number;
  revenue: number;
  lastActivity: Date | null;
  status: DealerOnboardingStatus;
}

export interface RevenueTrendData {
  month: string;
  revenue: number;
}

export interface DealerRankingData {
  name: string;
  revenue: number;
}

export interface LeadQuoteConversionData {
  name: string;
  leads: number;
  quotes: number;
  accepted: number;
}

export interface PerformanceChartsData {
  revenueTrend: RevenueTrendData[];
  dealerRanking: DealerRankingData[];
  conversionRanking: LeadQuoteConversionData[];
  topDealers: DealerRankingData[];
}

export interface DealerPerformanceFilters {
  search?: string;
  status?: DealerOnboardingStatus;
  dateRange?: { from: Date; to: Date };
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
