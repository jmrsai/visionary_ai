
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from 'next/link';
import AnimatedEyeModel from '@/components/AnimatedEyeModel';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertTriangle, Lightbulb, Hospital, Home, Youtube } from "lucide-react";
import { symptomChecker, type SymptomCheckerOutput } from "@/ai/flows/symptom-checker";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  symptoms: z.string().min(10, {
    message: "Please describe your symptoms in at least 10 characters.",
  }),
});

const severityColors: Record<string, string> = {
  Low: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
  Moderate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
  High: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
};

type ConditionName = 'normal' | 'glaucoma' | 'diabetic_retinopathy' | 'amd' | 'cataract';

const conditionMap: { [key: string]: ConditionName } = {
  'glaucoma': 'glaucoma',
  'diabetic retinopathy': 'diabetic_retinopathy',
  'age-related macular degeneration': 'amd',
  'macular degeneration': 'amd',
  'cataract': 'cataract',
  'cataracts': 'cataract',
};

const getConditionKey = (condition: string): ConditionName => {
    return conditionMap[condition.toLowerCase()] || 'normal';
};


export function SymptomCheckerForm() {
  const [result, setResult] = useState<SymptomCheckerOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [visualizedCondition, setVisualizedCondition] = useState<ConditionName>('normal');
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    setVisualizedCondition('normal');
    try {
      const response = await symptomChecker(values);
      setResult(response);
    } catch (error) {
      console.error("Error checking symptoms:", error);
      toast({
        title: "Error",
        description: "Failed to check symptoms. The AI service may be unavailable. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Describe Your Symptoms</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="symptoms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Symptoms</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'blurry vision, dry eyes, and occasional headaches'"
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Please enter your symptoms, separated by commas.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Lightbulb className="mr-2 h-4 w-4" />
                )}
                Check Symptoms
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        {isLoading && (
            <Card className="min-h-[400px]">
                 <CardHeader>
                    <CardTitle>Analyzing...</CardTitle>
                    <CardDescription>AI is processing your symptoms.</CardDescription>
                </CardHeader>
                 <CardContent>
                    <div className="flex flex-col items-center justify-center space-y-4 pt-10">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-muted-foreground">Analyzing symptoms...</p>
                    </div>
                 </CardContent>
            </Card>
        )}

        {result ? (
            <>
              {result.severity === 'High' && (
                <Alert variant="destructive" className="border-4">
                    <Hospital className="h-5 w-5" />
                    <AlertTitle className="text-xl font-bold">High Severity Detected</AlertTitle>
                    <AlertDescription className="text-base">
                        Your symptoms may indicate a serious condition. Please seek immediate medical attention from an eye care professional or go to the nearest emergency room.
                    </AlertDescription>
                </Alert>
              )}

                <div className="grid gap-4 items-start" style={{gridTemplateColumns: '1fr 220px'}}>
                    <Card>
                        <CardHeader>
                        <CardTitle>Possible Conditions</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                            AI-powered insights based on your symptoms.
                            <Badge className={severityColors[result.severity] || ''}>Severity: {result.severity}</Badge>
                        </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Disclaimer</AlertTitle>
                                <AlertDescription>{result.disclaimer}</AlertDescription>
                            </Alert>
                            <div className="space-y-4 pt-4" onMouseLeave={() => setVisualizedCondition('normal')}>
                                {result.possibleConditions.sort((a, b) => b.likelihood - a.likelihood).map((item) => (
                                    <div 
                                        key={item.condition}
                                        onMouseEnter={() => setVisualizedCondition(getConditionKey(item.condition))}
                                        className="p-3 rounded-lg border bg-background/50 cursor-pointer"
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <h4 className="font-semibold">{item.condition}</h4>
                                            <span className="text-sm font-medium text-muted-foreground">{item.likelihood}%</span>
                                        </div>
                                        <Progress value={item.likelihood} className="h-2" />
                                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="sticky top-20">
                         <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Visualization</CardTitle>
                         </CardHeader>
                         <CardContent>
                            <AnimatedEyeModel condition={visualizedCondition} showLabels={false} size="medium" />
                         </CardContent>
                    </Card>
                </div>

              {result.homeCareAdvice && result.homeCareAdvice.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Home className="h-5 w-5" /> Suggested Home Care</CardTitle>
                    <CardDescription>These are general suggestions for comfort. They are not a substitute for professional medical advice.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {result.homeCareAdvice.map((advice, index) => (
                        <li key={index} className="flex flex-col sm:flex-row justify-between sm:items-center p-3 rounded-lg bg-muted/50">
                            <span>{advice.advice}</span>
                            {advice.youtubeLink && (
                                <Button asChild variant="secondary" size="sm" className="mt-2 sm:mt-0">
                                    <Link href={advice.youtubeLink} target="_blank" rel="noopener noreferrer">
                                        <Youtube className="mr-2 h-4 w-4" /> Watch
                                    </Link>
                                </Button>
                            )}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </>
        ) : !isLoading && (
             <Card className="min-h-[400px]">
                <CardHeader>
                    <CardTitle>Awaiting Input</CardTitle>
                    <CardDescription>Your analysis will appear here.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center space-y-4 pt-10 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                            <Lightbulb className="h-8 w-8 text-muted-foreground"/>
                        </div>
                    <p className="text-muted-foreground">Potential conditions, severity, and home care suggestions will appear here once you submit your symptoms.</p>
                    </div>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
