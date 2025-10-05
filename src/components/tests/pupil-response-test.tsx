"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Camera, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export function PupilResponseTest() {
  const [step, setStep] = useState<'instructions' | 'testing' | 'results'>('instructions');
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [testProgress, setTestProgress] = useState(0);
  const [testStatusText, setTestStatusText] = useState('Waiting to start...');
  const [result, setResult] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const testTimerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (testTimerRef.current) {
        clearInterval(testTimerRef.current);
      }
      // Stop camera stream on component unmount
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const getCameraPermission = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera not supported");
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasCameraPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      return true;
    } catch (error) {
      console.error("Error accessing camera:", error);
      setHasCameraPermission(false);
      toast({
        variant: "destructive",
        title: "Camera Access Denied",
        description: "Please enable camera permissions to use this test.",
      });
      return false;
    }
  };

  const startTest = async () => {
    const hasPermission = await getCameraPermission();
    if (hasPermission) {
      setStep('testing');
      setTestProgress(0);
      setResult(null);
      
      const sequence = [
        { progress: 20, duration: 2000, text: 'Finding face... Please hold still.' },
        { progress: 40, duration: 1000, text: 'Calibrating baseline pupil size.' },
        { progress: 60, duration: 1000, text: 'Applying light stimulus...' },
        { progress: 80, duration: 2000, text: 'Measuring pupil constriction.' },
        { progress: 100, duration: 1500, text: 'Measuring pupil dilation.' },
      ];

      let currentIndex = 0;

      function runNextStep() {
        if(currentIndex >= sequence.length) {
            setTestStatusText('Analysis complete.');
            // Simulate AI result
            setResult(Math.random() > 0.3 ? 'Normal pupillary light reflex detected.' : 'Asymmetrical or sluggish pupil response detected.');
            setStep('results');
            return;
        }

        const step = sequence[currentIndex];
        setTestStatusText(step.text);
        setTestProgress(step.progress);

        currentIndex++;
        setTimeout(runNextStep, step.duration);
      }
      
      setTestStatusText("Initializing...");
      setTestProgress(5);
      setTimeout(runNextStep, 500);
    }
  };

  const restartTest = () => {
    setStep('instructions');
    setTestProgress(0);
    setResult(null);
    setTestStatusText('Waiting to start...');
    if(testTimerRef.current) clearInterval(testTimerRef.current);
  };

  const renderContent = () => {
    switch (step) {
      case 'instructions':
        return (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">Pupil Response Test (Experimental)</h3>
            <Alert variant="destructive">
              <AlertTitle>Warning!</AlertTitle>
              <AlertDescription>This test will flash a bright light. Do not proceed if you are sensitive to flashing lights or have a history of photosensitive seizures.</AlertDescription>
            </Alert>
            <p className="text-muted-foreground max-w-md mx-auto">
              This test uses your camera to measure how your pupils react to light. For best results, find a dimly lit room, hold your device steady at arm's length, and look directly at the camera.
            </p>
            <Button onClick={startTest}>
              <Camera className="mr-2 h-4 w-4" /> Start Test
            </Button>
          </div>
        );
      case 'testing':
        return (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-full aspect-video bg-muted rounded-lg overflow-hidden relative">
              <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
              {testProgress > 40 && testProgress < 65 && (
                <div className="absolute inset-0 bg-white animate-pulse"></div>
              )}
            </div>
            <Progress value={testProgress} className="w-full" />
            <p className="text-muted-foreground flex items-center gap-2">
              <Loader2 className="animate-spin h-4 w-4" />
              {testStatusText}
            </p>
          </div>
        );
      case 'results':
        return (
          <Card className="mx-auto max-w-md text-center">
            <CardHeader>
              <CardTitle>Test Complete</CardTitle>
              <CardDescription>Experimental Analysis:</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold my-4">{result}</p>
              <p className="text-sm text-muted-foreground mb-4">
                This is an experimental feature and should not be used for medical diagnosis. Abnormal results could be due to lighting, camera quality, or movement. Consult a healthcare professional for any concerns about your pupil reflex.
              </p>
              <Button onClick={restartTest}>
                <RefreshCw className="mr-2 h-4 w-4" /> Restart Test
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
