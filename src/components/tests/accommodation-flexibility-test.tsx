"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Zap, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

type Step = 'instructions' | 'test' | 'results';
const TOTAL_ROUNDS = 5;
const ANIMATION_DURATION_MS = 1000;
const DELAY_BETWEEN_ROUNDS_MS = 1500;

export function AccommodationFlexibilityTest() {
  const [step, setStep] = useState<Step>('instructions');
  const [round, setRound] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSymbol, setShowSymbol] = useState(false);
  const startTimeRef = useRef<number | null>(null);

  const startRound = useCallback(() => {
    setShowSymbol(true);
    setIsAnimating(true);
    
    // After animation ends, record start time
    setTimeout(() => {
      startTimeRef.current = performance.now();
      setIsAnimating(false);
    }, ANIMATION_DURATION_MS);
  }, []);

  const handleTap = () => {
    if (isAnimating || !startTimeRef.current) return;

    const endTime = performance.now();
    const reactionTime = Math.round(endTime - startTimeRef.current);
    setReactionTimes(prev => [...prev, reactionTime]);
    
    startTimeRef.current = null;
    setShowSymbol(false);

    if (round < TOTAL_ROUNDS - 1) {
      setRound(r => r + 1);
      setTimeout(startRound, DELAY_BETWEEN_ROUNDS_MS);
    } else {
      setStep('results');
    }
  };

  const startTest = () => {
    setRound(0);
    setReactionTimes([]);
    setStep('test');
    setTimeout(startRound, DELAY_BETWEEN_ROUNDS_MS);
  };
  
  const restartTest = () => {
    setStep('instructions');
  }

  const averageTime = reactionTimes.length > 0
    ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
    : 0;

  if (step === 'instructions') {
    return (
      <div className="text-center">
        <h3 className="text-xl font-semibold">Accommodation Speed Test</h3>
        <p className="text-muted-foreground mt-2 mb-4 max-w-md mx-auto">
          This test measures how quickly your eyes can focus. A symbol will appear and sharpen. Tap the screen the moment you can clearly identify it.
        </p>
        <Button onClick={startTest}>Start Test</Button>
      </div>
    );
  }

  if (step === 'results') {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <CardHeader>
          <CardTitle>Test Complete</CardTitle>
          <CardDescription>Here is your average focus speed.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="my-4">
            <p className="text-sm text-muted-foreground">Average Reaction Time</p>
            <p className="text-6xl font-bold">{averageTime}<span className="text-2xl text-muted-foreground">ms</span></p>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            A lower time indicates faster focus accommodation. Practice focus-shifting exercises to improve your score.
          </p>
          <Button onClick={restartTest}>
            <RefreshCw className="mr-2 h-4 w-4" /> Test Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      <p className="text-muted-foreground">Round {round + 1} of {TOTAL_ROUNDS}</p>
      <div 
        className="relative w-full aspect-square max-w-sm bg-muted rounded-lg border flex items-center justify-center cursor-pointer"
        onClick={handleTap}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full" />
        {showSymbol && (
          <Star className={cn(
            'h-32 w-32 text-foreground transition-all duration-1000',
            isAnimating ? 'blur-xl opacity-50' : 'blur-none opacity-100'
          )} />
        )}
      </div>
      <div className="h-10">
        {!showSymbol && round < TOTAL_ROUNDS && (
            <p className="text-muted-foreground animate-pulse">Get Ready...</p>
        )}
        {showSymbol && !isAnimating && (
            <p className="text-primary font-semibold animate-pulse">Tap Now!</p>
        )}
      </div>
    </div>
  );
}
