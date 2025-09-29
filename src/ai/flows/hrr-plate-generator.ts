"use server";
/**
 * @fileOverview An AI flow for generating Hardy-Rand-Rittler (HRR) style test plates.
 *
 * - generateHrrPlate - A function that creates a color vision test plate for various deficiencies.
 * - HrrPlateOutput - The return type for the generateHrrPlate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const symbols = ["circle", "cross", "triangle"] as const;
const deficiencies = ["Red-Green", "Blue-Yellow"] as const;

const HrrPlateOutputSchema = z.object({
    plateImageUri: z.string().describe("A data URI of the generated HRR plate image. It must include a MIME type and use Base64 encoding. Expected format: 'data:image/png;base64,<encoded_data>'."),
    correctSymbol: z.enum(symbols),
    options: z.array(z.string()).describe('An array of four strings, including the correct symbol and "none", to be used as multiple-choice options.'),
    deficiencyType: z.enum(deficiencies).describe("The type of color deficiency this plate is designed to test."),
});
export type HrrPlateOutput = z.infer<typeof HrrPlateOutputSchema>;

export async function generateHrrPlate(): Promise<HrrPlateOutput> {
  return hrrPlateFlow();
}

const hrrPlateFlow = ai.defineFlow(
  {
    name: 'hrrPlateFlow',
    outputSchema: HrrPlateOutputSchema,
  },
  async () => {
    const correctSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    const deficiencyType = deficiencies[Math.floor(Math.random() * deficiencies.length)];

    // Generate distractor symbols
    const distractors = new Set<string>();
    while(distractors.size < 2) {
        const d = symbols[Math.floor(Math.random() * symbols.length)];
        if (d !== correctSymbol) {
            distractors.add(d);
        }
    }
    const options = [correctSymbol, ...Array.from(distractors), "none"].sort(() => Math.random() - 0.5);

    const prompt = `Generate an image that looks exactly like a Hardy-Rand-Rittler (HRR) pseudoisochromatic test plate.
    The plate must be a circle filled with a pattern of multi-colored dots of varying sizes.
    
    This specific plate should test for **${deficiencyType}** color deficiency.
    
    Subtly embed the symbol "${correctSymbol}" within the dot pattern. The symbol should be composed of dots with a color that someone with a ${deficiencyType} color deficiency would find difficult to distinguish from the background dots.
    
    - If the deficiency is Red-Green, use shades of red, green, and gray.
    - If the deficiency is Blue-Yellow, use shades of blue, yellow, and gray.
    
    The symbol should be clearly visible to someone with normal color vision.
    Do not include any text or labels on the image itself. The output must be the image only.`;

    const { media } = await ai.generate({
        model: 'googleai/gemini-1.5-pro-preview',
        prompt: prompt,
    });

    if (!media.url) {
        throw new Error('Image generation failed for HRR plate.');
    }

    return {
        plateImageUri: media.url,
        correctSymbol: correctSymbol,
        options: options,
        deficiencyType: deficiencyType,
    };
  }
);
