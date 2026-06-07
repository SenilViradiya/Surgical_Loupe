"use client";

import { useState, useTransition } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, MoreHorizontal, Eye } from "lucide-react";
import { formatCurrency } from "@/src/lib/quotes/quote-calculations";
import { DealerPerformanceMetric } from "@/src/lib/dealers/performance-types";
import { format } from "date-fns";
import { DealerOnboardingStatus } from "@/lib/generated/prisma";

interface PerformanceTableProps {
    initialData: {
        items: DealerPerformanceMetric[];
        totalCount: number;
        totalPages: number;
    };
    onDealerClick: (dealerId: string) => void;
    // In a real app, these would trigger server actions or router.push with searchParams
    // For this implementation, we will simulate the state for UI demonstration
}

export function PerformanceTable({ initialData, onDealerClick }: PerformanceTableProps) {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);

    // Simulation: In a real app, we'd use router.push or server actions
    const items = initialData.items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.email.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = status === "all" || item.status === status;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search dealers..."
                        className="pl-10 border-slate-200 focus:ring-indigo-500 rounded-lg"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="w-full sm:w-[150px] border-slate-200 rounded-lg">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            {Object.values(DealerOnboardingStatus).map(s => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className="text-slate-600 border-slate-200">
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow>
                            <TableHead className="font-semibold text-slate-700">Dealer</TableHead>
                            <TableHead className="font-semibold text-slate-700">Leads</TableHead>
                            <TableHead className="font-semibold text-slate-700">
                                <div className="flex items-center gap-1 cursor-pointer hover:text-indigo-600">
                                    Quotes <ArrowUpDown className="h-3 w-3" />
                                </div>
                            </TableHead>
                            <TableHead className="font-semibold text-slate-700">Conversion</TableHead>
                            <TableHead className="font-semibold text-slate-700 text-right">
                                <div className="flex items-center justify-end gap-1 cursor-pointer hover:text-indigo-600">
                                    Revenue <ArrowUpDown className="h-3 w-3" />
                                </div>
                            </TableHead>
                            <TableHead className="font-semibold text-slate-700">Status</TableHead>
                            <TableHead className="text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((dealer) => (
                            <TableRow key={dealer.id} className="hover:bg-slate-50/80 transition-colors">
                                <TableCell>
                                    <div>
                                        <div className="font-semibold text-slate-900">{dealer.name}</div>
                                        <div className="text-xs text-slate-500">{dealer.email}</div>
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">{dealer.totalLeads}</TableCell>
                                <TableCell>
                                    <div className="text-sm">
                                        <span className="font-medium text-slate-900">{dealer.quotesCreated}</span>
                                        <span className="text-slate-400 text-xs ml-1">total</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <div className="text-sm font-medium">{dealer.conversionRate.toFixed(1)}%</div>
                                        <div className="w-16 h-1 rounded-full bg-slate-100 overflow-hidden">
                                            <div
                                                className="h-full bg-indigo-500 rounded-full"
                                                style={{ width: `${Math.min(dealer.conversionRate, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-bold text-slate-900">
                                    {formatCurrency(dealer.revenue)}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={
                                            dealer.status === "ACTIVE"
                                                ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                                                : "text-slate-600 bg-slate-50 border-slate-200"
                                        }
                                    >
                                        {dealer.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-slate-400 hover:text-indigo-600"
                                        onClick={() => onOpenClick(dealer.id)}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Pagination */}
                <div className="p-4 flex items-center justify-between border-t border-slate-100 bg-slate-50/30">
                    <div className="text-sm text-slate-500">
                        Showing <span className="font-medium text-slate-900">{items.length}</span> of <span className="font-medium text-slate-900">{initialData.totalCount}</span> results
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-8 border-slate-200" disabled>
                            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 border-slate-200" disabled>
                            Next <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );

    function onOpenClick(id: string) {
        onDealerClick(id);
    }
}
