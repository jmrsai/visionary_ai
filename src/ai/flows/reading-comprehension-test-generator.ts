'use server';

/**
 * @fileOverview An AI flow for generating reading comprehension tests.
 *
 * - generateReadingComprehensionTest - Generates a passage and MCQs.
 * - ReadingComprehensionTestOutput - The return type for the function.
 */

// import {ai} from '@/ai/genkit';
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


// Mock Implementation
export async function generateReadingComprehensionTest(): Promise<ReadingComprehensionTestOutput> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    passage: "The human eye is a complex organ that reacts to light and allows vision. The cornea, the transparent front part of the eye, refracts light, while the pupil, the black circular opening in the center of the iris, controls the amount of light reaching the retina. The retina is a light-sensitive layer at the back of the eye that contains cells called rods and cones. Rods are responsible for vision at low light levels, while cones are responsible for color vision and high-acuity vision.",
    questions: [
        {
            question: "What part of the eye controls the amount of light that enters?",
            options: ["Cornea", "Pupil", "Retina", "Rods"],
            correctAnswer: "Pupil"
        },
        {
            question: "Which cells are responsible for color vision?",
            options: ["Rods", "Cones", "Pupil", "Iris"],
            correctAnswer: "Cones"
        },
        {
            question: "Where is the retina located?",
            options: ["In the front of the eye", "In the center of the iris", "At the back of the eye", "Inside the cornea"],
            correctAnswer: "At the back of the eye"
        }
    ]
  };
}


/*
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
*/
