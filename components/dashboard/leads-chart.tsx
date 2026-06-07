"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface Props {
  data: {
    month: string;

    leads: number;

    converted: number;
  }[];
}

export function LeadsChart({
  data,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">
          Lead Analytics
        </h2>

        <p className="text-sm text-slate-500">
          Monthly lead trends
        </p>
      </div>

      <div className="h-[350px] w-full min-w-0 overflow-hidden">
        <ResponsiveContainer
          width="100%"
          height={350}
        >
          <LineChart
            data={data}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
            />

            <XAxis
              dataKey="month"
              stroke="#94a3b8"
            />

            <YAxis stroke="#94a3b8" />

            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                backgroundColor: "#fff",
              }}
            />

            <Line
              type="monotone"
              dataKey="leads"
              stroke="#334155"
              strokeWidth={2.5}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="converted"
              stroke="#94a3b8"
              strokeWidth={2.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
