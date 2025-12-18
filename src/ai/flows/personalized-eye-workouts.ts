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
    .describe('The generated personalized eye workout routine, formatted as a markdown list. Each item should include the exercise name, duration/reps, and sets.'),
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
  prompt: `You are a personal eye health assistant, skilled in creating personalized eye workout routines.

Based on the user's vision needs and preferences, generate a detailed workout routine.
The routine should be formatted as a markdown list. Each list item must specify the exercise, duration or repetitions, and the number of sets.

Vision Needs & Goals: {{{testResults}}}
Preferences: {{{preferences}}}

Your generated routine:`,
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
