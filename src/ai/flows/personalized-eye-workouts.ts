'use server';

/**
 * @fileOverview A personalized eye workout routine generator.
 *
 * - generatePersonalizedEyeWorkout - A function that generates personalized eye workout routines.
 * - PersonalizedEyeWorkoutInput - The input type for the generatePersonalizedEyeWorkout function.
 * - PersonalizedEyeWorkoutOutput - The return type for the generatePersonalizedEyeWorkout function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedEyeWorkoutInputSchema = z.object({
  testResults: z
    .string()
    .describe(
      'The user eye test results, it must include information about the vision needs and fitness'
    ),
  preferences: z.string().describe('The user workout preferences.'),
});
export type PersonalizedEyeWorkoutInput = z.infer<typeof PersonalizedEyeWorkoutInputSchema>;

const PersonalizedEyeWorkoutOutputSchema = z.object({
  workoutRoutine: z
    .string()
    .describe('The generated personalized eye workout routine.'),
});
export type PersonalizedEyeWorkoutOutput = z.infer<typeof PersonalizedEyeWorkoutOutputSchema>;

export async function generatePersonalizedEyeWorkout(
  input: PersonalizedEyeWorkoutInput
): Promise<PersonalizedEyeWorkoutOutput> {
  return generatePersonalizedEyeWorkoutFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedEyeWorkoutPrompt',
  input: {schema: PersonalizedEyeWorkoutInputSchema},
  output: {schema: PersonalizedEyeWorkoutOutputSchema},
  prompt: `You are a personal eye health assistant, skilled in creating personalized eye workout routines based on user test results and preferences.

  Based on the user's eye test results and preferences, generate a workout routine.
Eye Test Results: {{{testResults}}}
Preferences: {{{preferences}}}

Workout Routine:`, // No function calls, no asynchronous operations.
});

const generatePersonalizedEyeWorkoutFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedEyeWorkoutFlow',
    inputSchema: PersonalizedEyeWorkoutInputSchema,
    outputSchema: PersonalizedEyeWorkoutOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
