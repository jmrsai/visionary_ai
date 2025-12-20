

"use client";

import { useState, useMemo, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, RefreshCw, X, ArrowLeft, Loader2, Palette, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { HrrTest } from './hrr-test';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { MOCK_D15_CAPS } from '@/lib/data';
import { IshiharaPlateSVG, type IshiharaPlateData } from './ishihara-plate-svg';


const TOTAL_PLATES = 5; 

const getStatus = (score: number): 'normal' | 'attention' | 'concern' => {
    const accuracy = score / TOTAL_PLATES;
    if (accuracy >= 0.9) return 'normal'; // 90-100%
    if (accuracy >= 0.7) return 'attention'; // 70-89%
    return 'concern';
};

const getStatusInfo = (status: 'normal' | 'attention' | 'concern') => {
  switch (status) {
    case 'normal': 
        return { 
            text: 'Normal', 
            color: 'text-green-600', 
            bgColor: 'bg-green-100 dark:bg-green-900/50',
            interpretation: 'Your color vision appears to be normal. You correctly identified most color patterns.'
        };
    case 'attention': 
        return { 
            text: 'Needs Attention', 
            color: 'text-yellow-600', 
            bgColor: 'bg-yellow-100 dark:bg-yellow-900/50',
            interpretation: 'Some difficulty with color discrimination was detected. Consider consulting an eye care professional.'
        };
    case 'concern': 
        return { 
            text: 'Concerning', 
            color: 'text-red-600', 
            bgColor: 'bg-red-100 dark:bg-red-900/50',
            interpretation: 'A significant color vision deficiency was detected. We strongly recommend a professional evaluation.'
        };
  }
};


const generateNewPlateData = (usedNumbers: Set<number>): { data: IshiharaPlateData, newUsedNumbers: Set<number> } => {
    let correctNumber: number;
    do {
        correctNumber = Math.floor(Math.random() * 90) + 10;
    } while (usedNumbers.has(correctNumber));

    const newUsedNumbers = new Set(usedNumbers).add(correctNumber);

    const distractors = new Set<number>();
    while (distractors.size < 3) {
        const d = Math.floor(Math.random() * 90) + 10;
        if (d !== correctNumber) {
            distractors.add(d);
        }
    }
    const options = [correctNumber, ...Array.from(distractors)].sort(() => Math.random() - 0.5);
    
    return {
        data: {
            numberToDisplay: correctNumber,
            options,
        },
        newUsedNumbers: newUsedNumbers
    };
};


const IshiharaTest = () => {
  const [step, setStep] = useState<'instructions' | 'test' | 'results'>('instructions');
  const [currentPlate, setCurrentPlate] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [plateData, setPlateData] = useState<IshiharaPlateData | null>(null);
  const [usedNumbers, setUsedNumbers] = useState<Set<number>>(new Set());

  const prepareNextPlate = (currentUsed: Set<number>) => {
      const { data, newUsedNumbers } = generateNewPlateData(currentUsed);
      setPlateData(data);
      setUsedNumbers(newUsedNumbers);
  }

  const startTest = () => {
    setCurrentPlate(0);
    setScore(0);
    setUserAnswers([]);
    const initialUsed = new Set<number>();
    setUsedNumbers(initialUsed);
    prepareNextPlate(initialUsed);
    setStep('test');
  };

  const handleAnswer = (answer: number) => {
    if (!plateData) return;
    setUserAnswers([...userAnswers, answer]);
    if (answer === plateData.numberToDisplay) {
      setScore(score + 1);
    }
    
    if (currentPlate < TOTAL_PLATES - 1) {
      setCurrentPlate(currentPlate + 1);
      prepareNextPlate(usedNumbers);
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
        <h3 className="text-xl font-semibold">Algorithmic Ishihara Test</h3>
        <p className="text-muted-foreground mt-2 mb-4">
          You will be shown a series of unique, computer-generated plates. Click the number you see in the plate. If you see nothing, choose one of the options at random. This test primarily screens for red-green color deficiencies.
        </p>
        <div className="flex justify-center gap-4">
            <Button onClick={startTest}>Start Test</Button>
        </div>
      </div>
    );
  }

  if (step === 'results') {
    const finalStatus = getStatus(score);
    const statusInfo = getStatusInfo(finalStatus);
    const accuracy = Math.round((score / TOTAL_PLATES) * 100);

    return (
      <div className="max-w-lg mx-auto space-y-6">
        <Card className="text-center shadow-lg">
          <CardHeader>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Palette className="h-8 w-8 text-primary"/>
            </div>
            <CardTitle>Color Vision Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-6xl font-bold text-primary">{accuracy}</span>
              <span className="text-3xl text-muted-foreground">/100</span>
            </div>
             <Badge className={cn("text-sm", statusInfo.bgColor, statusInfo.color)}>{statusInfo.text}</Badge>
            <p className="text-sm text-muted-foreground">
                You correctly identified {score} out of {TOTAL_PLATES} plates.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
                <CardTitle className="text-lg text-blue-800 dark:text-blue-300">Interpretation</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-blue-700 dark:text-blue-300/90">{statusInfo.interpretation}</p>
                 <p className="text-xs text-blue-600 dark:text-blue-400/80 mt-4">This screening is not a substitute for a professional diagnosis.</p>
            </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" size="lg" onClick={restartTest}>
                <RefreshCw className="mr-2 h-4 w-4" /> Retake Test
            </Button>
            <Button size="lg" onClick={restartTest}>
                Done
            </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center space-y-6 max-w-md mx-auto">
        <div className="w-full text-center">
            <p className="text-muted-foreground">Plate {currentPlate + 1} of {TOTAL_PLATES}</p>
            <p className="font-semibold text-lg mt-4">What number do you see?</p>
             <p className="text-sm text-muted-foreground">If you see nothing, take your best guess.</p>
        </div>
        <div className="w-80 h-80 relative rounded-full overflow-hidden border-4 border-muted flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            {plateData ? (
                <IshiharaPlateSVG numberToDisplay={plateData.numberToDisplay} width={320} height={320} />
            ) : (
                 <div className="w-full h-full bg-muted animate-pulse" />
            )}
        </div>
        <div className="grid grid-cols-2 gap-4 w-full">
            {plateData?.options.map(option => (
            <Button key={option} size="lg" variant="outline" className="h-24 text-3xl font-bold" onClick={() => handleAnswer(option)}>
                {option}
            </Button>
            ))}
        </div>
         <div className="w-full pt-4">
          <Progress value={((currentPlate + 1) / TOTAL_PLATES) * 100} />
        </div>
    </div>
  );
};

export function ColorVisionTest() {
  return <IshiharaTest />;
}
