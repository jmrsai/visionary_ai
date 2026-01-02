
'use server';

/**
 * @fileOverview An AI flow for analyzing images of an eye for various ocular health conditions.
 *
 * - ocularHealthScan - A function that analyzes an eye image.
 * - OcularHealthScanInput - The input type for the function.
 * - OcularHealthScanOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OcularHealthScanInputSchema = z.object({
  eyeImageUri: z
    .string()
    .describe(
      "A close-up, clear, and well-lit photo of a human eye, as a data URI."
    ),
});
export type OcularHealthScanInput = z.infer<typeof OcularHealthScanInputSchema>;

const DetectedConditionSchema = z.object({
    condition: z.string().describe("The name of a possible condition suggested by the visual evidence (e.g., 'Possible Cataract', 'Pterygium', 'Signs of Dryness')."),
    confidence: z.enum(["Low", "Medium", "High"]).describe("The confidence level in this potential condition."),
    explanation: z.string().describe("A brief explanation of why this condition is being suggested based on the image."),
});

const OcularHealthScanOutputSchema = z.object({
    detectedConditions: z.array(DetectedConditionSchema).describe("An array of potential conditions based on the analysis. If the eye appears healthy, this can be an empty array."),
    recommendations: z.array(z.string()).describe("A list of 2-3 recommended next steps for the user. If a high-confidence issue is found, the primary recommendation MUST be to consult an ophthalmologist."),
    disclaimer: z.string().describe("A disclaimer that this is a screening tool and not a medical diagnosis."),
});
export type OcularHealthScanOutput = z.infer<typeof OcularHealthScanOutputSchema>;

export async function ocularHealthScan(input: OcularHealthScanInput): Promise<OcularHealthScanOutput> {
  return ocularHealthScanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'ocularHealthScanPrompt',
  input: {schema: OcularHealthScanInputSchema},
  output: {schema: OcularHealthScanOutputSchema},
  prompt: `You are an AI assistant with expertise in ophthalmology, trained to analyze images of human eyes for signs of common ocular surface and lens-related conditions.

  **Analysis Protocol:**
  1.  **Examine the Image:** Carefully inspect the provided eye image for any abnormalities. Pay close attention to:
      - The **Lens and Pupil**: Look for any cloudiness, opacities, or discoloration that might suggest a **cataract**.
      - The **Cornea and Sclera**: Look for any fleshy, triangular growths extending from the conjunctiva over the cornea, which could indicate a **pterygium**.
      - The **Sclera (white part)**: Note any significant, localized redness or prominent blood vessels.
      - The **Tear Film**: Assess for signs that might suggest dryness, such as a lack of luster or debris.
  2.  **Identify Potential Conditions:** Based on your visual analysis, identify potential conditions.
      - If you see cloudiness in the lens, suggest 'Possible Cataract'.
      - If you see a growth from the white of the eye onto the cornea, suggest 'Possible Pterygium'.
      - If the eye appears generally healthy, you can return an empty array for 'detectedConditions'.
  3.  **Formulate Recommendations:**
      - If any condition is detected with 'Medium' or 'High' confidence, your primary recommendation MUST be: "Consult an ophthalmologist for a comprehensive examination."
      - Provide other general advice, such as wearing sunglasses to protect against UV radiation (relevant for pterygium and cataracts) or using lubricating eye drops for dryness.
  4.  **Disclaimer:** Your response MUST include the disclaimer: "This is an experimental AI screening and not a substitute for a professional medical diagnosis. Consult an eye care professional for any health concerns."

  Image to analyze: {{media url=eyeImageUri}}`,
});

const ocularHealthScanFlow = ai.defineFlow(
  {
    name: 'ocularHealthScanFlow',
    inputSchema: OcularHealthScanInputSchema,
    outputSchema: OcularHealthScanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
