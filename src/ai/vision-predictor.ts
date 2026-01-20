'use server';

import { ai } from './genkit';
import { z } from 'genkit';

export interface VisionDataPoint {
    date: string;
    score: number;
}

export const predictFutureVision = ai.defineFlow(
    {
        name: 'predictFutureVision',
        inputSchema: z.object({
            history: z.array(z.object({
                date: z.string(),
                score: z.number()
            })),
            daysInFuture: z.number().default(30)
        }),
        outputSchema: z.object({
            predictedScore: z.number(),
            trend: z.enum(['improving', 'stable', 'declining']),
            advice: z.string(),
        }),
    },
    async (input) => {
        const { history, daysInFuture } = input;

        if (history.length < 2) {
            return {
                predictedScore: history.length > 0 ? history[0].score : 100,
                trend: 'stable' as const,
                advice: "Complete more check-ups to unlock AI vision forecasting!",
            };
        }

        const historyPrompt = history.map(p => `${p.date}: ${p.score}%`).join('\n');

        const prompt = `
      You are a vision health analyst. Based on the following historical vision acuity scores:
      ${historyPrompt}
      
      Analyze the trend and predict the user's vision score in ${daysInFuture} days if they continue their current trajectory.
      
      Respond in JSON format with:
      - predictedScore: a number (0-100)
      - trend: "improving", "stable", or "declining"
      - advice: a 1-sentence supportive recommendation.
    `;

        const result = await ai.generate(prompt);

        try {
            // Basic extraction if the model doesn't return pure JSON
            const jsonStr = result.text.match(/\{[\s\S]*\}/)?.[0] || result.text;
            return JSON.parse(jsonStr);
        } catch (e) {
            // Fallback
            return {
                predictedScore: history[0].score,
                trend: 'stable' as const,
                advice: "Maintain your current routine for optimal vision health.",
            };
        }
    }
);
