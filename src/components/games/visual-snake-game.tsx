"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, RefreshCw, Trophy, Apple } from 'lucide-react';
import { useEventListener } from '@/hooks/use-event-listener';

const GRID_SIZE = 20;
const INITIAL_SNAKE_LENGTH = 3;
const GAME_SPEED_MS = 200;

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
    const [snake, setSnake] = useState<Position[]>([ { x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
    const [direction, setDirection] = useState<Direction>('UP');
    const [food, setFood] = useState<Position>(() => getRandomPosition(snake));
    const [score, setScore] = useState(0);

    const gameLoopRef = useRef<NodeJS.Timeout>();

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
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
        setSnake([ { x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
        setDirection('UP');
        setScore(0);
        setFood(getRandomPosition([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]));
        setGameState('playing');
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
                return prevSnake;
            }

            // Check for self collision
            if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
                setGameState('gameOver');
                return prevSnake;
            }

            newSnake.unshift(head);

            if (head.x === food.x && head.y === food.y) {
                setScore(s => s + 10);
                setFood(getRandomPosition(newSnake));
            } else {
                newSnake.pop();
            }
            
            return newSnake;
        });
    }, [direction, food]);

    useEffect(() => {
        if (gameState === 'playing') {
            gameLoopRef.current = setInterval(moveSnake, GAME_SPEED_MS);
        }
        return () => {
            if (gameLoopRef.current) clearInterval(gameLoopRef.current);
        };
    }, [gameState, moveSnake]);

    if (gameState === 'intro' || gameState === 'gameOver') {
        return (
            <div className="bg-gradient-to-br from-green-300 via-teal-300 to-blue-300 p-4 sm:p-8 rounded-2xl max-w-2xl mx-auto">
                <Card className="bg-white/80 border-green-400/30 text-center text-gray-800">
                    <CardHeader>
                        <CardTitle className="text-3xl">{gameState === 'intro' ? 'Visual Snake! 🐍' : 'Game Over! 💥'}</CardTitle>
                        <CardDescription className="text-teal-700">{gameState === 'intro' ? "A game to test your reaction time!" : `You scored ${score} points!`}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <p className="text-5xl">{gameState === 'intro' ? '🍎' : '🎉'}</p>
                        <p className="text-teal-800">
                            {gameState === 'intro'
                                ? "Use your arrow keys to guide the snake and eat the apples. Don't hit the walls or yourself!"
                                : "That was a great run! Practice makes perfect."}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2 mt-4">
                            <Button onClick={startGame} className="w-full bg-green-600 hover:bg-green-700 text-white">
                                {gameState === 'intro' ? <Play className="mr-2 h-4 w-4"/> : <RefreshCw className="mr-2 h-4 w-4" />}
                                {gameState === 'intro' ? "Start Game" : "Play Again"}
                            </Button>
                            <Button variant="secondary" className="w-full" onClick={onBack}>
                                <ArrowLeft className="mr-2 h-4 w-4" />Back to Games
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="font-mono text-lg">Score: {score}</div>
            <div className="grid bg-green-100 dark:bg-green-900/50 p-2 rounded-md border-2 border-green-300" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
                {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
                    const x = i % GRID_SIZE;
                    const y = Math.floor(i / GRID_SIZE);
                    const isSnake = snake.some(seg => seg.x === x && seg.y === y);
                    const isFood = food.x === x && food.y === y;
                    
                    return (
                        <div key={i} className="aspect-square w-full">
                           {isSnake ? (
                                <div className="w-full h-full bg-green-600 rounded-sm"></div>
                           ) : isFood ? (
                                <div className="w-full h-full flex items-center justify-center text-red-500">
                                    <Apple className="w-full h-full" />
                                </div>
                           ) : null}
                        </div>
                    )
                })}
            </div>
            <p className="text-muted-foreground text-sm">Use arrow keys to control the snake</p>
        </div>
    );
}