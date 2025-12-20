
"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  Tooltip,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";

const MOCK_VISION_SCORE_HISTORY = [
  { "date": "Jan", "score": 80 },
  { "date": "Feb", "score": 82 },
  { "date": "Mar", "score": 85 },
  { "date": "Apr", "score": 84 },
  { "date": "May", "score": 88 },
  { "date": "Jun", "score": 90 },
  { "date": "Jul", "score": 92 }
];


const chartConfig = {
  score: {
    label: "Score",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;

export function VisionScoreChart() {
  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <ResponsiveContainer>
        <AreaChart
          data={MOCK_VISION_SCORE_HISTORY}
          margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="fillScore" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-score)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-score)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
          />
          <Tooltip
            cursor={{ fill: 'hsl(var(--muted))', opacity: 0.5 }}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Area
            dataKey="score"
            type="natural"
            fill="url(#fillScore)"
            stroke="var(--color-score)"
            stackId="a"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
