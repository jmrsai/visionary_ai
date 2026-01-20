
"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  ChevronRight,
  Gamepad2,
  TrendingUp,
  Sparkles,
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
import { Badge } from "@/components/ui/badge";
import { IllustratedCard } from "@/components/ui/illustrated-card";
import { EyeGymIcon, CheckupIcon, ProfileIcon } from "@/components/icons";
import { QuickGuide } from "./quick-guide";
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from "@/firebase";
import { collection, query, orderBy, limit, doc } from "firebase/firestore";
import type { ActivityLog, CheckupReport, User as UserProfile } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { MOCK_TESTS, MOCK_EXERCISES } from "@/lib/data";
import { cn } from "@/lib/utils";

const activityIconMap: Record<string, React.ElementType> = {
  completed_exercise: EyeGymIcon,
  completed_test: CheckupIcon,
}

const getPersonalizedContent = (interests: string[] = []) => {
  const content: { title: string; items: any[] } = {
    title: "Personalized For You",
    items: []
  };

  if (interests.includes('strain_reduction')) {
    content.items.push(...MOCK_EXERCISES.filter(ex => ex.category === 'Strain Reduction'));
  }
  if (interests.includes('vision_improvement')) {
    content.items.push(...MOCK_EXERCISES.filter(ex => ex.category === 'Focus & Flexibility'));
  }
  if (interests.includes('preventative_care')) {
    content.items.push(...MOCK_TESTS.filter(t => t.category === 'Core Diagnostics'));
  }
  if (interests.includes('kids_health')) {
    content.items.push(...MOCK_TESTS.filter(t => t.category === "Kids' Game Zone"));
  }

  // Deduplicate and limit
  content.items = Array.from(new Set(content.items.map(item => item.id)))
    .map(id => content.items.find(item => item.id === id)).slice(0, 3);

  return content;
}


export function UserDashboard() {
  const { user: authUser } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => {
    if (!authUser?.uid || !firestore) return null;
    return doc(firestore, `users/${authUser.uid}`);
  }, [authUser?.uid, firestore]);

  const { data: userProfile } = useDoc<UserProfile>(userProfileRef);

  const activityLogRef = useMemoFirebase(() => {
    if (!authUser?.uid || !firestore) return null;
    return query(collection(firestore, `users/${authUser.uid}/rewards`), orderBy("timestamp", "desc"), limit(5));
  }, [authUser?.uid, firestore]);

  const { data: activityLogs, isLoading: isLoadingActivity } = useCollection<ActivityLog>(activityLogRef);

  const visionHistoryRef = useMemoFirebase(() => {
    if (!authUser?.uid || !firestore) return null;
    return query(collection(firestore, `users/${authUser.uid}/visionTestResults`), orderBy("date", "desc"), limit(7));
  }, [authUser?.uid, firestore]);

  const { data: visionHistory, isLoading: isLoadingVision } = useCollection<CheckupReport>(visionHistoryRef);

  const personalizedContent = getPersonalizedContent(userProfile?.interests);

  const latestScore = visionHistory?.[0]?.results.find(r => r.testId === 'visual-acuity')?.value || "N/A";

  const allGames = MOCK_TESTS.filter(t => t.category === "Kids' Game Zone");

  return (
    <div className="flex flex-1 flex-col gap-6 md:gap-10 pb-10">
      <QuickGuide />

      {/* Hero Section with AI Trend Prediction Placeholder */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-1 lg:col-span-3 glass-card border-primary/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 transition-opacity group-hover:opacity-10">
            <Sparkles className="w-64 h-64 text-primary animate-pulse" />
          </div>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                <TrendingUp className="w-3 h-3 mr-1" /> AI Vision Trend
              </Badge>
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">Welcome back, {authUser?.displayName?.split(' ')[0] || 'Visionary'}!</CardTitle>
            <CardDescription className="text-lg">
              Based on your last 7 check-ups, your visual acuity is showing a <span className="text-primary font-semibold">positive upward trend</span>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 hover:-translate-y-0.5">
              <Link href="/primary-check-up">Continue Your Journey <ChevronRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-card flex flex-col items-center justify-center p-6 text-center">
          <div className="text-5xl font-black text-primary mb-2">{latestScore}</div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Visual Acuity</p>
          <div className="mt-4 h-[60px] w-full">
            <VisionScoreChart history={visionHistory} isLoading={isLoadingVision} />
          </div>
        </Card>
      </div>

      {/* Gaming Universe Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Gamepad2 className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Gaming Universe</h2>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/tests?tab=kids-game-zone">Explore All <ChevronRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {allGames.map((game, index) => (
            <Link key={game.id} href={`/games/${game.id}`} className="group">
              <Card className={cn(
                "h-full glass-card border-muted/20 transition-all duration-300",
                "group-hover:border-primary/50 group-hover:shadow-2xl group-hover:shadow-primary/10 group-hover:-translate-y-1"
              )}>
                <CardHeader className="pb-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary mb-2 group-hover:scale-110 transition-transform">
                    <game.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{game.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-2">{game.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2 grid gap-6 md:grid-cols-2">
          <IllustratedCard
            title="Vision Hub"
            description="Complete your regular vision health check-ups and AI screenings."
            buttonText="Open Hub"
            href="/checkups"
            illustration={<CheckupIcon className="w-48 h-auto text-primary animate-float" />}
            className="glass-card hover:border-primary/50"
          />
          <IllustratedCard
            title="Eye Gym"
            description="Strengthen your eyes with guided exercises and circuits."
            buttonText="Go to Gym"
            href="/gym"
            illustration={<EyeGymIcon className="w-48 h-auto text-accent animate-float [animation-delay:1s]" />}
            className="glass-card hover:border-accent/50"
          />
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ProfileIcon className="w-5 h-5 text-primary" />
              Profile & Progress
            </CardTitle>
            <CardDescription>
              Review your activity and track your long-term progress.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="relative w-40 h-40 mb-6 flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse blur-2xl" />
              <ProfileIcon className="w-full h-auto text-primary relative z-10" />
            </div>
            <Button asChild className="w-full rounded-xl" variant="outline">
              <Link href="/profile">
                View My Profile
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest achievements and completed tasks.
              </CardDescription>
            </div>
            <Activity className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoadingActivity && <p className="text-muted-foreground">Loading activity...</p>}
              {!isLoadingActivity && activityLogs && activityLogs.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {activityLogs.map((log) => {
                    const Icon = activityIconMap[log.activityType] || Activity;
                    return (
                      <div key={log.id} className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-transparent hover:border-primary/20 transition-colors">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-black shadow-sm">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-semibold leading-none">
                            {log.activityName}
                          </p>
                          <p className="text-xs text-muted-foreground italic">
                            {log.timestamp ? formatDistanceToNow(new Date((log.timestamp as any).seconds * 1000), { addSuffix: true }) : ''}
                          </p>
                        </div>
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-none">+{log.pointsEarned} XP</Badge>
                      </div>
                    )
                  })}
                </div>
              ) : !isLoadingActivity && (
                <div className="text-center py-12 border-2 border-dashed rounded-2xl">
                  <Activity className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                  <p className="mt-4 text-muted-foreground">No recent activity. Go complete a test or exercise!</p>
                  <Button variant="link" asChild className="mt-2 text-primary">
                    <Link href="/primary-check-up">Start now</Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
