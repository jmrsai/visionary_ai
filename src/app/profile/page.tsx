"use client";

import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Lightbulb, ChevronRight } from "lucide-react";

const visionScoreHistory = [
  { month: "Jan", score: 80 },
  { month: "Feb", score: 82 },
  { month: "Mar", score: 85 },
  { month: "Apr", score: 84 },
  { month: "May", score: 88 },
  { month: "Jun", score: 90 },
  { month: "Jul", score: 92 },
];
const visionScoreChartConfig = {
  score: {
    label: "Score",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const exerciseHistory = [
  { day: "Mon", minutes: 15 },
  { day: "Tue", minutes: 20 },
  { day: "Wed", minutes: 10 },
  { day: "Thu", minutes: 25 },
  { day: "Fri", minutes: 15 },
  { day: "Sat", minutes: 30 },
  { day: "Sun", minutes: 5 },
];
const exerciseChartConfig = {
  minutes: {
    label: "Minutes",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Profile & Progress</h1>
        <p className="text-muted-foreground">
          Track your journey to better vision health.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>AI Health Insights</CardTitle>
                <CardDescription>
                Discover AI-powered insights connecting your habits to your eye health.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center justify-center text-center p-6 bg-muted rounded-lg">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                        <Lightbulb className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-muted-foreground mb-4">Let our AI analyze your activity and provide personalized recommendations.</p>
                    <Button asChild>
                        <Link href="/profile/insights">
                            Generate My Insights <ChevronRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Vision Score Over Time</CardTitle>
            <CardDescription>
              Your vision score progress over the last 7 months.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={visionScoreChartConfig} className="h-[250px] w-full">
              <ResponsiveContainer>
                <LineChart data={visionScoreHistory} margin={{ left: -20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    domain={[75, 100]}
                  />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Line
                    dataKey="score"
                    type="monotone"
                    stroke="var(--color-score)"
                    strokeWidth={2}
                    dot={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Exercise Consistency</CardTitle>
            <CardDescription>
              Total minutes of eye exercises this week.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={exerciseChartConfig} className="h-[250px] w-full">
              <ResponsiveContainer>
                <BarChart data={exerciseHistory} margin={{ left: -20, right: 20 }}>
                <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                  <Bar dataKey="minutes" fill="var(--color-minutes)" radius={8} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
