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
    <div className="rounded-2xl border bg-white p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Lead Analytics
        </h2>

        <p className="text-muted-foreground text-sm">
          Monthly lead trends
        </p>
      </div>

      <div className="h-[350px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart
            data={data}
          >
            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="month"
            />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="leads"
              strokeWidth={3}
            />

            <Line
              type="monotone"
              dataKey="converted"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}