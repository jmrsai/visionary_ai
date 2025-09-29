
"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

// Contrast levels for the test, from easiest to hardest
const contrastLevels = [
  { level: 1, contrast: 0.8, score: "1.2 logCS" }, // High contrast
  { level: 2, contrast: 0.65, score: "1.35 logCS" },
  { level: 3, contrast: 0.5, score: "1.5 logCS" },
  { level: 4, contrast: 0.35, score: "1.65 logCS" },
  { level: 5, contrast: 0.2, score: "1.8 logCS" },
  { level: 6, contrast: 0.1, score: "1.95 logCS" },
  { level: 7, contrast: 0.05, score: "2.1 logCS" }, // Very low contrast
];

const characters = ['C', 'D', 'H', 'K', 'N', 'O', 'R', 'S', 'V', 'Z'];

export function ContrastSensitivityTest() {
  const [step, setStep] = useState<'instructions' | 'test' | 'results'>('instructions');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [finalScore, setFinalScore] = useState<string | null>(null);

  const currentStimulus = useMemo(() => {
    const randomChar = characters[Math.floor(Math.random() * characters.length)];
    const options = [randomChar];
    while (options.length < 4) {
      const randomOption = characters[Math.floor(Math.random() * characters.length)];
      if (!options.includes(randomOption)) {
        options.push(randomOption);
      }
    }
    return {
      char: randomChar,
      options: options.sort(() => Math.random() - 0.5),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLevel]);

  const startTest = () => {
    setStep('test');
    setCurrentLevel(0);
    setFinalScore(null);
  };

  const handleAnswer = (answer: string) => {
    if (answer === currentStimulus.char) {
      if (currentLevel < contrastLevels.length - 1) {
        setCurrentLevel(currentLevel + 1);
      } else {
        // Passed the highest level
        setFinalScore(contrastLevels[contrastLevels.length - 1].score);
        setStep('results');
      }
    } else {
      // Failed a level
      const score = currentLevel > 0 ? contrastLevels[currentLevel - 1].score : "Below 1.2 logCS";
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
        <h3 className="text-xl font-semibold">Contrast Sensitivity Instructions</h3>
        <p className="text-muted-foreground mt-2 mb-4 max-w-md mx-auto">
          This test measures your ability to see letters at different contrast levels. You will be shown a letter on the screen. Identify the letter from the options provided. The letters will become fainter as the test progresses.
        </p>
        <Button onClick={startTest}>Start Test</Button>
      </div>
    );
  }

  if (step === 'results') {
    return (
      <Card className="mx-auto max-w-md text-center">
        <CardHeader>
          <CardTitle>Test Complete</CardTitle>
          <CardDescription>Your estimated contrast sensitivity score is:</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-5xl font-bold my-4">{finalScore}</p>
          <p className="text-sm text-muted-foreground mb-4">
            A higher logCS score indicates better contrast sensitivity. Normal scores are typically 1.8 logCS or higher. This is a screening tool only. For a complete diagnosis, consult an eye care professional.
          </p>
          <Button onClick={restartTest}>
            <RefreshCw className="mr-2 h-4 w-4" /> Restart Test
          </Button>
        </CardContent>
      </Card>
    );
  }

  const levelData = contrastLevels[currentLevel];
  const textColor = `rgba(0, 0, 0, ${levelData.contrast})`;

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="h-48 flex items-center justify-center w-full bg-gray-300 rounded-md p-4">
        <p className="text-8xl font-bold" style={{ color: textColor }}>
          {currentStimulus.char}
        </p>
      </div>
      <p className="text-muted-foreground">Level {levelData.level} of {contrastLevels.length}</p>

      <div className="w-full max-w-md">
        <p className="text-center font-semibold mb-4">What letter do you see?</p>
        <div className="grid grid-cols-2 gap-4">
          {currentStimulus.options.map(option => (
            <Button key={option} variant="outline" size="lg" className="h-20 text-4xl" onClick={() => handleAnswer(option)}>
              {option}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
