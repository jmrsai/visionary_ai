
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, Trophy, Rocket, ShieldAlert, Zap, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// --- Game Settings ---
const GAME_DURATION_S = 60;
const SHIP_SIZE = 44;
const STAR_SIZE = 28;
const ASTEROID_SIZE = 34;
const POWERUP_SIZE = 30;
const STAR_SPAWN_RATE_MS = 1800;
const ASTEROID_SPAWN_RATE_MS = 1400;
const POWERUP_SPAWN_RATE_MS = 8000;

// --- Types ---
type GameObject = {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    rotation: number;
    type: 'star' | 'asteroid' | 'shield' | 'boost';
};

const StarField = React.memo(() => {
    const stars = React.useMemo(() => Array.from({ length: 60 }).map((_, i) => ({
        id: i,
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 100}%`,
        size: Math.random() * 2 + 0.5,
        duration: Math.random() * 3 + 2,
    })), []);

    return (
        <div className="absolute inset-0 overflow-hidden bg-[#050510]">
            {stars.map(star => (
                <motion.div
                    key={star.id}
                    className="absolute bg-white rounded-full"
                    style={{ left: star.x, top: star.y, width: star.size, height: star.size }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: star.duration, repeat: Infinity, repeatType: "loop" }}
                />
            ))}
        </div>
    );
});
StarField.displayName = "StarField";

export function CosmicRacerGame() {
    const [gameState, setGameState] = useState<'intro' | 'playing' | 'complete'>('intro');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION_S);
    const [isShielded, setIsShielded] = useState(false);
    const [multiplier, setMultiplier] = useState(1);

    const gameAreaRef = useRef<HTMLDivElement>(null);
    const shipPositionRef = useRef({ x: 0, y: 0 });
    const gameObjectsRef = useRef<GameObject[]>([]);
    const animationFrameRef = useRef<number>();
    const timersRef = useRef<NodeJS.Timeout[]>([]);
    const difficultyRef = useRef(1);

    const resetGame = useCallback(() => {
        setGameState('intro');
        setScore(0);
        setTimeLeft(GAME_DURATION_S);
        setIsShielded(false);
        setMultiplier(1);
        difficultyRef.current = 1;
        gameObjectsRef.current = [];
        timersRef.current.forEach(clearInterval);
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    }, []);

    const startGame = useCallback(() => {
        setScore(0);
        setTimeLeft(GAME_DURATION_S);
        setIsShielded(false);
        setMultiplier(1);
        difficultyRef.current = 1;
        gameObjectsRef.current = [];
        setGameState('playing');
    }, []);

    const checkCollision = (obj: GameObject) => {
        const ship = shipPositionRef.current;
        const dx = obj.x - (ship.x - SHIP_SIZE / 2);
        const dy = obj.y - (ship.y - SHIP_SIZE / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        const radius = (SHIP_SIZE + (obj.type === 'star' ? STAR_SIZE : ASTEROID_SIZE)) / 2.5;
        return distance < radius;
    };

    const gameLoop = useCallback(() => {
        // Increase difficulty over time
        difficultyRef.current = 1 + (score / 200) + ((GAME_DURATION_S - timeLeft) / 30);

        gameObjectsRef.current.forEach((obj, index) => {
            obj.x += obj.vx * difficultyRef.current;
            obj.y += obj.vy * difficultyRef.current;
            obj.rotation += 2;

            if (checkCollision(obj)) {
                if (obj.type === 'star') {
                    setScore(s => s + (10 * multiplier));
                    gameObjectsRef.current.splice(index, 1);
                } else if (obj.type === 'shield') {
                    setIsShielded(true);
                    setTimeout(() => setIsShielded(false), 5000);
                    gameObjectsRef.current.splice(index, 1);
                } else if (obj.type === 'boost') {
                    setMultiplier(2);
                    setTimeout(() => setMultiplier(1), 5000);
                    gameObjectsRef.current.splice(index, 1);
                } else if (obj.type === 'asteroid') {
                    if (isShielded) {
                        setIsShielded(false);
                        gameObjectsRef.current.splice(index, 1);
                    } else {
                        setGameState('complete');
                    }
                }
            }

            // Remove if off-screen
            if (obj.x < -100 || obj.x > (gameAreaRef.current?.offsetWidth || 0) + 100 ||
                obj.y < -100 || obj.y > (gameAreaRef.current?.offsetHeight || 0) + 100) {
                gameObjectsRef.current.splice(index, 1);
            }
        });

        if (gameAreaRef.current) {
            const gameObjects = gameAreaRef.current.querySelectorAll('.game-object');
            // This is a bit hacky, manual DOM manipulation for performance in the loop
            gameObjectsRef.current.forEach((obj, i) => {
                const el = gameAreaRef.current?.querySelector(`[data-id="${obj.id}"]`);
                if (el) {
                    (el as HTMLElement).style.transform = `translate(${obj.x}px, ${obj.y}px) rotate(${obj.rotation}deg)`;
                }
            });
        }

        animationFrameRef.current = requestAnimationFrame(gameLoop);
    }, [isShielded, multiplier, score, timeLeft]);

    useEffect(() => {
        if (gameState === 'playing') {
            const gameArea = gameAreaRef.current;
            if (!gameArea) return;

            const handleMouseMove = (e: MouseEvent) => {
                const rect = gameArea.getBoundingClientRect();
                shipPositionRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
                const shipEl = gameArea.querySelector('#ship');
                if (shipEl) {
                    (shipEl as HTMLElement).style.transform = `translate(${shipPositionRef.current.x - SHIP_SIZE / 2}px, ${shipPositionRef.current.y - SHIP_SIZE / 2}px)`;
                }
            };

            gameArea.addEventListener('mousemove', handleMouseMove);

            const spawnObject = (type: 'star' | 'asteroid' | 'shield' | 'boost') => {
                const side = Math.floor(Math.random() * 4);
                let x = 0, y = 0, vx = 0, vy = 0;
                const baseSpeed = type === 'star' ? 1.5 : (type === 'asteroid' ? 2 : 1.2);

                switch (side) {
                    case 0: // top
                        x = Math.random() * gameArea.offsetWidth; y = -50;
                        vx = Math.random() - 0.5; vy = baseSpeed; break;
                    case 1: // right
                        x = gameArea.offsetWidth + 50; y = Math.random() * gameArea.offsetHeight;
                        vx = -baseSpeed; vy = Math.random() - 0.5; break;
                    case 2: // bottom
                        x = Math.random() * gameArea.offsetWidth; y = gameArea.offsetHeight + 50;
                        vx = Math.random() - 0.5; vy = -baseSpeed; break;
                    default: // left
                        x = -50; y = Math.random() * gameArea.offsetHeight;
                        vx = baseSpeed; vy = Math.random() - 0.5; break;
                }

                gameObjectsRef.current.push({ id: Math.random(), x, y, vx, vy, rotation: Math.random() * 360, type });
            };

            const countdownTimer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        setGameState('complete');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            const starTimer = setInterval(() => spawnObject('star'), STAR_SPAWN_RATE_MS);
            const asteroidTimer = setInterval(() => spawnObject('asteroid'), ASTEROID_SPAWN_RATE_MS);
            const powerupTimer = setInterval(() => spawnObject(Math.random() > 0.5 ? 'shield' : 'boost'), POWERUP_SPAWN_RATE_MS);

            timersRef.current = [countdownTimer, starTimer, asteroidTimer, powerupTimer];

            animationFrameRef.current = requestAnimationFrame(gameLoop);

            return () => {
                gameArea.removeEventListener('mousemove', handleMouseMove);
                timersRef.current.forEach(clearInterval);
                if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            };
        }
    }, [gameState, gameLoop]);

    if (gameState === 'intro') {
        return (
            <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 p-4 sm:p-8 rounded-3xl text-white max-w-2xl mx-auto shadow-2xl border border-white/10">
                <Card className="bg-white/5 border-white/10 text-center backdrop-blur-md">
                    <CardHeader>
                        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                            <CardTitle className="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">COSMIC RACER 2.0</CardTitle>
                            <CardDescription className="text-blue-300/80 text-lg">Advanced Neuro-Visual Training</CardDescription>
                        </motion.div>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="flex justify-center gap-8">
                            <div className="flex flex-col items-center">
                                <div className="p-4 bg-yellow-400/10 rounded-2xl mb-2">
                                    <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                                </div>
                                <span className="text-xs text-blue-200">Points</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="p-4 bg-blue-400/10 rounded-2xl mb-2 text-blue-400">
                                    <Rocket className="w-8 h-8 -rotate-45" />
                                </div>
                                <span className="text-xs text-blue-200">Pilot</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="p-4 bg-red-400/10 rounded-2xl mb-2">
                                    <ShieldAlert className="w-8 h-8 text-red-400" />
                                </div>
                                <span className="text-xs text-blue-200">Avoid</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-left">
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                                <div className="flex items-center gap-2 mb-2 text-cyan-400">
                                    <ShieldCheck className="w-4 h-4" />
                                    <h4 className="font-bold text-sm uppercase italic">Shields</h4>
                                </div>
                                <p className="text-xs text-blue-200">Absorbs one asteroid collision. 5s duration.</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                                <div className="flex items-center gap-2 mb-2 text-yellow-400">
                                    <Zap className="w-4 h-4" />
                                    <h4 className="font-bold text-sm uppercase italic">Boost</h4>
                                </div>
                                <p className="text-xs text-blue-200">Double points for all stars collected. 5s duration.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button variant="ghost" asChild className="flex-1 text-blue-300 hover:text-white hover:bg-white/10">
                                <Link href="/gym"><ArrowLeft className="mr-2 h-4 w-4" /> Exit</Link>
                            </Button>
                            <Button onClick={startGame} size="lg" className="flex-[2] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold shadow-xl shadow-blue-500/20">
                                INITIATE MISSION
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (gameState === 'complete') {
        return (
            <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 p-4 sm:p-8 rounded-3xl text-white max-w-2xl mx-auto shadow-2xl border border-white/10">
                <Card className="bg-white/5 border-white/10 text-center backdrop-blur-md">
                    <CardHeader>
                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                            <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4 filter drop-shadow-[0_0_15px_rgba(250,204,21,0.4)]" />
                            <CardTitle className="text-4xl font-black">MISSION REPORT</CardTitle>
                        </motion.div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                                <p className="text-sm text-blue-300 mb-1">Time Survived</p>
                                <p className="text-4xl font-black text-white">{GAME_DURATION_S - timeLeft}s</p>
                            </div>
                            <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                                <p className="text-sm text-blue-300 mb-1">Total Score</p>
                                <p className="text-4xl font-black text-white">{score}</p>
                            </div>
                        </div>

                        <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20">
                            <p className="text-primary font-bold">EXCELLENT PERFORMANCE!</p>
                            <p className="text-xs text-blue-200 mt-1">Difficulty reached: {difficultyRef.current.toFixed(2)}x speed</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button onClick={startGame} className="flex-1 bg-white text-black hover:bg-gray-200 font-bold py-6 text-lg rounded-2xl">
                                <Rocket className="mr-2 h-5 w-5" /> RE-ENTER ORBIT
                            </Button>
                            <Button variant="outline" className="flex-1 border-white/20 hover:bg-white/10 py-6 text-lg rounded-2xl" asChild>
                                <Link href="/gym"><ArrowLeft className="mr-2 h-5 w-5" /> RETURN TO BASE</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center space-y-4 w-full px-4">
            <div className="flex justify-between items-center w-full max-w-2xl font-black text-xs tracking-tighter uppercase p-4 rounded-2xl bg-slate-900 shadow-2xl border border-white/10 text-white relative overflow-hidden">
                <div className="flex gap-6 items-center relative z-10">
                    <span className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        SCORE: {score}
                    </span>
                    <span className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-blue-400" />
                        MULTIPLIER: x{multiplier}
                    </span>
                </div>
                <span className="text-2xl font-black tabular-nums transition-all relative z-10" style={{ color: timeLeft < 10 ? '#ef4444' : 'white' }}>
                    {timeLeft}s
                </span>

                {/* Progress bar background */}
                <div className="absolute bottom-0 left-0 h-1 bg-blue-500/30 w-full" />
                <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-blue-500"
                    initial={{ width: "100%" }}
                    animate={{ width: `${(timeLeft / GAME_DURATION_S) * 100}%` }}
                />
            </div>

            <div
                ref={gameAreaRef}
                className="relative w-full aspect-video max-w-2xl bg-[#050510] rounded-[2.5rem] overflow-hidden border-2 border-white/10 shadow-[0_0_50px_rgba(59,130,246,0.15)] cursor-none"
            >
                <StarField />

                <AnimatePresence>
                    {/* Objects are rendered inside and managed via ref-based manual DOM for performance, 
                but we need the initial structure */}
                    <div className="pointer-events-none items-container">
                        {/* This is just a placeholder to let React manage the components, 
                    but the positions are updated via ref for high-freq updates */}
                        {gameObjectsRef.current.map(obj => (
                            <div
                                key={obj.id}
                                data-id={obj.id}
                                className="game-object absolute flex items-center justify-center"
                                style={{ width: 40, height: 40 }}
                            >
                                {obj.type === 'star' && <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 filter drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />}
                                {obj.type === 'asteroid' && <ShieldAlert className="w-8 h-8 text-slate-500 fill-slate-800" />}
                                {obj.type === 'shield' && <ShieldCheck className="w-7 h-7 text-cyan-400 filter drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]" />}
                                {obj.type === 'boost' && <Zap className="w-7 h-7 text-yellow-500 fill-yellow-500 filter drop-shadow-[0_0_10px_rgba(234,179,8,0.6)]" />}
                            </div>
                        ))}
                    </div>
                </AnimatePresence>

                <div id="ship" className="absolute transition-all duration-75 ease-out" style={{ width: SHIP_SIZE, height: SHIP_SIZE }}>
                    <div className="relative w-full h-full">
                        {isShielded && (
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="absolute inset-[-10px] rounded-full border-2 border-cyan-400/50 bg-cyan-400/10 shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                            />
                        )}
                        {multiplier > 1 && (
                            <motion.div
                                animate={{ opacity: [0, 0.5, 0] }}
                                transition={{ repeat: Infinity, duration: 0.5 }}
                                className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-black text-yellow-400 whitespace-nowrap"
                            >
                                BOOST X2
                            </motion.div>
                        )}
                        <Rocket className="w-full h-full text-blue-400 -rotate-45 filter drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]" />
                    </div>
                </div>
            </div>

            <div className="flex gap-4 w-full max-w-2xl px-2">
                <div className="flex-1 glass-card p-4 rounded-2xl flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-xl">
                        <Gamepad2 className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <p className="text-[10px] text-blue-300 font-bold uppercase tracking-widest">Training Mode</p>
                        <p className="text-sm font-bold">Dynamic Tracking</p>
                    </div>
                </div>
                <div className="flex-1 glass-card p-4 rounded-2xl flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-xl">
                        <TrendingUp className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                        <p className="text-[10px] text-purple-300 font-bold uppercase tracking-widest">Intensity</p>
                        <p className="text-sm font-bold">{difficultyRef.current.toFixed(2)}x Speed</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
