'use server';

/**
 * @fileOverview An AI flow for generating an Amsler grid image.
 *
 * - generateAmslerGrid - A function that creates an Amsler grid image.
 * - AmslerGridOutput - The return type for the generateAmslerGrid function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AmslerGridOutputSchema = z.object({
  gridImageUri: z
    .string()
    .describe(
      "A data URI of the generated Amsler grid image. It must include a MIME type and use Base64 encoding. Expected format: 'data:image/png;base64,<encoded_data>'."
    ),
});
export type AmslerGridOutput = z.infer<typeof AmslerGridOutputSchema>;

export async function generateAmslerGrid(): Promise<AmslerGridOutput> {
  return amslerGridFlow();
}

const amslerGridFlow = ai.defineFlow(
  {
    name: 'amslerGridFlow',
    outputSchema: AmslerGridOutputSchema,
  },
  async () => {
    const prompt = `Generate a standard Amsler grid used for eye tests.
The image should be a perfect square.
It must consist of a grid of straight, evenly spaced horizontal and vertical lines against a white background.
There must be a single, small black dot in the exact center of the grid.
The lines should be black.
The output must be the image only, with no other text or artifacts.`;

    try {
      const {media} = await ai.generate({
        model: 'googleai/gemini-pro-vision', // Using vision model for image generation
        prompt: prompt,
      });

      if (!media.url) {
        throw new Error('Image generation failed for Amsler grid.');
      }

      return {
        gridImageUri: media.url,
      };
    } catch (error) {
      console.error('AI Generation Error in amslerGridFlow:', error);
      throw new Error(
        'The AI service is currently unavailable. Please try again later.'
      );
    }
  }
);
