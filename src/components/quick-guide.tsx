
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, Dumbbell, Pill, Lightbulb, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  exit: {
    opacity: 0,
    transition: {
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 }
};

export function QuickGuide() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const quickGuideShown = localStorage.getItem('visionary_quickGuideShown');
        if (!quickGuideShown) {
            setIsVisible(true);
        }
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem('visionary_quickGuideShown', 'true');
    };

    return (
        <AnimatePresence>
        {isVisible && (
            <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={containerVariants}
            >
                <Card className="bg-muted/50 relative">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle>Quick Start Guide</CardTitle>
                                <CardDescription>Welcome to Visionary! Here are a few things you can do to get started.</CardDescription>
                            </div>
                            <Button variant="ghost" size="icon" onClick={handleDismiss} className="flex-shrink-0">
                                <X className="h-4 w-4" />
                                <span className="sr-only">Dismiss</span>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                        </div>
                    </CardContent>
                </Card>
             </motion.div>
        )}
        </AnimatePresence>
    )
}
