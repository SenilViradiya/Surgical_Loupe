import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Users,
    TrendingUp,
    DollarSign,
    FileText,
    CheckCircle,
    BarChart3,
    Target,
    Activity
} from "lucide-react";
import { formatCurrency } from "@/src/lib/quotes/quote-calculations";
import { DashboardKPIs } from "@/src/lib/dealers/performance-types";

interface PerformanceKPIsProps {
    kpis: DashboardKPIs;
}

export function PerformanceKPIs({ kpis }: PerformanceKPIsProps) {
    const cards = [
        {
            title: "Total Dealers",
            value: kpis.totalDealers,
            icon: Users,
            description: `${kpis.activeDealers} active accounts`,
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
        {
            title: "Total Leads",
            value: kpis.totalLeads,
            icon: BarChart3,
            description: "Across all dealers",
            color: "text-purple-600",
            bg: "bg-purple-50",
        },
        {
            title: "Total Quotes",
            value: kpis.totalQuotes,
            icon: FileText,
            description: "Created quote documents",
            color: "text-orange-600",
            bg: "bg-orange-50",
        },
        {
            title: "Quotes Accepted",
            value: kpis.acceptedQuotes,
            icon: CheckCircle,
            description: "Completed conversions",
            color: "text-green-600",
            bg: "bg-green-50",
        },
        {
            title: "Conversion Rate",
            value: `${kpis.conversionRate.toFixed(1)}%`,
            icon: Target,
            description: "Accepted vs total quotes",
            color: "text-indigo-600",
            bg: "bg-indigo-50",
        },
        {
            title: "Generated Revenue",
            value: formatCurrency(kpis.totalRevenue),
            icon: DollarSign,
            description: "Total value of accepted quotes",
            color: "text-emerald-600",
            bg: "bg-emerald-50",
        },
        {
            title: "Avg Quote Value",
            value: formatCurrency(kpis.avgQuoteValue),
            icon: TrendingUp,
            description: "Revenue per accepted quote",
            color: "text-cyan-600",
            bg: "bg-cyan-50",
        },
        {
            title: "Active Status",
            value: "94%",
            icon: Activity,
            description: "Platform utilization index",
            color: "text-rose-600",
            bg: "bg-rose-50",
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
                <Card key={card.title} className="overflow-hidden border-none shadow-md transition-all hover:shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">
                            {card.title}
                        </CardTitle>
                        <div className={`rounded-lg p-2 ${card.bg}`}>
                            <card.icon className={`h-4 w-4 ${card.color}`} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{card.value}</div>
                        <p className="text-xs text-slate-500 mt-1">
                            {card.description}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
