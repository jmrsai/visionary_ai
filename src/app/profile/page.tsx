
"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
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
import { Lightbulb, ChevronRight, CheckCircle } from "lucide-react";
import { AdherenceChart } from "@/components/adherence-chart";
import { ProgressCircle } from "@/components/ui/progress-circle";

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
  const adherenceScore = 92; // Mock score

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
              Discover AI-powered insights connecting your habits to your eye
              health.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center text-center p-6 bg-muted rounded-lg">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Lightbulb className="h-8 w-8 text-primary" />
              </div>
              <p className="text-muted-foreground mb-4">
                Let our AI analyze your activity and provide personalized
                recommendations.
              </p>
              <Button asChild>
                <Link href="/profile/insights">
                  Generate My Insights{" "}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Medication Adherence
            </CardTitle>
            <CardDescription>
              Your adherence score for the last 7 days.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <div className="relative">
              <ProgressCircle value={adherenceScore} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold">{adherenceScore}%</span>
                  <span className="text-xs text-muted-foreground">Adherence</span>
              </div>
            </div>
             <Button asChild variant="outline" className="w-full">
                <Link href="/profile/adherence">
                    View Full History <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>
              Total minutes of eye exercises and adherence this week.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdherenceChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
