"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, RefreshCw, Timer } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

type Step = 'instructions' | 'game' | 'results';
const GAME_DURATION_S = 30;
const MIN_APPEAR_TIME_MS = 800;
const MAX_APPEAR_TIME_MS = 2000;

const characters = [
  PlaceHolderImages.find(img => img.id === 'monkey-character')!,
  PlaceHolderImages.find(img => img.id === 'parrot-character')!,
  PlaceHolderImages.find(img => img.id === 'frog-character')!,
];

type Animal = {
  id: number;
  character: typeof characters[0];
  top: number;
  left: number;
  visible: boolean;
};

export function JungleExplorerGame() {
  const [step, setStep] = useState<Step>('instructions');
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION_S);
  const [score, setScore] = useState(0);
  const [animal, setAnimal] = useState<Animal | null>(null);

  const jungleBg = useMemo(() => PlaceHolderImages.find(img => img.id === 'jungle-background'), []);
  const timerRef = useRef<NodeJS.Timeout>();

  const spawnAnimal = useCallback(() => {
    const character = characters[Math.floor(Math.random() * characters.length)];
    const top = Math.random() * 70 + 10; // 10% to 80% from top
    const left = Math.random() * 80 + 10; // 10% to 90% from left
    const newAnimal: Animal = { id: Date.now(), character, top, left, visible: true };
    setAnimal(newAnimal);

    // Make animal disappear after a random time
    const disappearTime = Math.random() * (MAX_APPEAR_TIME_MS - MIN_APPEAR_TIME_MS) + MIN_APPEAR_TIME_MS;
    setTimeout(() => {
        setAnimal(prev => (prev?.id === newAnimal.id ? { ...prev, visible: false } : prev));
    }, disappearTime);

  }, []);

  const handleAnimalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (animal?.visible) {
      setScore(s => s + 10);
      setAnimal(a => a ? { ...a, visible: false } : null); // Hide immediately
    }
  };

  const startGame = () => {
    setStep('game');
    setScore(0);
    setTimeLeft(GAME_DURATION_S);
  };
  
  useEffect(() => {
    if (step === 'game' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft <= 0) {
      setStep('results');
    }
    return () => clearInterval(timerRef.current);
  }, [step, timeLeft]);

  useEffect(() => {
    let spawnInterval: NodeJS.Timeout;
    if (step === 'game' && timeLeft > 0) {
      spawnAnimal(); // Initial spawn
      spawnInterval = setInterval(spawnAnimal, MAX_APPEAR_TIME_MS);
    }
    return () => clearInterval(spawnInterval);
  }, [step, timeLeft, spawnAnimal]);

  const restartGame = () => {
    setStep('instructions');
  };

  if (step === 'instructions') {
    return (
      <div className="text-center">
        <h3 className="text-xl font-semibold">Jungle Explorer</h3>
        <p className="text-muted-foreground mt-2 mb-4 max-w-md mx-auto">
          Welcome, explorer! Animals are hiding in the jungle. Your mission is to spot and tap on them as quickly as you can. Let's see how many you can find!
        </p>
        <Button onClick={startGame} size="lg">
          <Play className="mr-2 h-4 w-4" /> Start Exploring
        </Button>
      </div>
    );
  }

  if (step === 'results') {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <CardHeader>
          <CardTitle>Exploration Complete!</CardTitle>
          <CardDescription>Great job spotting the animals.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Your Score</p>
          <p className="text-6xl font-bold my-4">{score}</p>
          <p className="text-muted-foreground">You're a sharp-eyed explorer! This game helps improve the speed and accuracy of your eye movements.</p>
          <Button onClick={restartGame} className="mt-6">
            <RefreshCw className="mr-2 h-4 w-4" /> Play Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex justify-between items-center w-full max-w-lg font-mono text-lg">
        <div className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            Time: <span className="font-bold">{timeLeft}</span>
        </div>
        <div>
            Score: <span className="font-bold">{score}</span>
        </div>
      </div>
      <div className="relative w-full aspect-video max-w-lg bg-gray-200 rounded-lg overflow-hidden border-4 border-muted">
        {jungleBg && <Image src={jungleBg.imageUrl} layout="fill" objectFit="cover" alt="Jungle background" data-ai-hint={jungleBg.imageHint} />}
        
        {animal?.visible && (
          <button
            className={cn(
              "absolute w-16 h-16 transition-all duration-200 focus:outline-none",
              animal.visible ? "opacity-100 scale-100" : "opacity-0 scale-50"
            )}
            style={{ top: `${animal.top}%`, left: `${animal.left}%`, transform: 'translate(-50%, -50%)' }}
            onClick={handleAnimalClick}
          >
            <Image 
              src={animal.character.imageUrl} 
              alt={animal.character.description} 
              layout="fill" 
              objectFit="contain" 
              data-ai-hint={animal.character.imageHint}
            />
          </button>
        )}
      </div>
       <p className="text-sm text-muted-foreground">Quickly tap the animals when they appear!</p>
    </div>
  );
}