"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, RefreshCw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Apple, Home, Square, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const acuityLevels = [
  { size: 'text-8xl', score: '20/200' },
  { size: 'text-7xl', score: '20/100' },
  { size: 'text-6xl', score: '20/70' },
  { size: 'text-5xl', score: '20/50' },
  { size: 'text-4xl', score: '20/40' },
  { size: 'text-3xl', score: '20/30' },
  { size: 'text-2xl', score: '20/25' },
  { size: 'text-xl', score: '20/20' },
];

const chartTypes = {
  letters: {
    name: 'Letters',
    chars: 'C D E F H K N O P R S T V Z',
  },
  numbers: {
    name: 'Numbers',
    chars: '1 2 3 4 5 6 7 8 9',
  },
  tumblingE: {
    name: 'Tumbling E',
    chars: 'E',
    directions: ['up', 'down', 'left', 'right'] as const,
  },
  pictures: {
    name: 'Pictures',
    chars: 'Apple, Home, Square, Circle',
    icons: {
      Apple: Apple,
      Home: Home,
      Square: Square,
      Circle: Circle,
    } as Record<string, React.ElementType>,
  },
};

type TestType = keyof typeof chartTypes;
type Direction = 'up' | 'down' | 'left' | 'right';
type Picture = 'Apple' | 'Home' | 'Square' | 'Circle';

const getRotationClass = (direction: Direction) => {
  switch (direction) {
    case 'up': return '-rotate-90';
    case 'down': return 'rotate-90';
    case 'left': return 'rotate-180';
    case 'right': return '';
  }
};

export function VisualAcuityTest() {
  const [step, setStep] = useState<'instructions' | 'selection' | 'test' | 'results'>('instructions');
  const [testType, setTestType] = useState<TestType>('letters');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [finalScore, setFinalScore] = useState<string | null>(null);

  const currentStimulus = useMemo(() => {
    const typeInfo = chartTypes[testType];
    const chars = typeInfo.chars.replace(/, /g, '');
    const char = chars[Math.floor(Math.random() * chars.length)];
    
    if (testType === 'tumblingE') {
      return {
        char: 'E',
        direction: chartTypes.tumblingE.directions[Math.floor(Math.random() * chartTypes.tumblingE.directions.length)],
      };
    }
    
    return { char };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLevel, testType]);

  const startTest = () => {
    setStep('test');
    setCurrentLevel(0);
    setFinalScore(null);
  };
  
  const handleAnswer = (answer: string) => {
    let isCorrect = false;
    if (testType === 'tumblingE') {
      isCorrect = answer === currentStimulus.direction;
    } else if (testType === 'pictures' || testType === 'letters' || testType === 'numbers') {
      isCorrect = answer.toUpperCase() === currentStimulus.char?.toUpperCase();
    }
    
    if (isCorrect) {
      if (currentLevel < acuityLevels.length - 1) {
        setCurrentLevel(currentLevel + 1);
      } else {
        setFinalScore(acuityLevels[acuityLevels.length - 1].score);
        setStep('results');
      }
    } else {
      const score = currentLevel > 0 ? acuityLevels[currentLevel - 1].score : 'Below 20/200';
      setFinalScore(score);
      setStep('results');
    }
  };

  const restartTest = () => {
    setStep('instructions');
    setTestType('letters');
  };

  const renderTestStimulus = () => {
    const level = acuityLevels[currentLevel];
    const IconComponent = testType === 'pictures' ? chartTypes.pictures.icons[currentStimulus.char!] : null;

    if (IconComponent) {
      return <IconComponent className={cn(level.size, "text-black transition-transform")} />;
    }

    return (
      <p className={cn(
        level.size,
        "font-mono tracking-widest text-black transition-transform",
        testType === 'tumblingE' && getRotationClass(currentStimulus.direction as Direction)
      )}>
        {currentStimulus.char}
      </p>
    );
  };

  const renderAnswerOptions = () => {
    switch (testType) {
      case 'tumblingE':
        return (
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" size="lg" className="flex-col h-20" onClick={() => handleAnswer('up')}><ArrowUp className="h-8 w-8" /><span>Up</span></Button>
            <Button variant="outline" size="lg" className="flex-col h-20" onClick={() => handleAnswer('down')}><ArrowDown className="h-8 w-8" /><span>Down</span></Button>
            <Button variant="outline" size="lg" className="flex-col h-20" onClick={() => handleAnswer('left')}><ArrowLeft className="h-8 w-8" /><span>Left</span></Button>
            <Button variant="outline" size="lg" className="flex-col h-20" onClick={() => handleAnswer('right')}><ArrowRight className="h-8 w-8" /><span>Right</span></Button>
          </div>
        );
      case 'pictures':
        const PictureIcons = chartTypes.pictures.icons;
        return (
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(PictureIcons).map(pic => {
                const Icon = PictureIcons[pic];
                return <Button key={pic} variant="outline" size="lg" className="flex-col h-20" onClick={() => handleAnswer(pic)}><Icon className="h-8 w-8" /><span>{pic}</span></Button>
            })}
          </div>
        );
      case 'letters':
      case 'numbers':
        const options = chartTypes[testType].chars.split('').filter(c => c !== ' ');
        const correctOption = currentStimulus.char!;
        const incorrectOptions = options.filter(o => o !== correctOption);
        const shuffledOptions = [correctOption, ...incorrectOptions.sort(() => 0.5 - Math.random()).slice(0, 3)].sort(() => 0.5 - Math.random());

        return (
          <div className="grid grid-cols-2 gap-4">
            {shuffledOptions.map(option => (
              <Button key={option} variant="outline" size="lg" className="h-20 text-4xl" onClick={() => handleAnswer(option)}>{option}</Button>
            ))}
          </div>
        );
    }
  };

  if (step === 'instructions') {
    return (
      <div className="text-center">
        <h3 className="text-xl font-semibold">Instructions</h3>
        <p className="text-muted-foreground mt-2 mb-4 max-w-md mx-auto">
          For accurate results, please stand 10 feet (about 3 meters) away from your screen. Cover one eye, then proceed.
        </p>
        <Button onClick={() => setStep('selection')}>
          <Eye className="mr-2 h-4 w-4" /> I'm Ready
        </Button>
      </div>
    );
  }
  
  if (step === 'selection') {
    return (
      <div className="max-w-md mx-auto space-y-6">
        <h3 className="text-xl font-semibold text-center">Choose Test Type</h3>
        <p className="text-muted-foreground text-center">Select the chart most appropriate for the person being tested.</p>
        <RadioGroup value={testType} onValueChange={(value) => setTestType(value as TestType)} className="space-y-2">
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="letters" id="letters" />
                <Label htmlFor="letters" className="flex-1">Letters (For literate adults)</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="numbers" id="numbers" />
                <Label htmlFor="numbers" className="flex-1">Numbers (For literate adults)</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="tumblingE" id="tumblingE" />
                <Label htmlFor="tumblingE" className="flex-1">Tumbling "E" (For illiterate adults & children)</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="pictures" id="pictures" />
                <Label htmlFor="pictures" className="flex-1">Pictures (For young children)</Label>
            </div>
        </RadioGroup>
        <Button onClick={startTest} className="w-full">Start Test</Button>
      </div>
    );
  }

  if (step === 'results') {
    return (
        <Card className="mx-auto max-w-md text-center">
            <CardHeader>
                <CardTitle>Test Complete</CardTitle>
                <CardDescription>Your estimated visual acuity is:</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-5xl font-bold my-4">{finalScore}</p>
                <p className="text-sm text-muted-foreground mb-4">This is a screening tool, not a medical diagnosis. For an accurate assessment, please consult an eye care professional.</p>
                <Button onClick={restartTest}>
                    <RefreshCw className="mr-2 h-4 w-4" /> Restart Test
                </Button>
            </CardContent>
        </Card>
    );
  }

  const level = acuityLevels[currentLevel];

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="h-48 flex items-center justify-center w-full bg-white rounded-md p-4">
        {renderTestStimulus()}
      </div>
      <p className="text-muted-foreground">Line {currentLevel + 1} of {acuityLevels.length} (Score: {level.score})</p>
      
      <div className="w-full max-w-md">
        {renderAnswerOptions()}
      </div>
    </div>
  );
}
