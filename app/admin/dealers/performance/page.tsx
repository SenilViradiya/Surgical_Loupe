import { Metadata } from "next";
import {
    getDealerPerformanceKPIs,
    getDealerAnalyticsCharts,
    getDealerPerformanceTable
} from "@/src/lib/dealers/performance-service";
import { PerformanceDashboardClient } from "./client";
import { requireActionRole } from "@/lib/authorization";
import { UserRole } from "@/lib/generated/prisma";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
    title: "Dealer Performance Dashboard | Surgical Loupe CRM",
    description: "Monitor dealer performance and business metrics.",
};

export default async function DealerPerformancePage() {
    await requireActionRole([UserRole.ADMIN]);

    // Parallel fetching on server
    const [kpis, charts, table] = await Promise.all([
        getDealerPerformanceKPIs(),
        getDealerAnalyticsCharts(),
        getDealerPerformanceTable({ page: 1, limit: 20 })
    ]);

    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<DashboardSkeleton />}>
                <PerformanceDashboardClient
                    kpis={kpis}
                    charts={charts}
                    table={table}
                />
            </Suspense>
        </div>
    );
}

function DashboardSkeleton() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full rounded-xl" />
                ))}
            </div>
            <div className="space-y-4">
                <Skeleton className="h-10 w-64 rounded-lg" />
                <div className="grid gap-6 md:grid-cols-2">
                    <Skeleton className="h-[400px] w-full rounded-xl" />
                    <Skeleton className="h-[400px] w-full rounded-xl" />
                </div>
            </div>
        </div>
    );
}
