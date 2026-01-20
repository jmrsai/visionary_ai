"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, RefreshCw, Trophy, Apple, Sparkles, BrainCircuit } from 'lucide-react';
import { useEventListener } from '@/hooks/use-event-listener';
import { generateGameFeedback } from '@/ai/flows/game-feedback';
import { cn } from '@/lib/utils';

const GRID_SIZE = 20;
const INITIAL_SPEED = 180;
const MIN_SPEED = 80;

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number, y: number };

const getRandomPosition = (snakeBody: Position[]): Position => {
    let position: Position;
    do {
        position = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE),
        };
    } while (snakeBody.some(segment => segment.x === position.x && segment.y === position.y));
    return position;
};

export function VisualSnakeGame({ onBack }: { onBack: () => void }) {
    const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameOver'>('intro');
    const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
    const [direction, setDirection] = useState<Direction>('UP');
    const [food, setFood] = useState<Position>(() => getRandomPosition(snake));
    const [score, setScore] = useState(0);
    const [aiFeedback, setAiFeedback] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const gameLoopRef = useRef<ReturnType<typeof setInterval>>();
    const speedRef = useRef(INITIAL_SPEED);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;

        e.preventDefault();
        switch (e.key) {
            case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
            case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
            case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
            case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        }
    }, [direction]);

    useEventListener('keydown', handleKeyDown);

    const startGame = () => {
        setSnake([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
        setDirection('UP');
        setScore(0);
        speedRef.current = INITIAL_SPEED;
        setAiFeedback(null);
        setFood(getRandomPosition([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]));
        setGameState('playing');
    };

    const fetchFeedback = async (finalScore: number) => {
        setIsAnalyzing(true);
        try {
            const feedback = await generateGameFeedback({ gameName: 'Visual Snake', score: finalScore });
            setAiFeedback(feedback);
        } catch (error) {
            console.error(error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const moveSnake = useCallback(() => {
        setSnake(prevSnake => {
            const newSnake = [...prevSnake];
            let head = { ...newSnake[0] };

            switch (direction) {
                case 'UP': head.y -= 1; break;
                case 'DOWN': head.y += 1; break;
                case 'LEFT': head.x -= 1; break;
                case 'RIGHT': head.x += 1; break;
            }

            // Check for wall collision
            if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
                setGameState('gameOver');
                fetchFeedback(score);
                return prevSnake;
            }

            // Check for self collision
            if (newSnake.some((segment: Position) => segment.x === head.x && segment.y === head.y)) {
                setGameState('gameOver');
                fetchFeedback(score);
                return prevSnake;
            }

            newSnake.unshift(head);

            if (head.x === food.x && head.y === food.y) {
                const newScore = score + 10;
                setScore(newScore);
                setFood(getRandomPosition(newSnake));
                // Speed up every 50 points
                if (newScore % 50 === 0) {
                    speedRef.current = Math.max(MIN_SPEED, speedRef.current - 15);
                }
            } else {
                newSnake.pop();
            }

            return newSnake;
        });
    }, [direction, food, score, fetchFeedback]);

    useEffect(() => {
        if (gameState === 'playing') {
            gameLoopRef.current = setInterval(moveSnake, speedRef.current);
        }
        return () => {
            if (gameLoopRef.current) clearInterval(gameLoopRef.current);
        };
    }, [gameState, moveSnake]);

    if (gameState === 'intro' || gameState === 'gameOver') {
        return (
            <div className="bg-[#0a0a0f] p-4 sm:p-8 rounded-[2rem] max-w-2xl mx-auto border border-purple-500/20 shadow-[0_0_40px_rgba(168,85,247,0.1)]">
                <Card className="bg-transparent border-none text-center text-white">
                    <CardHeader>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                            <CardTitle className="text-5xl font-black italic tracking-tighter bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                                {gameState === 'intro' ? 'NEON SNAKE' : 'GAME OVER'}
                            </CardTitle>
                            <CardDescription className="text-purple-300 font-mono mt-2">
                                {gameState === 'intro' ? "CYBERNETIC REFLEX TRAINING" : `FINAL PROTOCOL REACHED: ${score} UNITS`}
                            </CardDescription>
                        </motion.div>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {gameState === 'gameOver' && (
                            <div className="space-y-4">
                                <AnimatePresence mode="wait">
                                    {isAnalyzing ? (
                                        <motion.div
                                            key="analyzing"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="bg-white/5 border border-purple-500/20 p-6 rounded-3xl"
                                        >
                                            <div className="flex items-center justify-center gap-3">
                                                <BrainCircuit className="w-5 h-5 text-purple-400 animate-pulse" />
                                                <p className="text-sm font-mono text-purple-200">AI COACH ANALYZING PERFORMANCE...</p>
                                            </div>
                                        </motion.div>
                                    ) : aiFeedback ? (
                                        <motion.div
                                            key="feedback"
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            className="bg-purple-500/10 border border-purple-500/30 p-6 rounded-3xl text-left relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                                <Sparkles className="w-12 h-12 text-purple-400" />
                                            </div>
                                            <p className="text-purple-100 italic leading-relaxed font-medium">"{aiFeedback}"</p>
                                        </motion.div>
                                    ) : null}
                                </AnimatePresence>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button onClick={startGame} className="flex-[2] bg-purple-600 hover:bg-purple-500 text-white font-bold h-14 rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                                {gameState === 'intro' ? <Play className="mr-2 h-5 w-5" /> : <RefreshCw className="mr-2 h-5 w-5" />}
                                {gameState === 'intro' ? "BOOT SYSTEM" : "REBOOT PROGRAM"}
                            </Button>
                            <Button variant="outline" className="flex-1 border-white/10 text-white hover:bg-white/10 h-14 rounded-2xl" onClick={onBack}>
                                <ArrowLeft className="mr-2 h-5 w-5" /> EXIT
                            </Button>
                        </div>

                        {gameState === 'intro' && (
                            <p className="text-xs font-mono text-slate-500 mt-4 uppercase tracking-[0.2em]">
                                Use arrow keys to navigate the grid architecture
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center space-y-6">
            <div className="flex justify-between w-full max-w-md px-6 py-3 bg-[#0a0a0f] border border-purple-500/30 rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.1)]">
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Score</span>
                    <span className="text-xl font-black text-white tabular-nums">{score}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Latency</span>
                    <span className="text-xl font-black text-white tabular-nums">{speedRef.current}ms</span>
                </div>
            </div>

            <div
                className="grid relative bg-[#050508] p-1 rounded-2xl border-2 border-purple-500/20 shadow-[0_0_50px_rgba(168,85,247,0.15)] overflow-hidden"
                style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, width: 'min(90vw, 500px)', height: 'min(90vw, 500px)' }}
            >
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 pointer-events-none opacity-20"
                    style={{ backgroundImage: 'linear-gradient(#4a4a4a 1px, transparent 1px), linear-gradient(90deg, #4a4a4a 1px, transparent 1px)', backgroundSize: '25px 25px' }}
                />

                {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
                    const x = i % GRID_SIZE;
                    const y = Math.floor(i / GRID_SIZE);
                    const isHead = snake[0].x === x && snake[0].y === y;
                    const isSnake = snake.some((seg: Position) => seg.x === x && seg.y === y);
                    const isFood = food.x === x && food.y === y;

                    return (
                        <div key={i} className="aspect-square w-full p-[1px]">
                            {isSnake ? (
                                <motion.div
                                    initial={false}
                                    animate={{ scale: isHead ? 1.1 : 1 }}
                                    className={cn(
                                        "w-full h-full rounded-sm shadow-[0_0_8px_rgba(168,85,247,0.4)]",
                                        isHead ? "bg-purple-400 z-10" : "bg-purple-600/80"
                                    )}
                                />
                            ) : isFood ? (
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                    className="w-full h-full flex items-center justify-center text-pink-500"
                                >
                                    <div className="w-2.5 h-2.5 bg-pink-500 rounded-full shadow-[0_0_12px_rgba(236,72,153,1)]" />
                                </motion.div>
                            ) : null}
                        </div>
                    )
                })}
            </div>

            <div className="flex gap-2 items-center text-slate-500 font-mono text-[10px] uppercase tracking-widest">
                <div className="flex gap-1">
                    <div className="w-3 h-3 bg-purple-400 rounded-sm" />
                    <span>User</span>
                </div>
                <div className="w-4 h-[1px] bg-slate-800" />
                <div className="flex gap-1">
                    <div className="w-3 h-3 bg-pink-500 rounded-full shadow-[0_0_5px_rgba(236,72,153,1)]" />
                    <span>Target</span>
                </div>
            </div>
        </div>
    );
}
