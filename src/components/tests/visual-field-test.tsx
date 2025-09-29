"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

type Step = 'instructions' | 'test-left' | 'test-right' | 'results';
type Eye = 'left' | 'right';
type DotPosition = { top: string; left: string; quadrant: number };

const DOT_COUNT_PER_EYE = 10;
const DOT_DISPLAY_TIME = 350; // ms
const TIME_BETWEEN_DOTS = 1500; // ms

// Positions covering 4 quadrants in the periphery
const getDotPositions = (): DotPosition[] => {
  return [
    // Top-left
    { top: '15%', left: '15%', quadrant: 1 },
    { top: '25%', left: '25%', quadrant: 1 },
    // Top-right
    { top: '15%', left: '85%', quadrant: 2 },
    { top: '25%', left: '75%', quadrant: 2 },
    // Bottom-left
    { top: '85%', left: '15%', quadrant: 3 },
    { top: '75%', left: '25%', quadrant: 3 },
    // Bottom-right
    { top: '85%', left: '85%', quadrant: 4 },
    { top: '75%', left: '75%', quadrant: 4 },
    // Mid-periphery
    { top: '50%', left: '10%', quadrant: 1 },
    { top: '50%', left: '90%', quadrant: 2 },
    { top: '10%', left: '50%', quadrant: 1 },
    { top: '90%', left: '50%', quadrant: 3 },
  ].sort(() => Math.random() - 0.5);
};

export function VisualFieldTest() {
  const [step, setStep] = useState<Step>('instructions');
  const [activeDot, setActiveDot] = useState<DotPosition | null>(null);
  const [dotIndex, setDotIndex] = useState(0);
  const [leftScore, setLeftScore] = useState(0);
  const [rightScore, setRightScore] = useState(0);
  const [testInProgress, setTestInProgress] = useState(false);
  const testTimeout = useRef<NodeJS.Timeout>();

  const startTestForEye = (eye: Eye) => {
    setDotIndex(0);
    setActiveDot(null);
    setTestInProgress(true);
    
    const positions = getDotPositions();

    const showNextDot = (index: number) => {
      if (index >= DOT_COUNT_PER_EYE) {
        setTestInProgress(false);
        if (eye === 'left') {
            setStep('test-right');
        } else {
            setStep('results');
        }
        return;
      }
      
      setDotIndex(index);
      setActiveDot(positions[index]);

      // Hide dot after a short duration
      testTimeout.current = setTimeout(() => {
        setActiveDot(null);
        // Then wait before showing the next one
        testTimeout.current = setTimeout(() => {
          showNextDot(index + 1);
        }, TIME_BETWEEN_DOTS);
      }, DOT_DISPLAY_TIME);
    };

    // Initial delay before first dot
    testTimeout.current = setTimeout(() => showNextDot(0), 2000);
  };
  
  useEffect(() => {
    return () => {
        if(testTimeout.current) clearTimeout(testTimeout.current);
    }
  }, []);

  const handleUserClick = () => {
    if (activeDot) {
      if (step === 'test-left') setLeftScore(s => s + 1);
      if (step === 'test-right') setRightScore(s => s + 1);
      // Immediately hide dot and proceed to next one to prevent multiple clicks for same dot
      clearTimeout(testTimeout.current);
      setActiveDot(null);
      testTimeout.current = setTimeout(() => {
        showNextDot(dotIndex + 1);
      }, TIME_BETWEEN_DOTS);
    }
  };
  
  const showNextDot = (index: number) => {
      const positions = getDotPositions();
      if (index >= DOT_COUNT_PER_EYE) {
        setTestInProgress(false);
        if (step === 'test-left') {
            setStep('test-right');
        } else {
            setStep('results');
        }
        return;
      }
      
      setDotIndex(index);
      setActiveDot(positions[index]);

      testTimeout.current = setTimeout(() => {
        setActiveDot(null);
        testTimeout.current = setTimeout(() => {
          showNextDot(index + 1);
        }, TIME_BETWEEN_DOTS);
      }, DOT_DISPLAY_TIME);
    };

  const restartTest = () => {
    setStep('instructions');
    setLeftScore(0);
    setRightScore(0);
  };
  
  const renderTestArea = (eye: Eye) => (
    <div className="flex flex-col items-center space-y-4">
        <h3 className="text-xl font-semibold">Testing {eye === 'left' ? 'Left' : 'Right'} Eye</h3>
        <p className="text-muted-foreground">Cover your {eye === 'left' ? 'right' : 'left'} eye and stare at the central dot.</p>
        <div 
            className="relative w-full aspect-square max-w-md bg-muted rounded-lg border cursor-pointer"
            onClick={handleUserClick}
        >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full" />
            {activeDot && (
                <div 
                    className="absolute w-4 h-4 bg-red-500 rounded-full animate-ping"
                    style={{ top: activeDot.top, left: activeDot.left, transform: 'translate(-50%, -50%)' }}
                />
            )}
        </div>
        <p className="font-semibold">Tap anywhere on the grey area as soon as you see a flashing red dot.</p>
        <p className="text-muted-foreground">Dot {dotIndex + 1} / {DOT_COUNT_PER_EYE}</p>
        {!testInProgress && step !== 'instructions' && (
             <Button onClick={() => startTestForEye(eye === 'left' ? 'right' : 'left' as Eye)}>
                {eye === 'left' ? 'Start Right Eye Test' : 'See Results'}
            </Button>
        )}
    </div>
  );

  if (step === 'instructions') {
    return (
      <div className="text-center">
        <h3 className="text-xl font-semibold">Instructions</h3>
        <p className="text-muted-foreground mt-2 mb-4 max-w-md mx-auto">
          This test provides a basic screening of your peripheral vision. Keep your gaze fixed on the central point. You will test each eye separately.
          <br /><br />
          Tap the screen as soon as you notice a flashing red dot in your side vision.
        </p>
        <Button onClick={() => {setStep('test-left'); startTestForEye('left');}}>Start Left Eye Test</Button>
      </div>
    );
  }

  if (step === 'results') {
    const getInterpretation = (score: number) => {
        if (score > 8) return "Seems normal.";
        if (score > 5) return "Some inconsistencies noted.";
        return "Potential peripheral vision loss detected.";
    }
    return (
      <Card className="mx-auto max-w-lg text-center">
        <CardHeader>
          <CardTitle>Test Complete</CardTitle>
          <CardDescription>You detected {leftScore + rightScore} out of {DOT_COUNT_PER_EYE * 2} total dots.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-2 gap-4 my-4">
                <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-lg">Left Eye</h4>
                    <p className="text-3xl font-bold">{leftScore}/{DOT_COUNT_PER_EYE}</p>
                    <p className="text-sm text-muted-foreground">{getInterpretation(leftScore)}</p>
                </div>
                <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-lg">Right Eye</h4>
                    <p className="text-3xl font-bold">{rightScore}/{DOT_COUNT_PER_EYE}</p>
                     <p className="text-sm text-muted-foreground">{getInterpretation(rightScore)}</p>
                </div>
            </div>
          <p className="text-sm text-muted-foreground mb-4">This is a screening tool only and its accuracy depends on maintaining a steady gaze. If you have any concerns about your peripheral vision, consult an eye care professional.</p>
          <Button onClick={restartTest}>
            <RefreshCw className="mr-2 h-4 w-4" /> Restart Test
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      {step === 'test-left' && renderTestArea('left')}
      {step === 'test-right' && renderTestArea('right')}
    </div>
  );
}
