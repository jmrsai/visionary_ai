
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Gamepad2,
    Zap,
    RefreshCcw,
    Trophy,
    Glasses,
    Heart,
    Star,
    Info,
    ChevronRight,
    Play,
    Pause
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface GamePiece {
    id: number;
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    eye: 'left' | 'right' | 'both';
    shape: 'circle' | 'square' | 'triangle';
    size: number;
    isMatched: boolean;
}

export default function PuzzleFusionGame() {
    const [gameState, setGameState] = useState<'intro' | 'playing' | 'complete'>('intro');
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [pieces, setPieces] = useState<GamePiece[]>([]);
    const [selectedPieceId, setSelectedPieceId] = useState<number | null>(null);
    const [lives, setLives] = useState(3);

    const containerRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    // Generate Level Pieces
    const generateLevel = useCallback((lvl: number) => {
        const newPieces: GamePiece[] = [];
        const count = 3 + lvl; // Increase complexity

        for (let i = 0; i < count; i++) {
            // Target slots (stationary, visible to both)
            newPieces.push({
                id: i,
                x: 10 + (80 / count) * i,
                y: 20,
                targetX: 10 + (80 / count) * i,
                targetY: 20,
                eye: 'both',
                shape: ['circle', 'square', 'triangle'][i % 3] as any,
                size: 60,
                isMatched: false
            });

            // Movable pieces (visible to specific eyes)
            newPieces.push({
                id: i + 100,
                x: Math.random() * 80 + 10,
                y: Math.random() * 40 + 50,
                targetX: 10 + (80 / count) * i,
                targetY: 20,
                eye: i % 2 === 0 ? 'left' : 'right',
                shape: ['circle', 'square', 'triangle'][i % 3] as any,
                size: 50,
                isMatched: false
            });
        }
        setPieces(newPieces);
    }, []);

    const startGame = () => {
        setGameState('playing');
        setScore(0);
        setLevel(1);
        setLives(3);
        generateLevel(1);
    };

    const handlePieceInteraction = (id: number) => {
        if (gameState !== 'playing') return;

        const piece = pieces.find(p => p.id === id);
        if (!piece || piece.eye === 'both' || piece.isMatched) return;

        setSelectedPieceId(id);
    };

    const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (selectedPieceId === null || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        let clientX, clientY;

        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const x = ((clientX - rect.left) / rect.width) * 100;
        const y = ((clientY - rect.top) / rect.height) * 100;

        setPieces(prev => prev.map(p =>
            p.id === selectedPieceId ? { ...p, x, y } : p
        ));
    };

    const handleRelease = () => {
        if (selectedPieceId === null) return;

        const piece = pieces.find(p => p.id === selectedPieceId);
        if (!piece) {
            setSelectedPieceId(null);
            return;
        }

        // Check for match
        const dist = Math.sqrt(
            Math.pow(piece.x - piece.targetX, 2) +
            Math.pow(piece.y - piece.targetY, 2)
        );

        if (dist < 8) {
            setPieces(prev => prev.map(p =>
                (p.id === selectedPieceId || (p.targetX === piece.targetX && p.targetY === piece.targetY))
                    ? { ...p, isMatched: true, x: p.targetX, y: p.targetY }
                    : p
            ));
            setScore(prev => prev + 100);
            toast({
                title: "Fused!",
                description: "Vision synchronized perfectly.",
            });
        }

        setSelectedPieceId(null);
    };

    // Level completion check
    useEffect(() => {
        if (gameState === 'playing' && pieces.length > 0) {
            const unmatched = pieces.filter(p => p.eye !== 'both' && !p.isMatched);
            if (unmatched.length === 0) {
                if (level < 5) {
                    toast({ title: "Level Up!", description: `Moving to Level ${'${level + 1}'}` });
                    setLevel(prev => prev + 1);
                    generateLevel(level + 1);
                } else {
                    setGameState('complete');
                }
            }
        }
    }, [pieces, gameState, level, generateLevel, toast]);

    return (
        <Card className="glass-card border-primary/20 overflow-hidden shadow-2xl">
            <CardHeader className="border-b border-white/5 bg-white/5 pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/20 rounded-xl">
                            <Gamepad2 className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-black">Puzzle Fusion</CardTitle>
                            <CardDescription>Dichoptic Amblyopia Training</CardDescription>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Score</div>
                            <div className="text-xl font-black text-primary">{score}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Level</div>
                            <div className="text-xl font-black text-violet-500">{level}/5</div>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0 relative bg-slate-950">
                <AnimatePresence mode="wait">
                    {gameState === 'intro' && (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="aspect-video flex flex-col items-center justify-center p-8 text-center"
                        >
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 4 }}
                                className="mb-6 relative"
                            >
                                <Glasses className="w-24 h-24 text-primary opacity-20" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-red-500/80 blur-sm" />
                                        <div className="w-8 h-8 rounded-full bg-blue-500/80 blur-sm" />
                                    </div>
                                </div>
                            </motion.div>
                            <h2 className="text-3xl font-black mb-4 tracking-tight">READY FOR FUSION?</h2>
                            <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
                                Put on your <span className="text-red-500 font-bold">Red</span>-<span className="text-blue-500 font-bold">Blue</span> glasses.
                                Match the shapes to synchronize your eyes and improve binocular vision.
                            </p>
                            <Button onClick={startGame} size="xl" className="rounded-full px-12 text-lg font-bold shadow-xl shadow-primary/20">
                                Start Training
                            </Button>
                        </motion.div>
                    )}

                    {gameState === 'playing' && (
                        <motion.div
                            key="playing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="aspect-video relative overflow-hidden cursor-crosshair touch-none"
                            ref={containerRef}
                            onMouseMove={handleMove}
                            onTouchMove={handleMove}
                            onMouseUp={handleRelease}
                            onTouchEnd={handleRelease}
                        >
                            {/* Piece Rendering */}
                            {pieces.map((piece) => (
                                <motion.div
                                    key={piece.id}
                                    style={{
                                        left: `${'${piece.x}'}%`,
                                        top: `${'${piece.y}'}%`,
                                        width: `${'${piece.size}'}px`,
                                        height: `${'${piece.size}'}px`,
                                        marginLeft: `-${'${piece.size / 2}'}px`,
                                        marginTop: `-${'${piece.size / 2}'}px`,
                                    }}
                                    onMouseDown={() => handlePieceInteraction(piece.id)}
                                    onTouchStart={() => handlePieceInteraction(piece.id)}
                                    className={cn(
                                        "absolute flex items-center justify-center transition-colors duration-300",
                                        piece.eye === 'both' ? "border-2 border-white/20 border-dashed rounded-xl" : "shadow-lg cursor-grab active:cursor-grabbing",
                                        piece.isMatched && "opacity-20 scale-110 grayscale"
                                    )}
                                >
                                    {/* Dichoptic Channel Logic */}
                                    <div className={cn(
                                        "w-full h-full flex items-center justify-center",
                                        piece.eye === 'left' && "text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]",
                                        piece.eye === 'right' && "text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]",
                                        piece.eye === 'both' && "text-white/10"
                                    )}>
                                        {piece.shape === 'circle' && <div className="w-8 h-8 rounded-full bg-current" />}
                                        {piece.shape === 'square' && <div className="w-8 h-8 rounded-md bg-current" />}
                                        {piece.shape === 'triangle' && (
                                            <div
                                                className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[28px]"
                                                style={{ borderBottomColor: 'currentColor' }}
                                            />
                                        )}
                                    </div>

                                    {/* Selection Glow */}
                                    {selectedPieceId === piece.id && (
                                        <motion.div
                                            layoutId="selection"
                                            className="absolute -inset-2 rounded-full border border-white/40 animate-pulse"
                                        />
                                    )}
                                </motion.div>
                            ))}

                            {/* HUD Overlay */}
                            <div className="absolute top-4 left-4 flex gap-2">
                                <Badge variant="secondary" className="bg-black/50 backdrop-blur-md border-white/10">
                                    <Glasses className="w-3 h-3 mr-1" /> Dichoptic Active
                                </Badge>
                            </div>
                        </motion.div>
                    )}

                    {gameState === 'complete' && (
                        <motion.div
                            key="complete"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="aspect-video flex flex-col items-center justify-center p-8 text-center"
                        >
                            <Trophy className="w-24 h-24 text-yellow-500 mb-6 drop-shadow-[0_0_30px_rgba(234,179,8,0.3)]" />
                            <h2 className="text-4xl font-black mb-2">TRAINING COMPLETE!</h2>
                            <p className="text-muted-foreground mb-8">Excellent fusion. Your binocular coordination is improving.</p>
                            <div className="bg-primary/10 p-6 rounded-3xl mb-8 border border-primary/20">
                                <div className="text-sm font-bold uppercase tracking-widest text-primary mb-1">Final Score</div>
                                <div className="text-5xl font-black">{score}</div>
                            </div>
                            <div className="flex gap-4">
                                <Button onClick={startGame} variant="outline" className="rounded-full px-8">
                                    <RefreshCcw className="mr-2 h-4 w-4" /> Try Again
                                </Button>
                                <Button asChild className="rounded-full px-8">
                                    <Link href="/gym">Finish Workout</Link>
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>

            <div className="bg-slate-900 border-t border-white/5 p-4 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500" /> Left Eye
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-blue-500" /> Right Eye
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground italic">Developed with Vision Therapists</span>
                </div>
            </div>
        </Card>
    );
}
