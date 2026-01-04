
"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, Dumbbell, Pill, Lightbulb, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const guideItems = [
    {
        icon: ClipboardList,
        title: "Take a Vision Test",
        description: "Start with a baseline test to understand your vision health.",
        href: "/tests",
        color: "text-blue-500",
    },
    {
        icon: Dumbbell,
        title: "Try an Eye Exercise",
        description: "Reduce eye strain with a guided exercise from the Eye Gym.",
        href: "/gym",
        color: "text-green-500",
    },
    {
        icon: Pill,
        title: "Set a Reminder",
        description: "Manage your medications or schedule exercise reminders.",
        href: "/medication",
        color: "text-purple-500",
    },
    {
        icon: Lightbulb,
        title: "Get AI Insights",
        description: "Describe your symptoms to the AI and get instant feedback.",
        href: "/holistic-insights",
        color: "text-yellow-500",
    }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export function QuickGuide() {
    return (
        <Card className="bg-muted/50">
            <CardHeader>
                <CardTitle>Quick Start Guide</CardTitle>
                <CardDescription>Welcome to Visionary! Here are a few things you can do to get started.</CardDescription>
            </CardHeader>
            <CardContent>
                <motion.div 
                    className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {guideItems.map((item) => (
                        <motion.div key={item.title} variants={itemVariants}>
                            <Link href={item.href} className="h-full block">
                                <Card className="h-full hover:border-primary transition-all">
                                    <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 ${item.color}`}>
                                            <item.icon className="h-6 w-6" />
                                        </div>
                                        <CardTitle className="text-base font-semibold">{item.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">{item.description}</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </CardContent>
        </Card>
    )
}
