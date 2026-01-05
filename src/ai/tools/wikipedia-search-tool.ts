'use server';

/**
 * @fileOverview A Genkit tool for searching Wikipedia.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const WikipediaSearchInputSchema = z.object({
  query: z.string().describe("The topic to search for on Wikipedia."),
});

export const searchWikipediaTool = ai.defineTool(
  {
    name: 'searchWikipedia',
    description: "Searches Wikipedia for a given query and returns the summary of the article.",
    inputSchema: WikipediaSearchInputSchema,
    outputSchema: z.object({
        summary: z.string().describe("The summary of the Wikipedia article."),
    }),
  },
  async ({query}) => {
    // In a real application, you would use the Wikipedia API here.
    // We'll return a mock summary to demonstrate the flow.
    const mockSummaries: Record<string, string> = {
        'glaucoma': 'Glaucoma is a group of eye conditions that damage the optic nerve, the health of which is vital for good vision. This damage is often caused by an abnormally high pressure in your eye.',
        'cataracts': 'A cataract is a clouding of the normally clear lens of the eye. For people who have cataracts, seeing through cloudy lenses is a bit like looking through a frosty or fogged-up window.',
        'dry eye syndrome': 'Dry eye disease (DED), also known as keratoconjunctivitis sicca (KCS), is a multifactorial disease of the tears and ocular surface that results in symptoms of discomfort, visual disturbance, and tear film instability with potential damage to the ocular surface.',
        'macular degeneration': 'Macular degeneration is an eye disease that causes vision loss. It affects the macula, the part of the retina responsible for sharp, detailed central vision. There are two main types: dry and wet.'
    };
    
    const lowerQuery = query.toLowerCase();
    for (const key in mockSummaries) {
        if (lowerQuery.includes(key)) {
            return { summary: mockSummaries[key] };
        }
    }
    
    return { summary: `Could not find a specific summary for "${query}". Please provide a general overview of the topic.` };
  }
);
