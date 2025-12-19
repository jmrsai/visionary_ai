'use client';

import { useState } from 'react';
import { holisticHealthInsights } from '@/ai/flows/holistic-health-insights';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Loader2, Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function HolisticInsightsPage() {
  const [userInput, setUserInput] = useState('');
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setInsight('');

    // Mock data for screen time and symptoms
    const screenTimeData = JSON.stringify([
      { day: 'Mon', hours: 8 },
      { day: 'Tue', hours: 7 },
      { day: 'Wed', hours: 9 },
      { day: 'Thu', hours: 6 },
      { day: 'Fri', hours: 8 },
      { day: 'Sat', hours: 5 },
      { day: 'Sun', hours: 4 },
    ]);

    const symptomReports = JSON.stringify([
      { day: 'Wed', symptom: 'dry eyes' },
      { day: 'Fri', symptom: 'eye strain' },
    ]);

    try {
      const result = await holisticHealthInsights({
        screenTimeData,
        symptomReports,
        userInputText: userInput,
      });
      setInsight(result.insight);
    } catch (error) {
      console.error('Error getting insights:', error);
      setInsight('Failed to get insights. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="space-y-8">
       <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <BrainCircuit className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">AI Holistic Health Insights</h1>
          <p className="text-muted-foreground">
            Correlate lifestyle data with symptoms to find actionable health patterns.
          </p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <Card>
            <CardHeader>
                <CardTitle>Add Your Personal Notes</CardTitle>
                <CardDescription>
                    Optionally, add any other feelings, observations, or health notes from your week. This can help the AI find more accurate correlations.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Textarea
                    className="min-h-[150px]"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="e.g., 'I felt really tired on Wednesday afternoon', 'I think my new screen brightness is helping', 'Drank less water this week...'"
                    />
                    <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                    >
                    {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Generate Holistic Insight
                    </Button>
                </form>
            </CardContent>
        </Card>
        
        <Card className="min-h-[300px]">
            <CardHeader>
                <CardTitle>Your Insight</CardTitle>
            </CardHeader>
            <CardContent>
                {loading && (
                    <div className="flex flex-col items-center justify-center space-y-4 pt-10">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        <p className="text-muted-foreground">The AI is analyzing your week...</p>
                    </div>
                )}
                {insight && (
                    <Alert>
                        <BrainCircuit className="h-4 w-4" />
                        <AlertTitle>AI Analysis</AlertTitle>
                        <AlertDescription className="prose prose-sm dark:prose-invert max-w-none">
                            <p>{insight}</p>
                        </AlertDescription>
                    </Alert>
                )}
                {!loading && !insight && (
                     <div className="flex flex-col items-center justify-center space-y-4 pt-10 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                            <Sparkles className="h-8 w-8 text-muted-foreground"/>
                        </div>
                        <p className="text-muted-foreground">Your personalized insight will appear here after you submit your notes.</p>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>

    </div>
  );
}
