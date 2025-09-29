"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, RefreshCw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const acuityLevels = [
  { size: 'text-8xl', letters: 'E', score: '20/200' },
  { size: 'text-7xl', letters: 'F P', score: '20/100' },
  { size: 'text-6xl', letters: 'T O Z', score: '20/70' },
  { size: 'text-5xl', letters: 'L P E D', score: '20/50' },
  { size: 'text-4xl', letters: 'P E C F D', score: '20/40' },
  { size: 'text-3xl', letters: 'E D F C Z P', score: '20/30' },
  { size: 'text-2xl', letters: 'F E L O P Z D', score: '20/25' },
  { size: 'text-xl', letters: 'D E F P O T E C', score: '20/20' },
];

const directions = ['up', 'down', 'left', 'right'] as const;
type Direction = typeof directions[number];

const getRotationClass = (direction: Direction) => {
    switch (direction) {
        case 'up': return '-rotate-90';
        case 'down': return 'rotate-90';
        case 'left': return 'rotate-180';
        case 'right': return '';
    }
}

export function VisualAcuityTest() {
  const [step, setStep] = useState<'instructions' | 'test' | 'results'>('instructions');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [finalScore, setFinalScore] = useState<string | null>(null);

  const currentDirection = useMemo(() => {
    return directions[Math.floor(Math.random() * directions.length)];
  }, [currentLevel]);

  const startTest = () => {
    setStep('test');
    setCurrentLevel(0);
    setFinalScore(null);
  };

  const handleAnswer = (selectedDirection: Direction) => {
    if (selectedDirection === currentDirection) {
      if (currentLevel < acuityLevels.length - 1) {
        setCurrentLevel(currentLevel + 1);
      } else {
        // Passed the last level
        setFinalScore(acuityLevels[acuityLevels.length - 1].score);
        setStep('results');
      }
    } else {
      // Failed the current level
      const score = currentLevel > 0 ? acuityLevels[currentLevel - 1].score : 'Below 20/200';
      setFinalScore(score);
      setStep('results');
    }
  };

  const restartTest = () => {
    setStep('instructions');
  };

  if (step === 'instructions') {
    return (
      <div className="text-center">
        <h3 className="text-xl font-semibold">Instructions</h3>
        <p className="text-muted-foreground mt-2 mb-4 max-w-md mx-auto">
          For accurate results, please stand 10 feet (about 3 meters) away from your screen. Cover one eye, then use the buttons to indicate the direction the "E" is pointing.
        </p>
        <Button onClick={startTest}>
          <Eye className="mr-2 h-4 w-4" /> I'm Ready
        </Button>
      </div>
    );
  }

  if (step === 'results') {
    return (
        <Card className="mx-auto max-w-md text-center">
            <CardHeader>
                <CardTitle>Test Complete</CardTitle>
                <CardDescription>Your estimated visual acuity is:</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-5xl font-bold my-4">{finalScore}</p>
                <p className="text-sm text-muted-foreground mb-4">This is a screening tool, not a medical diagnosis. For an accurate assessment, please consult an eye care professional.</p>
                <Button onClick={restartTest}>
                    <RefreshCw className="mr-2 h-4 w-4" /> Restart Test
                </Button>
            </CardContent>
        </Card>
    );
  }

  const level = acuityLevels[currentLevel];

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="h-48 flex items-center justify-center w-full bg-white rounded-md p-4">
        <p className={cn(
          level.size,
          "font-mono tracking-widest text-black transition-transform",
          getRotationClass(currentDirection)
        )}>E</p>
      </div>
      <p className="text-muted-foreground">Line {currentLevel + 1} of {acuityLevels.length} (Score: {level.score})</p>
      
      <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" size="lg" className="flex-col h-20" onClick={() => handleAnswer('up')}>
            <ArrowUp className="h-8 w-8" />
            <span>Up</span>
          </Button>
          <Button variant="outline" size="lg" className="flex-col h-20" onClick={() => handleAnswer('down')}>
            <ArrowDown className="h-8 w-8" />
            <span>Down</span>
          </Button>
          <Button variant="outline" size="lg" className="flex-col h-20" onClick={() => handleAnswer('left')}>
            <ArrowLeft className="h-8 w-8" />
            <span>Left</span>
          </Button>
          <Button variant="outline" size="lg" className="flex-col h-20" onClick={() => handleAnswer('right')}>
            <ArrowRight className="h-8 w-8" />
            <span>Right</span>
          </Button>
      </div>
    </div>
  );
}
