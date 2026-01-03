
'use server';

/**
 * @fileOverview A Genkit tool for analyzing an image within the chat.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ImageAnalysisInputSchema = z.object({
  imageDataUri: z.string().describe("The image to analyze, as a data URI."),
  question: z.string().describe("The user's question about the image, providing context for the analysis."),
});

export const imageAnalysisTool = ai.defineTool(
  {
    name: 'imageAnalysis',
    description: "Analyzes an image provided by the user and answers a question about it. Use this for any user query that includes an image.",
    inputSchema: ImageAnalysisInputSchema,
    outputSchema: z.string(),
  },
  async ({ imageDataUri, question }) => {

    const prompt = `You are a helpful AI assistant with expertise in analyzing images, particularly for eye health.
    A user has uploaded an image and asked the following question: "${question}"

    Analyze the image and provide a helpful, safe, and informative response.

    **Safety First**:
    - If the image shows severe trauma, signs of serious infection, or anything alarming, your first and ONLY response should be: "This looks serious. Please seek immediate medical attention from an eye care professional or go to the nearest emergency room."
    - ALWAYS include the disclaimer: "I am an AI assistant, not a medical professional. This analysis is for informational purposes only. Please consult a qualified healthcare provider for any medical concerns."

    Image to analyze:
    {{media url=imageDataUri}}
    `;

    const { text } = await ai.generate({
      prompt: prompt,
      model: 'googleai/gemini-1.5-flash',
      context: { imageDataUri }
    });

    return text;
  }
);
