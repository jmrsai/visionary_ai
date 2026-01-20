
"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MOCK_TESTS } from "@/lib/data";
import { ChevronRight, ShieldCheck, Activity, Search, Palette, Contrast, Droplets, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function CheckupsHub() {
    const coreDiagnostics = MOCK_TESTS.filter(t => t.category === "Core Diagnostics");
    const advancedScreening = MOCK_TESTS.filter(t => t.category === "Advanced Screening");

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight">Vision Screening</h1>
                    <p className="mt-2 text-lg text-muted-foreground">
                        Professional-grade diagnostics powered by AI.
                    </p>
                </div>
                <Button asChild className="rounded-full shadow-lg shadow-primary/20">
                    <Link href="/tools/diagnostics">
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Access Secure Vault
                    </Link>
                </Button>
            </div>

            <div className="grid gap-8">
                {/* Core Diagnostics */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Activity className="text-primary w-5 h-5" />
                        <h2 className="text-2xl font-bold">Core Health Checks</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {coreDiagnostics.map((test) => (
                            <Link key={test.id} href={`/checkups/${'${test.id}'}`} className="group">
                                <Card className="h-full glass-card border-primary/20 transition-all group-hover:border-primary group-hover:shadow-2xl group-hover:-translate-y-1">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                                                <test.icon className="h-6 w-6" />
                                            </div>
                                            <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-[10px]">FAST</Badge>
                                        </div>
                                        <CardTitle className="mt-4">{test.title}</CardTitle>
                                        <CardDescription className="line-clamp-2">{test.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center text-xs font-bold text-primary group-hover:gap-2 transition-all">
                                            START TEST <ArrowRight className="h-3 w-3" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Advanced Screening */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="text-violet-500 w-5 h-5" />
                        <h2 className="text-2xl font-bold">Clinical Grade Analysis</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {advancedScreening.map((test) => (
                            <Link key={test.id} href={`/checkups/${'${test.id}'}`} className="group">
                                <Card className="h-full glass-card border-violet-500/20 transition-all group-hover:border-violet-500 group-hover:shadow-2xl group-hover:-translate-y-1">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-500 group-hover:scale-110 transition-transform">
                                                <test.icon className="h-6 w-6" />
                                            </div>
                                            <Badge variant="outline" className="border-violet-500/20 bg-violet-500/5 text-violet-500 text-[10px]">AI-V1</Badge>
                                        </div>
                                        <CardTitle className="mt-4">{test.title}</CardTitle>
                                        <CardDescription className="line-clamp-2">{test.description}</CardDescription>
                                    </CardHeader>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
