"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Check, X, Loader2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { generateAmslerGrid, type AmslerGridOutput } from '@/ai/flows/amsler-grid-generator';
import { useToast } from '@/hooks/use-toast';

const AmslerGrid = ({ onGridLoaded }: { onGridLoaded: (isLoaded: boolean) => void }) => {
  const [gridImage, setGridImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchGrid = async () => {
      setIsLoading(true);
      onGridLoaded(false);
      try {
        const result = await generateAmslerGrid();
        setGridImage(result.gridImageUri);
        onGridLoaded(true);
      } catch (error) {
        console.error("Failed to generate Amsler grid:", error);
        toast({
          title: "Error",
          description: "Could not load the Amsler grid. Please try refreshing.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchGrid();
  }, [toast, onGridLoaded]);

  if (isLoading) {
    return (
      <div className="w-64 h-64 relative bg-muted rounded-lg flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground mt-2">Generating Grid...</p>
      </div>
    );
  }

  if (!gridImage) {
    return (
      <div className="w-64 h-64 relative bg-muted rounded-lg flex items-center justify-center">
        <p className="text-sm text-destructive text-center">Failed to load grid.</p>
      </div>
    );
  }

  return (
    <div className="relative w-64 h-64">
      <Image src={gridImage} alt="AI-generated Amsler Grid" layout="fill" objectFit="contain" />
    </div>
  );
};

type Step = 'instructions' | 'test-left' | 'test-right' | 'results';
type Eye = 'left' | 'right';
type Distortion = {
    wavy: boolean;
    blurry: boolean;
    dark: boolean;
    missing: boolean;
};

export function MacularHealthTest() {
  const [step, setStep] = useState<Step>('instructions');
  const [leftEyeDistortions, setLeftEyeDistortions] = useState<Distortion>({ wavy: false, blurry: false, dark: false, missing: false });
  const [rightEyeDistortions, setRightEyeDistortions] = useState<Distortion>({ wavy: false, blurry: false, dark: false, missing: false });
  const [isGridLoaded, setIsGridLoaded] = useState(false);

  const startTest = () => {
    setStep('test-left');
    setLeftEyeDistortions({ wavy: false, blurry: false, dark: false, missing: false });
    setRightEyeDistortions({ wavy: false, blurry: false, dark: false, missing: false });
  };

  const handleFinishEyeTest = (eye: Eye) => {
    if (eye === 'left') {
      setStep('test-right');
    } else {
      setStep('results');
    }
  };

  const restartTest = () => {
    setStep('instructions');
  };
  
  const handleDistortionChange = (eye: Eye, type: keyof Distortion, checked: boolean) => {
      if (eye === 'left') {
          setLeftEyeDistortions(prev => ({...prev, [type]: checked}));
      } else {
          setRightEyeDistortions(prev => ({...prev, [type]: checked}));
      }
  };
  
  const getResultForEye = (distortions: Distortion) => {
      const hasDistortion = Object.values(distortions).some(v => v);
      return hasDistortion ? 'Potential Issues Detected' : 'No Issues Detected';
  };
  
  const renderResultDetails = (distortions: Distortion) => {
      const details = Object.entries(distortions)
        .filter(([, value]) => value)
        .map(([key]) => key);

      if (details.length === 0) return <p className="text-green-600 flex items-center justify-center gap-2"><Check /> Normal</p>;
      
      return (
        <ul className="text-sm list-disc list-inside text-left">
            {details.map(d => <li key={d} className="capitalize">{d} areas</li>)}
        </ul>
      )
  }

  const renderTestForEye = (eye: Eye) => {
    const distortions = eye === 'left' ? leftEyeDistortions : rightEyeDistortions;
    const setDistortion = (type: keyof Distortion, checked: boolean) => handleDistortionChange(eye, type, checked);

    return (
        <div className="flex flex-col items-center space-y-6">
            <h3 className="text-xl font-semibold">Testing {eye === 'left' ? 'Left' : 'Right'} Eye</h3>
            <p className="text-muted-foreground">Cover your {eye === 'left' ? 'right' : 'left'} eye and focus only on the center dot.</p>

            <div className="p-4 bg-background rounded-md">
                <AmslerGrid onGridLoaded={setIsGridLoaded} />
            </div>

            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>While focusing on the center dot, do you notice any of the following?</CardTitle>
                    <CardDescription>Check all that apply.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="wavy" checked={distortions.wavy} onCheckedChange={(c) => setDistortion('wavy', !!c)} />
                        <Label htmlFor="wavy">Are any lines wavy, bent, or distorted?</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="blurry" checked={distortions.blurry} onCheckedChange={(c) => setDistortion('blurry', !!c)} />
                        <Label htmlFor="blurry">Are parts of the grid blurry or out of focus?</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="dark" checked={distortions.dark} onCheckedChange={(c) => setDistortion('dark', !!c)} />
                        <Label htmlFor="dark">Are there any dark or gray areas?</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="missing" checked={distortions.missing} onCheckedChange={(c) => setDistortion('missing', !!c)} />
                        <Label htmlFor="missing">Are there any missing areas or blank spots?</Label>
                    </div>
                    <Button onClick={() => handleFinishEyeTest(eye)} className="w-full mt-4" disabled={!isGridLoaded}>
                        {eye === 'left' ? 'Next: Test Right Eye' : 'Finish Test'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
  }

  if (step === 'instructions') {
    return (
      <div className="text-center">
        <h3 className="text-xl font-semibold">Amsler Grid Instructions</h3>
        <p className="text-muted-foreground mt-2 mb-4 max-w-md mx-auto">
          The Amsler grid, designed by Swiss ophthalmologist Marc Amsler, is a tool used to detect vision problems resulting from damage to the macula. If you wear reading glasses, please put them on. Sit about 12-15 inches away from the screen. You will test each eye separately.
        </p>
        <Button onClick={startTest}>Start Test</Button>
      </div>
    );
  }

  if (step === 'results') {
    const leftResult = getResultForEye(leftEyeDistortions);
    const rightResult = getResultForEye(rightEyeDistortions);

    return (
      <Card className="mx-auto max-w-lg text-center">
        <CardHeader>
          <CardTitle>Test Complete</CardTitle>
          <CardDescription>
            {leftResult === 'Potential Issues Detected' || rightResult === 'Potential Issues Detected'
              ? 'Potential issues were detected. Please see a doctor.'
              : 'No issues were detected during this screening.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-2 gap-4 my-4">
                 <Card className="p-4">
                    <CardTitle className="text-lg">Left Eye</CardTitle>
                    <p className={`text-xl font-bold my-2 ${getResultForEye(leftEyeDistortions) === 'No Issues Detected' ? 'text-green-600' : 'text-orange-600'}`}>
                        {getResultForEye(leftEyeDistortions)}
                    </p>
                    {renderResultDetails(leftEyeDistortions)}
                </Card>
                 <Card className="p-4">
                    <CardTitle className="text-lg">Right Eye</CardTitle>
                    <p className={`text-xl font-bold my-2 ${getResultForEye(rightEyeDistortions) === 'No Issues Detected' ? 'text-green-600' : 'text-orange-600'}`}>
                        {getResultForEye(rightEyeDistortions)}
                    </p>
                    {renderResultDetails(rightEyeDistortions)}
                </Card>
            </div>
          <p className="text-sm text-muted-foreground mb-4">
            This is a screening tool only. If you noticed any distortions, please consult an eye care professional immediately for a comprehensive exam, even if this test showed no issues.
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
