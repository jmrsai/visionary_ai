"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Check, X, Loader2, Eraser } from 'lucide-react';
// import { generateAmslerGrid } from '@/ai/flows/amsler-grid-generator';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type Step = 'instructions' | 'loading' | 'test-left' | 'test-right' | 'results';
type Eye = 'left' | 'right';
type DistortionMark = {
  x: number; // percentage
  y: number; // percentage
};

const GridGuardian = ({ onTestComplete }: { onTestComplete: (marks: DistortionMark[]) => void }) => {
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
                <div className="absolute inset-0 bg-white">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
                         {[...Array(21)].map((_, i) => (
                            <div key={`v-${i}`} className="absolute top-0 bottom-0 bg-gray-300" style={{left: `${i*5}%`, width: '1px'}}></div>
                         ))}
                         {[...Array(21)].map((_, i) => (
                            <div key={`h-${i}`} className="absolute left-0 right-0 bg-gray-300" style={{top: `${i*5}%`, height: '1px'}}></div>
                         ))}
                    </div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-black rounded-full z-10" />

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
  const [leftEyeMarks, setLeftEyeMarks] = useState<DistortionMark[]>([]);
  const [rightEyeMarks, setRightEyeMarks] = useState<DistortionMark[]>([]);

  const startTest = () => {
    setStep('test-left');
    setLeftEyeMarks([]);
    setRightEyeMarks([]);
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
    return (
        <div className="relative w-full aspect-square bg-white rounded-md border">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
                 {[...Array(11)].map((_, i) => (
                    <div key={`v-${i}`} className="absolute top-0 bottom-0 bg-gray-200" style={{left: `${i*10}%`, width: '1px'}}></div>
                 ))}
                 {[...Array(11)].map((_, i) => (
                    <div key={`h-${i}`} className="absolute left-0 right-0 bg-gray-200" style={{top: `${i*10}%`, height: '1px'}}></div>
                 ))}
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-black rounded-full z-10" />
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
    const onTestComplete = eye === 'left' ? handleLeftTestComplete : handleRightTestComplete;
    return (
        <div className="flex flex-col items-center space-y-6">
            <h3 className="text-xl font-semibold">Testing {eye === 'left' ? 'Left' : 'Right'} Eye</h3>
            <p className="text-muted-foreground">Cover your {eye === 'left' ? 'right' : 'left'} eye and focus only on the center dot.</p>
            <GridGuardian onTestComplete={onTestComplete} />
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
