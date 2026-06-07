"use client";

import { useState } from "react";
import { PerformanceKPIs } from "@/components/admin/dealers/performance-kpi";
import { PerformanceCharts } from "@/components/admin/dealers/performance-charts";
import { PerformanceTable } from "@/components/admin/dealers/performance-table";
import { DealerDetailSheet } from "@/components/admin/dealers/dealer-detail-sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, RefreshCcw } from "lucide-react";
import { fetchDealerDetailsAction } from "./actions";
import {
    DashboardKPIs,
    PerformanceChartsData,
    DealerPerformanceMetric
} from "@/src/lib/dealers/performance-types";
import { toast } from "sonner";

interface PerformanceDashboardClientProps {
    kpis: DashboardKPIs;
    charts: PerformanceChartsData;
    table: {
        items: DealerPerformanceMetric[];
        totalCount: number;
        totalPages: number;
    };
}

export function PerformanceDashboardClient({ kpis, charts, table }: PerformanceDashboardClientProps) {
    const [selectedDealer, setSelectedDealer] = useState<any>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    const handleDealerClick = async (dealerId: string) => {
        setIsLoadingDetails(true);
        const result = await fetchDealerDetailsAction(dealerId);

        if (result.success) {
            setSelectedDealer(result.data);
            setIsSheetOpen(true);
        } else {
            toast.error(result.message || "Failed to load dealer details");
        }
        setIsLoadingDetails(false);
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dealer Performance</h1>
                    <p className="text-slate-500 mt-1">
                        Real-time analytics and business metrics across your dealer network.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="text-slate-600 border-slate-200">
                        <RefreshCcw className="h-4 w-4 mr-2" /> Refresh
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
                        <Download className="h-4 w-4 mr-2" /> Global Report
                    </Button>
                </div>
            </div>

            {/* KPIs */}
            <PerformanceKPIs kpis={kpis} />

            {/* Main Content Tabs */}
            <Tabs defaultValue="analytics" className="space-y-6">
                <TabsList className="bg-white border rounded-lg p-1 shadow-sm">
                    <TabsTrigger value="analytics" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600">
                        Network Analytics
                    </TabsTrigger>
                    <TabsTrigger value="table" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600">
                        Dealer Breakdown
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="analytics" className="space-y-6 outline-none">
                    <PerformanceCharts data={charts} />
                </TabsContent>

                <TabsContent value="table" className="outline-none">
                    <PerformanceTable
                        initialData={table}
                        onDealerClick={handleDealerClick}
                    />
                </TabsContent>
            </Tabs>

            {/* Detail Sheet */}
            <DealerDetailSheet
                dealer={selectedDealer}
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
            />
        </div>
    );
}
