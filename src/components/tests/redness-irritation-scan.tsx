"use client";

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Camera, RefreshCw, AlertTriangle, Upload, Eye, ShieldCheck, ListChecks } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// import { rednessIrritationScan, type RednessIrritationScanOutput } from '@/ai/flows/redness-irritation-scan';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

// Mock Type
type RednessIrritationScanOutput = {
    isEyeDetected: boolean;
    rednessLevel: "None" | "Low" | "Moderate" | "High";
    irritationLevel: "None" | "Low" | "Moderate" | "High";
    analysisSummary: string;
    potentialConditions: {
        condition: string;
        confidence: "Low" | "Medium" | "High";
        explanation: string;
    }[];
    suggestedActions: string[];
    preventativeTips: string[];
    disclaimer: string;
};


type Step = 'instructions' | 'capture' | 'analyzing' | 'results';

const levelColors: Record<string, string> = {
    "None": "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-300",
    "Low": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-300",
    "Moderate": "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300 border-orange-300",
    "High": "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-300",
};

const confidenceColors: Record<string, string> = {
    "Low": "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300",
    "Medium": "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
    "High": "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300",
}


export function RednessIrritationScan() {
  const [step, setStep] = useState<Step>('instructions');
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<RednessIrritationScanOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    return () => {
        stopCamera();
    }
  }, []);

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

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

  const handleStartCapture = async () => {
    const hasPermission = await getCameraPermission();
    if (hasPermission) {
      setStep('capture');
    }
  };

  const handleCapture = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUri = canvas.toDataURL("image/jpeg");
    setCapturedImage(dataUri);
    stopCamera();
    handleAnalyze(dataUri);
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUri = e.target?.result as string;
        setCapturedImage(dataUri);
        handleAnalyze(dataUri);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleAnalyze = async (imageUri: string) => {
    setStep('analyzing');
    setIsAnalyzing(true);
    try {
    //   const result = await rednessIrritationScan({ eyeImageUri: imageUri });
      const result: RednessIrritationScanOutput = {
          isEyeDetected: true,
          rednessLevel: "Low",
          irritationLevel: "None",
          analysisSummary: "AI is temporarily disabled. This is a mock result.",
          potentialConditions: [{ condition: "Healthy Eye", confidence: "High", explanation: "This is a mock result."}],
          suggestedActions: ["Rest your eyes.", "Stay hydrated."],
          preventativeTips: ["Take screen breaks.", "Use lubricating eye drops."],
          disclaimer: "This is an experimental screening tool, not a medical diagnosis. Consult a healthcare professional for any health concerns."
      }
      setAnalysisResult(result);
      setStep('results');
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast({
        title: "Analysis Failed",
        description: "The AI service could not analyze your image. Please try again.",
        variant: "destructive",
      });
      setStep('capture'); // Go back to capture
    } finally {
      setIsAnalyzing(false);
    }
  };

  const restartTest = () => {
    setStep('instructions');
    setCapturedImage(null);
    setAnalysisResult(null);
    setHasCameraPermission(null);
    stopCamera();
  };

  const renderContent = () => {
    switch (step) {
      case 'instructions':
        return (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">AI Redness & Irritation Scan</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              This experimental tool uses your camera to analyze the white of your eye (sclera) for signs of redness and irritation.
            </p>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>For Best Results</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside">
                    <li>Find a well-lit area.</li>
                    <li>Gently pull down your lower eyelid.</li>
                    <li>Hold the camera steady and close to your eye.</li>
                    <li>Ensure the image is clear and in focus.</li>
                </ul>
              </AlertDescription>
            </Alert>
            <Button onClick={handleStartCapture}>
              <Camera className="mr-2 h-4 w-4" /> Start Scan
            </Button>
          </div>
        );

      case 'capture':
        return (
          <div className="flex flex-col items-center space-y-4">
             <div className="w-full aspect-video bg-muted rounded-lg overflow-hidden relative">
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                <div className="absolute inset-0 flex items-center justify-center p-4">
                    <div className="w-48 h-32 border-4 border-dashed border-white/50 rounded-lg" />
                </div>
                {hasCameraPermission === false && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white p-4">
                        <AlertTitle>Camera permission denied</AlertTitle>
                        <AlertDescription>Please enable camera access in your browser settings or upload a photo.</AlertDescription>
                    </div>
                )}
            </div>
            <div className="flex items-center gap-4">
                <Button size="lg" onClick={handleCapture} disabled={!hasCameraPermission}>
                    <Camera className="mr-2 h-5 w-5" /> Capture
                </Button>
                <Button size="lg" variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mr-2 h-5 w-5" /> Upload
                </Button>
                <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleFileChange} />
            </div>
          </div>
        );

      case 'analyzing':
        return (
            <div className="flex flex-col items-center justify-center text-center h-64 space-y-4">
                {capturedImage && <Image src={capturedImage} alt="Captured eye" width={160} height={90} className="rounded-lg object-cover" />}
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground">AI is analyzing your eye...</p>
            </div>
        );
        
      case 'results':
        if (!analysisResult) return <p>No results found.</p>;
        return (
          <div className="grid md:grid-cols-2 gap-6 items-start">
             <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Your Scan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {capturedImage && (
                            <Image src={capturedImage} alt="Analyzed eye" width={320} height={180} className="rounded-lg object-cover w-full" />
                        )}
                        <Button onClick={restartTest} className="w-full mt-4">
                            <RefreshCw className="mr-2 h-4 w-4" /> Scan Again
                        </Button>
                    </CardContent>
                </Card>
             </div>

            <Card className="bg-muted/30">
                <CardHeader>
                    <CardTitle>AI Analysis Report</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {!analysisResult.isEyeDetected ? (
                        <Alert variant="destructive">
                            <AlertTitle>No Eye Detected</AlertTitle>
                            <AlertDescription>The AI could not clearly detect an eye in the image. Please try again with a clearer, more direct photo.</AlertDescription>
                        </Alert>
                    ) : (
                        <>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold mb-2">Overall Assessment</h4>
                                    <div className="flex justify-around p-2 rounded-lg bg-background">
                                        <div className="text-center">
                                            <p className="text-sm text-muted-foreground">Redness</p>
                                            <Badge className={cn(levelColors[analysisResult.rednessLevel])}>{analysisResult.rednessLevel}</Badge>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm text-muted-foreground">Irritation</p>
                                            <Badge className={cn(levelColors[analysisResult.irritationLevel])}>{analysisResult.irritationLevel}</Badge>
                                        </div>
                                    </div>
                                     <p className="text-sm text-muted-foreground mt-2">{analysisResult.analysisSummary}</p>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-2">Potential Conditions</h4>
                                    <div className="space-y-2">
                                    {analysisResult.potentialConditions.map(item => (
                                        <div key={item.condition} className="p-3 rounded-lg border bg-background">
                                            <div className="flex justify-between items-center">
                                                <h5 className="font-medium">{item.condition}</h5>
                                                <Badge className={cn("text-xs", confidenceColors[item.confidence])}>{item.confidence}</Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground">{item.explanation}</p>
                                        </div>
                                    ))}
                                    </div>
                                </div>
                                
                                <div>
                                    <h4 className="font-semibold flex items-center gap-2 mb-2"><ListChecks className="h-4 w-4"/> Suggested Actions</h4>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                        {analysisResult.suggestedActions.map((action, i) => <li key={i}>{action}</li>)}
                                    </ul>
                                </div>
                                
                                 <div>
                                    <h4 className="font-semibold flex items-center gap-2 mb-2"><ShieldCheck className="h-4 w-4"/> Preventative Tips</h4>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                        {analysisResult.preventativeTips.map((tip, i) => <li key={i}>{tip}</li>)}
                                    </ul>
                                </div>

                            </div>
                        </>
                    )}
                     <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Disclaimer</AlertTitle>
                        <AlertDescription>{analysisResult.disclaimer}</AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return <div>{renderContent()}</div>;
}
