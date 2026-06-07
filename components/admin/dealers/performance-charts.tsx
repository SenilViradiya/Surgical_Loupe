"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PerformanceChartsData } from "@/src/lib/dealers/performance-types";

const COLORS = ["#0ea5e9", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444", "#6366f1"];

interface PerformanceChartsProps {
    data: PerformanceChartsData;
}

export function PerformanceCharts({ data }: PerformanceChartsProps) {
    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Chart 1: Dealer Revenue Ranking */}
            <Card className="border-none shadow-md">
                <CardHeader>
                    <CardTitle>Dealer Revenue Ranking</CardTitle>
                    <CardDescription>Top revenue generating partners</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.dealerRanking}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="name"
                                stroke="#64748b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tick={{ dy: 10 }}
                            />
                            <YAxis
                                stroke="#64748b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `$${value / 1000}k`}
                            />
                            <Tooltip
                                cursor={{ fill: "transparent" }}
                                contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                            />
                            <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                                {data.dealerRanking.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Chart 2: Lead vs Quote Conversion */}
            <Card className="border-none shadow-md">
                <CardHeader>
                    <CardTitle>Lead vs Quote Conversion</CardTitle>
                    <CardDescription>Efficiency of the sales funnel by dealer</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.conversionRanking}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                cursor={{ fill: "#f8fafc" }}
                                contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                            />
                            <Legend verticalAlign="top" height={36} />
                            <Bar dataKey="leads" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Leads" />
                            <Bar dataKey="quotes" fill="#6366f1" radius={[4, 4, 0, 0]} name="Quotes" />
                            <Bar dataKey="accepted" fill="#10b981" radius={[4, 4, 0, 0]} name="Accepted" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Chart 3: Monthly Revenue Trend */}
            <Card className="border-none shadow-md">
                <CardHeader>
                    <CardTitle>Monthly Revenue Trend</CardTitle>
                    <CardDescription>Overall performance over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data.revenueTrend}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis
                                stroke="#64748b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `$${value / 1000}k`}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                            />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="#0ea5e9"
                                strokeWidth={3}
                                dot={{ r: 4, fill: "#0ea5e9", strokeWidth: 2, stroke: "#fff" }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Chart 4: Top 10 Dealers Performance */}
            <Card className="border-none shadow-md">
                <CardHeader>
                    <CardTitle>Market Share by Top Dealers</CardTitle>
                    <CardDescription>Revenue distribution among top performers</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={data.topDealers}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="name"
                                type="category"
                                stroke="#64748b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                width={100}
                            />
                            <Tooltip
                                cursor={{ fill: "#f8fafc" }}
                                contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                            />
                            <Bar dataKey="revenue" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
