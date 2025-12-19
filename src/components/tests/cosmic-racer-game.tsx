
"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, Trophy, Rocket } from 'lucide-react';
import Link from 'next/link';

const TOTAL_LEVELS = 3;
const LAPS_PER_LEVEL = 5;

const StarField = () => {
    const stars = useMemo(() => Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 100}%`,
        size: Math.random() * 1.5 + 0.5,
        duration: Math.random() * 2 + 1,
    })), []);

    return (
        <div className="absolute inset-0 overflow-hidden">
            {stars.map(star => (
                <motion.div
                    key={star.id}
                    className="absolute bg-white rounded-full"
                    style={{
                        left: star.x,
                        top: star.y,
                        width: star.size,
                        height: star.size,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{
                        duration: star.duration,
                        repeat: Infinity,
                        repeatType: "loop",
                    }}
                />
            ))}
        </div>
    );
};


export function CosmicRacerGame() {
  const [gamePhase, setGamePhase] = useState<'intro' | 'playing' | 'complete'>('intro');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lapsCompleted, setLapsCompleted] = useState(0);
  
  const raceDuration = useMemo(() => 4000 - (level * 500), [level]);

  useEffect(() => {
    if (gamePhase !== 'playing') return;

    const lapTimer = setInterval(() => {
        setLapsCompleted(prev => {
            const newLaps = prev + 1;
            setScore(s => s + (level * 10));

            if (newLaps >= LAPS_PER_LEVEL) {
                if (level < TOTAL_LEVELS) {
                    setLevel(l => l + 1);
                    return 0; // Reset laps for next level
                } else {
                    setGamePhase('complete');
                    clearInterval(lapTimer);
                    return newLaps;
                }
            }
            return newLaps;
        })
    }, raceDuration);

    return () => clearInterval(lapTimer);
  }, [gamePhase, level, raceDuration]);

  const startGame = () => {
    setGamePhase('playing');
    setScore(0);
    setLevel(1);
    setLapsCompleted(0);
  };

  const resetGame = () => {
    setGamePhase('intro');
  };

  if (gamePhase === 'complete') {
    const starsEarned = Math.floor(score / 20);
    return (
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-900 p-4 sm:p-8 rounded-2xl text-white max-w-2xl mx-auto">
            <Card className="bg-white/10 border-blue-400/30 text-center">
                <CardHeader>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <CardTitle className="text-3xl">Cosmic Champion! 🚀</CardTitle>
                    </motion.div>
                    <CardDescription className="text-blue-300">Mission Accomplished!</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-blue-200">
                        Amazing piloting skills! You completed all {TOTAL_LEVELS} levels and {lapsCompleted} laps through the cosmic race track!
                    </p>
                    <div className="bg-black/20 p-4 rounded-lg">
                        <Trophy className="w-16 h-16 text-yellow-400 mx-auto animate-pulse" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/20 p-4 rounded-lg">
                            <p className="text-xs text-blue-300">Stars Earned</p>
                            <p className="text-2xl font-bold flex items-center justify-center gap-1"><Star className="w-6 h-6 text-yellow-400" /> {starsEarned}</p>
                        </div>
                        <div className="bg-black/20 p-4 rounded-lg">
                            <p className="text-xs text-blue-300">Total Points</p>
                            <p className="text-2xl font-bold">{score}</p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 mt-4">
                        <Button onClick={resetGame} className="w-full bg-blue-600 hover:bg-blue-700">
                            🚀 Race Again
                        </Button>
                        <Button variant="secondary" className="w-full" asChild>
                            <Link href="/tests"> <ArrowLeft className="mr-2 h-4 w-4" />Back to Tests</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
  }

  if (gamePhase === 'intro') {
     return (
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-900 p-4 sm:p-8 rounded-2xl text-white max-w-2xl mx-auto">
            <Card className="bg-white/10 border-blue-400/30 text-center">
                <CardHeader>
                    <CardTitle className="text-3xl">Cosmic Racer 🚀</CardTitle>
                    <CardDescription className="text-blue-300">Welcome, Space Pilot!</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-5xl">🌌</p>
                    <p className="text-blue-200">
                       You're the captain of a super-fast spaceship! Your mission is to follow the cosmic race track through the stars without moving your head.
                    </p>
                    <div className="bg-black/20 p-4 rounded-lg text-left">
                        <h4 className="font-semibold mb-2">🎯 Mission Briefing:</h4>
                        <ul className="text-sm text-blue-300 space-y-1 list-disc list-inside">
                            <li>Keep your head perfectly still.</li>
                            <li>Follow the spaceship with your eyes only.</li>
                            <li>The spaceship gets faster each level!</li>
                            <li>Complete all 3 levels to become a Cosmic Champion!</li>
                        </ul>
                    </div>
                    <Button onClick={startGame} size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                        Launch Mission
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 to-black p-4 rounded-2xl text-white max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4 font-mono text-sm">
        <span>⭐ {score} pts</span>
        <span>🏁 Level {level}</span>
        <span>🔄 {lapsCompleted}/{LAPS_PER_LEVEL} laps</span>
      </div>
      
      <div className="relative aspect-video flex items-center justify-center bg-black/20 rounded-lg overflow-hidden">
        <StarField />
        
        {/* Figure-8 Path */}
        <svg className="absolute w-full h-full" viewBox="0 0 400 200">
          <path
            d="M 100,100 a 50,50 0 1,1 100,0 a 50,50 0 1,0 100,0"
            fill="none"
            stroke="rgba(59, 130, 246, 0.3)"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
        </svg>

        {/* Spaceship */}
        <motion.div
            className="absolute w-10 h-10"
            style={{
                offsetPath: `path("M 100,100 a 50,50 0 1,1 100,0 a 50,50 0 1,0 100,0")`,
                offsetDistance: "0%",
                scale: 0.8
            }}
            animate={{ offsetDistance: "100%" }}
            transition={{ duration: raceDuration / 1000, ease: "linear", repeat: Infinity }}
        >
            <Rocket className="w-full h-full text-blue-400" style={{ transform: 'rotate(90deg)'}}/>
        </motion.div>
      </div>

        <div className="mt-4 text-center bg-blue-900/50 p-4 rounded-lg">
            <p className="font-semibold text-blue-200">
                🎯 Follow the spaceship with your eyes! Keep your head still and track smoothly.
            </p>
        </div>
    </div>
  );
}
