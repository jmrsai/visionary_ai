"use client";

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, RefreshCw, X } from 'lucide-react';

const ishiharaPlates = [
  { imageUrl: 'https://picsum.photos/seed/ishihara1/300/300', number: 12, options: [12, 74, 28, 35] },
  { imageUrl: 'https://picsum.photos/seed/ishihara2/300/300', number: 8, options: [8, 3, 5, 6] },
  { imageUrl: 'https://picsum.photos/seed/ishihara3/300/300', number: 29, options: [29, 70, 88, 39] },
  { imageUrl: 'https://picsum.photos/seed/ishihara4/300/300', number: 5, options: [5, 2, 8, 3] },
  { imageUrl: 'https://picsum.photos/seed/ishihara5/300/300', number: 74, options: [74, 21, 14, 71] },
  { imageUrl: 'https://picsum.photos/seed/ishihara6/300/300', number: 45, options: [45, 15, 95, 42] },
  { imageUrl: 'https://picsum.photos/seed/ishihara7/300/300', number: 7, options: [7, 1, 4, 9] },
  { imageUrl: 'https://picsum.photos/seed/ishihara8/300/300', number: 16, options: [16, 75, 18, 15] },
  { imageUrl: 'https://picsum.photos/seed/ishihara9/300/300', number: 2, options: [2, 5, 3, 8] },
  { imageUrl: 'https://picsum.photos/seed/ishihara10/300/300', number: 97, options: [97, 87, 37, 91] },
];

export function ColorVisionTest() {
  const [step, setStep] = useState<'instructions' | 'test' | 'results'>('instructions');
  const [currentPlate, setCurrentPlate] = useState(0);
  const [score, setScore] = useState(0);

  const startTest = () => {
    setStep('test');
    setCurrentPlate(0);
    setScore(0);
  };

  const handleAnswer = (answer: number) => {
    if (answer === ishiharaPlates[currentPlate].number) {
      setScore(score + 1);
    }
    if (currentPlate < ishiharaPlates.length - 1) {
      setCurrentPlate(currentPlate + 1);
    } else {
      setStep('results');
    }
  };

  const restartTest = () => {
    setStep('instructions');
  };
  
  const shuffledOptions = useMemo(() => {
    if (step !== 'test') return [];
    const options = ishiharaPlates[currentPlate].options;
    return [...options].sort(() => Math.random() - 0.5);
  }, [currentPlate, step]);


  if (step === 'instructions') {
    return (
      <div className="text-center">
        <h3 className="text-xl font-semibold">Instructions</h3>
        <p className="text-muted-foreground mt-2 mb-4">
          You will be shown a series of plates. Click the number you see in the plate.
        </p>
        <Button onClick={startTest}>Start Test</Button>
      </div>
    );
  }

  if (step === 'results') {
    const isPass = score / ishiharaPlates.length >= 0.9; // 9 or more correct
    return (
      <Card className="mx-auto max-w-md text-center">
        <CardHeader>
          <CardTitle>Test Complete</CardTitle>
          <CardDescription>You correctly identified:</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-5xl font-bold my-4">{score} / {ishiharaPlates.length}</p>
          {isPass ? (
            <div className="flex items-center justify-center gap-2 text-green-600"><Check /> <p>You likely have normal color vision.</p></div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-orange-600"><X /> <p>You may have a color vision deficiency.</p></div>
          )}
          <p className="text-sm text-muted-foreground mt-4 mb-4">This screening is not a substitute for a professional diagnosis. Consult an eye doctor for a comprehensive evaluation.</p>
          <Button onClick={restartTest}>
            <RefreshCw className="mr-2 h-4 w-4" /> Retake Test
          </Button>
        </CardContent>
      </Card>
    );
  }

  const plate = ishiharaPlates[currentPlate];

  return (
    <div className="flex flex-col items-center space-y-6">
      <p className="text-muted-foreground">Plate {currentPlate + 1} of {ishiharaPlates.length}</p>
      <div className="w-64 h-64 relative rounded-full overflow-hidden border-4 border-muted">
        <Image src={plate.imageUrl} alt="Ishihara plate" layout="fill" objectFit="cover" data-ai-hint="abstract pattern"/>
      </div>
      <p className="font-semibold">What number do you see?</p>
      <div className="grid grid-cols-2 gap-4">
        {shuffledOptions.map(option => (
          <Button key={option} size="lg" variant="outline" onClick={() => handleAnswer(option)}>
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
}
