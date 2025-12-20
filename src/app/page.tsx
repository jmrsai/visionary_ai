

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

export default function Home() {
  return (
    <div className="flex flex-1 flex-col gap-4 md:gap-8">
      {/* Top Row Cards */}
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
            <CardDescription>Your weekly progress.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-4">
            <div className="text-center">
              <div className="text-6xl font-bold text-accent">92<span className="text-3xl text-muted-foreground">/100</span></div>
              <p className="text-xs text-muted-foreground mt-1">+2 since last week</p>
            </div>
            <div className="h-[100px] w-full">
              <VisionScoreChart />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row Cards */}
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
              An overview of your latest exercises and tests.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                    <Activity className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Completed: Focus Shift exercise.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      2 hours ago
                    </p>
                  </div>
                   <Badge variant="outline">+5 pts</Badge>
                </div>
                 <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                    <Activity className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      New personalized workout available.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      5 hours ago
                    </p>
                  </div>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
