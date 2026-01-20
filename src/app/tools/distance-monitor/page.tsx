
"use client";

import DistanceMonitor from "@/components/tools/distance-monitor";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function DistanceMonitorPage() {
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Button asChild variant="ghost" size="icon" className="rounded-full">
                    <Link href="/tools">
                        <ChevronLeft className="h-6 w-6" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Distance Monitor</h1>
                    <p className="text-muted-foreground">AI-powered proximity protection.</p>
                </div>
            </div>

            <div className="mt-8">
                <DistanceMonitor />
            </div>

            <div className="grid gap-6 md:grid-cols-2 mt-8">
                <div className="p-6 rounded-2xl bg-muted/50 border border-border/50">
                    <h3 className="font-bold text-lg mb-2">The Danger of Close Proximity</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        Holding digital devices too close to your eyes for extended periods causes excessive strain on the eye's focusing system, which is a primary driver for myopia (nearsightedness) progression, especially in children and young adults.
                    </p>
                </div>
                <div className="p-6 rounded-2xl bg-muted/50 border border-border/50">
                    <h3 className="font-bold text-lg mb-2">How it Works</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        Visionary uses a specialized calibration algorithm that creates a baseline of your face size at an optimal distance. The AI then monitors changes in this baseline to alert you instantly if you drift too close.
                    </p>
                </div>
            </div>
        </div>
    );
}
