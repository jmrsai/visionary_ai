"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Wand2, BarChart2, MessageSquareWarning } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
// import { holisticHealthInsights } from "@/ai/flows/holistic-health-insights";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// Mock data simulation
const mockScreenTimeData = [
  { day: "Mon", hours: 8.5 },
  { day: "Tue", hours: 9.2 },
  { day: "Wed", hours: 6.8 },
  { day: "Thu", hours: 10.1 },
  { day: "Fri", hours: 7.5 },
  { day: "Sat", hours: 4.2 },
  { day: "Sun", hours: 5.5 },
];

const mockSymptomReports = [
  { day: "Mon", symptom: "dry eyes" },
  { day: "Tue", symptom: "headache" },
  { day: "Thu", symptom: "dry eyes" },
  { day: "Thu", symptom: "eye strain" },
  { day: "Fri", symptom: "dry eyes" },
];

export function InsightsGenerator() {
  const [insight, setInsight] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsLoading(true);
    setInsight(null);
    try {
    //   const result = await holisticHealthInsights({
    //     screenTimeData: JSON.stringify(mockScreenTimeData),
    //     symptomReports: JSON.stringify(mockSymptomReports),
    //   });
    //   setInsight(result.insight);
      setInsight("AI insight generation is temporarily disabled.");
    } catch (error) {
      console.error("Error generating insight:", error);
      toast({
        title: "Error",
        description: "Failed to generate insight. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5" /> Simulated Weekly Data
            </CardTitle>
            <CardDescription>
              This is a simulation. In a full app, this data would be collected
              from your device (e.g., HealthKit) and in-app reports.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Screen Time (Hours)</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                {mockScreenTimeData.map((d) => (
                  <div key={d.day} className="flex justify-between">
                    <span>{d.day}:</span>
                    <span>{d.hours.toFixed(1)} hrs</span>
                  </div>
                ))}
              </div>
            </div>
             <div>
              <h4 className="font-semibold mb-2">Reported Symptoms</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                 {mockSymptomReports.length > 0 ? mockSymptomReports.map((s, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{s.day}:</span>
                    <span className="capitalize">{s.symptom}</span>
                  </div>
                )) : <p>No symptoms reported this week.</p>}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        <Card className="min-h-[300px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5" /> AI-Generated Insight
            </CardTitle>
            <CardDescription>
              Our AI analyzes your data to find meaningful connections.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center text-center">
            {isLoading && (
              <>
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">
                  Analyzing your week...
                </p>
              </>
            )}
            {insight && (
              <Alert>
                <AlertTitle className="text-left">Your Weekly Insight</AlertTitle>
                <AlertDescription className="text-left">
                  {insight}
                </AlertDescription>
              </Alert>
            )}
            {!isLoading && !insight && (
              <>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                  <MessageSquareWarning className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground mb-4">
                  Click the button to generate your personalized health insight.
                </p>
                <Button onClick={handleGenerate}>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Insight
                </Button>
              </>
            )}
            {!isLoading && insight && (
                 <Button onClick={handleGenerate} variant="secondary" className="mt-6">
                    <Wand2 className="mr-2 h-4 w-4" />
                    Regenerate Insight
                </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
