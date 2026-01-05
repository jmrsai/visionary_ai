
"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  ChevronRight,
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
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import type { ActivityLog } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

const activityIconMap: Record<string, React.ElementType> = {
    completed_exercise: EyeGymIcon,
    completed_test: CheckupIcon,
}

export function UserDashboard() {
  const [showQuickGuide, setShowQuickGuide] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();

  const activityLogRef = useMemoFirebase(() => {
    if (!user?.id || !firestore) return null;
    return query(collection(firestore, `users/${user.id}/rewards`), orderBy("timestamp", "desc"), limit(5));
  }, [user?.id, firestore]);

  const { data: activityLogs, isLoading: isLoadingActivity } = useCollection<ActivityLog>(activityLogRef);


  useEffect(() => {
    if (typeof window !== 'undefined') {
        const quickGuideShown = localStorage.getItem('visionary_quickGuideShown');
        if (!quickGuideShown) {
            setShowQuickGuide(true);
        }
    }
  }, []);

  const handleDismissQuickGuide = () => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('visionary_quickGuideShown', 'true');
    }
    setShowQuickGuide(false);
  };
  
  return (
    <div className="flex flex-1 flex-col gap-4 md:gap-8">
      {showQuickGuide && <QuickGuide onDismiss={handleDismissQuickGuide} />}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2 grid gap-6 md:grid-cols-2">
          <IllustratedCard 
            title="Daily Check-up"
            description="Complete your 5-minute daily vision health check-up."
            buttonText="Start Check-up"
            href="/primary-check-up"
            illustration={<CheckupIcon className="w-48 h-auto text-primary" />}
            className="animate-fade-in-up"
          />
           <IllustratedCard 
            title="Eye Gym"
            description="Strengthen your eyes with guided exercises and circuits."
            buttonText="Go to Gym"
            href="/gym"
            illustration={<EyeGymIcon className="w-48 h-auto text-accent" />}
            className="animate-fade-in-up"
            style={{ animationDelay: '200ms' }}
          />
        </div>
        
        <Card className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <CardHeader className="pb-2">
            <CardTitle>Vision Score</CardTitle>
            <CardDescription>Your progress over time. (Data is currently mocked)</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-4">
            <div className="text-center">
              <div className="text-6xl font-bold text-accent">92<span className="text-3xl text-muted-foreground">/100</span></div>
              <p className="text-xs text-muted-foreground mt-1">+2 since last month</p>
            </div>
            <div className="h-[100px] w-full">
              <VisionScoreChart />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-3 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
           <CardHeader>
             <CardTitle>Profile & Progress</CardTitle>
            <CardDescription>
              Review your activity and track your long-term progress.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <ProfileIcon className="w-40 h-auto text-primary mb-4"/>
            <Button asChild className="w-full">
              <Link href="/profile">
                View My Profile
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-4 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest achievements and completed tasks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                {isLoadingActivity && <p className="text-muted-foreground">Loading activity...</p>}
                {!isLoadingActivity && activityLogs && activityLogs.length > 0 ? (
                    activityLogs.map((log) => {
                        const Icon = activityIconMap[log.activityType] || Activity;
                        return (
                            <div key={log.id} className="flex items-center gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                                    <Icon className="h-5 w-5 text-secondary-foreground" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                    Completed: {log.activityName}.
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                    {log.timestamp ? formatDistanceToNow(new Date(log.timestamp), { addSuffix: true }) : ''}
                                    </p>
                                </div>
                                <Badge variant="outline">+{log.pointsEarned} pts</Badge>
                            </div>
                        )
                    })
                ) : !isLoadingActivity && (
                    <div className="text-center py-8 text-muted-foreground">
                        <Activity className="mx-auto h-12 w-12" />
                        <p className="mt-4">No recent activity. Go complete a test or exercise!</p>
                    </div>
                )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
