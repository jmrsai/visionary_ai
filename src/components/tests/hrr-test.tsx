"use client";

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, RefreshCw, X, ArrowLeft, Loader2, Circle, XIcon, Triangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateHrrPlate, type HrrPlateOutput } from '@/ai/flows/hrr-plate-generator';

const TOTAL_PLATES = 6;

const symbolMap = {
    circle: Circle,
    cross: XIcon,
    triangle: Triangle,
};

export function HrrTest({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<'instructions' | 'test' | 'results' | 'loading'>('instructions');
  const [currentPlate, setCurrentPlate] = useState(0);
  const [results, setResults] = useState<{ plate: HrrPlateOutput, answer: string, correct: boolean }[]>([]);
  const [plateData, setPlateData] = useState<HrrPlateOutput | null>(null);
  const { toast } = useToast();

  const getNextPlate = useCallback(async () => {
    setStep('loading');
    try {
        const data = await generateHrrPlate();
        setPlateData(data);
        setStep('test');
    } catch (error) {
        console.error("Failed to generate HRR plate:", error);
        toast({
            title: "Error",
            description: "Could not generate the test plate. Please try again.",
            variant: "destructive"
        });
        setStep('instructions');
    }
  }, [toast]);

  const startTest = () => {
    setCurrentPlate(0);
    setResults([]);
    getNextPlate();
  };

  const handleAnswer = (answer: string) => {
    if (!plateData) return;

    const correct = answer === plateData.correctSymbol;
    setResults(prev => [...prev, { plate: plateData, answer, correct }]);

    if (currentPlate < TOTAL_PLATES - 1) {
      setCurrentPlate(currentPlate + 1);
      getNextPlate();
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
        <h3 className="text-xl font-semibold">AI-Powered HRR Test</h3>
        <p className="text-muted-foreground mt-2 mb-4 max-w-lg mx-auto">
          You will be shown a series of unique, AI-generated plates. Click the symbol you see. If you see multiple symbols, click on all of them. If you see no symbol, click 'None'. This test screens for both red-green and blue-yellow color vision deficiencies.
        </p>
        <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={onBack}><ArrowLeft className="mr-2 h-4 w-4" />Back</Button>
            <Button onClick={startTest}>Start Test</Button>
        </div>
      </div>
    );
  }

  if (step === 'loading') {
    return (
        <div className="flex flex-col items-center justify-center text-center h-64 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Generating comprehensive test plate...</p>
        </div>
    );
  }

  if (step === 'results') {
    const score = results.filter(r => r.correct).length;
    const redGreenErrors = results.filter(r => !r.correct && r.plate.deficiencyType.includes('Red-Green')).length;
    const blueYellowErrors = results.filter(r => !r.correct && r.plate.deficiencyType.includes('Blue-Yellow')).length;

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

  return (
    <div className="flex flex-col items-center space-y-6">
        {plateData && (
            <>
                <p className="text-muted-foreground">Plate {currentPlate + 1} of {TOTAL_PLATES}</p>
                <div className="w-64 h-64 relative rounded-full overflow-hidden border-4 border-muted">
                    <Image src={plateData.plateImageUri} alt="AI-generated HRR plate" layout="fill" objectFit="cover" data-ai-hint="abstract pattern"/>
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
