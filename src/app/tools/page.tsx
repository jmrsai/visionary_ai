
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Timer,
    Smartphone,
    Upload,
    Pill,
    ChevronRight,
    Activity,
    ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const tools = [
    {
        id: 'break-reminder',
        title: '20-20-20 Companion',
        description: 'Automated eye strain protection with gaze detection.',
        icon: Timer,
        href: '/tools/break-reminder',
        color: 'text-violet-500',
        borderColor: 'border-violet-500/20',
        bgColor: 'bg-violet-500/10'
    },
    {
        id: 'distance-monitor',
        title: 'Distance Monitor',
        description: 'AI-powered warning if your device is held too close.',
        icon: Smartphone,
        href: '/tools/distance-monitor',
        color: 'text-blue-500',
        borderColor: 'border-blue-500/20',
        bgColor: 'bg-blue-500/10'
    },
    {
        id: 'medication',
        title: 'Medication Manager',
        description: 'Smart reminders with OCR bottle scanning.',
        icon: Pill,
        href: '/medication',
        color: 'text-green-500',
        borderColor: 'border-green-500/20',
        bgColor: 'bg-green-500/10'
    },
    {
        id: 'diagnostics',
        title: 'Diagnostic Vault',
        description: 'Secure OCT & Fundus photo storage with trend analysis.',
        icon: Upload,
        href: '/tools/diagnostics',
        color: 'text-orange-500',
        borderColor: 'border-orange-500/20',
        bgColor: 'bg-orange-500/10'
    }
];

export default function ToolsPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-4xl font-black tracking-tight mb-2 bg-gradient-to-r from-primary to-violet-600 bg-clip-text text-transparent">
                    Intelligent Management
                </h1>
                <p className="text-muted-foreground text-lg">
                    Advanced AI tools to protect and manage your vision health 24/7.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {tools.map((tool, index) => (
                    <motion.div
                        key={tool.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className={`group relative overflow-hidden glass-card transition-all hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 ${tool.borderColor}`}>
                            <div className={`absolute top-0 right-0 p-8 opacity-5 transition-opacity group-hover:opacity-20`}>
                                <tool.icon className="w-32 h-32" />
                            </div>

                            <CardHeader className="relative z-10">
                                <div className={`w-12 h-12 rounded-xl ${tool.bgColor} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                                    <tool.icon className={`w-6 h-6 ${tool.color}`} />
                                </div>
                                <CardTitle className="text-2xl font-bold">{tool.title}</CardTitle>
                                <CardDescription className="text-md leading-relaxed">
                                    {tool.description}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="relative z-10">
                                <Button asChild variant="ghost" className="rounded-full px-0 hover:bg-transparent group/btn">
                                    <Link href={tool.href} className="flex items-center gap-1 font-semibold text-primary">
                                        Open Tool <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* AI Insights Section */}
            <Card className="border-primary/20 bg-primary/5 backdrop-blur-sm overflow-hidden border-dashed">
                <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1 px-2 rounded-md bg-primary text-white text-[10px] font-bold uppercase tracking-widest">Premium AI</div>
                    </div>
                    <CardTitle className="text-xl">Vision Guard™ Active</CardTitle>
                    <CardDescription>
                        Our background algorithms are monitoring your blink rate and posture to prevent myopia progression.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold">
                                    {i}
                                </div>
                            ))}
                        </div>
                        <span className="text-sm font-medium">Auto-protection is active</span>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-full border-primary/20 hover:bg-primary/10">
                        View Log
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
