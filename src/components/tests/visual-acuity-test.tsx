"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, RefreshCw } from 'lucide-react';

const snellenChartLines = [
  { size: 'text-8xl', letters: 'E', score: '20/200' },
  { size: 'text-7xl', letters: 'F P', score: '20/100' },
  { size: 'text-6xl', letters: 'T O Z', score: '20/70' },
  { size: 'text-5xl', letters: 'L P E D', score: '20/50' },
  { size: 'text-4xl', letters: 'P E C F D', score: '20/40' },
  { size: 'text-3xl', letters: 'E D F C Z P', score: '20/30' },
  { size: 'text-2xl', letters: 'F E L O P Z D', score: '20/25' },
  { size: 'text-xl', letters: 'D E F P O T E C', score: '20/20' },
];

export function VisualAcuityTest() {
  const [step, setStep] = useState<'instructions' | 'test' | 'results'>('instructions');
  const [currentLine, setCurrentLine] = useState(0);
  const [finalScore, setFinalScore] = useState<string | null>(null);

  const startTest = () => {
    setStep('test');
    setCurrentLine(0);
    setFinalScore(null);
  };

  const nextLine = () => {
    if (currentLine < snellenChartLines.length - 1) {
      setCurrentLine(currentLine + 1);
    } else {
      setFinalScore(snellenChartLines[snellenChartLines.length - 1].score);
      setStep('results');
    }
  };

  const couldNotRead = () => {
    const score = currentLine > 0 ? snellenChartLines[currentLine - 1].score : '20/200';
    setFinalScore(score);
    setStep('results');
  };

  const restartTest = () => {
    setStep('instructions');
  };

  if (step === 'instructions') {
    return (
      <div className="text-center">
        <h3 className="text-xl font-semibold">Instructions</h3>
        <p className="text-muted-foreground mt-2 mb-4">
          For accurate results, please stand 10 feet (about 3 meters) away from your screen. Cover one eye and read the letters.
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
                <p className="text-sm text-muted-foreground mb-4">This is not a medical diagnosis. For an accurate assessment, please consult an eye care professional.</p>
                <Button onClick={restartTest}>
                    <RefreshCw className="mr-2 h-4 w-4" /> Restart Test
                </Button>
            </CardContent>
        </Card>
    );
  }

  const line = snellenChartLines[currentLine];

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="h-48 flex items-center justify-center w-full bg-white rounded-md p-4">
        <p className={`${line.size} font-mono tracking-widest text-black`}>{line.letters}</p>
      </div>
      <p className="text-muted-foreground">Line {currentLine + 1} of {snellenChartLines.length}. Score: {line.score}</p>
      <div className="flex gap-4">
        <Button onClick={nextLine}>I can read this</Button>
        <Button variant="outline" onClick={couldNotRead}>I can't read this</Button>
      </div>
    </div>
  );
}
