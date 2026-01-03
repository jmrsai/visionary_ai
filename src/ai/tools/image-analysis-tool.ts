
'use server';

/**
 * @fileOverview A unified Genkit tool for analyzing eye images.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ImageAnalysisInputSchema = z.object({
  imageDataUri: z.string().describe("The image to analyze, as a data URI."),
  question: z.string().describe("The user's question about the image, providing context for the analysis."),
});

const DetectedConditionSchema = z.object({
    condition: z.string().describe("The name of a possible condition suggested by the visual evidence (e.g., 'Possible Cataract', 'Signs of Dryness')."),
    confidence: z.enum(["Low", "Medium", "High"]).describe("The confidence level in this potential condition."),
    explanation: z.string().describe("A brief explanation of why this condition is being suggested based on the image."),
});

const ImageAnalysisOutputSchema = z.object({
    analysisSummary: z.string().describe("A concise summary of the findings, addressing the user's question and any detected issues."),
    detectedConditions: z.array(DetectedConditionSchema).describe("An array of potential conditions based on the analysis. If the eye appears healthy, this can be an empty array."),
    recommendations: z.array(z.string()).describe("A list of 2-3 recommended next steps for the user. If a high-confidence issue is found, the primary recommendation MUST be to consult an ophthalmologist."),
    disclaimer: z.string().describe("A disclaimer that this is a screening tool and not a medical diagnosis."),
});


export const imageAnalysisTool = ai.defineTool(
  {
    name: 'imageAnalysis',
    description: "Analyzes an image of an eye for health conditions (redness, irritation, cataracts, etc.) and answers a user's question about it. Use this for any user query that includes an image.",
    inputSchema: ImageAnalysisInputSchema,
    outputSchema: ImageAnalysisOutputSchema,
  },
  async ({ imageDataUri, question }) => {

    const prompt = `You are a helpful AI assistant with expertise in analyzing images, particularly for ophthalmology.
    A user has uploaded an image and asked the following question: "${question}"

    **Analysis Protocol:**
    1.  **Examine the Image:** Carefully inspect the provided eye image for any abnormalities. Pay close attention to:
        - The **Lens and Pupil**: Look for any cloudiness or opacities that might suggest a **cataract**.
        - The **Cornea and Sclera**: Look for any fleshy, triangular growths extending from the conjunctiva over the cornea, which could indicate a **pterygium**.
        - The **Sclera (white part)**: Note any significant, localized redness or prominent blood vessels to assess for irritation or conditions like 'Conjunctivitis'.
        - The **Tear Film**: Assess for signs that might suggest dryness.
    2.  **Identify Potential Conditions:** Based on your visual analysis, identify potential conditions.
        - If you see cloudiness in the lens, suggest 'Possible Cataract'.
        - If you see a growth from the white of the eye onto the cornea, suggest 'Possible Pterygium'.
        - If the eye appears generally healthy, you can return an empty array for 'detectedConditions'.
    3.  **Formulate Recommendations:**
        - If any condition is detected with 'Medium' or 'High' confidence, your primary recommendation MUST be: "Consult an ophthalmologist for a comprehensive examination."
        - Provide other general advice, such as wearing sunglasses to protect against UV radiation (relevant for pterygium and cataracts) or using lubricating eye drops for dryness.
    4.  **Generate a Summary**: Create a concise 'analysisSummary' that directly answers the user's question and integrates your findings.
    5.  **Disclaimer:** Your response MUST include the disclaimer: "This is an experimental AI screening and not a substitute for a professional medical diagnosis. Consult an eye care professional for any health concerns."

    Image to analyze:
    {{media url=imageDataUri}}
    `;

    const { output } = await ai.generate({
      prompt: prompt,
      model: 'googleai/gemini-1.5-flash',
      output: { schema: ImageAnalysisOutputSchema },
      context: { imageDataUri }
    });

    return output!;
  }
);
