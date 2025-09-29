"use client";

import { useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, RefreshCw, X, ArrowLeft, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { generateIshiharaPlate, type IshiharaPlateOutput } from '@/ai/flows/ishihara-plate-generator';
import { HrrTest } from './hrr-test';


const TOTAL_PLATES = 5; // Let's do 5 plates for the AI version

const IshiharaTest = ({ onBack }: { onBack: () => void }) => {
  const [step, setStep] = useState<'instructions' | 'test' | 'results' | 'loading'>('instructions');
  const [currentPlate, setCurrentPlate] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [plateData, setPlateData] = useState<IshiharaPlateOutput | null>(null);
  const { toast } = useToast();

  const getNextPlate = useCallback(async () => {
    setStep('loading');
    try {
        const data = await generateIshiharaPlate();
        setPlateData(data);
        setStep('test');
    } catch (error) {
        console.error("Failed to generate Ishihara plate:", error);
        toast({
            title: "Error Generating Test",
            description: "Could not generate the next plate. The AI service may be temporarily unavailable. Please try again.",
            variant: "destructive"
        });
        setStep('instructions');
    }
  }, [toast]);


  const startTest = () => {
    setCurrentPlate(0);
    setScore(0);
    setUserAnswers([]);
    getNextPlate();
  };

  const handleAnswer = (answer: number) => {
    if (!plateData) return;
    setUserAnswers([...userAnswers, answer]);
    if (answer === plateData.correctNumber) {
      setScore(score + 1);
    }
    
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
        <h3 className="text-xl font-semibold">AI-Powered Ishihara Test</h3>
        <p className="text-muted-foreground mt-2 mb-4">
          You will be shown a series of unique, AI-generated plates. Click the number you see in the plate. This test primarily screens for red-green color deficiencies.
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
            <p className="text-muted-foreground">Generating next test plate...</p>
        </div>
    )
  }

  if (step === 'results') {
    const isPass = score / TOTAL_PLATES >= 0.9;
    return (
      <Card className="mx-auto max-w-md text-center">
        <CardHeader>
          <CardTitle>Ishihara Test Complete</CardTitle>
          <CardDescription>You correctly identified:</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-5xl font-bold my-4">{score} / {TOTAL_PLATES}</p>
          {isPass ? (
            <div className="flex items-center justify-center gap-2 text-green-600"><Check /> <p>You likely have normal color vision.</p></div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-orange-600"><X /> <p>You may have a red-green color vision deficiency.</p></div>
          )}
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
                    <Image src={plateData.plateImageUri} alt="AI-generated Ishihara plate" layout="fill" objectFit="cover" data-ai-hint="abstract pattern"/>
                </div>
                <p className="font-semibold">What number do you see?</p>
                <div className="grid grid-cols-2 gap-4">
                    {plateData.options.map(option => (
                    <Button key={option} size="lg" variant="outline" onClick={() => handleAnswer(option)}>
                        {option}
                    </Button>
                    ))}
                </div>
            </>
        )}
    </div>
  );
};


// --- D-15 Arrangement Test Data ---
const d15Caps = [
  { id: 0, color: '#9d9d57', label: 'Pilot'}, // Pilot cap - fixed
  { id: 1, color: '#a7955c' },
  { id: 2, color: '#aa8e63' },
  { id: 3, color: '#ac876d' },
  { id: 4, color: '#ab7f78' },
  { id: 5, color: '#aa7885' },
  { id: 6, color: '#a27293' },
  { id: 7, color: '#9770a0' },
  { id: 8, color: '#8872a9' },
  { id: 9, color: '#7a78b0' },
  { id: 10, color: '#717fb4' },
  { id: 11, color: '#6d86b2' },
  { id: 12, color: '#718d9b' },
  { id: 13, color: '#7e9488' },
  { id: 14, color: '#8b997c' },
  { id: 15, color: '#949b6b' },
];

// Correct order for D-15
const d15CorrectOrder = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];


const D15Test = ({ onBack }: { onBack: () => void }) => {
  const [step, setStep] = useState<'instructions' | 'test' | 'results'>('instructions');
  const [caps, setCaps] = useState(() => [...d15Caps.slice(1)].sort(() => Math.random() - 0.5));
  const [draggedCapId, setDraggedCapId] = useState<number | null>(null);

  const handleDragStart = (id: number) => {
    setDraggedCapId(id);
  };

  const handleDrop = (targetId: number) => {
    if (draggedCapId === null) return;

    const newCaps = [...caps];
    const draggedIndex = newCaps.findIndex(c => c.id === draggedCapId);
    const targetIndex = newCaps.findIndex(c => c.id === targetId);
    
    // Swap the caps
    [newCaps[draggedIndex], newCaps[targetIndex]] = [newCaps[targetIndex], newCaps[draggedIndex]];
    
    setCaps(newCaps);
    setDraggedCapId(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const getResultLines = () => {
    const arrangement = [0, ...caps.map(c => c.id), 0]; // Add pilot at start/end for calculation
    const lines = [];
    for (let i = 0; i < arrangement.length - 1; i++) {
        const cap1 = arrangement[i];
        const cap2 = arrangement[i+1];
        
        // Check for specific error types (Protan, Deutan, Tritan axes)
        // This is a simplified logic for demonstration
        if (Math.abs(cap1 - cap2) > 2 && !(cap1 === 0 && cap2 === 15) && !(cap1 === 15 && cap2 === 0)) {
             lines.push({from: cap1, to: cap2, type: 'error' });
        } else {
             lines.push({from: cap1, to: cap2, type: 'correct' });
        }
    }
    return lines;
  };
  
  const startTest = () => {
    setStep('test');
  };

  const finishTest = () => {
    setStep('results');
  };

  const restartTest = () => {
    setStep('instructions');
    setCaps([...d15Caps.slice(1)].sort(() => Math.random() - 0.5));
  }

  if (step === 'instructions') {
    return (
      <div className="text-center">
        <h3 className="text-xl font-semibold">Farnsworth D-15 Arrangement Test</h3>
        <p className="text-muted-foreground mt-2 mb-4 max-w-lg mx-auto">
          Arrange the colored caps in order of hue, starting from the fixed pilot cap. Drag and drop the caps to reorder them. Click "Finish Test" when you are done.
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={onBack}><ArrowLeft className="mr-2 h-4 w-4" />Back</Button>
          <Button onClick={startTest}>Start Test</Button>
        </div>
      </div>
    );
  }

  if (step === 'results') {
    const userOrder = caps.map(c => c.id);
    const correct = JSON.stringify(userOrder) === JSON.stringify(d15CorrectOrder);

    return (
        <Card className="mx-auto w-full text-center">
            <CardHeader>
                <CardTitle>D-15 Test Complete</CardTitle>
                <CardDescription>
                    {correct ? 'Your arrangement is correct.' : 'Your arrangement indicates a potential color vision deficiency.'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-4">Below is a diagram of your results. Lines connect the caps in the order you placed them. Crossing lines indicate errors in color perception.</p>
                {/* Result Diagram */}
                <div className="relative w-64 h-64 mx-auto my-6">
                    {d15Caps.map(cap => {
                        const angle = (cap.id / 16) * 2 * Math.PI - (Math.PI / 2);
                        const x = 50 + 45 * Math.cos(angle);
                        const y = 50 + 45 * Math.sin(angle);
                        return (
                            <div key={cap.id} className="absolute w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs" style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)', backgroundColor: cap.color }}>
                                {cap.id}
                            </div>
                        )
                    })}
                     <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
                        {getResultLines().map((line, i) => {
                             const fromCap = d15Caps.find(c => c.id === line.from)!;
                             const toCap = d15Caps.find(c => c.id === line.to)!;
                             const fromAngle = (fromCap.id / 16) * 2 * Math.PI - (Math.PI / 2);
                             const toAngle = (toCap.id / 16) * 2 * Math.PI - (Math.PI / 2);
                             const x1 = 50 + 35 * Math.cos(fromAngle);
                             const y1 = 50 + 35 * Math.sin(fromAngle);
                             const x2 = 50 + 35 * Math.cos(toAngle);
                             const y2 = 50 + 35 * Math.sin(toAngle);

                             return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={line.type === 'error' ? 'red' : 'gray'} strokeWidth="1" />
                        })}
                    </svg>
                </div>
                <p className="text-sm text-muted-foreground mt-4 mb-4">This screening is not a substitute for a professional diagnosis. Please consult an eye care professional.</p>
                <Button onClick={restartTest}>
                    <RefreshCw className="mr-2 h-4 w-4" /> Retake Test
                </Button>
            </CardContent>
        </Card>
    )
  }

  return (
    <div className="flex flex-col items-center w-full">
      <Card className="w-full">
        <CardHeader>
            <CardTitle>Arrange the Colors</CardTitle>
            <CardDescription>Drag and drop the tiles to place them in the correct order of hue.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-wrap gap-2 justify-center items-center p-4 border rounded-lg">
                <div className="flex flex-col items-center">
                    <div style={{ backgroundColor: d15Caps[0].color }} className="w-12 h-12 rounded-lg shadow-md flex items-center justify-center font-bold text-white">
                        P
                    </div>
                    <span className="text-xs mt-1">Pilot</span>
                </div>

                <div className="flex-grow flex flex-wrap gap-2">
                    {caps.map(cap => (
                        <div
                            key={cap.id}
                            draggable
                            onDragStart={() => handleDragStart(cap.id)}
                            onDrop={() => handleDrop(cap.id)}
                            onDragOver={handleDragOver}
                            className={cn(
                                "w-16 h-16 rounded-lg shadow-md cursor-pointer transition-all flex items-center justify-center text-xs font-mono",
                                draggedCapId === cap.id && "opacity-50 scale-110"
                            )}
                            style={{ backgroundColor: cap.color }}
                        >
                             <span className="bg-black/30 rounded-sm px-1.5 py-0.5 text-white">{cap.color}</span>
                        </div>
                    ))}
                </div>
            </div>
            <Button onClick={finishTest} className="mt-6 w-full">Finish Test</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export function ColorVisionTest() {
  const [testType, setTestType] = useState<'selection' | 'ishihara' | 'd15' | 'hrr'>('selection');

  const renderContent = () => {
    switch(testType) {
      case 'ishihara':
        return <IshiharaTest onBack={() => setTestType('selection')} />;
      case 'd15':
        return <D15Test onBack={() => setTestType('selection')} />;
      case 'hrr':
        return <HrrTest onBack={() => setTestType('selection')} />;
      case 'selection':
      default:
        return (
          <div className="text-center space-y-6">
            <h3 className="text-xl font-semibold">Choose a Color Vision Test</h3>
            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <Card className="hover:border-primary transition-colors">
                  <CardHeader>
                      <CardTitle>AI Ishihara Plate Test</CardTitle>
                      <CardDescription>Screens for red-green color deficiencies using AI-generated plates.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <Button onClick={() => setTestType('ishihara')} className="w-full">Start Ishihara Test</Button>
                  </CardContent>
              </Card>
               <Card className="hover:border-primary transition-colors">
                  <CardHeader>
                      <CardTitle>AI HRR Plate Test</CardTitle>
                      <CardDescription>A comprehensive test for red-green and blue-yellow deficiencies.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <Button onClick={() => setTestType('hrr')} className="w-full">Start HRR Test</Button>
                  </CardContent>
              </Card>
              <Card className="hover:border-primary transition-colors">
                  <CardHeader>
                      <CardTitle>Farnsworth D-15 Test</CardTitle>
                      <CardDescription>Screens for all types of color deficiency by arranging colored tiles.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <Button onClick={() => setTestType('d15')} className="w-full">Start D-15 Test</Button>
                  </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  }

  return <div>{renderContent()}</div>;
}
