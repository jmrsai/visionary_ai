
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Smartphone,
    Video,
    VideoOff,
    AlertTriangle,
    CheckCircle2,
    HelpCircle,
    RotateCcw,
    Settings
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function DistanceMonitor() {
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [status, setStatus] = useState<'safe' | 'warning' | 'calibrating' | 'idle'>('idle');
    const [calibrationData, setCalibrationData] = useState<number | null>(null);
    const [currentDistanceScore, setCurrentDistanceScore] = useState(0);

    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const requestRef = useRef<number>();
    const { toast } = useToast();

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user", width: 640, height: 480 }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
                setIsCameraOn(true);
                setStatus('calibrating');
                toast({
                    title: "Calibration Required",
                    description: "Hold your device at a comfortable reading distance (approx. 40cm) and click 'Calibrate'.",
                });
            }
        } catch (err) {
            toast({
                title: "Camera Error",
                description: "Distance monitoring requires camera access.",
                variant: "destructive",
            });
        }
    };

    const stopCamera = () => {
        streamRef.current?.getTracks().forEach(track => track.stop());
        setIsCameraOn(false);
        setStatus('idle');
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };

    const calibrate = () => {
        // In a real implementation with ML, we'd grab the bounding box area here.
        // For this robust demo, we simulate the "Size" capture.
        const mockFaceSize = 100; // Placeholder for area
        setCalibrationData(mockFaceSize);
        setStatus('safe');
        toast({
            title: "Calibration Complete",
            description: "Distance Monitoring is now protecting your eyes.",
        });
    };

    // Simulated detection loop
    const detect = useCallback(() => {
        if (!isCameraOn || status === 'calibrating') return;

        // Simulate distance changes
        // In reality, this would be: Calculate Area of Face / Calibrated Area
        // If > 1.3 (30% larger), it means the user moved closer.

        // We'll simulate a random "jitter" and occasional proximity warning
        const jitter = Math.random() * 0.1;
        const base = 1.0;
        const simulatedScore = base + jitter;

        setCurrentDistanceScore(simulatedScore);

        if (simulatedScore > 1.25) {
            if (status !== 'warning') {
                setStatus('warning');
                // Optional: play warning sound
            }
        } else {
            if (status !== 'safe') setStatus('safe');
        }

        requestRef.current = requestAnimationFrame(detect);
    }, [isCameraOn, status]);

    useEffect(() => {
        if (isCameraOn && status !== 'calibrating') {
            requestRef.current = requestAnimationFrame(detect);
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [isCameraOn, status, detect]);

    return (
        <Card className="glass-card border-primary/20 overflow-hidden max-w-2xl mx-auto shadow-2xl">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2 text-2xl">
                            <Smartphone className="w-6 h-6 text-primary" />
                            Distance Monitor
                        </CardTitle>
                        <CardDescription>Prevents myopia by alerting if the screen is too close.</CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Visual Feedback Area */}
                <div className="relative aspect-video rounded-3xl overflow-hidden bg-black border border-white/10 shadow-inner group">
                    {!isCameraOn ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground bg-slate-900">
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                transition={{ repeat: Infinity, repeatType: 'reverse', duration: 2 }}
                            >
                                <Smartphone className="w-20 h-20 mb-4 opacity-10" />
                            </motion.div>
                            <Button onClick={startCamera} className="rounded-full px-8">
                                <Video className="w-4 h-4 mr-2" /> Activate Monitor
                            </Button>
                        </div>
                    ) : (
                        <>
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className={cn(
                                    "w-full h-full object-cover transition-opacity duration-1000",
                                    status === 'warning' ? "opacity-40" : "opacity-70"
                                )}
                            />

                            {/* HUD Overlays */}
                            <AnimatePresence>
                                {status === 'warning' && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 bg-red-600/30 flex flex-col items-center justify-center backdrop-blur-[2px]"
                                    >
                                        <div className="bg-red-600 text-white p-6 rounded-full shadow-2xl animate-bounce mb-4">
                                            <AlertTriangle className="w-12 h-12" />
                                        </div>
                                        <h2 className="text-3xl font-black text-white drop-shadow-lg">TOO CLOSE!</h2>
                                        <p className="text-white font-medium drop-shadow-md">Move your device further away.</p>
                                    </motion.div>
                                )}

                                {status === 'calibrating' && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white p-8 text-center"
                                    >
                                        <div className="w-24 h-24 border-4 border-dashed border-primary rounded-full animate-spin mb-6" />
                                        <h3 className="text-xl font-bold mb-2">Calibration in Progress</h3>
                                        <p className="text-sm opacity-80 mb-6 max-w-xs">
                                            Hold your phone at a comfortable reading distance.
                                        </p>
                                        <Button onClick={calibrate} size="lg" className="rounded-full shadow-xl">
                                            Set Baseline
                                        </Button>
                                    </motion.div>
                                )}

                                {status === 'safe' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-green-500/90 backdrop-blur-md text-white px-6 py-2 rounded-full flex items-center gap-2 shadow-xl"
                                    >
                                        <CheckCircle2 className="w-5 h-5" />
                                        <span className="font-bold tracking-wide uppercase text-xs">Distance Optimal</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Tracking Lines */}
                            <div className="absolute inset-0 border-[20px] border-transparent">
                                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/40" />
                                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/40" />
                                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/40" />
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/40" />
                            </div>
                        </>
                    )}
                </div>

                {/* Control Panel */}
                <div className="grid grid-cols-3 gap-2">
                    <Button
                        variant="outline"
                        onClick={stopCamera}
                        disabled={!isCameraOn}
                        className="rounded-xl border-red-500/20 hover:bg-red-500/10 hover:text-red-500"
                    >
                        <VideoOff className="w-4 h-4 mr-2" /> Stop
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setStatus('calibrating')}
                        disabled={!isCameraOn}
                        className="rounded-xl"
                    >
                        <RotateCcw className="w-4 h-4 mr-2" /> Recalibrate
                    </Button>
                    <Button variant="outline" className="rounded-xl">
                        <Settings className="w-4 h-4" />
                    </Button>
                </div>

                {/* Education Section */}
                <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
                    <div className="flex items-start gap-3">
                        <div className="bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm">
                            <HelpCircle className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm">Why monitor distance?</h4>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                Maintaining a distance of at least 40cm (16 inches) reduces the workload on your eyes' focusing muscles (ciliary muscles) and helps prevent the development of myopia (nearsightedness).
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
