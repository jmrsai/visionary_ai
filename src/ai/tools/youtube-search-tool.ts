'use server';

/**
 * @fileOverview A Genkit tool for searching YouTube for remedy videos.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const YouTubeSearchInputSchema = z.object({
    query: z.string().describe("The search query for the YouTube video, e.g., 'how to apply a warm compress for eyes'."),
});

export const searchYouTubeForRemedy = ai.defineTool(
  {
    name: 'searchYouTubeForRemedy',
    description: "Searches YouTube for a relevant video based on a query and returns the video URL.",
    inputSchema: YouTubeSearchInputSchema,
    outputSchema: z.object({
        videoUrl: z.string().describe("The full URL of the YouTube video."),
    }),
  },
  async ({query}) => {
    console.log(`Simulating YouTube search for: "${query}"`);
    
    // In a real application, you would use the YouTube Data API here.
    // For this prototype, we'll return a pre-selected, relevant video.
    // This demonstrates the tool's functionality without requiring API keys.
    
    const mockResults: Record<string, string> = {
        'warm compress': 'https://www.youtube.com/watch?v=nO8_N-a_y-Y',
        'artificial tears': 'https://www.youtube.com/watch?v=i-v234pKp7E',
        'clean eyelid': 'https://www.youtube.com/watch?v=JQEiH-O1R-Q',
    };

    const lowerQuery = query.toLowerCase();
    for (const keyword in mockResults) {
        if (lowerQuery.includes(keyword)) {
            return { videoUrl: mockResults[keyword] };
        }
    }

    // Default fallback if no keyword matches
    return { videoUrl: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(query) };
  }
);
