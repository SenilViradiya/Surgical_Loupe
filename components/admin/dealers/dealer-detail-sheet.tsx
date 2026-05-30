"use client";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet";
import { formatCurrency } from "@/src/lib/quotes/quote-calculations";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Calendar,
    Mail,
    Phone,
    MapPin,
    TrendingUp,
    CheckCircle,
    XCircle,
    Clock,
    Activity
} from "lucide-react";
import { format } from "date-fns";

interface DealerDetailSheetProps {
    dealer: any; // Using any for brevity in this complex object, but it matches the getDealerDetails return type
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function DealerDetailSheet({ dealer, open, onOpenChange }: DealerDetailSheetProps) {
    if (!dealer) return null;

    const metrics = dealer.metrics;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
                <SheetHeader className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Badge variant={dealer.onboardingStatus === "ACTIVE" ? "default" : "secondary"}>
                            {dealer.onboardingStatus}
                        </Badge>
                        <span className="text-xs text-slate-500">ID: {dealer.id}</span>
                    </div>
                    <SheetTitle className="text-2xl font-bold text-slate-900">{dealer.name}</SheetTitle>
                    <SheetDescription className="text-slate-600">
                        Comprehensive performance overview and dealer details.
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-8 space-y-8 pb-10">
                    {/* Contact Info */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Contact Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <Mail className="h-4 w-4 text-slate-400" />
                                {dealer.email}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <Phone className="h-4 w-4 text-slate-400" />
                                {dealer.phone}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <Calendar className="h-4 w-4 text-slate-400" />
                                Joined {format(new Date(dealer.createdAt), "PPP")}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <MapPin className="h-4 w-4 text-slate-400" />
                                {dealer.city}, {dealer.state}
                            </div>
                        </div>
                    </section>

                    <Separator />

                    {/* Performance Summary */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Performance Metrics</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                                <p className="text-xs font-medium text-slate-500">Revenue Generated</p>
                                <p className="mt-1 text-xl font-bold text-slate-900">{formatCurrency(metrics.revenueGenerated)}</p>
                            </div>
                            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                                <p className="text-xs font-medium text-slate-500">Total Leads</p>
                                <p className="mt-1 text-xl font-bold text-slate-900">{metrics.totalLeads}</p>
                            </div>
                            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                                <p className="text-xs font-medium text-slate-500">Accepted Quotes</p>
                                <div className="mt-1 flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <p className="text-xl font-bold text-slate-900">{metrics.acceptedQuotes}</p>
                                </div>
                            </div>
                            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                                <p className="text-xs font-medium text-slate-500">Rejected / Pending</p>
                                <div className="mt-1 flex items-center gap-2">
                                    <XCircle className="h-4 w-4 text-rose-400" />
                                    <p className="text-xl font-bold text-slate-900">{metrics.rejectedQuotes} / {metrics.pendingQuotes}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <Separator />

                    {/* Recent Activity */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Recent Activity</h3>
                            <Activity className="h-4 w-4 text-slate-400" />
                        </div>
                        <div className="space-y-4">
                            {metrics.recentActivity.length > 0 ? (
                                metrics.recentActivity.map((log: any) => (
                                    <div key={log.id} className="flex gap-4">
                                        <div className="mt-1 flex flex-col items-center">
                                            <div className="rounded-full bg-slate-100 p-1">
                                                <Clock className="h-3 w-3 text-slate-500" />
                                            </div>
                                            <div className="h-full w-px bg-slate-100" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium text-slate-900">{log.action}</p>
                                            <p className="text-xs text-slate-500">{log.description}</p>
                                            <p className="text-[10px] text-slate-400">{format(new Date(log.createdAt), "MMM d, h:mm a")}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-slate-500 italic">No recent activity recorded.</p>
                            )}
                        </div>
                    </section>

                    <div className="pt-4">
                        <Separator className="mb-6" />
                        <div className="rounded-2xl bg-indigo-600 p-6 text-white overflow-hidden relative">
                            <TrendingUp className="absolute -right-4 -bottom-4 h-32 w-32 text-indigo-500/20 rotate-12" />
                            <div className="relative z-10">
                                <p className="text-indigo-100 text-sm font-medium">Conversion Efficiency</p>
                                <p className="text-3xl font-bold mt-1">
                                    {metrics.totalQuotes > 0 ? ((metrics.acceptedQuotes / metrics.totalQuotes) * 100).toFixed(1) : 0}%
                                </p>
                                <p className="text-indigo-100 text-xs mt-2">Overall lead-to-sale performance index</p>
                            </div>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
