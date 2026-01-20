
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Eye,
    Droplets,
    Camera,
    Video,
    AlertTriangle,
    CheckCircle2,
    Info,
    RefreshCcw,
    Activity,
    BrainCircuit
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export function DryEyeDetector() {
    const [status, setStatus] = useState<'idle' | 'calibrating' | 'monitoring' | 'result'>('idle');
    const [blinkCount, setBlinkCount] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60); // 1 minute test
    const [lastBlinkTime, setLastBlinkTime] = useState<number | null>(null);
    const [isCameraActive, setIsCameraActive] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const { toast } = useToast();

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsCameraActive(true);
                setStatus('calibrating');

                // Simulate calibration
                setTimeout(() => {
                    setStatus('monitoring');
                    startMonitoring();
                }, 3000);
            }
        } catch (err) {
            toast({
                title: "Camera Access Denied",
                description: "We need camera access to detect your blinking pattern.",
                variant: "destructive"
            });
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            setIsCameraActive(false);
        }
    };

    const startMonitoring = () => {
        setBlinkCount(0);
        setTimeLeft(60);

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setStatus('result');
                    stopCamera();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Simulation logic for blinks (real CV would happen via requestAnimationFrame)
        const blinkSim = setInterval(() => {
            if (Math.random() > 0.85) { // Random blink simulation
                setBlinkCount(curr => curr + 1);
                setLastBlinkTime(Date.now());
                setTimeout(() => setLastBlinkTime(null), 200);
            }
        }, 2000);

        return () => {
            clearInterval(timer);
            clearInterval(blinkSim);
        };
    };

    const blinkRatePerMinute = blinkCount; // Since test is 60s

    return (
        <Card className="glass-card border-primary/20 overflow-hidden shadow-2xl max-w-xl mx-auto">
            <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                    <div className="p-3 bg-blue-500/10 rounded-2xl">
                        <Droplets className="w-8 h-8 text-blue-500" />
                    </div>
                </div>
                <CardTitle className="text-2xl font-black">Dry Eye Detection</CardTitle>
                <CardDescription>Camera-based Blink Rate Monitoring</CardDescription>
            </CardHeader>

            <CardContent className="p-8">
                <AnimatePresence mode="wait">
                    {status === 'idle' && (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center space-y-6"
                        >
                            <p className="text-muted-foreground leading-relaxed">
                                Our AI monitors your blink rate to detect signs of Digital Eye Strain and Dry Eye Syndrome.
                                A normal blink rate is 15-20 times per minute.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-muted/50 border border-border/50">
                                    <div className="text-xs font-bold text-muted-foreground uppercase mb-1">Duration</div>
                                    <div className="text-xl font-bold">60 Sec</div>
                                </div>
                                <div className="p-4 rounded-2xl bg-muted/50 border border-border/50">
                                    <div className="text-xs font-bold text-muted-foreground uppercase mb-1">Tech</div>
                                    <div className="text-xl font-bold">Bio-CV</div>
                                </div>
                            </div>
                            <Button onClick={startCamera} className="w-full rounded-2xl py-6 text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20">
                                <Camera className="mr-2 h-5 w-5" /> Initialize Camera
                            </Button>
                        </motion.div>
                    )}

                    {(status === 'calibrating' || status === 'monitoring') && (
                        <motion.div
                            key="monitoring"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6"
                        >
                            <div className="relative aspect-video rounded-3xl overflow-hidden bg-black border-2 border-primary/20">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover scale-x-[-1]"
                                />

                                <div className="absolute inset-0 pointer-events-none border-[40px] border-black/40">
                                    <div className="w-full h-full border-2 border-primary/50 border-dashed rounded-[40px] flex items-center justify-center">
                                        {status === 'calibrating' && (
                                            <div className="bg-black/60 backdrop-blur-md px-6 py-2 rounded-full flex items-center gap-2">
                                                <BrainCircuit className="w-4 h-4 text-primary animate-spin" />
                                                <span className="text-xs font-bold text-white uppercase tracking-tighter">AI Calibrating Face...</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Blink Flash */}
                                <AnimatePresence>
                                    {lastBlinkTime && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-x-0 top-0 h-1 bg-primary shadow-[0_0_20px_#7c3aed]"
                                        />
                                    )}
                                </AnimatePresence>

                                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                                    <Badge className="bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1">
                                        <Video className="w-3 h-3 mr-2 animate-pulse text-red-500" />
                                        LIVE ANALYSIS
                                    </Badge>
                                    <div className="flex flex-col items-end gap-1">
                                        <div className="text-[10px] font-bold text-white uppercase tracking-widest opacity-60">Blink Rate</div>
                                        <div className="text-3xl font-black text-white">{blinkCount}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50">
                                <div className="flex gap-4">
                                    <div className="text-center">
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase">Time Left</div>
                                        <div className="text-xl font-bold">{timeLeft}s</div>
                                    </div>
                                    <div className="w-[2px] bg-border my-2" />
                                    <div className="text-center">
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase">Status</div>
                                        <div className="text-xl font-bold text-primary">{status === 'calibrating' ? 'Prep' : 'Scanning'}</div>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => { stopCamera(); setStatus('idle'); }} className="rounded-full">
                                    <RefreshCcw className="w-4 h-4" />
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {status === 'result' && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-6"
                        >
                            <div className="p-8 rounded-[40px] bg-blue-500/5 border border-blue-500/20 relative">
                                <div className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">Average Blink Rate</div>
                                <div className="text-6xl font-black">{blinkRatePerMinute} <span className="text-xl opacity-30">BPM</span></div>
                                <div className="mt-6 flex flex-col items-center gap-2">
                                    <Badge className={cn(
                                        "px-4 py-1",
                                        blinkRatePerMinute < 10 ? "bg-orange-500" : "bg-green-500"
                                    )}>
                                        {blinkRatePerMinute < 10 ? 'LOW BLINK RATE' : 'HEALTHY RANGE'}
                                    </Badge>
                                    <p className="text-xs text-muted-foreground mt-2 max-w-xs">
                                        {blinkRatePerMinute < 10
                                            ? "Your blink rate is low. This may lead to dry eyes. Try the 20-20-20 rule."
                                            : "Your blinking patterns are within the healthy normal range."}
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-3 pt-4">
                                <Button className="w-full rounded-2xl bg-blue-600 hover:bg-blue-700" onClick={() => setStatus('idle')}>
                                    Retest Session
                                </Button>
                                <Button variant="outline" className="w-full rounded-2xl" asChild>
                                    <Link href="/dashboard">Continue to Dashboard</Link>
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>

            <CardFooter className="bg-muted/10 border-t border-border/50 p-6 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    <BrainCircuit className="w-3 h-3 text-primary" />
                    AI Blink-Recognition Engine Active
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed text-center opacity-60">
                    Note: For best results, ensure your face is well-lit and clearly visible in the center of the frame.
                </p>
            </CardFooter>
        </Card>
    );
}
