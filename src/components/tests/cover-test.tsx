
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Play, ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Step = 'instructions' | 'test-left' | 'test-right' | 'observe-left' | 'observe-right' | 'results';
type EyeToTest = 'left' | 'right';
type Result = 'normal' | 'movement-detected' | 'unsure';

export function CoverTest() {
  const [step, setStep] = useState<Step>('instructions');
  const [results, setResults] = useState<{ left: Result | null, right: Result | null }>({ left: null, right: null });
  const [showOccluder, setShowOccluder] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();

  const startTest = () => {
    setResults({ left: null, right: null });
    setStep('test-left');
  };
  
  useEffect(() => {
    return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
    }
  }, []);

  const handleOcclusion = (eye: EyeToTest) => {
    setShowOccluder(true);
    timerRef.current = setTimeout(() => {
        setShowOccluder(false);
        setStep(eye === 'left' ? 'observe-left' : 'observe-right');
    }, 2000);
  };
  
  const handleObservation = (eye: EyeToTest, result: Result) => {
      setResults(prev => ({...prev, [eye]: result}));
      if (eye === 'left') {
          setStep('test-right');
      } else {
          setStep('results');
      }
  }

  const restartTest = () => {
    setStep('instructions');
  };

  const renderInstructions = () => (
    <div className="text-center">
      <h3 className="text-xl font-semibold">Cover Test for Strabismus</h3>
      <p className="text-muted-foreground mt-2 mb-4 max-w-md mx-auto">
        This is a guided self-test to screen for eye misalignment (strabismus). Find a comfortable spot where you can see your own reflection in your device's camera.
      </p>
      <Button onClick={startTest}><Play className="mr-2 h-4 w-4" /> Start Screening</Button>
    </div>
  );

  const renderTestStep = (eye: EyeToTest) => (
    <div className="flex flex-col items-center space-y-4">
      <h3 className="text-xl font-semibold">Testing {eye === 'left' ? 'Left' : 'Right'} Eye</h3>
      <p className="text-muted-foreground text-center">
        Stare at the red dot. Keep your gaze fixed on it.
        When you're ready, press the button to cover your {eye === 'left' ? 'right' : 'left'} eye.
      </p>
      <div className="relative w-full max-w-xs aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
        {/* Simulating a camera feed */}
        <div className="w-16 h-16 rounded-full bg-gray-400 flex items-center justify-center"><Eye className="w-8 h-8 text-white"/></div>
        {/* Central fixation dot */}
        <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
        
        <AnimatePresence>
        {showOccluder && (
             <motion.div
                initial={{ x: eye === 'left' ? '100%' : '-100%'}}
                animate={{ x: 0 }}
                exit={{ x: eye === 'left' ? '100%' : '-100%'}}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={`absolute inset-y-0 ${eye === 'left' ? 'right-0' : 'left-0'} w-1/2 bg-black/80 flex items-center justify-center`}
            >
                <EyeOff className="w-10 h-10 text-white" />
            </motion.div>
        )}
        </AnimatePresence>
      </div>
      <Button onClick={() => handleOcclusion(eye)} disabled={showOccluder}>
          Cover {eye === 'left' ? 'Right' : 'Left'} Eye for 2 seconds
      </Button>
    </div>
  );
  
  const renderObservationStep = (eye: EyeToTest) => (
      <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold">Observation: {eye === 'left' ? 'Left' : 'Right'} Eye</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
              When you uncovered your eye, did the {eye} eye have to move to look back at the dot? Watch your reflection carefully.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => handleObservation(eye, 'movement-detected')} variant="destructive">Yes, I saw it move</Button>
              <Button onClick={() => handleObservation(eye, 'normal')} className="bg-green-600 hover:bg-green-700">No, it stayed still</Button>
              <Button onClick={() => handleObservation(eye, 'unsure')} variant="outline">I'm not sure</Button>
          </div>
          <p className="text-xs text-muted-foreground">If an eye moves to re-align, it might indicate strabismus.</p>
      </div>
  );

  const renderResults = () => {
    const hasIssue = results.left === 'movement-detected' || results.right === 'movement-detected';
    return (
      <Card className="mx-auto max-w-lg text-center">
        <CardHeader>
          <CardTitle>Screening Complete</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-2 gap-4 my-4">
                <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-lg">Left Eye</h4>
                    <p className="text-xl font-bold capitalize">{results.left?.replace('-', ' ')}</p>
                </div>
                 <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-lg">Right Eye</h4>
                    <p className="text-xl font-bold capitalize">{results.right?.replace('-', ' ')}</p>
                </div>
            </div>
            {hasIssue ? (
                 <p className="text-orange-600">Your self-assessment indicated potential eye movement. This can be a sign of strabismus.</p>
            ) : (
                <p className="text-green-600">Your self-assessment did not indicate any obvious eye movement.</p>
            )}
          <p className="text-sm text-muted-foreground mt-4 mb-6">This is a basic screening tool and is not a substitute for a professional diagnosis. If you have any concerns about your eye alignment, please consult an eye doctor.</p>
          <Button onClick={restartTest}><RefreshCw className="mr-2 h-4 w-4" /> Restart Test</Button>
        </CardContent>
      </Card>
    );
  };
  
  switch (step) {
      case 'instructions': return renderInstructions();
      case 'test-left': return renderTestStep('left');
      case 'observe-left': return renderObservationStep('left');
      case 'test-right': return renderTestStep('right');
      case 'observe-right': return renderObservationStep('right');
      case 'results': return renderResults();
      default: return null;
  }
}
