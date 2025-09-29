"use client";

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, RefreshCw, X, ArrowLeft, Loader2, Circle, XIcon, Triangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MOCK_HRR_PLATES } from '@/lib/data';
import type { HrrPlate } from '@/lib/types';


const TOTAL_PLATES = MOCK_HRR_PLATES.length;

const symbolMap = {
    circle: Circle,
    cross: XIcon,
    triangle: Triangle,
};

export function HrrTest({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<'instructions' | 'test' | 'results'>('instructions');
  const [currentPlateIndex, setCurrentPlateIndex] = useState(0);
  const [results, setResults] = useState<{ plate: HrrPlate, answer: string, correct: boolean }[]>([]);
  const { toast } = useToast();

  const startTest = () => {
    setCurrentPlateIndex(0);
    setResults([]);
    setStep('test');
  };

  const handleAnswer = (answer: string) => {
    const plateData = MOCK_HRR_PLATES[currentPlateIndex];
    if (!plateData) return;

    const correct = answer === plateData.correctSymbol;
    setResults(prev => [...prev, { plate: plateData, answer, correct }]);

    if (currentPlateIndex < TOTAL_PLATES - 1) {
      setCurrentPlateIndex(prev => prev + 1);
    } else {
      setStep('results');
    }
  };

  const restartTest = () => {
    setStep('instructions');
  };

  if (step === 'instructions') {
    return (
      <div className="text-center">
        <h3 className="text-xl font-semibold">Hardy-Rand-Rittler (HRR) Test</h3>
        <p className="text-muted-foreground mt-2 mb-4 max-w-lg mx-auto">
          You will be shown a series of plates with colored symbols. Click the symbol you see. If you see no symbol, click 'None'. This test screens for both red-green and blue-yellow color vision deficiencies.
        </p>
        <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={onBack}><ArrowLeft className="mr-2 h-4 w-4" />Back</Button>
            <Button onClick={startTest}>Start Test</Button>
        </div>
      </div>
    );
  }

  if (step === 'results') {
    const score = results.filter(r => r.correct).length;
    const redGreenErrors = results.filter(r => !r.correct && r.plate.deficiencyType === 'Red-Green').length;
    const blueYellowErrors = results.filter(r => !r.correct && r.plate.deficiencyType === 'Blue-Yellow').length;

    let resultText = "You appear to have normal color vision.";
    if (redGreenErrors > 1 && blueYellowErrors > 1) {
        resultText = "Results suggest a severe color vision deficiency (Red-Green and Blue-Yellow).";
    } else if (redGreenErrors > 1) {
        resultText = "Results suggest a Red-Green color vision deficiency.";
    } else if (blueYellowErrors > 1) {
        resultText = "Results suggest a Blue-Yellow color vision deficiency.";
    } else if (score < TOTAL_PLATES) {
        resultText = "Results suggest a mild or uncategorized color vision deficiency."
    }

    return (
      <Card className="mx-auto max-w-md text-center">
        <CardHeader>
          <CardTitle>HRR Test Complete</CardTitle>
          <CardDescription>You correctly identified {score} out of {TOTAL_PLATES} plates.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold my-4">{resultText}</p>
          <p className="text-sm text-muted-foreground mt-4 mb-4">This screening is not a substitute for a professional diagnosis. Consult an eye doctor for a comprehensive evaluation.</p>
          <Button onClick={restartTest}>
            <RefreshCw className="mr-2 h-4 w-4" /> Retake Test
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  const plateData = MOCK_HRR_PLATES[currentPlateIndex];

  return (
    <div className="flex flex-col items-center space-y-6">
        {plateData && (
            <>
                <p className="text-muted-foreground">Plate {currentPlateIndex + 1} of {TOTAL_PLATES}</p>
                <div className="w-64 h-64 relative rounded-full overflow-hidden border-4 border-muted">
                    <Image src={plateData.plateImageUri} alt="HRR plate" layout="fill" objectFit="cover" data-ai-hint="abstract pattern"/>
                </div>
                <p className="font-semibold">What symbol do you see?</p>
                <div className="grid grid-cols-2 gap-4">
                    {plateData.options.map(option => {
                        const Icon = option === "none" ? () => <span className="text-lg">None</span> : symbolMap[option as keyof typeof symbolMap];
                        return (
                            <Button key={option} size="lg" variant="outline" className="h-16 capitalize" onClick={() => handleAnswer(option)}>
                                <Icon className="h-8 w-8" />
                            </Button>
                        )
                    })}
                </div>
            </>
        )}
    </div>
  );
}
