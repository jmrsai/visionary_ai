
"use client";

import type { User } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Lightbulb, ChevronRight, CheckCircle, Bell, Video, GraduationCap, Star } from "lucide-react";
import { ProgressCircle } from "@/components/ui/progress-circle";
import { AdherenceChart } from "./adherence/adherence-chart";
import { QuickGuide } from "@/components/quick-guide";


export function UserProfile({ user }: { user: User }) {
  const adherenceScore = 92; // NOTE: This is a mock score. A real app would calculate this from adherence data.

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
            <h1 className="text-3xl font-bold">Welcome, {user.displayName || user.email}!</h1>
            <p className="text-muted-foreground">
              Track your journey to better vision health.
            </p>
        </div>
        <Card className="p-2 px-4 bg-amber-300/20 border-amber-400">
            <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500" />
                <span className="text-lg font-bold text-amber-700 dark:text-amber-300">{user.points || 0}</span>
                <span className="text-sm text-muted-foreground">Points</span>
            </div>
        </Card>
      </div>


      <QuickGuide />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>AI Health Insights</CardTitle>
            <CardDescription>
              Connect your habits to your eye health with AI-powered insights.
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
                <Link href="/holistic-insights">
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
        
        <Card>
          <CardHeader>
            <CardTitle>Telemedicine</CardTitle>
            <CardDescription>
              Connect with eye care professionals through secure video calls.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center text-center p-6 bg-muted rounded-lg">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Video className="h-8 w-8 text-primary" />
              </div>
              <p className="text-muted-foreground mb-4">
                View upcoming appointments or start an instant consultation.
              </p>
              <Button asChild>
                <Link href="/telemedicine">
                  Go to Dashboard
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Education Center</CardTitle>
            <CardDescription>
              Learn about eye health, conditions, and preventative care.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center text-center p-6 bg-muted rounded-lg">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <p className="text-muted-foreground mb-4">
                Explore our AI-powered library of eye health articles.
              </p>
              <Button asChild>
                <Link href="/education">
                  Explore Topics
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Adherence Chart</CardTitle>
            <CardDescription>
              A visual summary of your medication adherence this week. (Data is currently mocked).
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
