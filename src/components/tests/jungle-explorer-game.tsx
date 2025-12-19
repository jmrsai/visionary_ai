"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Play, RefreshCw, Star, Trophy } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

type Step = 'intro' | 'playing' | 'complete';
const GAME_DURATION_S = 30;

interface Animal {
  id: string;
  character: typeof characters[0];
  isNear: boolean;
  position: { x: number; y: number };
  scale: number;
}

const characters = [
  { id: 'monkey-character', isNear: false, far: true },
  { id: 'parrot-character', isNear: true, far: false },
  { id: 'frog-character', isNear: true, far: false },
  { id: 'monkey-character', isNear: false, far: true }, // Add duplicates for variety
  { id: 'parrot-character', isNear: true, far: false },
  { id: 'frog-character', isNear: true, far: false },
];

export function JungleExplorerGame() {
  const [step, setStep] = useState<Step>('intro');
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION_S);
  const [score, setScore] = useState(0);
  const [animalsFound, setAnimalsFound] = useState(0);
  const [currentAnimal, setCurrentAnimal] = useState<Animal | null>(null);

  const jungleBg = useMemo(() => PlaceHolderImages.find(img => img.id === 'jungle-background'), []);
  const gameTimerRef = useRef<NodeJS.Timeout>();
  const animalTimerRef = useRef<NodeJS.Timeout>();

  const showNextAnimal = useCallback(() => {
    if (animalsFound >= characters.length) {
      setStep('complete');
      return;
    }

    const characterData = characters[animalsFound];
    const isNear = Math.random() > 0.5;
    const animalImage = PlaceHolderImages.find(img => img.id === characterData.id);
    if (!animalImage) return;

    const newAnimal: Animal = {
      id: Date.now().toString(),
      character: animalImage,
      isNear,
      position: {
        x: Math.random() * 80 + 10, // 10% to 90%
        y: Math.random() * 60 + 20, // 20% to 80%
      },
      scale: isNear ? 1.2 : 0.7,
    };

    setCurrentAnimal(newAnimal);

    animalTimerRef.current = setTimeout(() => {
        // Auto-advances if not clicked
        setAnimalsFound(prev => prev + 1);
        setCurrentAnimal(null);
    }, 2500);

  }, [animalsFound]);

  useEffect(() => {
    if (step === 'playing') {
      if (timeLeft <= 0) {
        setStep('complete');
        return;
      }
      gameTimerRef.current = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    }
    return () => clearInterval(gameTimerRef.current);
  }, [step, timeLeft]);

  useEffect(() => {
    if (step === 'playing' && !currentAnimal) {
       // A short delay before the next one appears
       setTimeout(showNextAnimal, 400);
    }
    return () => {
        if (animalTimerRef.current) clearTimeout(animalTimerRef.current);
    }
  }, [step, currentAnimal, showNextAnimal]);


  const handleAnimalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentAnimal) return;

    const points = currentAnimal.isNear ? 10 : 15;
    setScore(s => s + points);
    setAnimalsFound(prev => prev + 1);

    if(animalTimerRef.current) clearTimeout(animalTimerRef.current);
    setCurrentAnimal(null); // Hide immediately
  };

  const startGame = () => {
    setStep('playing');
    setScore(0);
    setAnimalsFound(0);
    setTimeLeft(GAME_DURATION_S);
    setCurrentAnimal(null);
  };

  const resetGame = () => {
    setStep('intro');
  };

  if (step === 'complete') {
    const starsEarned = Math.floor(score / 20);
    return (
        <Card className="mx-auto w-full max-w-lg text-center border-green-500 border-2 shadow-lg">
            <CardHeader className="bg-green-500 text-primary-foreground rounded-t-lg">
                <CardTitle>Amazing Explorer! 🎉</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                 <Trophy className="w-16 h-16 text-yellow-400 mx-auto animate-pulse" />
                 <h3 className="text-xl font-bold">Jungle Mission Complete!</h3>
                 <p className="text-muted-foreground">
                    Wow! You found {animalsFound} animals! Your eyes are getting stronger every day!
                 </p>
                <div className="flex justify-around bg-muted p-4 rounded-lg">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1">
                            <Star className="w-6 h-6 text-yellow-500" />
                            <p className="text-2xl font-bold">{starsEarned}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">Stars Earned</p>
                    </div>
                     <div className="text-center">
                        <div className="flex items-center justify-center gap-1">
                            <Trophy className="w-6 h-6 text-primary" />
                            <p className="text-2xl font-bold">{score}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">Total Points</p>
                    </div>
                </div>
                 <div className="flex flex-col sm:flex-row gap-2 mt-4">
                    <Button onClick={resetGame} className="w-full">
                        <RefreshCw className="mr-2 h-4 w-4" /> Play Again
                    </Button>
                    <Button variant="secondary" className="w-full" asChild>
                        <Link href="/gym"> <ArrowLeft className="mr-2 h-4 w-4" />Back to Gym</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
  }

  if (step === 'intro') {
    return (
        <Card className="text-center w-full max-w-lg mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl">Jungle Explorer 🦋</CardTitle>
                <CardDescription>Welcome to the Kambalakonda Wildlife Sanctuary!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                    You're a brave jungle explorer! Your mission is to spot all the amazing animals 
                    hiding in our beautiful sanctuary.
                </p>
                <div className="text-left bg-muted p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">🎯 How to Play:</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        <li>Look carefully at the jungle scene.</li>
                        <li>Some animals are close (BIG), others are far (small).</li>
                        <li>Quickly click on them when you see them clearly.</li>
                        <li>Find as many as you can before time runs out!</li>
                    </ul>
                </div>
                <Button onClick={startGame} size="lg" className="w-full">
                    <Play className="mr-2 h-5 w-5" /> Start Adventure
                </Button>
            </CardContent>
        </Card>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex justify-between items-center w-full max-w-lg font-mono text-lg p-2 rounded-lg bg-muted border">
        <div className="flex items-center gap-2">
            Score: <span className="font-bold">{score}</span>
        </div>
         <div className="flex items-center gap-2">
            Time: <span className="font-bold">{timeLeft}s</span>
        </div>
        <div className="flex items-center gap-2">
            Found: <span className="font-bold">{animalsFound}/{characters.length}</span>
        </div>
      </div>
      <div 
        className="relative w-full aspect-[4/3] max-w-lg bg-gray-200 rounded-lg overflow-hidden border-4 border-muted cursor-pointer"
        onClick={() => { /* Missed click */ }}
      >
        {jungleBg && <Image src={jungleBg.imageUrl} layout="fill" objectFit="cover" alt="Jungle background" data-ai-hint={jungleBg.imageHint} priority />}
        
        <AnimatePresence>
            {currentAnimal && (
                <motion.div
                    key={currentAnimal.id}
                    className="absolute w-20 h-20"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: currentAnimal.scale, opacity: 1 }}
                    exit={{ scale: 0.1, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    style={{ 
                        top: `${currentAnimal.position.y}%`, 
                        left: `${currentAnimal.position.x}%`
                    }}
                    onClick={handleAnimalClick}
                >
                    <Image 
                        src={currentAnimal.character.imageUrl} 
                        alt={currentAnimal.character.description} 
                        layout="fill" 
                        objectFit="contain" 
                        data-ai-hint={currentAnimal.character.imageHint}
                    />
                </motion.div>
            )}
        </AnimatePresence>
      </div>
       <div className="text-center bg-background/80 backdrop-blur-sm p-2 rounded-lg -mt-16 relative z-10 w-full max-w-lg">
        <p className="font-semibold text-primary">
            {currentAnimal
              ? currentAnimal.isNear
                ? `🔍 Look! A ${currentAnimal.character.description} right in front of you!`
                : `👀 Quick! Spot the ${currentAnimal.character.description} way over there!`
              : 'Get ready...'}
        </p>
       </div>
    </div>
  );
}
