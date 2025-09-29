'use server';

/**
 * @fileOverview Symptom checker flow that takes in user inputted symptoms and provides a list of possible eye conditions with details.
 *
 * - symptomChecker - A function that handles the symptom checking process.
 * - SymptomCheckerInput - The input type for the symptomChecker function.
 * - SymptomCheckerOutput - The return type for the symptomChecker function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SymptomCheckerInputSchema = z.object({
  symptoms: z
    .string()
    .describe('A comma separated list of eye-related symptoms the user is experiencing.'),
});
export type SymptomCheckerInput = z.infer<typeof SymptomCheckerInputSchema>;

const SymptomCheckerOutputSchema = z.object({
    possibleConditions: z.array(z.object({
        condition: z.string().describe('The name of the possible eye condition.'),
        description: z.string().describe('A brief, one-sentence description of the condition.'),
        likelihood: z.number().describe('A percentage likelihood of this condition given the symptoms (0-100).'),
    })).describe('An array of possible eye conditions related to the symptoms.'),
    disclaimer: z.string().describe('A disclaimer that this is not a medical diagnosis.'),
});
export type SymptomCheckerOutput = z.infer<typeof SymptomCheckerOutputSchema>;

export async function symptomChecker(input: SymptomCheckerInput): Promise<SymptomCheckerOutput> {
  return symptomCheckerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'symptomCheckerPrompt',
  input: {schema: SymptomCheckerInputSchema},
  output: {schema: SymptomCheckerOutputSchema},
  prompt: `You are an AI assistant designed to provide possible eye conditions based on symptoms. Analyze the user's symptoms and return a list of potential conditions.

For each condition, provide:
1. The condition name.
2. A brief, one-sentence description.
3. An estimated likelihood as a percentage (0-100).

Your response must include a disclaimer: "This is not a medical diagnosis. Consult a healthcare professional for any health concerns."

Symptoms: {{{symptoms}}}`,
});

const symptomCheckerFlow = ai.defineFlow(
  {
    name: 'symptomCheckerFlow',
    inputSchema: SymptomCheckerInputSchema,
    outputSchema: SymptomCheckerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
