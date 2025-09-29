"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';

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

export function AstigmatismTest() {
  const [step, setStep] = useState<'instructions' | 'test' | 'results'>('instructions');
  const [result, setResult] = useState<string | null>(null);

  const startTest = () => {
    setStep('test');
    setResult(null);
  };

  const handleResult = (hasAstigmatism: boolean) => {
    setResult(hasAstigmatism ? 'Astigmatism Possible' : 'Astigmatism Unlikely');
    setStep('results');
  };

  const restartTest = () => {
    setStep('instructions');
  };

  if (step === 'instructions') {
    return (
      <div className="text-center">
        <h3 className="text-xl font-semibold">Instructions</h3>
        <p className="text-muted-foreground mt-2 mb-4 max-w-md mx-auto">
          Stand about 3 feet away from the screen. Cover one eye and look at the center of the dial. Then repeat with the other eye.
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
          <CardDescription>Your screening result is:</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold my-4">{result}</p>
          <p className="text-sm text-muted-foreground mb-4">This is a screening tool only. If you suspect you have astigmatism, consult with an eye care professional for a proper diagnosis.</p>
          <Button onClick={restartTest}>
            <RefreshCw className="mr-2 h-4 w-4" /> Restart Test
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-8">
        <div className="bg-white p-8 rounded-lg">
            <AstigmatismDial />
        </div>
      <p className="font-semibold text-center max-w-md">Do any of the lines appear darker or sharper than others? All lines should appear equally clear and black.</p>
      <div className="flex gap-4">
        <Button onClick={() => handleResult(true)}>Yes, some lines are darker</Button>
        <Button variant="outline" onClick={() => handleResult(false)}>No, all lines look the same</Button>
      </div>
    </div>
  );
}
