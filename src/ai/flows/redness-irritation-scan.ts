'use server';

/**
 * @fileOverview An AI flow for analyzing images of an eye for redness and irritation.
 *
 * - rednessIrritationScan - A function that analyzes an eye image.
 * - RednessIrritationScanInput - The input type for the function.
 * - RednessIrritationScanOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RednessIrritationScanInputSchema = z.object({
  eyeImageUri: z
    .string()
    .describe(
      "A close-up photo of a human eye, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type RednessIrritationScanInput = z.infer<typeof RednessIrritationScanInputSchema>;

const RednessIrritationScanOutputSchema = z.object({
    isEyeDetected: z.boolean().describe("Whether a human eye was clearly detected in the image."),
    rednessLevel: z.enum(["None", "Low", "Moderate", "High"]).describe("The estimated level of redness on the sclera."),
    irritationLevel: z.enum(["None", "Low", "Moderate", "High"]).describe("The estimated level of general irritation (e.g., visible blood vessels, swelling)."),
    summary: z.string().describe("A concise, one-sentence summary of the findings. If no eye is detected, state that clearly."),
    disclaimer: z.string().describe("A disclaimer that this is a screening tool and not a medical diagnosis."),
});
export type RednessIrritationScanOutput = z.infer<typeof RednessIrritationScanOutputSchema>;


export async function rednessIrritationScan(input: RednessIrritationScanInput): Promise<RednessIrritationScanOutput> {
  return rednessIrritationScanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'rednessIrritationScanPrompt',
  input: {schema: RednessIrritationScanInputSchema},
  output: {schema: RednessIrritationScanOutputSchema},
  prompt: `You are an AI assistant trained to analyze images of human eyes for signs of redness and irritation.
  Your task is to analyze the provided image and provide a structured analysis.

  1.  First, determine if the image clearly shows a human eye. If not, set isEyeDetected to false and provide a summary stating that.
  2.  If an eye is detected, analyze the sclera (the white part of the eye).
  3.  Estimate the level of redness (from None to High).
  4.  Estimate the level of general irritation (looking for prominent blood vessels, swelling, etc.).
  5.  Provide a single-sentence summary of your findings.
  6.  Always include the disclaimer: "This is a screening tool, not a medical diagnosis. Consult a healthcare professional for any health concerns."

  Image to analyze: {{media url=eyeImageUri}}`,
});

const rednessIrritationScanFlow = ai.defineFlow(
  {
    name: 'rednessIrritationScanFlow',
    inputSchema: RednessIrritationScanInputSchema,
    outputSchema: RednessIrritationScanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
