'use server';

/**
 * @fileOverview An AI flow for generating stereopsis (depth perception) test images.
 *
 * - generateStereopsisTest - A function that creates a random dot stereogram.
 * - StereopsisTestOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SHAPES = ["circle", "square", "triangle", "star"] as const;

const StereopsisTestOutputSchema = z.object({
  imageUri: z.string().describe("A data URI of the generated random dot stereogram image. It must be in PNG format."),
  hiddenShape: z.enum(SHAPES).describe("The shape that is hidden within the stereogram."),
  options: z.array(z.enum(SHAPES)).describe("An array of four shape names, including the correct one, to be used as multiple-choice options."),
});

export type StereopsisTestOutput = z.infer<typeof StereopsisTestOutputSchema>;

export async function generateStereopsisTest(): Promise<StereopsisTestOutput> {
  return stereopsisTestFlow();
}

const stereopsisTestFlow = ai.defineFlow(
  {
    name: 'stereopsisTestFlow',
    outputSchema: StereopsisTestOutputSchema,
  },
  async () => {
    const hiddenShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    
    // Generate three other random shapes for options
    const distractors = new Set<typeof SHAPES[number]>();
    while(distractors.size < 3) {
        const d = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        if (d !== hiddenShape) {
            distractors.add(d);
        }
    }
    const options = [hiddenShape, ...Array.from(distractors)].sort(() => Math.random() - 0.5) as [typeof SHAPES[number], typeof SHAPES[number], typeof SHAPES[number], typeof SHAPES[number]];

    const prompt = `Generate a red and cyan 3D anaglyph image.
The image must be a square and filled with a dense, random pattern of red and cyan dots.
When viewed with red-cyan 3D glasses, a simple, solid "${hiddenShape}" shape should appear to float distinctly above the background.
The hidden shape should be large and centrally located.
Do not include any other text, labels, or artifacts in the image. The output must be the image only.`;

    try {
      const { media } = await ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: prompt,
      });

      if (!media.url) {
        throw new Error('Image generation failed for stereopsis test.');
      }

      return {
        imageUri: media.url,
        hiddenShape: hiddenShape,
        options: options,
      };
    } catch (error) {
      console.error("AI Generation Error in stereopsisTestFlow:", error);
      throw new Error("The AI service is currently unavailable. Please try again later.");
    }
  }
);
