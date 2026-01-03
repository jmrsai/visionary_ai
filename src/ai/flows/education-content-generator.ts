'use server';

/**
 * @fileOverview An AI flow for generating educational content about eye conditions.
 *
 * - generateEducationContent - Generates a structured article on a given topic.
 * - EducationContentInput - The input type for the function.
 * - EducationContentOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EducationContentInputSchema = z.object({
  topic: z.string().describe("The eye health topic to generate content about (e.g., 'Glaucoma')."),
});
export type EducationContentInput = z.infer<typeof EducationContentInputSchema>;

const EducationContentOutputSchema = z.object({
  title: z.string().describe("The formal title of the article."),
  article: z
    .string()
    .describe('A well-structured, medically-informed article about the topic, formatted in Markdown. It must include sections for Symptoms, Causes, Treatments, and Prevention.'),
});
export type EducationContentOutput = z.infer<typeof EducationContentOutputSchema>;

export async function generateEducationContent(input: EducationContentInput): Promise<EducationContentOutput> {
  return educationContentFlow(input);
}


const prompt = ai.definePrompt({
  name: 'educationContentPrompt',
  input: {schema: EducationContentInputSchema},
  output: {schema: EducationContentOutputSchema},
  prompt: `You are a medical writer specializing in ophthalmology for a patient education app.
  
  Your task is to generate a clear, accurate, and easy-to-understand article about the given eye health topic.
  
  The article MUST be formatted in Markdown and include the following sections:
  - An introductory paragraph.
  - A section titled "## Symptoms" with a bulleted list.
  - A section titled "## Causes" explaining the primary causes.
  - A section titled "## Treatments" describing common medical treatments.
  - A section titled "## Prevention & Management" with a bulleted list of tips.
  
  ALWAYS include this disclaimer at the very end of the article, formatted exactly as follows:
  **Disclaimer:** This article is for informational purposes only and is not a substitute for professional medical advice.
  
  Topic: {{{topic}}}
  `,
});

const educationContentFlow = ai.defineFlow(
  {
    name: 'educationContentFlow',
    inputSchema: EducationContentInputSchema,
    outputSchema: EducationContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
