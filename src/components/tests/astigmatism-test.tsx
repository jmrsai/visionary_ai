"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const AstigmatismDial = () => (
  <div className="w-64 h-64 relative">
    {[...Array(12)].map((_, i) => (
      <div
        key={i}
        className="absolute w-full h-full"
        style={{ transform: `rotate(${i * 15}deg)` }}
      >
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-black" />
      </div>
    ))}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-black" />
  </div>
);

type Eye = 'left' | 'right';
type Step = 'instructions' | 'test-left' | 'test-right' | 'results';

export function AstigmatismTest() {
  const [step, setStep] = useState<Step>('instructions');
  const [results, setResults] = useState<{ left: string | null, right: string | null }>({ left: null, right: null });

  const startTest = () => {
    setStep('test-left');
    setResults({ left: null, right: null });
  };

  const handleResult = (eye: Eye, answer: 'yes' | 'no') => {
    const resultText = answer === 'yes' ? 'Astigmatism Possible' : 'Astigmatism Unlikely';
    setResults(prev => ({ ...prev, [eye]: resultText }));

    if (eye === 'left') {
      setStep('test-right');
    } else {
      setStep('results');
    }
  };

  const restartTest = () => {
    setStep('instructions');
  };
  
  const renderTestForEye = (eye: Eye) => {
    const nextEye = eye === 'left' ? 'right' : 'finish';
    return (
        <div className="flex flex-col items-center space-y-8">
            <h3 className="text-xl font-semibold">Testing {eye === 'left' ? 'Left' : 'Right'} Eye</h3>
            <p className="text-muted-foreground">Cover your {eye === 'left' ? 'right' : 'left'} eye and focus on the center dot.</p>
            <div className="bg-white p-8 rounded-lg">
                <AstigmatismDial />
            </div>
            <p className="font-semibold text-center max-w-md">Do any of the lines appear darker or sharper than others? All lines should appear equally clear and black.</p>
            <div className="flex gap-4">
                <Button onClick={() => handleResult(eye, 'yes')}>Yes, some lines are darker</Button>
                <Button variant="outline" onClick={() => handleResult(eye, 'no')}>No, all lines look the same</Button>
            </div>
        </div>
    )
  }

  if (step === 'instructions') {
    return (
      <div className="text-center">
        <h3 className="text-xl font-semibold">Instructions</h3>
        <p className="text-muted-foreground mt-2 mb-4 max-w-md mx-auto">
          This test helps screen for astigmatism. For best results, sit about 3 feet (1 meter) away from the screen. You will test each eye separately.
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
          <CardDescription>Below are your screening results for each eye.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-2 gap-4 my-4">
                <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-lg">Left Eye</h4>
                    <p className="text-2xl font-bold">{results.left}</p>
                </div>
                <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-lg">Right Eye</h4>
                    <p className="text-2xl font-bold">{results.right}</p>
                </div>
            </div>

          <p className="text-sm text-muted-foreground mb-4">This is a screening tool only. If you suspect you have astigmatism, or if your results show it is possible, consult with an eye care professional for a proper diagnosis.</p>
          <Button onClick={restartTest}>
            <RefreshCw className="mr-2 h-4 w-4" /> Restart Test
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
        {step === 'test-left' && renderTestForEye('left')}
        {step === 'test-right' && renderTestForEye('right')}
    </div>
  );
}
