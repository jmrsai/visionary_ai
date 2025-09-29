"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertTriangle, Lightbulb } from "lucide-react";
import { symptomChecker } from "@/ai/flows/symptom-checker";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  symptoms: z.string().min(10, {
    message: "Please describe your symptoms in at least 10 characters.",
  }),
});

export function SymptomCheckerForm() {
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
    try {
      const response = await symptomChecker(values);
      setResult(response.possibleConditions);
    } catch (error) {
      console.error("Error checking symptoms:", error);
      toast({
        title: "Error",
        description: "Failed to check symptoms. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const possibleConditions = result?.split(',').map(s => s.trim()).filter(Boolean) || [];

  return (
    <div className="grid gap-8 md:grid-cols-2">
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
      
      <Card className="min-h-[400px]">
        <CardHeader>
          <CardTitle>Possible Conditions</CardTitle>
          <CardDescription>Based on the symptoms you provided.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Disclaimer</AlertTitle>
            <AlertDescription>
              This is not a medical diagnosis. Consult a healthcare professional for any health concerns.
            </AlertDescription>
          </Alert>

          {isLoading && (
            <div className="flex flex-col items-center justify-center space-y-4 pt-10">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Analyzing symptoms...</p>
            </div>
          )}

          {result && (
             <div className="flex flex-wrap gap-2 pt-4">
                {possibleConditions.map((condition, index) => (
                    <Badge key={index} variant="secondary" className="text-base px-3 py-1">
                        {condition}
                    </Badge>
                ))}
            </div>
          )}

          {!isLoading && !result && (
            <div className="flex flex-col items-center justify-center space-y-4 pt-10 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <Lightbulb className="h-8 w-8 text-muted-foreground"/>
                </div>
              <p className="text-muted-foreground">Potential conditions will be shown here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
