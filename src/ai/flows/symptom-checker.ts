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
    severity: z.enum(["Low", "Moderate", "High"]).describe("An overall assessment of the severity of the described symptoms."),
    homeCareAdvice: z.array(z.string()).describe("A list of safe, primary home care suggestions for low-severity symptoms. If severity is high, this should be an empty array."),
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
  prompt: `You are an AI assistant designed to provide a primary diagnosis and home treatment suggestions based on eye-related symptoms.

Analyze the user's symptoms and perform the following steps:
1.  **Assess Severity:** Determine if the collection of symptoms represents a "Low," "Moderate," or "High" severity case. High severity symptoms include: sudden vision loss, severe eye pain, flashes of light, physical injury to the eye, or chemical splashes.
2.  **Provide Possible Conditions:** Return a list of potential conditions. For each, provide the condition name, a brief description, and an estimated likelihood as a percentage (0-100).
3.  **Suggest Home Care (for Low Severity only):** If the severity is "Low," provide a list of 2-3 safe, general home care suggestions (e.g., "Apply a warm compress," "Use artificial tears," "Gently clean the eyelid").
4.  **Recommend Hospital for High Severity:** If the severity is "High," the 'homeCareAdvice' list must be empty. Your primary message to the user is to seek immediate medical attention.
5.  **Disclaimer:** Your response must always include the disclaimer: "This is not a medical diagnosis. Consult a healthcare professional for any health concerns."

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
