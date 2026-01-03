'use server';

/**
 * @fileOverview An AI flow for extracting medication details from an image using OCR.
 *
 * - medicationOcr - A function that analyzes a prescription image.
 * - MedicationOcrInput - The input type for the function.
 * - MedicationOcrOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MedicationOcrInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "An image of a prescription label or medication box, as a data URI."
    ),
});
export type MedicationOcrInput = z.infer<typeof MedicationOcrInputSchema>;


const MedicationOcrOutputSchema = z.object({
  medicationName: z.string().describe("The name of the medication identified from the text."),
  dosage: z.string().describe("The dosage instructions (e.g., '1 tablet', '2 drops', '10mg')."),
  frequency: z.string().describe("The frequency of administration (e.g., 'once daily', 'twice a day', 'every 4 hours')."),
});
export type MedicationOcrOutput = z.infer<typeof MedicationOcrOutputSchema>;

export async function medicationOcr(input: MedicationOcrInput): Promise<MedicationOcrOutput> {
  return medicationOcrFlow(input);
}

const prompt = ai.definePrompt({
  name: 'medicationOcrPrompt',
  input: {schema: MedicationOcrInputSchema},
  output: {schema: MedicationOcrOutputSchema},
  prompt: `You are an AI assistant specialized in Optical Character Recognition (OCR) for medical prescriptions. Your task is to analyze the provided image of a prescription label or medication box and extract the following information accurately.

  - **medicationName**: The trade or generic name of the drug.
  - **dosage**: The strength and form of the medication (e.g., "1 tablet", "250 mg", "1 drop").
  - **frequency**: How often the medication should be taken (e.g., "once daily", "2 times a day", "every morning").
  
  Focus only on extracting these three pieces of information. Ignore other details like patient name, pharmacy, or Rx number.

  Image to analyze: {{media url=imageDataUri}}`,
});

const medicationOcrFlow = ai.defineFlow(
  {
    name: 'medicationOcrFlow',
    inputSchema: MedicationOcrInputSchema,
    outputSchema: MedicationOcrOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
