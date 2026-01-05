"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, RefreshCw, Trophy, Star, Lightbulb } from 'lucide-react';
import Link from 'next/link';

// --- Game Settings ---
const GAME_DURATION_S = 60;
const WORDS_PER_LEVEL = 3;
const BASE_POINTS = 10;
const TIME_BONUS_MULTIPLIER = 5;

const levels: { [key: number]: { wordLength: number; scrambleStrength: number } } = {
  1: { wordLength: 3, scrambleStrength: 1 },
  2: { wordLength: 4, scrambleStrength: 2 },
  3: { wordLength: 5, scrambleStrength: 3 },
  4: { wordLength: 6, scrambleStrength: 4 },
};

// Simple word list, in a real app this could come from an AI flow
const wordList = [
    "cat", "dog", "sun", "run", "big", "see", "one", "two", "red", "blue",
    "four", "five", "play", "ball", "jump", "tree", "read", "book", "food", "work",
    "apple", "happy", "smile", "laugh", "water", "earth", "space", "friend", "school",
    "planet", "summer", "winter", "orange", "yellow", "purple", "animal"
];

const scrambleWord = (word: string, strength: number): string[] => {    
    let letters = word.split('');
    for (let i = 0; i < strength * 2; i++) {
        const idx1 = Math.floor(Math.random() * letters.length);
        let idx2 = Math.floor(Math.random() * letters.length);
        // Ensure different indices
        if (idx1 === idx2) idx2 = (idx1 + 1) % letters.length;
        [letters[idx1], letters[idx2]] = [letters[idx2], letters[idx1]];
    }
    return letters;
};

const getWordsForLevel = (level: number) => {
    const { wordLength } = levels[level];
    return wordList.filter(w => w.length === wordLength);
}

export function WordBuilderGame({ onBack }: { onBack: () => void }) {
    const [gameState, setGameState] = useState<'intro' | 'playing' | 'complete'>('intro');
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION_S);
    
    const [currentWord, setCurrentWord] = useState('');
    const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
    const [builtWord, setBuiltWord] = useState<string>('');
    const [wordsInLevel, setWordsInLevel] = useState(0);

    const gameTimerRef = useRef<NodeJS.Timeout>();
    const wordStartTimeRef = useRef<number>(0);

    const setupNextWord = useCallback(() => {
        const availableWords = getWordsForLevel(level);
        if (availableWords.length === 0) {
            // No more words for this level, end game
            setGameState('complete');
            return;
        }

        const newWord = availableWords[Math.floor(Math.random() * availableWords.length)];
        setCurrentWord(newWord);
        setScrambledLetters(scrambleWord(newWord, levels[level].scrambleStrength));
        setBuiltWord('');
        wordStartTimeRef.current = Date.now();
    }, [level]);

     useEffect(() => {
        if (gameState === 'playing') {
            gameTimerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(gameTimerRef.current as NodeJS.Timeout);
                        setGameState('complete');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            setupNextWord();
        }
        return () => {
            if (gameTimerRef.current) clearInterval(gameTimerRef.current);
        }
    }, [gameState, setupNextWord]);

    const handleLetterClick = (letter: string, index: number) => {
        setBuiltWord(prev => prev + letter);
        setScrambledLetters(prev => prev.filter((_, i) => i !== index));
    };
    
    const handleUndo = () => {
        if (builtWord.length === 0) return;
        const lastLetter = builtWord[builtWord.length - 1];
        setBuiltWord(prev => prev.slice(0, -1));
        setScrambledLetters(prev => [...prev, lastLetter]);
    };
    
    const resetGame = () => {
        setGameState('intro');
        setLevel(1);
        setScore(0);
        setTimeLeft(GAME_DURATION_S);
        setWordsInLevel(0);
    };

    useEffect(() => {
        if (currentWord && builtWord.length === currentWord.length) {
            if (builtWord === currentWord) {
                // Correct!
                const timeTaken = (Date.now() - wordStartTimeRef.current) / 1000;
                const timeBonus = Math.max(0, Math.floor((5 - timeTaken) * TIME_BONUS_MULTIPLIER));
                setScore(prev => prev + BASE_POINTS + timeBonus);

                if (wordsInLevel + 1 >= WORDS_PER_LEVEL) {
                    if (level + 1 > Object.keys(levels).length) {
                        setGameState('complete'); // All levels done
                    } else {
                        setLevel(prev => prev + 1);
                        setWordsInLevel(0);
                    }
                 setTimeout(setupNextWord, 500); // Wait a bit before next word
                } else {
                    setWordsInLevel(prev => prev + 1);
                    setTimeout(setupNextWord, 500);
                }
            } else {
                // Incorrect, reset
                setTimeout(() => {
                    setBuiltWord('');
                    setScrambledLetters(scrambleWord(currentWord, levels[level].scrambleStrength));
                }, 500);
            }
        }
    }, [builtWord, currentWord, level, wordsInLevel, setupNextWord]);
    

  if (gameState === 'intro') {
    return (
        <div className="bg-gradient-to-br from-yellow-300 via-orange-300 to-red-300 p-4 sm:p-8 rounded-2xl max-w-2xl mx-auto">
            <Card className="bg-white/80 border-orange-400/30 text-center text-gray-800">
                <CardHeader>
                    <CardTitle className="text-3xl">Word Builder! 🏗️</CardTitle>
                    <CardDescription className="text-orange-700">A game of quick eyes and smarts!</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-5xl">🔡</p>
                    <p className="text-orange-800">
                       Letters are all mixed up! Can you put them back in the right order to spell the word?
                    </p>
                    <div className="bg-white/50 p-4 rounded-lg text-left">
                        <h4 className="font-semibold mb-2 text-gray-900">🎯 How to Play:</h4>
                        <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                            <li>Look at the scrambled letters.</li>
                            <li>Click them in the right order to build the word.</li>
                            <li>Build as many words as you can before time runs out!</li>
                        </ul>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outline" onClick={onBack} className="w-full">
                           <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                        <Button onClick={() => setGameState('playing')} size="lg" className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                            Let's Build!
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
  }
  
   if (gameState === 'complete') {
    return (
        <div className="bg-gradient-to-br from-yellow-300 via-orange-300 to-red-300 p-4 sm:p-8 rounded-2xl max-w-2xl mx-auto">
            <Card className="bg-white/80 border-orange-400/30 text-center text-gray-800">
                <CardHeader>
                    <CardTitle className="text-3xl">Amazing Job! 🏆</CardTitle>
                    <CardDescription className="text-orange-700">Game Over!</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-orange-800">
                        You're a super word builder! Look at what you accomplished.
                    </p>
                     <div className="flex justify-around bg-white/50 p-4 rounded-lg">
                        <div className="text-center">
                             <div className="flex items-center justify-center gap-1">
                                <Trophy className="w-6 h-6 text-yellow-500" />
                                <p className="text-2xl font-bold">{score}</p>
                            </div>
                            <p className="text-xs text-gray-600">Total Score</p>
                        </div>
                         <div className="text-center">
                            <div className="flex items-center justify-center gap-1">
                                <Lightbulb className="w-6 h-6 text-blue-500" />
                                <p className="text-2xl font-bold">{level}</p>
                            </div>
                            <p className="text-xs text-gray-600">Highest Level</p>
                        </div>
                    </div>
                     <div className="flex flex-col sm:flex-row gap-2 mt-4">
                        <Button onClick={resetGame} className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                            <RefreshCw className="mr-2 h-4 w-4" /> Play Again
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
    <div className="p-4 rounded-lg bg-orange-50 border border-orange-200 max-w-2xl mx-auto space-y-4">
        <div className="flex justify-between items-center font-mono text-gray-700">
            <span>Score: {score}</span>
            <span>Level: {level}</span>
            <span>Time: {timeLeft}s</span>
        </div>
        <div className="h-24 bg-white border-2 border-dashed border-orange-300 rounded-lg flex items-center justify-center p-4">
            <p className="text-4xl font-bold tracking-widest text-gray-800">{builtWord}</p>
        </div>
        <div className="h-24 flex items-center justify-center gap-3">
             <AnimatePresence>
                {scrambledLetters.map((letter, index) => (
                    <motion.div
                        key={`${currentWord}-${letter}-${index}`}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                    >
                        <Button 
                            className="text-3xl font-bold w-16 h-16"
                            onClick={() => handleLetterClick(letter, index)}
                        >
                            {letter.toUpperCase()}
                        </Button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
         <Button variant="outline" onClick={handleUndo} className="w-full">Undo</Button>
    </div>
  )
}
