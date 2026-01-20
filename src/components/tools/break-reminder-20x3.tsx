
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Timer,
    Eye,
    RefreshCcw,
    Play,
    Pause,
    Settings2,
    Bell,
    Video,
    VideoOff,
    CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const WORK_TIME = 20 * 60; // 20 minutes in seconds
const REST_TIME = 20; // 20 seconds

export default function BreakReminder20x3() {
    const [timeLeft, setTimeLeft] = useState(WORK_TIME);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<'work' | 'rest'>('work');
    const [sessionCount, setSessionCount] = useState(0);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isGazeDetected, setIsGazeDetected] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { toast } = useToast();

    // Sound effect (simulated)
    const playNotification = useCallback(() => {
        const audio = new Audio('/sounds/notification.mp3');
        audio.play().catch(() => console.log("Audio play prevented"));

        if ("vibrate" in navigator) {
            navigator.vibrate([200, 100, 200]);
        }
    }, []);

    const toggleCamera = async () => {
        if (isCameraOn) {
            streamRef.current?.getTracks().forEach(track => track.stop());
            setIsCameraOn(false);
            setIsGazeDetected(false);
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    streamRef.current = stream;
                    setIsCameraOn(true);
                    toast({
                        title: "Intelligence Enabled",
                        description: "Gaze detection is now monitoring your eye comfort.",
                    });
                }
            } catch (err) {
                toast({
                    title: "Camera Access Required",
                    description: "Please allow camera access for gaze-detected reminders.",
                    variant: "destructive",
                });
            }
        }
    };

    // Simple Gaze Activity Simulation Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isCameraOn && mode === 'rest') {
            interval = setInterval(() => {
                // In a real app, we'd use MediaPipe or TF.js here.
                // For this demo, we simulate a "looking away" detection
                const detected = Math.random() > 0.3;
                setIsGazeDetected(detected);
            }, 1000);
        } else {
            setIsGazeDetected(false);
        }
        return () => clearInterval(interval);
    }, [isCameraOn, mode]);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            playNotification();
            if (mode === 'work') {
                setMode('rest');
                setTimeLeft(REST_TIME);
                toast({
                    title: "Time for a Break!",
                    description: "Look at something 20 feet away for 20 seconds.",
                });
            } else {
                setMode('work');
                setTimeLeft(WORK_TIME);
                setSessionCount(prev => prev + 1);
                toast({
                    title: "Ready to Work",
                    description: "Break complete. Focus back on your tasks!",
                });
            }
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft, mode, playNotification, toast]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = mode === 'work'
        ? ((WORK_TIME - timeLeft) / WORK_TIME) * 100
        : ((REST_TIME - timeLeft) / REST_TIME) * 100;

    return (
        <Card className="glass-card border-primary/20 overflow-hidden max-w-2xl mx-auto">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2 text-2xl">
                            <Timer className="w-6 h-6 text-primary" />
                            20-20-20 Companion
                        </CardTitle>
                        <CardDescription>Combat Digital Eye Strain Algorithmically</CardDescription>
                    </div>
                    <Badge variant={mode === 'work' ? 'outline' : 'default'} className={cn(
                        "px-3 py-1",
                        mode === 'work' ? "border-primary text-primary" : "bg-green-500 text-white border-green-500"
                    )}>
                        {mode === 'work' ? 'Working Mode' : 'Resting Mode'}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Timer Display */}
                <div className="relative py-12 flex flex-col items-center">
                    <svg className="w-64 h-64 -rotate-90">
                        <circle
                            cx="128"
                            cy="128"
                            r="120"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-muted-foreground/10"
                        />
                        <motion.circle
                            cx="128"
                            cy="128"
                            r="120"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={754}
                            initial={{ strokeDashoffset: 754 }}
                            animate={{ strokeDashoffset: 754 - (754 * progress) / 100 }}
                            className={cn(
                                "transition-colors duration-500",
                                mode === 'work' ? "text-primary" : "text-green-500"
                            )}
                        />
                    </svg>

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                        <div className="text-6xl font-black tracking-tighter mb-1">
                            {formatTime(timeLeft)}
                        </div>
                        <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                            {mode === 'work' ? 'Until Break' : 'Rest Remaining'}
                        </div>
                    </div>
                </div>

                {/* Intelligence Feature: Camera Feed */}
                <div className="bg-muted/50 rounded-2xl p-4 border border-border/50">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className={cn(
                                "w-2 h-2 rounded-full animate-pulse",
                                isCameraOn ? "bg-green-500" : "bg-red-500"
                            )} />
                            <span className="text-sm font-semibold uppercase tracking-wider">AI Gaze Detection</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleCamera}
                            className={cn(isCameraOn && "text-primary hover:text-primary")}
                        >
                            {isCameraOn ? <Video className="w-4 h-4 mr-2" /> : <VideoOff className="w-4 h-4 mr-2" />}
                            {isCameraOn ? "Disable AI" : "Enable AI"}
                        </Button>
                    </div>

                    <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/10 group">
                        {!isCameraOn ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                                <VideoOff className="w-12 h-12 mb-2 opacity-20" />
                                <p className="text-xs">Camera Offline</p>
                            </div>
                        ) : (
                            <>
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full h-full object-cover opacity-60"
                                />
                                {mode === 'rest' && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <AnimatePresence>
                                            {isGazeDetected ? (
                                                <motion.div
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    className="bg-green-500/80 backdrop-blur-sm text-white px-4 py-2 rounded-full flex items-center gap-2"
                                                >
                                                    <CheckCircle2 className="w-5 h-5" />
                                                    Good! You're looking away.
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="bg-orange-500/80 backdrop-blur-sm text-white px-4 py-2 rounded-full flex items-center gap-2"
                                                >
                                                    <Eye className="w-5 h-5 animate-bounce" />
                                                    Look 20ft away!
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </>
                        )}
                        <div className="absolute top-2 right-2">
                            {isCameraOn && (
                                <Badge className="bg-black/50 backdrop-blur-md">Active Monitoring</Badge>
                            )}
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex gap-4">
                    <Button
                        size="xl"
                        className="flex-1 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20"
                        onClick={() => setIsActive(!isActive)}
                    >
                        {isActive ? (
                            <><Pause className="mr-2 h-6 w-6" /> Stop Timer</>
                        ) : (
                            <><Play className="mr-2 h-6 w-6" /> Start Timer</>
                        )}
                    </Button>
                    <Button
                        variant="secondary"
                        size="xl"
                        className="rounded-2xl"
                        onClick={() => {
                            setIsActive(false);
                            setTimeLeft(WORK_TIME);
                            setMode('work');
                        }}
                    >
                        <RefreshCcw className="h-6 w-6" />
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                        <div className="text-2xl font-bold text-primary">{sessionCount}</div>
                        <div className="text-xs font-medium text-muted-foreground uppercase">Sessions Today</div>
                    </div>
                    <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                        <div className="text-2xl font-bold text-primary">{(sessionCount * 20 / 60).toFixed(1)}h</div>
                        <div className="text-xs font-medium text-muted-foreground uppercase">Eye Protection Time</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
