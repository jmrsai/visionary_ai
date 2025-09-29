'use server';

/**
 * @fileOverview An AI flow for generating reading comprehension tests.
 *
 * - generateReadingComprehensionTest - Generates a passage and MCQs.
 * - ReadingComprehensionTestOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';


const QuestionSchema = z.object({
    question: z.string().describe("The multiple-choice question about the passage."),
    options: z.array(z.string()).length(4).describe("An array of 4 possible answers."),
    correctAnswer: z.string().describe("The correct answer from the options array."),
});

const ReadingComprehensionTestOutputSchema = z.object({
    passage: z.string().describe("A short, simple passage on a random topic (e.g., a simple medical concept, a historical event, or a scientific fact). Around 100-150 words."),
    questions: z.array(QuestionSchema).length(3).describe("An array of 3 multiple-choice questions based on the passage."),
});
export type ReadingComprehensionTestOutput = z.infer<typeof ReadingComprehensionTestOutputSchema>;


export async function generateReadingComprehensionTest(): Promise<ReadingComprehensionTestOutput> {
  return readingComprehensionTestGeneratorFlow();
}

const prompt = ai.definePrompt({
  name: 'readingComprehensionTestPrompt',
  output: {schema: ReadingComprehensionTestOutputSchema},
  prompt: `Generate a short reading comprehension test.

  The passage should be about a random, simple topic (like a medical fact, a historical event, or a scientific concept) and be approximately 100-150 words long.
  
  Based on the passage, create exactly 3 multiple-choice questions. Each question must have 4 options, and one of them must be the correct answer.
  
  Ensure the questions are straightforward and their answers can be found directly within the provided passage.`,
});

const readingComprehensionTestGeneratorFlow = ai.defineFlow(
  {
    name: 'readingComprehensionTestGeneratorFlow',
    outputSchema: ReadingComprehensionTestOutputSchema,
  },
  async () => {
    const {output} = await prompt({});
    return output!;
  }
);
