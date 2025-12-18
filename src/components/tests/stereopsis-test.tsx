"use client";

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, RefreshCw, AlertTriangle, Circle, Square, Star, TriangleIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// import { generateStereopsisTest, type StereopsisTestOutput } from '@/ai/flows/stereopsis-test-generator';

// Mock type
type StereopsisTestOutput = {
    imageUri: string;
    hiddenShape: "circle" | "square" | "triangle" | "star";
    options: ("circle" | "square" | "triangle" | "star")[];
}


type Step = 'instructions' | 'loading' | 'test' | 'results';

const shapeMap = {
    circle: Circle,
    square: Square,
    triangle: TriangleIcon,
    star: Star,
};

const TOTAL_ROUNDS = 3;

export function StereopsisTest() {
  const [step, setStep] = useState<Step>('instructions');
  const [testData, setTestData] = useState<StereopsisTestOutput | null>(null);
  const [results, setResults] = useState<{ correct: boolean }[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const { toast } = useToast();

  const loadTest = useCallback(async () => {
    setStep('loading');
    try {
    //   const data = await generateStereopsisTest();
      const shapes = ["circle", "square", "triangle", "star"] as const;
      const hiddenShape = shapes[Math.floor(Math.random() * shapes.length)];
      const distractors = new Set<typeof shapes[number]>();
      while(distractors.size < 3) {
          const d = shapes[Math.floor(Math.random() * shapes.length)];
          if (d !== hiddenShape) distractors.add(d);
      }
      const options = [hiddenShape, ...Array.from(distractors)].sort(() => Math.random() - 0.5);
      const data: StereopsisTestOutput = {
        imageUri: `https://picsum.photos/seed/${Math.random()}/400/400`,
        hiddenShape: hiddenShape,
        options: options as any,
      }
      setTestData(data);
      setStep('test');
    } catch (error) {
      console.error("Failed to generate stereopsis test:", error);
      toast({
        title: "Error",
        description: "Could not generate the test image. Please try again.",
        variant: "destructive",
      });
      setStep('instructions');
    }
  }, [toast]);

  const handleAnswer = (answer: string) => {
    if (!testData) return;

    const isCorrect = answer === testData.hiddenShape;
    const newResults = [...results, { correct: isCorrect }];
    setResults(newResults);

    if (currentRound < TOTAL_ROUNDS - 1) {
      setCurrentRound(prev => prev + 1);
      loadTest();
    } else {
      setStep('results');
    }
  };

  const startTest = () => {
    setResults([]);
    setCurrentRound(0);
    loadTest();
  };
  
  const restartTest = () => {
      setStep('instructions');
  }

  const renderContent = () => {
    switch (step) {
      case 'instructions':
        return (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">Stereopsis (Depth Perception) Test</h3>
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Special Glasses Required</AlertTitle>
              <AlertDescription>
                This test requires **red-cyan 3D glasses**. Please put them on now to proceed. Without them, you will not be able to see the hidden shapes.
              </AlertDescription>
            </Alert>
            <p className="text-muted-foreground max-w-md mx-auto">
              You will be shown an image with a random pattern of dots. When viewed with 3D glasses, a shape should appear to "pop out". Your task is to identify that shape. (AI image generation is disabled).
            </p>
            <Button onClick={startTest}>I have my 3D glasses, let's start</Button>
          </div>
        );

      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Generating stereogram...</p>
          </div>
        );
        
      case 'test':
        if (!testData) return null;
        return (
          <div className="flex flex-col items-center space-y-6">
            <p className="text-muted-foreground">Image {currentRound + 1} of {TOTAL_ROUNDS}</p>
            <div className="w-80 h-80 relative rounded-lg overflow-hidden border-4 border-muted">
              <Image src={testData.imageUri} alt="AI-generated random dot stereogram" layout="fill" objectFit="cover" data-ai-hint="abstract pattern 3d" />
            </div>
            <p className="font-semibold">What hidden shape do you see?</p>
            <div className="grid grid-cols-2 gap-4">
              {testData.options.map(shape => {
                  const Icon = shapeMap[shape];
                  return (
                    <Button key={shape} size="lg" variant="outline" className="h-20 text-lg capitalize" onClick={() => handleAnswer(shape)}>
                        <Icon className="mr-2 h-6 w-6"/> {shape}
                    </Button>
                  )
              })}
            </div>
          </div>
        );
        
      case 'results':
        const score = results.filter(r => r.correct).length;
        const passed = score >= (TOTAL_ROUNDS - 1);
        return (
          <Card className="mx-auto max-w-md text-center">
            <CardHeader>
              <CardTitle>Test Complete</CardTitle>
              <CardDescription>You correctly identified:</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-6xl font-bold my-4">{score} / {TOTAL_ROUNDS}</p>
              <div className={`text-lg font-semibold ${passed ? 'text-green-600' : 'text-orange-600'}`}>
                {passed ? "Normal depth perception detected." : "Potential depth perception issues detected."}
              </div>
              <p className="text-sm text-muted-foreground mt-4 mb-4">
                This is a screening tool, not a medical diagnosis. Difficulty with this test could indicate an issue with how your eyes work together. Consult an eye care professional for a comprehensive evaluation.
              </p>
              <Button onClick={restartTest}>
                <RefreshCw className="mr-2 h-4 w-4" /> Test Again
              </Button>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return <div>{renderContent()}</div>;
}
