"use client";

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, RefreshCw, X } from 'lucide-react';

const ishiharaPlates = [
  { imageUrl: 'https://i.ibb.co/jDNQ4Rz/ishihara-1.png', number: 12, options: [12, 74, 28, 35] },
  { imageUrl: 'https://i.ibb.co/q1CjW3Y/ishihara-2.png', number: 8, options: [8, 3, 5, 6] },
  { imageUrl: 'https://i.ibb.co/b3F3XGY/ishihara-3.png', number: 29, options: [29, 70, 88, 39] },
  { imageUrl: 'https://i.ibb.co/8D9zY5G/ishihara-4.png', number: 5, options: [5, 2, 8, 3] },
  { imageUrl: 'https://i.ibb.co/8g3JcZn/ishihara-5.png', number: 3, options: [3, 5, 8, 2] },
  { imageUrl: 'https://i.ibb.co/kH2T8Kc/ishihara-6.png', number: 15, options: [15, 17, 71, 74] },
  { imageUrl: 'https://i.ibb.co/pwnL12p/ishihara-7.png', number: 74, options: [74, 21, 14, 71] },
  { imageUrl: 'https://i.ibb.co/yQvT9yY/ishihara-8.png', number: 6, options: [6, 8, 5, 9] },
  { imageUrl: 'https://i.ibb.co/f2sS1hH/ishihara-9.png', number: 45, options: [45, 15, 95, 42] },
  { imageUrl: 'https://i.ibb.co/yPVRpNy/ishihara-10.png', number: 5, options: [5, 3, 6, 8] },
  { imageUrl: 'https://i.ibb.co/vYF8Pkv/ishihara-11.png', number: 7, options: [7, 1, 4, 9] },
  { imageUrl: 'https://i.ibb.co/HCrp6B4/ishihara-12.png', number: 16, options: [16, 75, 18, 15] },
  { imageUrl: 'https://i.ibb.co/RSC51n9/ishihara-13.png', number: 73, options: [73, 13, 18, 23] },
];

export function ColorVisionTest() {
  const [step, setStep] = useState<'instructions' | 'test' | 'results'>('instructions');
  const [currentPlate, setCurrentPlate] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);

  const startTest = () => {
    setStep('test');
    setCurrentPlate(0);
    setScore(0);
    setUserAnswers([]);
  };

  const handleAnswer = (answer: number) => {
    setUserAnswers([...userAnswers, answer]);
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
    const isPass = score / ishiharaPlates.length >= 0.9;
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
