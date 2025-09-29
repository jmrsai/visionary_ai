"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Star } from 'lucide-react';

type Step = 'instructions' | 'test' | 'results';
type Stimulus = {
  id: number;
  position: { top: string; left: string };
  color: 'red' | 'blue' | 'green';
};

const STIMULUS_COUNT = 10;
const STIMULUS_DISPLAY_TIME_MS = 200;
const TIME_BETWEEN_STIMULI_MS = 2000;

const COLORS = ['red', 'blue', 'green'] as const;

// Generate random positions in the periphery
const generateStimuli = (count: number): Stimulus[] => {
  const stimuli: Stimulus[] = [];
  for (let i = 0; i < count; i++) {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    // Ensure stimuli are in the periphery, not too close to the center
    const top = Math.random() < 0.5 ? `${Math.random() * 25 + 5}%` : `${Math.random() * 25 + 70}%`; // 5-30% or 70-95%
    const left = Math.random() < 0.5 ? `${Math.random() * 25 + 5}%` : `${Math.random() * 25 + 70}%`; // 5-30% or 70-95%
    
    stimuli.push({
      id: i,
      position: { top, left },
      color,
    });
  }
  return stimuli;
};


export function VisualFieldTest() {
  const [step, setStep] = useState<Step>('instructions');
  const [stimuli, setStimuli] = useState<Stimulus[]>([]);
  const [currentStimulus, setCurrentStimulus] = useState<Stimulus | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showButtons, setShowButtons] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout>();

  const startGame = () => {
    setScore(0);
    setCurrentIndex(0);
    const newStimuli = generateStimuli(STIMULUS_COUNT);
    setStimuli(newStimuli);
    setStep('test');
    runGameCycle(0, newStimuli);
  };
  
  const runGameCycle = useCallback((index: number, stims: Stimulus[]) => {
      if (index >= STIMULUS_COUNT) {
          setStep('results');
          return;
      }

      setCurrentIndex(index);
      setCurrentStimulus(stims[index]);
      setShowButtons(false);
      
      // Hide the stimulus after a short time
      timerRef.current = setTimeout(() => {
          setCurrentStimulus(null);
          // Show answer buttons after stimulus disappears
          timerRef.current = setTimeout(() => {
              setShowButtons(true);
          }, 300);
      }, STIMULUS_DISPLAY_TIME_MS);
      
  }, []);

  const handleAnswer = (color: 'red' | 'blue' | 'green') => {
      if (stimuli[currentIndex].color === color) {
          setScore(s => s + 1);
      }
      // Move to next stimulus
      setShowButtons(false);
      timerRef.current = setTimeout(() => {
          runGameCycle(currentIndex + 1, stimuli);
      }, 500); // Brief delay before next stimulus
  }

  const restartTest = () => {
    setStep('instructions');
  };
  
  const renderTestArea = () => (
    <div className="flex flex-col items-center space-y-4">
        <h3 className="text-xl font-semibold">Keep your eyes on the central dot!</h3>
        <div className="relative w-full aspect-square max-w-sm bg-muted rounded-lg border">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full" />
            {currentStimulus && (
                <div 
                    className="absolute w-5 h-5 rounded-full"
                    style={{ 
                        top: currentStimulus.position.top, 
                        left: currentStimulus.position.left, 
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: currentStimulus.color,
                     }}
                />
            )}
        </div>

       {showButtons ? (
            <div className="flex flex-col items-center space-y-4 pt-4">
                 <p className="font-semibold">What color was the dot?</p>
                 <div className="flex gap-4">
                    <Button onClick={() => handleAnswer('red')} className="bg-red-500 hover:bg-red-600">Red</Button>
                    <Button onClick={() => handleAnswer('blue')} className="bg-blue-500 hover:bg-blue-600">Blue</Button>
                    <Button onClick={() => handleAnswer('green')} className="bg-green-500 hover:bg-green-600">Green</Button>
                 </div>
            </div>
        ) : (
             <div className="h-24 flex items-center justify-center">
                <p className="text-muted-foreground">Stimulus {currentIndex + 1} / {STIMULUS_COUNT}</p>
             </div>
        )}
    </div>
  );

  useEffect(() => {
      return () => {
          if (timerRef.current) clearTimeout(timerRef.current);
      }
  }, []);

  if (step === 'instructions') {
    return (
      <div className="text-center">
        <h3 className="text-xl font-semibold">"Side Sight" Game Instructions</h3>
        <p className="text-muted-foreground mt-2 mb-4 max-w-md mx-auto">
          Test your peripheral awareness with this game. Keep your gaze fixed on the central point.
          <br /><br />
          A colored dot will flash in your side vision. After it disappears, click the button corresponding to the color you saw.
        </p>
        <Button onClick={startGame}>Start Game</Button>
      </div>
    );
  }

  if (step === 'results') {
    const accuracy = (score / STIMULUS_COUNT) * 100;
    return (
      <Card className="mx-auto max-w-lg text-center">
        <CardHeader>
          <CardTitle>Game Over!</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-2">
                <p className="text-lg text-muted-foreground">You correctly identified:</p>
                <p className="text-6xl font-bold">{score} / {STIMULUS_COUNT}</p>
                <p className="text-2xl font-semibold text-primary">{accuracy}% Accuracy</p>
            </div>
          <p className="text-sm text-muted-foreground mt-6 mb-4">Great job training your peripheral vision! Regular practice can help improve your reaction time and awareness.</p>
          <Button onClick={restartTest}>
            <RefreshCw className="mr-2 h-4 w-4" /> Play Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      {step === 'test' && renderTestArea()}
    </div>
  );
}
