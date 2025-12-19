"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Play, Timer, Loader2, Check, X } from 'lucide-react';
import { generateReadingComprehensionTest, type ReadingComprehensionTestOutput } from '@/ai/flows/reading-comprehension-test-generator';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';

type Step = 'instructions' | 'loading' | 'reading' | 'answering' | 'results';

export function ReadingSpeedTest() {
  const [step, setStep] = useState<Step>('instructions');
  const [testContent, setTestContent] = useState<ReadingComprehensionTestOutput | null>(null);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [readingTime, setReadingTime] = useState(0);
  const [score, setScore] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const { toast } = useToast();
  
  const loadTest = useCallback(async () => {
    setStep('loading');
    try {
      const content = await generateReadingComprehensionTest();
      setTestContent(content);
      setStep('reading');
      startTimeRef.current = Date.now();
    } catch (error) {
      console.error("Failed to generate reading test:", error);
      toast({
        title: "Error",
        description: "Could not generate the test. Please try again.",
        variant: "destructive"
      });
      setStep('instructions');
    }
  }, [toast]);

  const finishReading = () => {
    if (startTimeRef.current) {
      const endTime = Date.now();
      const durationSeconds = (endTime - startTimeRef.current) / 1000;
      setReadingTime(durationSeconds);
    }
    setStep('answering');
  };
  
  const handleAnswerChange = (questionIndex: number, answer: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = answer;
    setUserAnswers(newAnswers);
  };

  const finishTest = () => {
    if (!testContent) return;

    let correctCount = 0;
    testContent.questions.forEach((q, i) => {
      if (userAnswers[i] === q.correctAnswer) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setStep('results');
  };

  const restartTest = () => {
    setStep('instructions');
    setTestContent(null);
    setUserAnswers([]);
    setReadingTime(0);
    setScore(0);
    startTimeRef.current = null;
  };
  
  if (step === 'instructions') {
    return (
      <div className="text-center">
        <h3 className="text-xl font-semibold">Instructions</h3>
        <p className="text-muted-foreground mt-2 mb-4 max-w-md mx-auto">
          You will be shown a short passage. Read it at your normal pace. When you finish reading, click the "I'm Finished" button. You will then be asked a few questions about the passage to test your comprehension.
        </p>
        <Button onClick={loadTest}>
          <Play className="mr-2 h-4 w-4" /> Start Test
        </Button>
      </div>
    );
  }
  
  if (step === 'loading') {
      return (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Generating your reading test...</p>
          </div>
      )
  }

  if (step === 'results') {
    const wordCount = testContent?.passage.split(/\s+/).length || 0;
    const wpm = Math.round((wordCount / readingTime) * 60);
    const comprehension = score / (testContent?.questions.length || 1);
    const adjustedWpm = Math.round(wpm * comprehension);

    return (
      <Card className="mx-auto max-w-2xl text-center">
        <CardHeader>
          <CardTitle>Test Complete</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Reading Speed</p>
              <p className="text-4xl font-bold">{wpm} <span className="text-xl">WPM</span></p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Comprehension</p>
              <p className="text-4xl font-bold">{Math.round(comprehension * 100)}<span className="text-xl">%</span></p>
               <p className="text-xs text-muted-foreground">({score} / {testContent?.questions.length} correct)</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Adjusted Speed</p>
              <p className="text-4xl font-bold">{adjustedWpm} <span className="text-xl">WPM</span></p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-6 mb-4">
            Your adjusted speed reflects your reading pace combined with your ability to comprehend the material.
          </p>
          <Button onClick={restartTest}>
            <RefreshCw className="mr-2 h-4 w-4" /> Take Test Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-6">
        {step === 'reading' && (
             <Card className="w-full">
                <CardHeader>
                    <CardTitle>Read the passage below</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                <p className="text-lg leading-relaxed text-justify">
                    {testContent?.passage}
                </p>
                </CardContent>
            </Card>
        )}

       {step === 'answering' && testContent && (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Answer the questions</CardTitle>
                    <CardDescription>Based on the passage you just read.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                   {testContent.questions.map((q, qIndex) => (
                       <div key={qIndex} className="space-y-4">
                            <p className="font-semibold">{qIndex + 1}. {q.question}</p>
                            <RadioGroup onValueChange={(value) => handleAnswerChange(qIndex, value)}>
                                {q.options.map((option, oIndex) => (
                                    <div key={oIndex} className="flex items-center space-x-2">
                                        <RadioGroupItem value={option} id={`q${qIndex}o${oIndex}`} />
                                        <Label htmlFor={`q${qIndex}o${oIndex}`}>{option}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                       </div>
                   ))}
                </CardContent>
            </Card>
       )}

      {step === 'reading' && (
        <Button size="lg" onClick={finishReading}>
          <Timer className="mr-2 h-4 w-4" /> I'm Finished Reading
        </Button>
      )}

      {step === 'answering' && (
          <Button size="lg" onClick={finishTest} disabled={userAnswers.includes(undefined) || userAnswers.length !== testContent?.questions.length}>
             <Check className="mr-2 h-4 w-4" /> Submit Answers
          </Button>
      )}
    </div>
  );
}
