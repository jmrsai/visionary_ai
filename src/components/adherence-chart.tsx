
"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";

const adherenceData = [
  { day: "Mon", taken: 4, missed: 1 },
  { day: "Tue", taken: 5, missed: 0 },
  { day: "Wed", taken: 5, missed: 0 },
  { day: "Thu", taken: 3, missed: 2 },
  { day: "Fri", taken: 4, missed: 1 },
  { day: "Sat", taken: 5, missed: 0 },
  { day: "Sun", taken: 4, missed: 1 },
];

const chartConfig = {
  taken: {
    label: "Taken",
    color: "hsl(var(--primary))",
  },
  missed: {
    label: "Missed",
    color: "hsl(var(--destructive))",
  },
} satisfies ChartConfig;

export function AdherenceChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <ResponsiveContainer>
        <BarChart data={adherenceData} stackOffset="sign" margin={{ left: -20, right: 20 }}>
            <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <Tooltip content={<ChartTooltipContent indicator="dot" />} />
            <Bar dataKey="taken" fill="var(--color-taken)" stackId="a" radius={[8, 8, 0, 0]} />
            <Bar dataKey="missed" fill="var(--color-missed)" stackId="a" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
