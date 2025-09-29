"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';

const AmslerGrid = () => (
  <div className="w-64 h-64 bg-white p-2 grid grid-cols-20 grid-rows-20 gap-px border border-black">
    {[...Array(400)].map((_, i) => (
      <div key={i} className="bg-black w-full h-full" />
    ))}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white" />
  </div>
);

export function MacularHealthTest() {
  const [step, setStep] = useState<'instructions' | 'test' | 'results'>('instructions');
  const [result, setResult] = useState<string | null>(null);

  const startTest = () => {
    setStep('test');
    setResult(null);
  };

  const handleResult = (isNormal: boolean) => {
    setResult(isNormal ? 'No Issues Detected' : 'Potential Issues Detected');
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
          If you wear reading glasses, please put them on. Sit about 12-15 inches away from the screen. Cover one eye, focus on the center dot, and then repeat with the other eye.
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
          <p className="text-sm text-muted-foreground mb-4">
            {result === 'No Issues Detected'
              ? 'Your perception of the Amsler grid appears normal. Continue regular eye check-ups.'
              : 'You noticed some distortions. This could indicate a problem with your macula. Please consult an eye care professional immediately for a comprehensive exam.'}
          </p>
          <Button onClick={restartTest}>
            <RefreshCw className="mr-2 h-4 w-4" /> Restart Test
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="p-4 bg-background rounded-md">
        <AmslerGrid />
      </div>
      <p className="font-semibold text-center max-w-md">While looking at the center dot, are all lines straight and all squares of equal size? Are there any blank spots or distortions?</p>
      <div className="flex gap-4">
        <Button onClick={() => handleResult(true)}>Yes, the grid looks normal</Button>
        <Button variant="destructive" onClick={() => handleResult(false)}>No, I see distortions</Button>
      </div>
    </div>
  );
}
