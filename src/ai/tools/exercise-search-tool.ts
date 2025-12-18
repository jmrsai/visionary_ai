'use server';

/**
 * @fileOverview A Genkit tool for searching for eye exercises within the app.
 */

import {ai} from '@/ai/genkit';
import {MOCK_EXERCISES} from '@/lib/data';
import {z} from 'zod';

const ExerciseSearchInputSchema = z.object({
  query: z.string().describe("A search query for an eye exercise, e.g., 'dry eyes', 'focus', 'strain'."),
});

const ExerciseSearchResultSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    path: z.string().describe("The URL path to the exercise page."),
});

export const searchExercisesTool = ai.defineTool(
  {
    name: 'searchExercises',
    description: "Searches for relevant eye exercises available in the app based on a query.",
    inputSchema: ExerciseSearchInputSchema,
    outputSchema: z.object({
        exercises: z.array(ExerciseSearchResultSchema).describe("A list of matching exercises."),
    }),
  },
  async ({query}) => {
    const lowerQuery = query.toLowerCase();
    
    const matchingExercises = MOCK_EXERCISES.filter(ex => 
        ex.title.toLowerCase().includes(lowerQuery) ||
        ex.description.toLowerCase().includes(lowerQuery) ||
        ex.category.toLowerCase().includes(lowerQuery) ||
        (ex.benefits && ex.benefits.some(b => b.toLowerCase().includes(lowerQuery)))
    ).map(ex => ({
        id: ex.id,
        title: ex.title,
        description: ex.description,
        path: `/gym/exercise/${ex.id}`
    }));

    return { exercises: matchingExercises.slice(0, 3) }; // Return top 3 matches
  }
);
