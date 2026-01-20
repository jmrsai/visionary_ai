'use server';

import { ai } from '../genkit';
import { z } from 'genkit';

export const generateGameFeedback = ai.defineFlow(
    {
        name: 'generateGameFeedback',
        inputSchema: z.object({
            gameName: z.string(),
            score: z.number(),
            latestAchievement: z.string().optional(),
        }),
        outputSchema: z.string(),
    },
    async (input) => {
        const { gameName, score, latestAchievement } = input;

        const prompt = `
      You are a friendly, encouraging AI vision coach for a health app called 'Visionary AI'.
      The user just played '${gameName}' and scored ${score} points.
      ${latestAchievement ? `They also achieved: ${latestAchievement}` : ''}
      
      Provide a very short (1-2 sentences), motivating, and slightly playful comment about their performance and how it helps their eye health.
      Keep it high-energy and cyberpunk-themed to match the new 'Gaming Universe' aesthetic.
    `;

        const result = await ai.generate(prompt);
        return result.text;
    }
);
