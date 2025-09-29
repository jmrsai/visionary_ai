"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Play, Timer } from 'lucide-react';

const readingPassage = `The human eye is a remarkable organ, capable of distinguishing millions of colors and detecting a single photon of light. It works much like a camera, with the cornea and lens focusing light onto the retina. The retina is a light-sensitive layer at the back of the eye that contains two types of photoreceptor cells: rods and cones. Rods are responsible for vision at low light levels, while cones are active at higher light levels and are capable of color vision. The signals from these cells are transmitted through the optic nerve to the brain, which interprets them as images. Protecting our vision through regular check-ups and healthy habits is crucial for maintaining this incredible sense throughout our lives.`;
const wordCount = readingPassage.split(/\s+/).length;

export function ReadingSpeedTest() {
  const [step, setStep] = useState<'instructions' | 'testing' | 'results'>('instructions');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startTest = () => {
    setStep('testing');
    setStartTime(Date.now());
  };

  const finishTest = () => {
    if (startTime) {
      const endTime = Date.now();
      const durationSeconds = (endTime - startTime) / 1000;
      const wpmCalc = Math.round((wordCount / durationSeconds) * 60);
      setWpm(wpmCalc);
    }
    setStep('results');
  };

  const restartTest = () => {
    setStep('instructions');
    setWpm(0);
    setStartTime(null);
  };

  if (step === 'instructions') {
    return (
      <div className="text-center">
        <h3 className="text-xl font-semibold">Instructions</h3>
        <p className="text-muted-foreground mt-2 mb-4 max-w-md mx-auto">
          When you are ready, click 'Start Reading'. Read the passage that appears at your normal pace. When you have finished, click the 'I'm Finished' button.
        </p>
        <Button onClick={startTest}>
          <Play className="mr-2 h-4 w-4" /> Start Reading
        </Button>
      </div>
    );
  }

  if (step === 'results') {
    return (
      <Card className="mx-auto max-w-md text-center">
        <CardHeader>
          <CardTitle>Test Complete</CardTitle>
          <CardDescription>Your estimated reading speed is:</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-5xl font-bold my-4">{wpm} WPM</p>
          <p className="text-sm text-muted-foreground mb-4">
            The average reading speed for adults is around 200-300 words per minute (WPM). This result can be influenced by many factors, including comprehension and screen readability.
          </p>
          <Button onClick={restartTest}>
            <RefreshCw className="mr-2 h-4 w-4" /> Take Test Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      <Card className="w-full">
        <CardContent className="pt-6">
          <p className="text-lg leading-relaxed text-justify">
            {readingPassage}
          </p>
        </CardContent>
      </Card>
      <Button size="lg" onClick={finishTest}>
        <Timer className="mr-2 h-4 w-4" /> I'm Finished
      </Button>
    </div>
  );
}
