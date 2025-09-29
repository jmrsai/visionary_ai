
import {
  Activity,
  CalendarCheck,
  ChevronRight,
  Eye,
  HeartPulse,
  Sparkles,
  Target,
} from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VisionScoreChart } from "@/components/vision-score-chart";
import { MOCK_REMINDERS, MOCK_ACTIVITIES } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col gap-4 md:gap-8">
      {/* Top Row Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="animate-fade-in-up">
          <CardHeader className="pb-2">
             <div className="flex items-center gap-2 text-accent">
                <HeartPulse className="h-5 w-5" />
                <CardTitle className="text-lg">Vision Score</CardTitle>
             </div>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold">92<span className="text-3xl text-muted-foreground">/100</span></div>
            <p className="text-xs text-muted-foreground mt-1">+2 since last week</p>
          </CardContent>
        </Card>
        <Card className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">Daily Check-up</CardTitle>
                <CalendarCheck className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
                <CardDescription className="mb-4">
                    Complete your 5-minute daily vision health check-up.
                </CardDescription>
                <Button asChild className="w-full">
                    <Link href="/primary-check-up">Start Check-up</Link>
                </Button>
            </CardContent>
        </Card>
        <Card className="animate-fade-in-up lg:col-span-2" style={{ animationDelay: '200ms' }}>
          <CardHeader>
             <CardTitle>Weekly Progress</CardTitle>
            <CardDescription>
              You've completed 4/5 exercises this week.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[100px] w-full">
            <VisionScoreChart />
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-3 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <CardHeader className="flex flex-row items-center">
             <div className="grid gap-2">
              <CardTitle>Upcoming Reminders</CardTitle>
              <CardDescription>
                Stay on track with your eye care routine.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/reminders">
                View All
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="grid gap-4">
            {MOCK_REMINDERS.slice(0, 3).map((reminder) => (
              <div
                key={reminder.id}
                className="flex items-center gap-4 rounded-lg border p-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                  <CalendarCheck className="h-5 w-5" />
                </div>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    {reminder.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {reminder.time}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-4 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              An overview of your latest exercises and tests.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {MOCK_ACTIVITIES.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                    <Activity className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.description}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.timestamp}
                    </p>
                  </div>
                   {activity.score && (
                      <Badge variant="outline">{activity.score}</Badge>
                    )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
