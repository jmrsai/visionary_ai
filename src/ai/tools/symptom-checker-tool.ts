'use server';

/**
 * @fileOverview A Genkit tool for the symptom checker flow.
 */

import {symptomChecker} from '@/ai/flows/symptom-checker';
import {ai} from '@/ai/genkit';
import {z} from 'zod';

const SymptomCheckerToolInputSchema = z.object({
    symptoms: z
      .string()
      .describe('A comma separated list of eye-related symptoms the user is experiencing.'),
  });

export const symptomCheckerTool = ai.defineTool(
    {
        name: 'symptomChecker',
        description: 'Analyzes a list of eye-related symptoms to provide a list of possible conditions, their descriptions, and their likelihood. Use this when a user describes one or more specific symptoms.',
        inputSchema: SymptomCheckerToolInputSchema,
        outputSchema: z.any(),
    },
    async (input) => {
        return await symptomChecker(input);
    }
);
