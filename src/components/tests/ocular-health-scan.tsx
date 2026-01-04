
"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, RefreshCw, AlertTriangle, Upload, Eye, ListChecks, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ocularHealthScan, type OcularHealthScanOutput } from '@/ai/flows/ocular-health-scan';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type Step = 'instructions' | 'capture' | 'analyzing' | 'results';

const confidenceColors: Record<string, string> = {
    "Low": "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300",
    "Medium": "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
    "High": "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300",
};

export function OcularHealthScan() {
  const [step, setStep] = useState<Step>('instructions');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<OcularHealthScanOutput | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleAnalyze = async (imageUri: string) => {
    setStep('analyzing');
    try {
      const result = await ocularHealthScan({ eyeImageUri: imageUri });
      setAnalysisResult(result);
      setStep('results');
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast({
        title: "Analysis Failed",
        description: "The AI service could not analyze your image. Please try again.",
        variant: "destructive",
      });
      setStep('instructions');
    }
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

  const restartTest = () => {
    setStep('instructions');
    setCapturedImage(null);
    setAnalysisResult(null);
  };
  
  const renderContent = () => {
    switch (step) {
      case 'instructions':
        return (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">AI Ocular Health Scan</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Upload a clear, well-lit photo of your eye to screen for common ocular surface conditions like cataracts and pterygium.
            </p>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Important: This Is Not a Diagnosis</AlertTitle>
              <AlertDescription>This experimental AI tool provides a preliminary screening. It is not a substitute for a professional medical examination by an ophthalmologist.</AlertDescription>
            </Alert>
            <Button onClick={() => fileInputRef.current?.click()} size="lg">
                <Upload className="mr-2 h-4 w-4" /> Upload Photo of Your Eye
            </Button>
            <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>
        );

      case 'analyzing':
        return (
            <div className="flex flex-col items-center justify-center text-center h-64 space-y-4">
                {capturedImage && <Image src={capturedImage} alt="Captured eye" width={160} height={90} className="rounded-lg object-cover" />}
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground">AI is analyzing your ocular health...</p>
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
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold flex items-center gap-2 mb-2">
                                Detected Conditions
                                <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger><HelpCircle className="h-4 w-4 text-muted-foreground"/></TooltipTrigger>
                                    <TooltipContent><p>The AI's assessment of potential conditions.</p></TooltipContent>
                                </Tooltip>
                                </TooltipProvider>
                            </h4>
                            <div className="space-y-2">
                            {analysisResult.detectedConditions.map(item => (
                                <div key={item.condition} className="p-3 rounded-lg border bg-background">
                                    <div className="flex justify-between items-center">
                                        <h5 className="font-medium">{item.condition}</h5>
                                        <Badge className={cn("text-xs", confidenceColors[item.confidence])}>{item.confidence} Confidence</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{item.explanation}</p>
                                </div>
                            ))}
                            {analysisResult.detectedConditions.length === 0 && <p className="text-sm text-muted-foreground">No specific conditions detected.</p>}
                            </div>
                        </div>
                        
                        <div>
                            <h4 className="font-semibold flex items-center gap-2 mb-2"><ListChecks className="h-4 w-4"/> Recommendations</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                {analysisResult.recommendations.map((action, i) => <li key={i}>{action}</li>)}
                            </ul>
                        </div>
                    </div>
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
