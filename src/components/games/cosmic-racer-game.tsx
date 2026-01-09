
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Trophy, Rocket, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// --- Game Settings ---
const GAME_DURATION_S = 60;
const SHIP_SIZE = 40;
const STAR_SIZE = 25;
const ASTEROID_SIZE = 30;
const STAR_SPAWN_RATE_MS = 2000;
const ASTEROID_SPAWN_RATE_MS = 1500;

// --- Types ---
type GameObject = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  type: 'star' | 'asteroid';
};

const StarField = React.memo(() => {
    const stars = React.useMemo(() => Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 100}%`,
        size: Math.random() * 1.5 + 0.5,
        duration: Math.random() * 2 + 3,
    })), []);

    return (
        <div className="absolute inset-0 overflow-hidden">
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
  
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const shipPositionRef = useRef({ x: 0, y: 0 });
  const gameObjectsRef = useRef<GameObject[]>([]);
  const animationFrameRef = useRef<number>();
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const resetGame = useCallback(() => {
    setGameState('intro');
    setScore(0);
    setTimeLeft(GAME_DURATION_S);
    gameObjectsRef.current = [];
    timersRef.current.forEach(clearTimeout);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
  }, []);

  const startGame = useCallback(() => {
    setScore(0);
    setTimeLeft(GAME_DURATION_S);
    gameObjectsRef.current = [];
    setGameState('playing');
  }, []);

  const checkCollision = (obj: GameObject) => {
    const ship = shipPositionRef.current;
    const dx = obj.x - ship.x;
    const dy = obj.y - ship.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < (SHIP_SIZE + (obj.type === 'star' ? STAR_SIZE : ASTEROID_SIZE)) / 2;
  };
  
  const gameLoop = useCallback(() => {
    gameObjectsRef.current.forEach((obj, index) => {
        obj.x += obj.vx;
        obj.y += obj.vy;
        
        // Check for collision
        if (checkCollision(obj)) {
            if (obj.type === 'star') {
                setScore(s => s + 10);
                gameObjectsRef.current.splice(index, 1);
            } else if (obj.type === 'asteroid') {
                setGameState('complete');
            }
        }
        
        // Remove if off-screen
        if (obj.x < -50 || obj.x > (gameAreaRef.current?.offsetWidth || 0) + 50 ||
            obj.y < -50 || obj.y > (gameAreaRef.current?.offsetHeight || 0) + 50) {
            gameObjectsRef.current.splice(index, 1);
        }
    });

    if (gameAreaRef.current) {
        const gameObjects = gameAreaRef.current.querySelectorAll('.game-object');
        gameObjects.forEach((el, index) => {
            const obj = gameObjectsRef.current[index];
            if (obj) {
                (el as HTMLElement).style.transform = `translate(${obj.x}px, ${obj.y}px) rotate(${obj.rotation}deg)`;
            }
        });
    }
    
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, []);

  useEffect(() => {
    if (gameState === 'playing') {
      const gameArea = gameAreaRef.current;
      if (!gameArea) return;

      const handleMouseMove = (e: MouseEvent) => {
        const rect = gameArea.getBoundingClientRect();
        shipPositionRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        const shipEl = gameArea.querySelector('#ship');
        if (shipEl) {
            (shipEl as HTMLElement).style.transform = `translate(${shipPositionRef.current.x - SHIP_SIZE/2}px, ${shipPositionRef.current.y - SHIP_SIZE/2}px)`;
        }
      };
      
      gameArea.addEventListener('mousemove', handleMouseMove);

      const spawnObject = (type: 'star' | 'asteroid') => {
        const side = Math.floor(Math.random() * 4);
        let x, y, vx, vy;
        const speed = type === 'star' ? 1.5 : 2;

        switch (side) {
            case 0: // top
                x = Math.random() * gameArea.offsetWidth; y = -ASTEROID_SIZE;
                vx = Math.random() - 0.5; vy = speed; break;
            case 1: // right
                x = gameArea.offsetWidth + ASTEROID_SIZE; y = Math.random() * gameArea.offsetHeight;
                vx = -speed; vy = Math.random() - 0.5; break;
            case 2: // bottom
                x = Math.random() * gameArea.offsetWidth; y = gameArea.offsetHeight + ASTEROID_SIZE;
                vx = Math.random() - 0.5; vy = -speed; break;
            default: // left
                x = -ASTEROID_SIZE; y = Math.random() * gameArea.offsetHeight;
                vx = speed; vy = Math.random() - 0.5; break;
        }

        gameObjectsRef.current.push({ id: Date.now(), x, y, vx, vy, rotation: Math.random() * 360, type });
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
      timersRef.current = [countdownTimer, starTimer, asteroidTimer];

      animationFrameRef.current = requestAnimationFrame(gameLoop);
      
      return () => {
        gameArea.removeEventListener('mousemove', handleMouseMove);
        timersRef.current.forEach(clearTimeout);
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      };
    }
  }, [gameState, gameLoop]);
  
  if (gameState === 'intro') {
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
                       You're the captain of a super-fast spaceship! Your mission is to navigate through a dangerous asteroid field.
                    </p>
                    <div className="bg-black/20 p-4 rounded-lg text-left">
                        <h4 className="font-semibold mb-2">🎯 Mission Briefing:</h4>
                        <ul className="text-sm text-blue-300 space-y-1 list-disc list-inside">
                            <li>Move your mouse to control the spaceship.</li>
                            <li>Collect the shining stars for points!</li>
                            <li>Dodge the dangerous asteroids!</li>
                            <li>Survive as long as you can!</li>
                        </ul>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outline" asChild className="w-full">
                           <Link href="/gym"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Link>
                        </Button>
                        <Button onClick={startGame} size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                            Launch Mission
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
  }

  if (gameState === 'complete') {
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
                        Amazing piloting skills! You survived the asteroid field!
                    </p>
                    <div className="bg-black/20 p-4 rounded-lg">
                        <Trophy className="w-16 h-16 text-yellow-400 mx-auto animate-pulse" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/20 p-4 rounded-lg">
                            <p className="text-xs text-blue-300">Time Survived</p>
                            <p className="text-2xl font-bold">{GAME_DURATION_S - timeLeft}s</p>
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
                           <Link href="/gym"><ArrowLeft className="mr-2 h-4 w-4" />Back to Gym</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4 w-full">
      <div className="flex justify-between items-center w-full max-w-2xl font-mono text-sm p-2 rounded-lg bg-slate-800 border border-slate-700 text-white">
        <span>⭐ Score: {score}</span>
        <span>⏳ Time: {timeLeft}s</span>
      </div>
      
      <div 
        ref={gameAreaRef}
        className="relative w-full aspect-video max-w-2xl bg-gradient-to-br from-slate-900 to-black rounded-lg overflow-hidden border-2 border-slate-700 cursor-none"
      >
        <StarField />
        
        {/* Render game objects - this part could be more optimized with canvas for many objects */}
        {gameObjectsRef.current.map(obj => (
            <div key={obj.id} className="game-object absolute" style={{ width: obj.type === 'star' ? STAR_SIZE : ASTEROID_SIZE, height: obj.type === 'star' ? STAR_SIZE : ASTEROID_SIZE}}>
                {obj.type === 'star' ? <Star className="w-full h-full text-yellow-400 fill-yellow-400" /> : <ShieldAlert className="w-full h-full text-slate-400 fill-slate-600" />}
            </div>
        ))}
        
        <div id="ship" className="absolute" style={{width: SHIP_SIZE, height: SHIP_SIZE}}>
            <Rocket className="w-full h-full text-blue-400 -rotate-45" />
        </div>
      </div>
      
      <div className="mt-4 text-center bg-blue-900/50 p-4 rounded-lg text-white max-w-2xl">
            <p className="font-semibold text-blue-200">
                🎯 Collect stars and dodge asteroids!
            </p>
        </div>
    </div>
  );
}
