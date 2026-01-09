
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
import { MOCK_VISION_SCORE_HISTORY } from "@/lib/data";
import type { CheckupReport } from "@/lib/types";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";


const chartConfig = {
  score: {
    label: "Score",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;

interface VisionScoreChartProps {
    history: CheckupReport[] | null;
    isLoading: boolean;
}

export function VisionScoreChart({ history, isLoading }: VisionScoreChartProps) {

  if (isLoading) {
      return (
          <div className="flex items-center justify-center h-full">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
      )
  }

  if (!history || history.length === 0) {
      return (
          <div className="flex items-center justify-center h-full">
              <p className="text-sm text-muted-foreground">No data available.</p>
          </div>
      )
  }
  
  const chartData = history.map(report => {
      const score2020 = parseInt(report.results.find(r => r.testId === 'visual-acuity')?.value.split('/')[1] || '0', 10);
      return {
          date: format(new Date(report.date), "MMM d"),
          score: 100 - (score2020 - 20), // Simple conversion for chart
      }
  }).reverse(); // Reverse to show chronological order


  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <ResponsiveContainer>
        <AreaChart
          data={chartData}
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
