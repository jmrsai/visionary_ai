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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Wand2 } from "lucide-react";
import { generatePersonalizedEyeWorkout } from "@/ai/flows/personalized-eye-workouts";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  testResults: z.string().min(10, {
    message: "Please describe your vision needs in at least 10 characters.",
  }),
  preferences: z.string().min(10, {
    message: "Please describe your preferences in at least 10 characters.",
  }),
});

export function WorkoutForm() {
  const [workout, setWorkout] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      testResults: "",
      preferences: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setWorkout(null);
    try {
      const result = await generatePersonalizedEyeWorkout(values);
      setWorkout(result.workoutRoutine);
    } catch (error) {
      console.error("Error generating workout:", error);
      toast({
        title: "Error",
        description: "Failed to generate workout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Your Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="testResults"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vision Needs & Goals</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'I work on a computer all day and my eyes feel tired.' or 'I want to improve my focus for reading.'"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Describe any issues you face or what you want to achieve.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workout Preferences</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'I prefer short, 5-minute sessions.' or 'I like game-like exercises.'"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Any preferences for duration, style, or intensity?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Generate Workout
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card className="min-h-[400px]">
        <CardHeader>
          <CardTitle>Your Personalized Routine</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex flex-col items-center justify-center space-y-4 pt-10">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Generating your workout...</p>
            </div>
          )}
          {workout && (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p>{workout}</p>
            </div>
          )}
          {!isLoading && !workout && (
            <div className="flex flex-col items-center justify-center space-y-4 pt-10 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <Wand2 className="h-8 w-8 text-muted-foreground"/>
                </div>
              <p className="text-muted-foreground">Your AI-generated workout will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
