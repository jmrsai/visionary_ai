
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Activity,
    RefreshCcw,
    Trophy,
    Eye,
    Zap,
    Info,
    ChevronDown,
    ChevronUp,
    Glasses
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function BrockStringSimulator() {
    const [gameState, setGameState] = useState<'intro' | 'playing' | 'complete'>('intro');
    const [score, setScore] = useState(0);
    const [activeBead, setActiveBead] = useState(0);
    const [convergenceType, setConvergenceType] = useState<'jump' | 'smooth'>('jump');
    const [beadStates, setBeadStates] = useState([false, false, false]);

    const startGame = () => {
        setGameState('playing');
        setScore(0);
        setActiveBead(0);
        setBeadStates([false, false, false]);
    };

    const handleBeadClick = (index: number) => {
        if (index === activeBead) {
            const nextStates = [...beadStates];
            nextStates[index] = true;
            setBeadStates(nextStates);
            setScore(prev => prev + 100);

            if (index < 2) {
                setActiveBead(prev => prev + 1);
            } else {
                setGameState('complete');
            }
        }
    };

    return (
        <Card className="glass-card border-primary/20 overflow-hidden shadow-2xl">
            <CardHeader className="border-b border-white/5 bg-white/5 pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/20 rounded-xl">
                            <Activity className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-black">Brock String Digital</CardTitle>
                            <CardDescription>Convergence / Divergence Training</CardDescription>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Focus</div>
                            <div className="text-xl font-black text-primary">{Math.floor((beadStates.filter(b => b).length / 3) * 100)}%</div>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0 relative bg-slate-950 min-h-[400px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                    {gameState === 'intro' && (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center p-12 text-center"
                        >
                            <div className="w-48 h-1 bg-gradient-to-r from-primary to-violet-500 rounded-full mb-8 relative">
                                <div className="absolute -top-2 left-4 w-5 h-5 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
                                <div className="absolute -top-2 left-24 w-5 h-5 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50" />
                                <div className="absolute -top-2 right-4 w-5 h-5 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
                            </div>
                            <h2 className="text-3xl font-black mb-4 tracking-tight">VIRTUAL CONVERGENCE</h2>
                            <p className="text-muted-foreground max-w-sm mb-8 leading-relaxed">
                                Focus on the highlighted bead. You should see two strings crossing exactly at the bead (the "X" pattern).
                            </p>
                            <Button onClick={startGame} size="xl" className="rounded-full px-12 text-lg font-bold shadow-xl shadow-primary/20">
                                Start Session
                            </Button>
                        </motion.div>
                    )}

                    {gameState === 'playing' && (
                        <div className="relative w-full h-[400px] flex items-center justify-center perspective-[1000px]">
                            {/* The String (Perspective) */}
                            <div className="absolute w-[120%] h-1 bg-white/10 rotate-x-[60deg] shadow-[0_0_10px_rgba(255,255,255,0.1)]" />

                            {/* Beads */}
                            <div className="flex justify-around items-center w-full px-12 gap-8 z-10">
                                {[0, 1, 2].map((idx) => (
                                    <motion.button
                                        key={idx}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleBeadClick(idx)}
                                        className={cn(
                                            "relative w-16 h-16 rounded-full border-4 transition-all duration-500 flex items-center justify-center group",
                                            activeBead === idx ? "border-primary bg-primary/20 scale-125 z-50 shadow-[0_0_40px_#7c3aed]" : "border-white/10 bg-white/5",
                                            beadStates[idx] && "border-green-500 bg-green-500/20"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-6 h-6 rounded-full",
                                            idx === 0 ? "bg-red-500" : idx === 1 ? "bg-yellow-500" : "bg-green-500"
                                        )} />

                                        {activeBead === idx && (
                                            <motion.div
                                                layoutId="glow"
                                                className="absolute -inset-4 border border-primary/30 rounded-full animate-ping"
                                            />
                                        )}

                                        <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold uppercase tracking-widest">
                                            {idx === 0 ? "Near" : idx === 1 ? "Mid" : "Far"}
                                        </div>
                                    </motion.button>
                                ))}
                            </div>

                            {/* Perspective Lines (The Virtual 'X') */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                                <line x1="0" y1="200" x2="100%" y2="200" stroke="white" strokeWidth="2" />
                            </svg>
                        </div>
                    )}

                    {gameState === 'complete' && (
                        <motion.div
                            key="complete"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center p-8 text-center"
                        >
                            <Trophy className="w-24 h-24 text-yellow-500 mb-6 drop-shadow-[0_0_30px_rgba(234,179,8,0.3)]" />
                            <h2 className="text-4xl font-black mb-2">CONVERGENCE ACHIEVED!</h2>
                            <p className="text-muted-foreground mb-8 text-lg">Your binocular alignment score is excellent.</p>
                            <div className="bg-primary/10 p-6 rounded-3xl mb-8 border border-primary/20 w-64">
                                <div className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Consistency</div>
                                <div className="text-4xl font-black">98%</div>
                            </div>
                            <div className="flex gap-4">
                                <Button onClick={startGame} variant="outline" className="rounded-full px-8">
                                    <RefreshCcw className="mr-2 h-4 w-4" /> Repeat
                                </Button>
                                <Button asChild className="rounded-full px-8">
                                    <Link href="/gym">Workout Hub</Link>
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>

            <CardFooter className="bg-slate-900 border-t border-white/5 p-6 space-y-4 flex flex-col">
                <div className="flex items-center gap-4 w-full justify-center">
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                        Convergence Focus
                    </Badge>
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                        Dipolpia Reduction
                    </Badge>
                </div>
                <p className="text-[10px] text-muted-foreground text-center italic">
                    Instructions: If you see two strings forming an 'X' at the bead, your eyes are converging correctly.
                    If the 'X' forms in front or behind, adjust your focus.
                </p>
            </CardFooter>
        </Card>
    );
}
