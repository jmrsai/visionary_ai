
"use client";

import BreakReminder20x3 from "@/components/tools/break-reminder-20x3";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function BreakReminderPage() {
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Button asChild variant="ghost" size="icon" className="rounded-full">
                    <Link href="/tools">
                        <ChevronLeft className="h-6 w-6" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">20-20-20 Companion</h1>
                    <p className="text-muted-foreground">Digital eye strain prevention tool.</p>
                </div>
            </div>

            <div className="mt-8">
                <BreakReminder20x3 />
            </div>

            <div className="grid gap-6 md:grid-cols-2 mt-8">
                <div className="p-6 rounded-2xl bg-muted/50 border border-border/50">
                    <h3 className="font-bold text-lg mb-2">What is the 20-20-20 Rule?</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        For every 20 minutes spent looking at a screen, a person should look at something 20 feet away for at least 20 seconds. This helps the eye muscles relax from the constant focus on close-up digital displays.
                    </p>
                </div>
                <div className="p-6 rounded-2xl bg-muted/50 border border-border/50">
                    <h3 className="font-bold text-lg mb-2">AI Gaze Detection</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        When enabled, Visionary uses your camera to intelligently detect if you are actually looking away during your rest sessions, ensuring maximum relaxation for your eyes.
                    </p>
                </div>
            </div>
        </div>
    );
}
