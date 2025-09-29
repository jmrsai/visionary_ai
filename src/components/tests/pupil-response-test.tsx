"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Camera, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

export function PupilResponseTest() {
  const [step, setStep] = useState<'instructions' | 'testing' | 'results'>('instructions');
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [testProgress, setTestProgress] = useState(0);
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
      // Simulate a test process
      testTimerRef.current = setInterval(() => {
        setTestProgress(prev => {
          const newProgress = prev + 10;
          if (newProgress >= 100) {
            clearInterval(testTimerRef.current);
            // Simulate AI result
            setResult(Math.random() > 0.5 ? 'Normal pupillary light reflex detected.' : 'Asymmetrical or sluggish pupil response detected.');
            setStep('results');
            return 100;
          }
          return newProgress;
        });
      }, 500);
    }
  };

  const restartTest = () => {
    setStep('instructions');
    setTestProgress(0);
    setResult(null);
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
              This test uses your camera to measure how your pupils react to light. Ensure you are in a dimly lit room and hold your device steady.
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
              {testProgress > 30 && testProgress < 70 && (
                <div className="absolute inset-0 bg-white animate-pulse"></div>
              )}
            </div>
            <Progress value={testProgress} className="w-full" />
            <p className="text-muted-foreground flex items-center gap-2">
              <Loader2 className="animate-spin h-4 w-4" />
              {testProgress < 30 ? 'Positioning...' : testProgress < 70 ? 'Flashing light...' : 'Analyzing...'}
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
                This is an experimental feature and should not be used for medical diagnosis. Abnormal results could be due to lighting, camera quality, or movement. Consult a healthcare professional for any concerns.
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
