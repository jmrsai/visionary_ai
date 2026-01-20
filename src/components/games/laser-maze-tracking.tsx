
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Target,
    Wind,
    RefreshCcw,
    Trophy,
    Gamepad2,
    Eye,
    Zap,
    AlertCircle,
    Info,
    ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Point {
    x: number;
    y: number;
}

export default function LaserMazeTracking() {
    const [gameState, setGameState] = useState<'intro' | 'playing' | 'complete'>('intro');
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [targetPos, setTargetPos] = useState<Point>({ x: 50, y: 50 });
    const [userPos, setUserPos] = useState<Point>({ x: 50, y: 50 });
    const [path, setPath] = useState<Point[]>([]);
    const [isActive, setIsActive] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number>();
    const startTimeRef = useRef<number>(0);

    const generatePath = useCallback((lvl: number) => {
        const points: Point[] = [];
        const segments = 5 + lvl * 2;
        for (let i = 0; i < segments; i++) {
            points.push({
                x: 10 + Math.random() * 80,
                y: 10 + Math.random() * 80
            });
        }
        return points;
    }, []);

    const startGame = () => {
        const newPath = generatePath(1);
        setPath(newPath);
        setTargetPos(newPath[0]);
        setUserPos(newPath[0]);
        setGameState('playing');
        setScore(0);
        setLevel(1);
        setIsActive(true);
        startTimeRef.current = performance.now();
    };

    const updateGame = useCallback((time: number) => {
        if (gameState !== 'playing' || !isActive) return;

        const elapsed = (time - startTimeRef.current) / 1000;
        const speed = 0.2 + level * 0.1;

        // Calculate current target position along the path
        const totalDuration = path.length / speed;
        const currentSegment = Math.floor((elapsed * speed) % path.length);
        const nextSegment = (currentSegment + 1) % path.length;
        const segmentProgress = (elapsed * speed) % 1;

        const p1 = path[currentSegment];
        const p2 = path[nextSegment];

        if (p1 && p2) {
            const newX = p1.x + (p2.x - p1.x) * segmentProgress;
            const newY = p1.y + (p2.y - p1.y) * segmentProgress;
            setTargetPos({ x: newX, y: newY });
        }

        // Check proximity
        const dist = Math.sqrt(Math.pow(userPos.x - targetPos.x, 2) + Math.pow(userPos.y - targetPos.y, 2));
        if (dist < 10) {
            setScore(prev => prev + 1);
        }

        if (elapsed > 30) { // 30 seconds per level
            if (level < 3) {
                setLevel(prev => prev + 1);
                setPath(generatePath(level + 1));
                startTimeRef.current = time;
            } else {
                setGameState('complete');
                setIsActive(false);
            }
        }

        requestRef.current = requestAnimationFrame(updateGame);
    }, [gameState, isActive, level, path, userPos, targetPos, generatePath]);

    useEffect(() => {
        requestRef.current = requestAnimationFrame(updateGame);
        return () => cancelAnimationFrame(requestRef.current!);
    }, [updateGame]);

    const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        let clientX, clientY;

        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        setUserPos({
            x: ((clientX - rect.left) / rect.width) * 100,
            y: ((clientY - rect.top) / rect.height) * 100
        });
    };

    return (
        <Card className="glass-card border-primary/20 overflow-hidden shadow-2xl">
            <CardHeader className="border-b border-white/5 bg-white/5 pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/20 rounded-xl">
                            <Target className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-black">Laser Maze</CardTitle>
                            <CardDescription>Smooth Pursuit Tracking</CardDescription>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Accuracy</div>
                            <div className="text-xl font-black text-primary">{Math.min(100, Math.floor(score / 1.5))}%</div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Cycle</div>
                            <div className="text-xl font-black text-violet-500">{level}/3</div>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0 relative bg-black aspect-video overflow-hidden">
                <AnimatePresence mode="wait">
                    {gameState === 'intro' && (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="w-32 h-32 rounded-full border-2 border-primary/30 flex items-center justify-center mb-8"
                            >
                                <div className="w-4 h-4 rounded-full bg-primary shadow-[0_0_20px_#7c3aed]" />
                            </motion.div>
                            <h2 className="text-3xl font-black mb-4 tracking-tight">STAY ON TARGET</h2>
                            <p className="text-muted-foreground max-w-sm mb-8 leading-relaxed">
                                Follow the <span className="text-primary font-bold">Glowing Laser</span> with your cursor or finger.
                                Keep your head still and follow only with your eyes.
                            </p>
                            <Button onClick={startGame} size="xl" className="rounded-full px-12 text-lg font-bold shadow-xl shadow-primary/20">
                                Begin Tracking
                            </Button>
                        </motion.div>
                    )}

                    {gameState === 'playing' && (
                        <div
                            className="absolute inset-0 cursor-none touch-none"
                            ref={containerRef}
                            onMouseMove={handleMouseMove}
                            onTouchMove={handleMouseMove}
                        >
                            {/* The Path */}
                            <svg className="absolute inset-0 w-full h-full opacity-10">
                                <polyline
                                    points={path.map(p => `${'${p.x}'},${'${p.y}'}`).join(' ')}
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="0.5"
                                    vectorEffect="non-scaling-stroke"
                                    className="w-full h-full"
                                    style={{ transform: 'scale(100, 100)' }}
                                />
                            </svg>

                            {/* The Laser Target */}
                            <motion.div
                                className="absolute w-8 h-8 -ml-4 -mt-4"
                                animate={{
                                    left: `${'${targetPos.x}'}%`,
                                    top: `${'${targetPos.y}'}%`,
                                }}
                                transition={{ type: "just" }}
                            >
                                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                                <div className="absolute inset-2 bg-primary rounded-full shadow-[0_0_20px_#7c3aed]" />
                                <div className="absolute inset-[30%] bg-white rounded-full" />
                            </motion.div>

                            {/* User Position (Reticle) */}
                            <motion.div
                                className="absolute w-12 h-12 -ml-6 -mt-6 border-2 border-white/30 rounded-full flex items-center justify-center pointer-events-none"
                                animate={{
                                    left: `${'${userPos.x}'}%`,
                                    top: `${'${userPos.y}'}%`,
                                }}
                                transition={{ type: "spring", damping: 20, stiffness: 200 }}
                            >
                                <div className="w-1 h-3 bg-white/50 absolute top-0" />
                                <div className="w-1 h-3 bg-white/50 absolute bottom-0" />
                                <div className="h-1 w-3 bg-white/50 absolute left-0" />
                                <div className="h-1 w-3 bg-white/50 absolute right-0" />
                            </motion.div>

                            {/* Feedback Toast Area */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                                <Badge variant="outline" className="bg-black/80 backdrop-blur-xl border-white/20 px-4 py-1">
                                    Track the Pulse
                                </Badge>
                            </div>
                        </div>
                    )}

                    {gameState === 'complete' && (
                        <motion.div
                            key="complete"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
                        >
                            <Trophy className="w-24 h-24 text-yellow-500 mb-6 drop-shadow-[0_0_30px_rgba(234,179,8,0.3)]" />
                            <h2 className="text-4xl font-black mb-2">PURSUIT SUCCESS!</h2>
                            <p className="text-muted-foreground mb-8 text-lg">Your tracking precision is within healthy ocular ranges.</p>
                            <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-8">
                                <div className="bg-primary/10 p-4 rounded-2xl border border-primary/20">
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-primary">Accuracy</div>
                                    <div className="text-2xl font-black">{Math.min(100, Math.floor(score / 1.5))}%</div>
                                </div>
                                <div className="bg-violet-500/10 p-4 rounded-2xl border border-violet-500/20">
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-violet-500">Stability</div>
                                    <div className="text-2xl font-black">High</div>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Button onClick={startGame} variant="outline" className="rounded-full px-8">
                                    <RefreshCcw className="mr-2 h-4 w-4" /> Restart
                                </Button>
                                <Button asChild className="rounded-full px-8">
                                    <Link href="/gym">Back to Gym</Link>
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>

            <CardFooter className="bg-slate-900 border-t border-white/5 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                    <Eye className="w-4 h-4" />
                    Focus: Static Head, Moving Eyes
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[10px]">
                        MEDICAL GRADE
                    </Badge>
                </div>
            </CardFooter>
        </Card>
    );
}
