"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Check, X, Loader2, Eraser } from 'lucide-react';
import { generateAmslerGrid } from '@/ai/flows/amsler-grid-generator';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type Step = 'instructions' | 'loading' | 'test-left' | 'test-right' | 'results';
type Eye = 'left' | 'right';
type DistortionMark = {
  x: number; // percentage
  y: number; // percentage
};

const GridGuardian = ({ gridImage, onTestComplete }: { gridImage: string, onTestComplete: (marks: DistortionMark[]) => void }) => {
    const [marks, setMarks] = useState<DistortionMark[]>([]);
    const gridRef = useRef<HTMLDivElement>(null);

    const handleGridClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!gridRef.current) return;
        const rect = gridRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMarks(prev => [...prev, { x, y }]);
    };

    const clearMarks = () => {
        setMarks([]);
    }

    return (
        <div className="flex flex-col items-center space-y-4">
            <div 
                ref={gridRef}
                className="relative w-full aspect-square max-w-sm bg-muted rounded-lg border cursor-crosshair"
                onClick={handleGridClick}
            >
                <Image src={gridImage} alt="Amsler Grid" layout="fill" objectFit="contain" />

                {marks.map((mark, i) => (
                    <div
                        key={i}
                        className="absolute w-4 h-4 bg-red-500/70 rounded-full"
                        style={{
                            left: `${mark.x}%`,
                            top: `${mark.y}%`,
                            transform: 'translate(-50%, -50%)',
                        }}
                    />
                ))}
            </div>

            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-base">Instructions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <p>While staring at the center dot, do any lines appear wavy, blurry, or are there any dark spots on the grid?</p>
                    <p className="font-semibold">If so, tap where you see the problem.</p>
                     <div className="flex gap-2">
                        <Button variant="outline" onClick={clearMarks} className="w-full">
                            <Eraser className="mr-2 h-4 w-4" /> Clear Marks
                        </Button>
                        <Button onClick={() => onTestComplete(marks)} className="w-full">
                           {marks.length > 0 ? "Confirm Marks & Continue" : "No Issues, Continue"}
                        </Button>
                     </div>
                </CardContent>
            </Card>
        </div>
    );
};


export function MacularHealthTest() {
  const [step, setStep] = useState<Step>('instructions');
  const [gridImage, setGridImage] = useState<string | null>(null);
  const [leftEyeMarks, setLeftEyeMarks] = useState<DistortionMark[]>([]);
  const [rightEyeMarks, setRightEyeMarks] = useState<DistortionMark[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const loadGrid = async () => {
      setStep('loading');
      try {
        const result = await generateAmslerGrid();
        setGridImage(result.gridImageUri);
        setStep('test-left');
      } catch (error) {
        console.error("Failed to generate Amsler grid:", error);
        toast({
          title: "Error loading test",
          description: "Could not load the Amsler grid. Please try again.",
          variant: "destructive",
        });
        setStep('instructions');
      }
    };

    if (step === 'instructions') {
        // Reset state when going back to instructions
        setGridImage(null);
        setLeftEyeMarks([]);
        setRightEyeMarks([]);
    } else if (step === 'test-left' && !gridImage) {
        loadGrid();
    }
  }, [step, gridImage, toast]);

  const startTest = () => {
    if (!gridImage) {
      setStep('test-left'); // This will trigger the useEffect to load the grid
    } else {
      setStep('test-left');
    }
  };

  const handleLeftTestComplete = (marks: DistortionMark[]) => {
    setLeftEyeMarks(marks);
    setStep('test-right');
  };

  const handleRightTestComplete = (marks: DistortionMark[]) => {
    setRightEyeMarks(marks);
    setStep('results');
  };

  const restartTest = () => {
    setStep('instructions');
  };
  
  const getResultForEye = (marks: DistortionMark[]) => {
      return marks.length > 0 ? 'Potential Issues Detected' : 'No Issues Detected';
  };
  
  const renderMarkedGrid = (marks: DistortionMark[]) => {
    if (!gridImage) return null;
    return (
        <div className="relative w-full aspect-square bg-white rounded-md border">
            <Image src={gridImage} alt="Amsler Grid" layout="fill" objectFit="contain" />
            {marks.map((mark, i) => (
                <div
                    key={i}
                    className="absolute w-3 h-3 bg-red-500/70 rounded-full"
                    style={{
                        left: `${mark.x}%`,
                        top: `${mark.y}%`,
                        transform: 'translate(-50%, -50%)',
                    }}
                />
            ))}
        </div>
    );
  };

  const renderTestForEye = (eye: Eye) => {
    if (!gridImage) return <p>Loading grid...</p>;
    const onTestComplete = eye === 'left' ? handleLeftTestComplete : handleRightTestComplete;
    return (
        <div className="flex flex-col items-center space-y-6">
            <h3 className="text-xl font-semibold">Testing {eye === 'left' ? 'Left' : 'Right'} Eye</h3>
            <p className="text-muted-foreground">Cover your {eye === 'left' ? 'right' : 'left'} eye and focus only on the center dot.</p>
            <GridGuardian gridImage={gridImage} onTestComplete={onTestComplete} />
        </div>
    )
  }

  if (step === 'instructions') {
    return (
      <div className="text-center">
        <h3 className="text-xl font-semibold">"Grid Guardian" Game</h3>
        <p className="text-muted-foreground mt-2 mb-4 max-w-md mx-auto">
          This test helps screen for issues in your central vision, such as those caused by macular degeneration. If you wear reading glasses, please put them on. Sit about 12-15 inches away from the screen.
        </p>
        <Button onClick={startTest}>Start Test</Button>
      </div>
    );
  }
  
  if (step === 'loading') {
      return (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Generating Amsler Grid...</p>
          </div>
      )
  }

  if (step === 'results') {
    const leftResult = getResultForEye(leftEyeMarks);
    const rightResult = getResultForEye(rightEyeMarks);

    return (
      <Card className="mx-auto max-w-2xl text-center">
        <CardHeader>
          <CardTitle>Test Complete</CardTitle>
          <CardDescription>
            {leftEyeMarks.length > 0 || rightEyeMarks.length > 0
              ? 'Potential issues were detected. Please save this report and consult an eye care professional.'
              : 'No issues were detected during this screening.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
                 <div className="p-4 border rounded-lg">
                    <CardTitle className="text-lg mb-4">Left Eye</CardTitle>
                    {renderMarkedGrid(leftEyeMarks)}
                    <p className={cn("font-bold mt-4", leftEyeMarks.length === 0 ? 'text-green-600' : 'text-orange-600')}>{leftResult}</p>
                </div>
                 <div className="p-4 border rounded-lg">
                    <CardTitle className="text-lg mb-4">Right Eye</CardTitle>
                    {renderMarkedGrid(rightEyeMarks)}
                     <p className={cn("font-bold mt-4", rightEyeMarks.length === 0 ? 'text-green-600' : 'text-orange-600')}>{rightResult}</p>
                </div>
            </div>
          <p className="text-sm text-muted-foreground mb-4">
            This is a screening tool only. If you noticed any distortions, please consult an eye care professional immediately for a comprehensive exam. You can save a screenshot of this result to share with your doctor.
          </p>
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
